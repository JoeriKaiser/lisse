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
          }
        })
        .catch((error) => {
          setResult(JSON.stringify(error));
          setTimingInfo((prev) => ({ ...prev, usingOffscreenCanvas }));
        });
    } else {
      detectVideo(false);
    }
  };

  return (
    <div className="container">
      <button className="bg-primary text-primary-foreground" onClick={handleVideoButton}>
        Camera
      </button>
      <select
        className="bg-primary text-primary-foreground"
        value={encoding}
        onChange={(e) => setEncoding(e.target.value)}>
        <option value="utf-8">UTF-8</option>
        <option value="iso-8859-15">ISO-8859-15</option>
        <option value="windows-1252">Windows-1252</option>
        <option value="macintosh">Macintosh</option>
      </select>
      <div className="viewcontainer">
        <div className="viewport">
          <canvas id="canvas" ref={canvasRef}></canvas>
          <img ref={imgRef} crossOrigin="anonymous" />

          {/* <Webcam
            ref={webcamRef}
            audio={false}
            height={1080}
            screenshotFormat="image/jpeg"
            width={1920}
          /> */}
          <video ref={videoRef} muted autoPlay playsInline></video>
        </div>
        <h5>Result</h5>
        <div className="result row">
          <pre className="six columns">{result}</pre>
          <div className="six columns">
            <div>
              {timingInfo.usingOffscreenCanvas.toString()}
              <br />
              Time since previous scan: {formatNumber(timingInfo.waitingTime)} ms
              <br />
              <code>drawImage()</code>: {formatNumber(timingInfo.drawImageTime)} ms
              <br />
              <code>getImageData()</code>: {formatNumber(timingInfo.getImageDataTime)} ms
              <br />
              <code>scanImageData()</code>: {formatNumber(timingInfo.scanImageDataTime)} ms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasmScanner;
