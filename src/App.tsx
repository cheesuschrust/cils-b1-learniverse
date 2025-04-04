
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Dashboard from '@/pages/dashboard';
import ProgressPage from '@/pages/progress';
import DailyQuestion from '@/pages/DailyQuestion';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Analytics from '@/pages/Analytics';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import Achievements from '@/pages/Achievements';
import FlashcardsPage from '@/pages/FlashcardsPage';
import WritingPage from '@/pages/WritingPage';
import ListeningPage from '@/pages/ListeningPage';
import SpeakingPage from '@/pages/SpeakingPage';
import SettingsPage from '@/pages/SettingsPage';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="italian-app-theme">
      <AuthProvider>
        <NotificationsProvider>
          <GamificationProvider>
            <Router>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected Routes */}
                <Route element={<Layout />}>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/daily-questions" element={<DailyQuestion />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/flashcards" element={<FlashcardsPage />} />
                    <Route path="/writing" element={<WritingPage />} />
                    <Route path="/listening" element={<ListeningPage />} />
                    <Route path="/speaking" element={<SpeakingPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Route>
                
                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </GamificationProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
