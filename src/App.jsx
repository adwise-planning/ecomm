import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';

const Login = lazy(() => import('./pages/Login.jsx'));
const SignUp = lazy(() => import('./pages/SignUp.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const OrdersTable = lazy(() => import('./pages/OrdersTable.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Recommendations = lazy(() => import('./pages/Recommendations.jsx'));
const Integrations = lazy(() => import('./pages/Integrations.jsx'));
const Analytics = lazy(() => import('./pages/Analytics.jsx'));
const Team = lazy(() => import('./pages/Team.jsx'));
const Billing = lazy(() => import('./pages/Billing.jsx'));

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
              <Route path="/signup" element={<SignUp />} />

              <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrdersTable />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="settings" element={
                <ProtectedRoute allowedRoles={['L1', 'L3']}>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="team" element={
                <ProtectedRoute allowedRoles={['L1', 'L3']}>
                  <Team />
                </ProtectedRoute>
              } />
              <Route path="billing" element={
                <ProtectedRoute allowedRoles={['L1', 'L3']}>
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
