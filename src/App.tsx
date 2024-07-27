import { QueryClientProvider } from 'react-query';
import './App.css';
import { QueryClient } from 'react-query';
import ScannerContainer from './components/Scanner/ScannerContainer';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ScannerContainer />
      </QueryClientProvider>
    </>
  );
}

export default App;
