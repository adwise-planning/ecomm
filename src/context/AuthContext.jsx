import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { hasPermission as checkUserPermission } from '../lib/permissions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
    localStorage.removeItem('ecomEzUser');
    toast.success('Logged out');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return checkUserPermission(user.role, permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasPermission }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext);
