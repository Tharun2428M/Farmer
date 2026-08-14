import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state from persistent storage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getCurrentUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();

    // Listen for session expiration events from API interceptor
    const handleSessionExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth-session-expired', handleSessionExpired);
  }, []);

  /**
   * Login user via Spring Boot REST API
   */
  const login = useCallback(async (email, password) => {
    const response = await authService.login({ email, password });
    if (response?.token && response?.user) {
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  }, []);

  /**
   * Register new Customer or Farmer via Spring Boot REST API
   */
  const register = useCallback(async (userData) => {
    const response = await authService.register(userData);
    if (response?.token && response?.user) {
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  }, []);

  /**
   * Logout user and clear tokens
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
