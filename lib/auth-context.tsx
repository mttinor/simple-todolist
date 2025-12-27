'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, User } from './api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email?: string, password?: string, flow?: 'signIn' | 'signUp') => Promise<void>;
  signInAnonymous: () => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authApi.getMe();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const signIn = async (email?: string, password?: string, flow?: 'signIn' | 'signUp') => {
    const response = await authApi.signIn({ email, password, flow });
    setUser(response.user);
  };

  const signInAnonymous = async () => {
    const response = await authApi.signIn({});
    setUser(response.user);
  };

  const signOut = () => {
    authApi.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInAnonymous, signOut, refreshUser }}>
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

