import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const OrdersTable = lazy(() => import('./pages/OrdersTable'));
const Settings = lazy(() => import('./pages/Settings'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const Integrations = lazy(() => import('./pages/Integrations'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Team = lazy(() => import('./pages/Team'));
const Billing = lazy(() => import('./pages/Billing'));

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{
            className: 'dark:bg-slate-800 dark:text-white',
          }} />
          <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrdersTable />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="settings" element={
                <ProtectedRoute allowedRoles={['L1', 'L2', 'L3']}>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="team" element={
                <ProtectedRoute allowedRoles={['L1', 'L2', 'L3']}>
                  <Team />
                </ProtectedRoute>
              } />
              <Route path="billing" element={
                <ProtectedRoute allowedRoles={['L1', 'L2', 'L3']}>
                  <Billing />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;