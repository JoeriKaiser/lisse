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
    let selectedDeviceId: string | undefined;

    const initializeScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        const videoInputDevices = await codeReader.listVideoInputDevices();
        selectedDeviceId = videoInputDevices[1]?.deviceId;

        if (selectedDeviceId && videoRef.current) {
          await codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, handleResult);
        } else {
          setError('No video input devices found.');
        }
      } catch (error) {
        console.error('Camera not found or permission denied:', error);
        setError(
          'Camera not found or permission denied. Please ensure you have a camera and granted permission.'
        );
      }
    };

    initializeScanner();

    return () => {
      codeReader.reset();
    };
  }, [handleResult]);

  return (
    <div>
      <h1>Lisse Scanner</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <video ref={videoRef} style={{ width: '100%' }} />
    </div>
  );
};

export default React.memo(BarcodeScanner);
