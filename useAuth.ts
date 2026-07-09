import { useState, useCallback, useEffect } from 'react';
import { User } from '@/types';
import { apiClient } from '@/lib/api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => {
    // Load token from localStorage immediately in initializer
    if (typeof window === 'undefined') {
      return {
        user: null,
        token: null,
        isLoading: false,
        error: null,
      };
    }

    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');

    if (token && user) {
      return {
        user: JSON.parse(user),
        token,
        isLoading: false,
        error: null,
      };
    }

    return {
      user: null,
      token: null,
      isLoading: false,
      error: null,
    };
  });

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));

      const response = await apiClient.register(email, password, fullName);

      if (!response.success) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: response.error || 'Registration failed',
        }));
        return { success: false };
      }

      const { token, user } = response.data!;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      setState({
        user,
        token,
        isLoading: false,
        error: null,
      });

      return { success: true };
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    const response = await apiClient.login(email, password);

    if (!response.success) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: response.error || 'Login failed',
      }));
      return { success: false };
    }

    const { token, user } = response.data!;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    setState({
      user,
      token,
      isLoading: false,
      error: null,
    });

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    setState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.is_admin ?? false,
    register,
    login,
    logout,
  };
}
