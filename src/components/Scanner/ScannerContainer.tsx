import { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import Accordion from '../Accordion/Accordion';
import Button from '../Button/Button';
import { Scan, useCreateScan } from '../../api/mutations/scan';
import { Result } from '@zxing/library';

const ScannerContainer = () => {
  const [items, setItems] = useState<Array<Result>>([]);
  const createScan = useCreateScan();
  // TODO temp, change this to dynamic user
  const testScan: Scan = {
    userId: '2',
    barcode: '1234567890123',
    productName: 'test',
    productCategory: 'test',
    notes: 'test'
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
