import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

import { useLogin, useLogout, getCurrentUser } from '../api/mutations/login';

interface User {
  email: string;
  id?: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser({ email: userData.email, id: userData.id });
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
