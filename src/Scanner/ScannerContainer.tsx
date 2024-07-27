import { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";
import CustomAccordion from "../components/Accordion/Accordion";

const ScannerContainer = () => {
  const [items, setItems] = useState<Array<string>>([]);
  console.log("ScannerContainer");
  return (
    <>
      <BarcodeScanner items={items} setItems={setItems} />
      <CustomAccordion items={items} />
    </>
  );
};

export default ScannerContainer;
