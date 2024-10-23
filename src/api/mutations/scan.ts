import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export type Scan = {
  userId: string;
  barcode: string;
  productName?: string;
  productCategory?: string;
  notes?: string;
};

type ScanInput = {
  userId: string;
  barcode: string;
  productName?: string;
  productCategory?: string;
  notes?: string;
};

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/scanner`,
  withCredentials: true
});

const createScan = async (scan: ScanInput): Promise<Scan> => {
  const response = await api.post<Scan>('/scan', scan);
  return response.data;
};

export const useCreateScan = () => {
  const queryClient = useQueryClient();

  return useMutation<Scan, Error, ScanInput>({
    mutationFn: createScan,
    onSuccess: (newScan) => {
      queryClient.invalidateQueries(['scans']);
      queryClient.setQueryData(['scan', newScan.barcode], newScan);
    }
  });
};
