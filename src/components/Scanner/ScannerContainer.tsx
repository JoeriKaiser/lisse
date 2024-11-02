import { useState } from 'react';
import Accordion from '../Accordion/Accordion';
import Button from '../Button/Button';
import { useCreateScan } from '../../api/mutations/scan';
import { Result } from '@zxing/library';
import { useAuth } from '../../context/AuthContext';
import { Scan } from '../../api/types';

const ScannerContainer = () => {
  const { user } = useAuth();
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
    // TODO temp, clear items
    setItems([]);
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
      <h5>{`Hi, currently logged in as ${user?.email}`}</h5>
      {/* TODO implement barcode scanner */}
      <Accordion items={items} />
      <Button text="Send" onPress={sendScan} />
    </>
  );
};

export default ScannerContainer;
