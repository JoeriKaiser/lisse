import { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import Accrdion from '../components/Accordion/Accordion';
import Button from '../components/Button/Button';

const ScannerContainer = () => {
  const [items, setItems] = useState<Array<string>>([]);
  console.log('ScannerContainer');
  return (
    <>
      <BarcodeScanner items={items} setItems={setItems} />
      <Accrdion items={items} />
      <Button text="Send" onPress={() => console.log('Send')} />
    </>
  );
};

export default ScannerContainer;
