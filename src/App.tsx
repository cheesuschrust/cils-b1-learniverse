
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import { FlashcardsProvider } from '@/contexts/FlashcardsContext';

// Learning pages
import FlashcardsPage from '@/pages/learning/FlashcardsPage';
import ReadingPage from '@/pages/learning/ReadingPage';
import WritingPage from '@/pages/learning/WritingPage';
import ListeningPage from '@/pages/learning/ListeningPage';
import SpeakingPage from '@/pages/learning/SpeakingPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FlashcardsProvider>
          <Toaster />
          <Routes>
            {/* Home page */}
            <Route path="/" element={<HomePage />} />
            
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
              
              {/* Learning routes */}
              <Route path="flashcards" element={<FlashcardsPage />} />
              <Route path="reading" element={<ReadingPage />} />
              <Route path="writing" element={<WritingPage />} />
              <Route path="listening" element={<ListeningPage />} />
              <Route path="speaking" element={<SpeakingPage />} />
            </Route>
            
            {/* Redirect to login for any unknown routes */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </FlashcardsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
