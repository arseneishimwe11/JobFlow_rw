import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../lib/apiClient';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  isVerified?: boolean;
  isPro?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid token
    const checkAuth = async () => {
      try {
        const token = apiClient.getToken();
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const response = await apiClient.auth.me() as any;
        if (response.success && response.data) {
          setUser({
            ...response.data,
            role: response.data.role.toLowerCase() as 'admin' | 'user',
          });
        } else {
          setUser({
            ...response,
            role: response.role.toLowerCase() as 'admin' | 'user',
          });
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear invalid token
        apiClient.clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.auth.login({ email, password }) as any;
      const userData: User = {
        ...response.user,
        role: response.user.role.toLowerCase() as 'admin' | 'user',
      };
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.auth.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    }
    apiClient.clearToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
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