import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { IFormInputs } from '../../features/Register/formTypes';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`
});

const register = async (register: IFormInputs): Promise<IFormInputs> => {
  const response = await api.post<IFormInputs>('/register', register);
  return response.data;
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<IFormInputs, Error, IFormInputs>({
    mutationFn: register,
    onSuccess: (newRegister) => {
      queryClient.invalidateQueries(['register']);
      queryClient.setQueryData(['register'], newRegister);
    }
  });
};
