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

  return (
    <div>
      <h1>Lisse Scanner</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <video ref={videoRef} style={{ width: '100%' }} />
    </div>
  );
};

export default React.memo(BarcodeScanner);
