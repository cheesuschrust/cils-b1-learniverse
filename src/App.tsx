
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
          </Route>
          
          {/* Redirect to login for any unknown routes */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
