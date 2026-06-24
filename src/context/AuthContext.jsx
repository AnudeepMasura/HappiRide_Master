import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Session Persistence
    const storedUser = localStorage.getItem('happi_admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse persistent user', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('happi_admin_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        throw new Error(result.error || 'Login verification failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout service call failed:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('happi_admin_user');
    }
  };

  const hasPermission = (moduleName) => {
    if (!user) return false;
    return user.permissions.includes(moduleName);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
