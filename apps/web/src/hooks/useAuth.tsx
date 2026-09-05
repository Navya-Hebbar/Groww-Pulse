import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';

export interface User {
  id: string;
  email: string;
  name?: string;
}

const DEFAULT_DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'demo@growwpulse.dev',
  name: 'Navya (Demo)',
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetchApi<User>('/auth/me'),
    enabled: !!token && token !== 'demo-token',
    retry: false,
  });

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    queryClient.clear();
  };

  const currentUser = token
    ? (token === 'demo-token' ? DEFAULT_DEMO_USER : data || DEFAULT_DEMO_USER)
    : null;

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isLoading: isLoading && !!token && token !== 'demo-token',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
