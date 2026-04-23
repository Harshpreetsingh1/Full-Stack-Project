import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  useEffect(() => {
    const initAuth = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp && decoded.exp < now) {
            logout();
          } else {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({
              id: decoded.id,
              role: decoded.role,
            });
          }
        } catch (error) {
          console.error('Token decode error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token, logout]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = response.data.data;

    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser({
      id: userData._id,
      role: userData.role,
      name: userData.name,
      email: userData.email,
    });

    return response.data;
  };

  const register = async (name, email, password, role = 'user') => {
    const response = await api.post('/auth/register', { name, email, password, role });
    const { token: newToken, user: userData } = response.data.data;

    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser({
      id: userData._id,
      role: userData.role,
      name: userData.name,
      email: userData.email,
    });

    return response.data;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
