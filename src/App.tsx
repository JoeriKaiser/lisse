import { Scan, useCreateScan } from './api/mutations/scan';
import WasmScanner from './components/Scanner/WasmScanner';
import { Button } from './components/ui/button';
import { useAuth } from './context/AuthContext';
import './index.css';

function App() {
  const { user } = useAuth();

  const sendMockScan = () => {
    const scan: Scan = {
      userId: user?.id || '1',
      barcode: '1234567890123',
      productName: 'test',
      productCategory: 'test',
      notes: 'test'
    };
    useCreateScan().mutate(scan, {
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
