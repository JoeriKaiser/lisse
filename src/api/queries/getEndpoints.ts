import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { EndpointConfiguration } from '../types'; // Make sure to define this type in your types.ts file

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/endpoint`,
  withCredentials: true
});

export const getEndpointsForOrganization = async (organizationId: string) => {
  const response = await api.get<EndpointConfiguration[]>(`/${organizationId}`);
  return response.data;
};

export const useGetEndpoints = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useQuery(
    ['endpointConfigurations', organizationId],
    () => getEndpointsForOrganization(organizationId),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['endpointConfigurations', organizationId], data);
        // Also set individual endpoint data
        data.forEach((endpoint) => {
          queryClient.setQueryData(['endpointConfiguration', endpoint.id], endpoint);
        });
      }
    }
  );
};

export const getEndpointById = async (id: number) => {
  const response = await api.get<EndpointConfiguration>(`/endpoint/${id}`);
  return response.data;
};

export const useGetEndpoint = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery(['endpointConfiguration', id], () => getEndpointById(id), {
    onSuccess: (data) => {
      queryClient.setQueryData(['endpointConfiguration', id], data);
    }
  });
};
