import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';

export type User = {
  username: string;
  password: string;
};

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`
});

const login = async (username: string, password: string): Promise<User> => {
  const response = await api.post<User>('/login', { username, password });
  return response.data;
};

export const useLogin = (username: string, password: string) => {
  const queryClient = useQueryClient();

  return useQuery<User, Error>(['user'], async () => {
    const user = await login(username, password);
    queryClient.setQueryData(['user'], user);
    return user;
  });
};
