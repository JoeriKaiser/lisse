import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { EndpointConfiguration } from '../types'; // You'll need to define this type

type CreateEndpointInput = {
  name: string;
  url: string;
  authMethod: string;
  authValue: string;
  customHeaders: Record<string, string>;
};

type UpdateEndpointInput = CreateEndpointInput & {
  id: number;
  isActive: boolean;
};

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/endpoint`,
  withCredentials: true
});

const createEndpoint = async (endpoint: CreateEndpointInput): Promise<EndpointConfiguration> => {
  const response = await api.post<EndpointConfiguration>('/', endpoint);
  return response.data;
};

const updateEndpoint = async (endpoint: UpdateEndpointInput): Promise<EndpointConfiguration> => {
  const { id, ...data } = endpoint;
  const response = await api.put<EndpointConfiguration>(`/${id}`, data);
  return response.data;
};

export const useCreateEndpoint = () => {
  const queryClient = useQueryClient();

  return useMutation<EndpointConfiguration, Error, CreateEndpointInput>({
    mutationFn: createEndpoint,
    onSuccess: (newEndpoint) => {
      queryClient.invalidateQueries(['endpointConfigurations']);
      queryClient.setQueryData(['endpointConfiguration', newEndpoint.id], newEndpoint);
    }
  });
};

export const useUpdateEndpoint = () => {
  const queryClient = useQueryClient();

  return useMutation<EndpointConfiguration, Error, UpdateEndpointInput>({
    mutationFn: updateEndpoint,
    onSuccess: (updatedEndpoint) => {
      queryClient.invalidateQueries(['endpointConfigurations']);
      queryClient.setQueryData(['endpointConfiguration', updatedEndpoint.id], updatedEndpoint);
    }
  });
};
