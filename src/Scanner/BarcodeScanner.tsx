import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

const QrScannerComponent = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Array<QrScanner.ScanResult> | null>(
    []
  );

  useEffect(() => {
    const videoElement = videoRef.current;

    const initializeScanner = async () => {
      let qrScanner;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());

        if (videoElement) {
          qrScanner = new QrScanner(
            videoElement,
            (result) => {
              console.log(result);
              alert(`QR Code detected: ${result.data}`);
              setResults((prev) => [...prev, result]);
            },
            {
              onDecodeError: (error) => {
                console.error(error);
              },
              highlightScanRegion: true,
              highlightCodeOutline: true,
            }
          );

          qrScanner.start();
        }
      } catch (error) {
        console.error("Camera not found or permission denied:", error);
        setError(
          "Camera not found or permission denied. Please ensure you have a camera and granted permission."
        );
      }
    };
    if (videoElement) {
      initializeScanner();
    }
  }, []);

  return (
    <div>
      {results && results.length > 0 && (
        <div>
          <h2>Results</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result.data}</li>
            ))}
          </ul>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <video ref={videoRef} style={{ width: "100%" }}></video>
    </div>
  );
};

export default QrScannerComponent;
