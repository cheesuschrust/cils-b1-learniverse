
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
import SupportCenter from '@/pages/SupportCenter';
import OnboardingPage from '@/pages/OnboardingPage';

// Marketing Pages
import Index from '@/pages/Index';
import LandingPage from '@/pages/marketing/LandingPage';
import FeaturesPage from '@/pages/marketing/FeaturesPage';
import AboutPage from '@/pages/marketing/AboutPage';

// Subscription Pages
import SubscriptionPage from '@/pages/subscription/SubscriptionPage';
import PricingPage from '@/pages/subscription/PricingPage';
import SubscriptionPlansPage from '@/pages/subscription/SubscriptionPlansPage';
import SubscriptionManagementPage from '@/pages/subscription/SubscriptionManagementPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="italian-app-theme">
      <AuthProvider>
        <NotificationsProvider>
          <GamificationProvider>
            <Router>
              <Routes>
                {/* Public Marketing Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                
                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                
                {/* Onboarding */}
                <Route path="/onboarding" element={<OnboardingPage />} />
                
                {/* Support Center (public but with auth-enhanced features) */}
                <Route path="/support-center" element={<SupportCenter />} />
                
                {/* Protected Routes */}
                <Route element={<Layout />}>
                  <Route element={<ProtectedRoute />}>
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
                    
                    {/* Subscription Management */}
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/subscription/plans" element={<SubscriptionPlansPage />} />
                    <Route path="/subscription/manage" element={<SubscriptionManagementPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
