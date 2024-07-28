import { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import Accordion from '../Accordion/Accordion';
import Button from '../Button/Button';
import { Scan, useCreateScan } from '../../api/mutations/scan';

const ScannerContainer = () => {
  const [items, setItems] = useState<Array<string>>(['hello']);
  const createScan = useCreateScan();
  const testScan: Scan = {
    name: 'test'
  };
  const sendScan = () => {
    createScan.mutate(testScan, {
      onSuccess: () => {
        console.log('success');
      },
      onError: () => {
        console.log('error');
      }
    });
  };
  return (
    <>
      <BarcodeScanner items={items} setItems={setItems} />
      <Accordion items={items} />
      <Button text="Send" onPress={sendScan} />
    </>
  );
};

export default ScannerContainer;
