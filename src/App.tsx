
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import LoadingSpinner from './components/ui/spinner';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { ThemeProvider } from './components/ui/theme-provider';
import { HelmetProvider } from 'react-helmet-async';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/Index'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const FlashcardsPage = lazy(() => import('./pages/activities/Flashcards'));
const MultipleChoicePage = lazy(() => import('./pages/activities/MultipleChoice'));
const ReadingComprehensionPage = lazy(() => import('./pages/activities/ReadingComprehension'));
const SpeakingPage = lazy(() => import('./pages/activities/Speaking'));
const WritingPage = lazy(() => import('./pages/activities/Writing'));
const ListeningPage = lazy(() => import('./pages/activities/Listening'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const ContentManagement = lazy(() => import('./pages/admin/ContentManagement'));
const ContentAnalysis = lazy(() => import('./pages/admin/ContentAnalysis'));
const SystemLogs = lazy(() => import('./pages/admin/SystemLogs'));
const SupportTickets = lazy(() => import('./pages/admin/SupportTickets'));
const SystemSettings = lazy(() => import('./pages/admin/SystemSettings'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><LoadingSpinner size="lg" /></div>}>
          <Routes>
            {/* Main routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              
              {/* Activities routes */}
              <Route path="activities">
                <Route path="flashcards" element={<FlashcardsPage />} />
                <Route path="multiple-choice" element={<MultipleChoicePage />} />
                <Route path="reading" element={<ReadingComprehensionPage />} />
                <Route path="speaking" element={<SpeakingPage />} />
                <Route path="writing" element={<WritingPage />} />
                <Route path="listening" element={<ListeningPage />} />
              </Route>
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="content-analysis" element={<ContentAnalysis />} />
              <Route path="logs" element={<SystemLogs />} />
              <Route path="tickets" element={<SupportTickets />} />
              <Route path="settings" element={<SystemSettings />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

// Main app export wrapped with providers
export default function AppWithProviders() {
  return (
    <UserPreferencesProvider>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </UserPreferencesProvider>
  );
}
