import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { Scan } from '../types.ts';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/scanner`,
  withCredentials: true
});

export const getScansForUser = async (userId: string) => {
  const response = await api.get<Scan[]>(`/scans/${userId}`);
  return response.data;
};

export const useGetScans = (userId: string) => {
  const queryClient = useQueryClient();

  return useQuery(['scans', userId], () => getScansForUser(userId), {
    onSuccess: (data) => {
      queryClient.setQueryData(['scans', userId], data);
    }
  });
};
