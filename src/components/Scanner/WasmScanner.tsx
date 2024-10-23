import React, { useState, useRef, useEffect, useCallback } from 'react';

declare const zbarWasm: any;

const WasmScanner: React.FC = () => {
  const [encoding, setEncoding] = useState<string>('utf-8');
  const [result, setResult] = useState<string>('');
  const [timingInfo, setTimingInfo] = useState({
    usingOffscreenCanvas: false,
    waitingTime: 0,
    drawImageTime: 0,
    getImageDataTime: 0,
    scanImageDataTime: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasVideoFeed, setHasVideoFeed] = useState<boolean>(false);
  const [usingOffscreenCanvas, setUsingOffscreenCanvas] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const offCanvasRef = useRef<OffscreenCanvas | null>(null);
  const afterPreviousCallFinishedRef = useRef<number>(0);

  useEffect(() => {
    const isOffscreenCanvasWorking = () => {
      try {
        return Boolean(new OffscreenCanvas(1, 1).getContext('2d'));
      } catch {
        return false;
      }
    };

    setUsingOffscreenCanvas(isOffscreenCanvasWorking());
  }, []);

  const formatNumber = (number: number, fractionDigits = 1) => {
    return number.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    });
  };

  const getOffCtx2d = useCallback(
    (width: number, height: number) => {
      if (usingOffscreenCanvas) {
        if (
          !offCanvasRef.current ||
          offCanvasRef.current.width !== width ||
          offCanvasRef.current.height !== height
        ) {
          offCanvasRef.current = new OffscreenCanvas(width, height);
        }
        return offCanvasRef.current.getContext('2d');
      }
      return null;
    },
    [usingOffscreenCanvas]
  );

  const detect = useCallback(
    (source: HTMLImageElement | HTMLVideoElement) => {
      const afterFunctionCalled = performance.now();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) return Promise.resolve();

      canvas.width = (source as HTMLVideoElement).videoWidth || source.width;
      canvas.height = (source as HTMLVideoElement).videoHeight || source.height;

      if (canvas.height && canvas.width) {
        const offCtx = getOffCtx2d(canvas.width, canvas.height) || ctx;

        offCtx.drawImage(source, 0, 0);

        const afterDrawImage = performance.now();
        const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
        const afterGetImageData = performance.now();

        return zbarWasm.scanImageData(imageData).then((symbols: any[]) => {
          const afterScanImageData = performance.now();

          symbols.forEach((symbol) => {
            const lastPoint = symbol.points[symbol.points.length - 1];
            ctx.moveTo(lastPoint.x, lastPoint.y);
            symbol.points.forEach((point: { x: number; y: number }) =>
              ctx.lineTo(point.x, point.y)
            );

            ctx.lineWidth = Math.max(Math.min(canvas.height, canvas.width) / 100, 1);
            ctx.strokeStyle = '#00e00060';
            ctx.stroke();
          });

          symbols.forEach((s) => {
            delete s.type;
            // delete s.data;
            delete s.points;
            delete s.time;
            delete s.cacheCount;
          });

          symbols.forEach((s) => (s.rawValue = s.decode(encoding)));

          setResult(JSON.stringify(symbols, null, 2));

          setTimingInfo({
            usingOffscreenCanvas,
            waitingTime: afterFunctionCalled - afterPreviousCallFinishedRef.current,
            drawImageTime: afterDrawImage - afterFunctionCalled,
            getImageDataTime: afterGetImageData - afterDrawImage,
            scanImageDataTime: afterScanImageData - afterGetImageData
          });

          afterPreviousCallFinishedRef.current = performance.now();
        });
      } else {
        setResult('Source not ready');
        setTimingInfo((prev) => ({ ...prev, usingOffscreenCanvas }));
        return Promise.resolve();
      }
    },
    [encoding, usingOffscreenCanvas, getOffCtx2d]
  );

  const detectVideo = useCallback(
    (active: boolean) => {
      if (active) {
        if (videoRef.current) {
          detect(videoRef.current).then(() => {
            const newRequestId = requestAnimationFrame(() => detectVideo(true));
            setRequestId(newRequestId);
          });
        }
      } else {
        if (requestId !== null) {
          cancelAnimationFrame(requestId);
          setRequestId(null);
        }
      }
    },
    [detect, requestId]
  );

  async function hasTorchCapability(deviceId: string): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }
      });
      const track = stream.getVideoTracks()[0];

      if ('ImageCapture' in window) {
        const imageCapture = new (window as any).ImageCapture(track);
        const photoCapabilities = await imageCapture.getPhotoCapabilities();
        return !!photoCapabilities.torch;
      }

      stream.getTracks().forEach((track) => track.stop());
      return false;
    } catch (error) {
      console.error('Error checking torch capability:', error);
      return false;
    }
  }

  const handleVideoButton = async () => {
    if (!requestId) {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const videoDevices = devices.filter((device) => device.kind === 'videoinput');

      let selectedCamera: MediaDeviceInfo | undefined;

      // Try to find a camera with torch capability
      for (const device of videoDevices) {
        if (await hasTorchCapability(device.deviceId)) {
          selectedCamera = device;
          break;
        }
      }

      // If no camera with torch is found, fallback to previous logic
      if (!selectedCamera) {
        selectedCamera = videoDevices.find(
          (device) =>
            device.label.toLowerCase().includes('back') &&
            !device.label.toLowerCase().includes('wide') &&
            !device.label.toLowerCase().includes('telephoto')
        );
      }

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera.deviceId } : undefined,
          facingMode: selectedCamera ? undefined : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            detectVideo(true);
            setHasVideoFeed(true);
          }
        })
        .catch((error) => {
          setResult(JSON.stringify(error));
          setTimingInfo((prev) => ({ ...prev, usingOffscreenCanvas }));
          setHasVideoFeed(false);
        });
    } else {
      detectVideo(false);
      setHasVideoFeed(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          onClick={handleVideoButton}>
          Camera
        </button>
        <select
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={encoding}
          onChange={(e) => setEncoding(e.target.value)}>
          <option value="utf-8">UTF-8</option>
          <option value="iso-8859-15">ISO-8859-15</option>
          <option value="windows-1252">Windows-1252</option>
          <option value="macintosh">Macintosh</option>
        </select>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative aspect-video">
          <canvas id="canvas" ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
          <img ref={imgRef} crossOrigin="anonymous" className="hidden" />
          {hasVideoFeed ? (
            <video
              ref={videoRef}
              muted
              autoPlay
              playsInline
              className="w-full h-full object-cover"></video>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100 text-gray-700 text-lg text-center p-4">
              <p>No video feed available</p>
              <p className="mt-2">Click the Camera button to start</p>
            </div>
          )}
        </div>

        <div className="p-6">
          <h5 className="text-xl font-semibold mb-4">Result</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">{result}</pre>
            <div className="space-y-2 text-sm">
              <p>Using Offscreen Canvas: {timingInfo.usingOffscreenCanvas.toString()}</p>
              <p>Time since previous scan: {formatNumber(timingInfo.waitingTime)} ms</p>
              <p>
                <code className="bg-gray-200 px-1 rounded">drawImage()</code>:{' '}
                {formatNumber(timingInfo.drawImageTime)} ms
              </p>
              <p>
                <code className="bg-gray-200 px-1 rounded">getImageData()</code>:{' '}
                {formatNumber(timingInfo.getImageDataTime)} ms
              </p>
              <p>
                <code className="bg-gray-200 px-1 rounded">scanImageData()</code>:{' '}
                {formatNumber(timingInfo.scanImageDataTime)} ms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasmScanner;
