import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useLogin } from '../../api/mutations/login';
import { useAuth } from '../../context/AuthContext';
import { IFormInputs } from './formTypes';
import Login from './Login';

const LoginContainer = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const loginUser = useLogin();

  const onSubmit = (inputs: IFormInputs) => {
    try {
      setError(null);
      setLoading(true);
      loginUser.mutate(inputs, {
        onSuccess: (data) => {
          setLoading(false);
          navigate({ to: '/' });
          if (inputs.rememberMe) {
            setUser(data);
          }
        },
        onError: () => {
          setLoading(false);
          setError('Invalid email or password');
        }
      });
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Login onSubmit={onSubmit} error={error} loading={loading} />
    </>
  );
};

export default LoginContainer;
