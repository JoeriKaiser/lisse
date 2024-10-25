import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useGetEndpoints } from '../../api/queries/getEndpoints';
import { useCreateEndpoint, useUpdateEndpoint } from '../../api/mutations/endpoint';
import { useAuth } from '../../context/AuthContext';
import { FormInputs } from './formTypes';

type FormData = yup.InferType<typeof FormInputs>;

const SettingsContainer: React.FC = () => {
  const { organization } = useAuth();
  const { data: endpoints, isLoading: isLoadingEndpoints } = useGetEndpoints(organization.id!);
  const createEndpoint = useCreateEndpoint();
  const updateEndpoint = useUpdateEndpoint();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(FormInputs)
  });

  const onSubmit = (data: FormData) => {
    const endpointData = {
      ...data,
      customHeaders: data.customHeaders ? JSON.parse(data.customHeaders) : {}
    };

    if (endpoints && endpoints.length > 0) {
      updateEndpoint.mutate({
        id: endpoints[0].id,
        isActive: endpointData.isActive ?? false,
        name: endpointData.name,
        url: endpointData.url,
        authMethod: endpointData.authMethod,
        authValue: endpointData.authValue,
        customHeaders: endpointData.customHeaders
      });
    } else {
      createEndpoint.mutate(endpointData);
    }
  };

  React.useEffect(() => {
    if (endpoints && endpoints.length > 0) {
      const currentEndpoint = endpoints[0];
      reset({
        name: currentEndpoint.name,
        url: currentEndpoint.url,
        authMethod: currentEndpoint.authMethod,
        authValue: currentEndpoint.authValue,
        customHeaders: JSON.stringify(currentEndpoint.customHeaders),
        isActive: currentEndpoint.isActive
      });
    }
  }, [endpoints, reset]);

  if (isLoadingEndpoints) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Endpoint Configuration</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input {...register('name')} id="name" className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="url" className="block mb-1">
            URL
          </label>
          <input {...register('url')} id="url" className="w-full p-2 border rounded" />
          {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
        </div>

        <div>
          <label htmlFor="authMethod" className="block mb-1">
            Auth Method
          </label>
          <input
            {...register('authMethod')}
            id="authMethod"
            className="w-full p-2 border rounded"
          />
          {errors.authMethod && <p className="text-red-500 text-sm">{errors.authMethod.message}</p>}
        </div>

        <div>
          <label htmlFor="authValue" className="block mb-1">
            Auth Value
          </label>
          <input
            {...register('authValue')}
            id="authValue"
            type="password"
            className="w-full p-2 border rounded"
          />
          {errors.authValue && <p className="text-red-500 text-sm">{errors.authValue.message}</p>}
        </div>

        <div>
          <label htmlFor="customHeaders" className="block mb-1">
            Custom Headers (JSON)
          </label>
          <textarea
            {...register('customHeaders')}
            id="customHeaders"
            className="w-full p-2 border rounded"
          />
          {errors.customHeaders && (
            <p className="text-red-500 text-sm">{errors.customHeaders.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="isActive" className="flex items-center">
            <input {...register('isActive')} id="isActive" type="checkbox" className="mr-2" />
            Active
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={createEndpoint.isLoading || updateEndpoint.isLoading}>
          {createEndpoint.isLoading || updateEndpoint.isLoading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default SettingsContainer;
