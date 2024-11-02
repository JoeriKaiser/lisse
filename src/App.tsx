import { useCreateScan } from './api/mutations/scan';
import { Scan } from './api/types';
import WasmScanner from './components/Scanner/WasmScanner';
import { Button } from './components/ui/button';
import { useAuth } from './context/AuthContext';
import './index.css';

function App() {
  const { user } = useAuth();
  const createScanMutation = useCreateScan();

  const sendMockScan = () => {
    const scan: Scan = {
      userId: user?.id || '3',
      barcode: '1275987654321',
      productName: 'Cookies',
      productCategory: 'food',
      notes: 'These are some notes about the cookies'
    };
    createScanMutation.mutate(scan, {
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
      <WasmScanner />
      <Button onClick={sendMockScan}>Send</Button>
    </>
  );
}

export default App;
