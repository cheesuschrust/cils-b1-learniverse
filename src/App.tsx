
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { SkipToContent } from '@/components/accessibility/SkipToContent';
import { KeyboardShortcutsModal } from '@/components/accessibility/KeyboardShortcutsModal';
import { Spinner } from '@/components/ui/spinner';

// Layout components
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import AuthCallbackPage from '@/pages/auth/AuthCallbackPage';

// Public pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Protected route component
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy-loaded protected pages for better performance
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const UserProfilePage = lazy(() => import('@/pages/profile/UserProfilePage'));
const UserPreferencesPage = lazy(() => import('@/pages/settings/UserPreferencesPage'));
const SubscriptionPlansPage = lazy(() => import('@/pages/subscription/SubscriptionPlansPage'));

// Loading fallback for lazy-loaded components
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Spinner size="lg" />
  </div>
);

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
          <Route path="callback" element={<AuthCallbackPage />} />
        </Route>
        
        {/* Legacy auth routes - redirect to new paths */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected routes - using Suspense for lazy loading */}
        <Route path="/dashboard" element={
          <ProtectedRoute offlineAccessible={true}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            <Suspense fallback={<LoadingFallback />}>
              <DashboardPage />
            </Suspense>
          } />
        </Route>
        
        {/* Profile & Settings */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            <Suspense fallback={<LoadingFallback />}>
              <UserProfilePage />
            </Suspense>
          } />
        </Route>
        
        <Route path="/settings" element={
          <ProtectedRoute offlineAccessible={true}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            <Suspense fallback={<LoadingFallback />}>
              <UserPreferencesPage />
            </Suspense>
          } />
        </Route>
        
        {/* Subscription */}
        <Route path="/subscription" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            <Suspense fallback={<LoadingFallback />}>
              <SubscriptionPlansPage />
            </Suspense>
          } />
          <Route path="plans" element={
            <Suspense fallback={<LoadingFallback />}>
              <SubscriptionPlansPage />
            </Suspense>
          } />
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
