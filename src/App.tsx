
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Import layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Import components
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import Index from '@/pages/Index';

// Import contexts
import { AuthProvider } from '@/contexts/AuthContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { AIUtilsProvider } from '@/contexts/AIUtilsContext';

// Import pages
import {
  Login,
  SignUp,
  PasswordReset,
  Dashboard,
  Flashcards,
  Lessons,
  SpeakingPractice,
  ListeningExercises,
  WritingExercises,
  LearningCalendar,
  UserProfile,
  Settings,
  Communities,
  ProgressTracker,
  AdminDashboard,
  UserManagement,
  ContentUploader,
  FileUploader,
  AdminSettings,
  ContentAnalysis,
  MultipleChoice
} from '@/pages/imports';
import SystemLogs from '@/pages/admin/SystemLogs';
import SupportTickets from '@/pages/admin/SupportTickets';
import Support from '@/pages/Support';
import SupportCenter from '@/pages/SupportCenter';
import AIManagement from '@/pages/admin/AIManagement';
import SystemTests from '@/pages/admin/SystemTests';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <UserPreferencesProvider>
            <AIUtilsProvider>
              <NotificationsProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/password-reset" element={<PasswordReset />} />
                  
                  {/* Root redirect */}
                  <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
                  
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                    <Route path="/app" element={<DashboardLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="flashcards" element={<Flashcards />} />
                      <Route path="multiple-choice" element={<MultipleChoice />} />
                      <Route path="lessons" element={<Lessons />} />
                      <Route path="speaking" element={<SpeakingPractice />} />
                      <Route path="listening" element={<ListeningExercises />} />
                      <Route path="writing" element={<WritingExercises />} />
                      <Route path="calendar" element={<LearningCalendar />} />
                      <Route path="profile" element={<UserProfile />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="communities" element={<Communities />} />
                      <Route path="progress" element={<ProgressTracker />} />
                      <Route path="support" element={<Support />} />
                      <Route path="support-center" element={<SupportCenter />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="content" element={<ContentUploader />} />
                      <Route path="content-analysis" element={<ContentAnalysis />} />
                      <Route path="file-uploader" element={<FileUploader />} />
                      <Route path="ai-management" element={<AIManagement />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="logs" element={<SystemLogs />} />
                      <Route path="system-tests" element={<SystemTests />} />
                      <Route path="support-tickets" element={<SupportTickets />} />
                      <Route path="analytics" element={<AdminAnalyticsDashboard />} />
                      <Route path="email-config" element={<EmailConfigurationPanel />} />
                    </Route>
                  </Route>
                  
                  <Route path="/multiple-choice" element={<MultipleChoice />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <ShadcnToaster />
              </NotificationsProvider>
            </AIUtilsProvider>
          </UserPreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
