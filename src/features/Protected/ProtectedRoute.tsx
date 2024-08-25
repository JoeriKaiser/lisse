import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO add origin url to redirect to
  const navigate = useNavigate({ from: '/' });
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log(user);
    if (user) {
      navigate({ to: '/' });
    }
    if (!user) {
      navigate({ to: '/login' });
    }
  }, [user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
