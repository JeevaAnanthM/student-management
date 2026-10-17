import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { isTokenExpired } from '../utils/jwtUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on application load
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        if (isTokenExpired(storedToken)) {
          authService.logout();
          setUser(null);
          setToken(null);
        } else {
          setToken(storedToken);
          setUser(storedUser);
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for unauthorized 401 events from Axios interceptor
    const handleUnauthorized = () => {
      authService.logout();
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = (jwtToken, userData) => {
    authService.setSession(jwtToken, userData);
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    isStudent: user?.role === 'STUDENT',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
