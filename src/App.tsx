
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { SkipToContent } from '@/components/accessibility/SkipToContent';
import { KeyboardShortcutsModal } from '@/components/accessibility/KeyboardShortcutsModal';

// Layout components
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';

// Protected pages
import DashboardPage from '@/pages/DashboardPage';
import UserProfilePage from '@/pages/profile/UserProfilePage';
import UserPreferencesPage from '@/pages/settings/UserPreferencesPage';
import SubscriptionPlansPage from '@/pages/subscription/SubscriptionPlansPage';

// Public pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Protected route component
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Effect to handle authentication redirects
  useEffect(() => {
    if (!isLoading) {
      // Redirect authenticated users away from auth pages
      if (isAuthenticated && 
          (location.pathname === '/login' || 
           location.pathname === '/signup' || 
           location.pathname === '/auth/login' || 
           location.pathname === '/auth/signup')) {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return (
    <>
      <SkipToContent />
      <KeyboardShortcutsModal />
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        
        {/* Authentication routes */}
        <Route path="/auth" element={<AuthLayout requireAuth={false} />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
        </Route>
        
        {/* Legacy auth routes - redirect to new paths */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
        </Route>
        
        {/* Profile & Settings */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<UserProfilePage />} />
        </Route>
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<UserPreferencesPage />} />
        </Route>
        
        {/* Subscription */}
        <Route path="/subscription" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SubscriptionPlansPage />} />
          <Route path="plans" element={<SubscriptionPlansPage />} />
        </Route>
        
        {/* Premium content (requires subscription) */}
        <Route path="/premium" element={
          <ProtectedRoute requirePremium={true}>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Premium routes would go here */}
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Admin routes would go here */}
        </Route>
        
        {/* 404 - Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
