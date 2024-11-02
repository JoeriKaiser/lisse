import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

import { useLogin, useLogout, getCurrentUser } from '../api/mutations/login';

export interface User {
  email: string;
  id?: string;
  organizationId?: string;
}

interface AuthContextType {
  user: User | null;
  organization: { id: string | undefined };
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<{ id: string | undefined }>({ id: undefined });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = (await getCurrentUser()) as User;
        if (userData) {
          setUser({ email: userData.email, id: userData.id });
          setOrganization({ id: userData.organizationId });
        }
      } catch (error) {
        console.log('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    useLogin().mutate(
      { email, password },
      {
        onSuccess: (data) => {
          setUser({ email: data.email, id: data.id });
          setOrganization({ id: data.organizationId });
        },
        onError: () => {
          console.log('error');
        }
      }
    );
  };

  const logout = async () => {
    useLogout().mutate();
    setUser(null);
  };

  const value = {
    user,
    organization,
    setUser,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
