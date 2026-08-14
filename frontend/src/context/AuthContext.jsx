import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for initial auth session state
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('user_data');
      }
    }
    setLoading(false);
  }, []);

  const loginPlaceholder = (userData, role) => {
    const mockUser = { ...userData, role: role || 'CUSTOMER' };
    setUser(mockUser);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    localStorage.setItem('jwt_token', 'mock_jwt_token_phase_1');
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
    localStorage.removeItem('jwt_token');
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    loginPlaceholder,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
