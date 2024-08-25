import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { IFormInputs } from '../../features/Login/formTypes';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  withCredentials: true
});

const login = async (login: IFormInputs): Promise<IFormInputs> => {
  const response = await api.post<IFormInputs>('/login', login);
  return response.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<IFormInputs, Error, IFormInputs>({
    mutationFn: login,
    onSuccess: (newLogin) => {
      queryClient.invalidateQueries(['login']);
      queryClient.setQueryData(['login'], newLogin);
    }
  });
};

const logout = async () => {
  await api.get('/logout');
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries(['login']);
      queryClient.setQueryData(['login'], null);
    }
  });
};

export const getCurrentUser = async () => {
  const response = await api.get<IFormInputs>('/current-user');
  return response.data;
};
