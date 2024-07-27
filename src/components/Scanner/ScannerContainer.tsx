import { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import Accordion from '../Accordion/Accordion';
import Button from '../Button/Button';

const ScannerContainer = () => {
  const [items, setItems] = useState<Array<string>>([]);
  console.log('ScannerContainer');
  return (
    <>
      <BarcodeScanner items={items} setItems={setItems} />
      <Accordion items={items} />
      <Button text="Send" onPress={() => console.log('Send')} />
    </>
  );
};

export default ScannerContainer;
