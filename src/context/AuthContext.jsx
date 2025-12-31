import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { hasPermission as checkUserPermission } from '../lib/permissions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('ecomEzUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, otp) => {
    try {
      const res = await api.login(email, otp);
      setUser(res.user);
      localStorage.setItem('ecomEzUser', JSON.stringify(res.user));
      toast.success(`Welcome, ${res.user.name}`);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setOriginalUser(null);
    localStorage.removeItem('ecomEzUser');
    localStorage.removeItem('ecomEzOriginalUser');
    toast.success('Logged out');
  };

  const startImpersonation = (impersonatedUser) => {
    if (user && user.role === 'L1') {
      const currentOriginalUser = originalUser || user;
      setOriginalUser(currentOriginalUser);
      localStorage.setItem('ecomEzOriginalUser', JSON.stringify(currentOriginalUser));

      setUser(impersonatedUser);
      toast.success(`Now impersonating ${impersonatedUser.name}`);
    } else {
      toast.error('Only L1 admins can impersonate users.');
    }
  };

  const stopImpersonation = () => {
    if (originalUser) {
      setUser(originalUser);
      setOriginalUser(null);
      localStorage.removeItem('ecomEzOriginalUser');
      toast.info('Stopped impersonating.');
    }
  };

  const hasPermission = (permission) => {
    // During impersonation, permissions are based on the impersonated user's role
    const currentUser = user;
    if (!currentUser) return false;
    return checkUserPermission(currentUser.role, permission);
  };

  const isImpersonating = !!originalUser;

  return (
    <AuthContext.Provider value={{
      user,
      originalUser,
      login,
      logout,
      loading,
      hasPermission,
      startImpersonation,
      stopImpersonation,
      isImpersonating
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext);
