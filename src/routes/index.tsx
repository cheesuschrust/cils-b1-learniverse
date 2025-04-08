
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';
import { Spinner } from '@/components/ui/spinner';

// Lazily loaded page components with descriptive names
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'));
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

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-[50vh]">
    <Spinner size="lg" className="text-primary" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Root routes with main layout */}
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          
          {/* User related pages */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Learning pages */}
          <Route path="flashcards" element={<FlashcardsPage />} />
          <Route path="practice">
            <Route path="listening" element={<ListeningPage />} />
            <Route path="reading" element={<ReadingPage />} />
            <Route path="writing" element={<WritingPage />} />
            <Route path="speaking" element={<SpeakingPage />} />
          </Route>
        </Route>
        
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        
        {/* Dashboard layout */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          {/* Add dashboard specific routes here */}
        </Route>
        
        {/* Admin routes */}
        <Route path="admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          {/* Add more admin routes as needed */}
        </Route>
        
        {/* 404 - Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
