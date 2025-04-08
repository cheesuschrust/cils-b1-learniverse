
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import RootLayout from '@/layouts/RootLayout';
import AuthLayout from '@/layouts/AuthLayout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ProfilePage from '@/pages/user/ProfilePage';
import FlashcardsPage from '@/pages/learning/FlashcardsPage';
import ReadingPage from '@/pages/learning/ReadingPracticePage';
import ListeningPage from '@/pages/learning/ListeningPracticePage';
import NotFoundPage from '@/pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root routes with main layout */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="practice">
              <Route path="reading" element={<ReadingPage />} />
              <Route path="listening" element={<ListeningPage />} />
            </Route>
          </Route>
          
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
};

export default App;
