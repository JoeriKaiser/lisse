import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { IFormInputs } from './formTypes';
import Login from './Login';
import { useLogin } from '../../api/mutations/login';
import { useAuth } from '../../context/AuthContext';

const LoginContainer = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginUser = useLogin();
  const { setUser } = useAuth();

  const onSubmit = async (inputs: IFormInputs) => {
    setError(null);
    setLoading(true);
    try {
      await loginUser.mutateAsync(inputs).then(() => {
        setLoading(false);
        setUser({ email: inputs.email });
        if (inputs.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        navigate({ to: '/' });
      });
    } catch (error) {
      setLoading(false);
      setError('Invalid email or password');
      console.error('Login error:', error);
    }
  };

  return (
    <>
      <Login onSubmit={onSubmit} error={error} loading={loading} />
    </>
  );
};

export default LoginContainer;
