import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ecomEzUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const loading = false;

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

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext);