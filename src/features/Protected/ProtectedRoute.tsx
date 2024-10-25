import React from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    console.log('FWEFEEF', user, loading);
    if (!loading && !user) {
      if (router.state.location.pathname !== '/login') {
        navigate({ to: '/login', search: { redirect: router.state.location.pathname } });
      }
    }
  }, [user, loading, navigate, router.state.location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
