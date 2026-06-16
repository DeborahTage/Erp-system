import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import { 
  hasPermission as checkPermission, 
  hasAnyPermission as checkAnyPermission, 
  canAccessModule as checkModuleAccess, 
  canPerformAction as checkActionPermission 
} from '../lib/permissions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.me()
        .then((res) => setUser(res.data.data))
        .catch(() => localStorage.clear())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const hasRole = (...roles) => user && roles.includes(user.role);

  const hasPermission = (permission) => {
    if (!user) return false;
    return checkPermission(user.role, permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!user) return false;
    return checkAnyPermission(user.role, permissions);
  };

  const canAccessModule = (module) => {
    if (!user) return false;
    return checkModuleAccess(user.role, module);
  };

  const canPerformAction = (action, module) => {
    if (!user) return false;
    return checkActionPermission(user.role, action, module);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      hasRole,
      hasPermission,
      hasAnyPermission,
      canAccessModule,
      canPerformAction
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
