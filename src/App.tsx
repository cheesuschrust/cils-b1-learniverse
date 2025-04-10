
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import MarketingLayout from '@/layouts/MarketingLayout';
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/marketing/LandingPage';
import NotFound from '@/pages/NotFound';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/pages/auth/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';

const App = () => {
  return (
    <Routes>
      {/* Marketing Routes */}
      <Route path="/" element={<MarketingLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="features" element={<div>Features Page</div>} />
        <Route path="about" element={<div>About Page</div>} />
        <Route path="pricing" element={<div>Pricing Page</div>} />
        <Route path="support-center" element={<div>Support Center</div>} />
      </Route>
      
      {/* Authentication Routes */}
      <Route path="/auth" element={<MarketingLayout />}>
        <Route path="login" element={<AuthPage />} />
        <Route path="register" element={<AuthPage />} />
        <Route path="forgot-password" element={<div>Forgot Password Page</div>} />
      </Route>
      
      {/* Application Routes - Protected */}
      <Route path="/app" element={
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="flashcards" element={<div>Flashcards Page</div>} />
        <Route path="practice" element={<div>Practice Page</div>} />
        <Route path="progress" element={<div>Progress Page</div>} />
        <Route path="profile" element={<div>Profile Page</div>} />
        <Route path="settings" element={<div>Settings Page</div>} />
      </Route>
      
      {/* Admin Routes - Protected with Admin Check */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <RootLayout />
        </ProtectedRoute>
      }>
        <Route index element={<div>Admin Dashboard</div>} />
        <Route path="users" element={<div>User Management</div>} />
        <Route path="content" element={<div>Content Management</div>} />
      </Route>
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
