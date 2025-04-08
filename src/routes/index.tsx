
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AdminLayout from '@/layouts/AdminLayout';
import { Spinner } from '@/components/ui/spinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AIUtilsProvider } from '@/contexts/AIUtilsContext';

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-[50vh]">
    <Spinner size="lg" className="text-primary" />
  </div>
);

// Lazily loaded page components
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'));
const ProgressPage = lazy(() => import('@/pages/user/ProgressPage'));
const SettingsPage = lazy(() => import('@/pages/user/SettingsPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Practice pages
const FlashcardsPage = lazy(() => import('@/pages/learning/FlashcardsPage'));
const ListeningPage = lazy(() => import('@/pages/learning/ListeningPracticePage'));
const ReadingPage = lazy(() => import('@/pages/learning/ReadingPracticePage'));
const WritingPage = lazy(() => import('@/pages/learning/WritingExercisePage'));
const SpeakingPage = lazy(() => import('@/pages/learning/SpeakingPracticePage'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const ContentManager = lazy(() => import('@/pages/admin/ContentManager'));
const AIManagement = lazy(() => import('@/pages/admin/AIManagement'));
const SubscriptionManager = lazy(() => import('@/pages/admin/SubscriptionManager'));
const SystemHealth = lazy(() => import('@/pages/admin/SystemHealth'));

// Subscription page
const SubscriptionPage = lazy(() => import('@/pages/subscription/SubscriptionPage'));
const SubscriptionManagementPage = lazy(() => import('@/pages/subscription/SubscriptionManagementPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AIUtilsProvider>
        <Routes>
          {/* Root routes with main layout */}
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            
            {/* User related pages */}
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="progress" element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            {/* Learning pages */}
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="practice">
              <Route path="listening" element={<ListeningPage />} />
              <Route path="reading" element={<ReadingPage />} />
              <Route path="writing" element={<WritingPage />} />
              <Route path="speaking" element={<SpeakingPage />} />
            </Route>
            
            {/* Subscription pages */}
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="subscription/manage" element={
              <ProtectedRoute>
                <SubscriptionManagementPage />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>
          
          {/* Dashboard layout */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<HomePage />} />
          </Route>
          
          {/* Admin routes - Protected with requireAdmin flag */}
          <Route path="admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="ai-management" element={<AIManagement />} />
            <Route path="subscriptions" element={<SubscriptionManager />} />
            <Route path="system-health" element={<SystemHealth />} />
          </Route>
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AIUtilsProvider>
    </Suspense>
  );
};

export default AppRoutes;
