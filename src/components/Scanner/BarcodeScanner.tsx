import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

type Props = {
  items: Result[];
  setItems: (items: Result[]) => void;
};

const BarcodeScanner: React.FC<Props> = ({ items, setItems }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');

  const handleResult = useCallback(
    (result: Result | null, error: Error | undefined) => {
      if (result) {
        alert(`Scanned item : ${JSON.stringify(result)}`);
        setItems([...items, result]);
      }
      if (error) {
        console.error(error);
      }
    },
    [setItems]
  );

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const initializeScanner = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');

        const rearCamera = videoDevices.find(
          (device) =>
            !(
              device.label.toLowerCase().includes('front') ||
              device.label.toLowerCase().includes('facetime')
            )
        );

        if (rearCamera && videoRef.current) {
          await codeReader.decodeFromVideoDevice(
            rearCamera.deviceId,
            videoRef.current,
            handleResult
          );
        } else if (videoDevices.length > 0 && videoRef.current) {
          await codeReader.decodeFromVideoDevice(
            videoDevices[videoDevices.length - 1].deviceId,
            videoRef.current,
            handleResult
          );
        } else {
          setError('No suitable camera found.');
        }
      } catch (error) {
        console.error('Camera error:', error);
        setError(
          'Camera not found or permission denied. Please ensure you have granted camera permission.'
        );
      }
    };

    initializeScanner();

    return () => {
      codeReader.reset();
    };
  }, []);

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <h1>Lisse Scanner</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <video ref={videoRef} style={{ width: '100%' }} />
      <svg style={overlayStyle} viewBox={`0 0 100 100`} preserveAspectRatio="xMidYMid slice">
        <rect
          x={100 * 0.25}
          y={100 * 0.4}
          width={100 * 0.5}
          height={100 * 0.2}
          fill="none"
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

export default React.memo(BarcodeScanner);
