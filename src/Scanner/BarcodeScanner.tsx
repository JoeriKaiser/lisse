import { Suspense, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useState } from "react";

type Props = {
  items: string[];
  setItems: (items: string[]) => void;
};

const BarcodeScanner = ({ items, setItems }: Props) => {
  const videoRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let selectedDeviceId;

    const initializeScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());

        const videoInputDevices = await codeReader.listVideoInputDevices();
        selectedDeviceId = videoInputDevices[1]?.deviceId;

        if (selectedDeviceId) {
          codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, error) => {
              if (result) {
                console.log(result.getText());
                setItems([...items, result.getText()]);
              }
              if (error) {
                console.error(error);
              }
            }
          );
        } else {
          setError("No video input devices found.");
        }
      } catch (error) {
        console.error("Camera not found or permission denied:", error);
        setError(
          "Camera not found or permission denied. Please ensure you have a camera and granted permission."
        );
      }
    };

    initializeScanner();

    return () => {
      codeReader.reset();
    };
  });

  return (
    <div>
      <h1>Lisse QR</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {items.map((code, index) => (
        <p key={index}>{code}</p>
      ))}
      <Suspense fallback={<div>Loading...</div>}>
        <video ref={videoRef} style={{ width: "100%" }}></video>
      </Suspense>
    </div>
  );
};

export default BarcodeScanner;
