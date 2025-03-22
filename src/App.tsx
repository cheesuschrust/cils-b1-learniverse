
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Import layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Import components
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NotFound from '@/pages/NotFound';

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
  ContentAnalysis
} from '@/pages/imports';

function App() {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <HelmetProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="flashcards" element={<Flashcards />} />
                  <Route path="lessons" element={<Lessons />} />
                  <Route path="speaking" element={<SpeakingPractice />} />
                  <Route path="listening" element={<ListeningExercises />} />
                  <Route path="writing" element={<WritingExercises />} />
                  <Route path="calendar" element={<LearningCalendar />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="communities" element={<Communities />} />
                  <Route path="progress" element={<ProgressTracker />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="content" element={<ContentUploader />} />
                  <Route path="content-analysis" element={<ContentAnalysis />} />
                  <Route path="file-uploader" element={<FileUploader />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <ShadcnToaster />
        </HelmetProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  );
}

export default App;
