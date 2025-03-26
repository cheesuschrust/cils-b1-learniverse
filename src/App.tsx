
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/layouts/AdminLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import UserManagement from '@/pages/admin/UserManagement';
import AIManagement from '@/pages/admin/AIManagement';
import UserProfile from '@/pages/UserProfile';
import EmailVerification from '@/pages/EmailVerification';
import FlashcardsPage from '@/pages/Flashcards';
import MultipleChoicePage from '@/pages/MultipleChoice';
import WritingPage from '@/pages/Writing';
import SpeakingPage from '@/pages/Speaking';
import ListeningPage from '@/pages/Listening';
import Analytics from '@/pages/Analytics';
import Achievements from '@/pages/Achievements';
import Settings from '@/pages/Settings';
import AIAssistant from '@/pages/AIAssistant';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  useEffect(() => {
    // Set initial theme based on system preference
    const theme = localStorage.getItem('theme') || 'system';
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.add(theme);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-verification/:token" element={<EmailVerification />} />
        <Route path="*" element={<NotFound />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute children={undefined} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/multiple-choice" element={<MultipleChoicePage />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/speaking" element={<SpeakingPage />} />
            <Route path="/listening" element={<ListeningPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} children={undefined} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/ai" element={<AIManagement />} />
          </Route>
        </Route>

        {/* NotFound route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
