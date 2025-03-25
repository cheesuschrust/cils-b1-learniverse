
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AIUtilsProvider } from '@/contexts/AIUtilsContext';

// Layouts
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/layouts/AdminLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Regular pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Flashcards from '@/pages/Flashcards';
import MultipleChoice from '@/pages/MultipleChoice';
import Writing from '@/pages/Writing';
import Speaking from '@/pages/Speaking';
import Listening from '@/pages/Listening';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Support from '@/pages/Support';
import SupportCenter from '@/pages/SupportCenter';
import CalendarPage from '@/pages/Calendar';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ResetPassword from '@/pages/ResetPassword';
import EmailVerification from '@/pages/EmailVerification';
import SubscriptionPage from '@/pages/SubscriptionPage';
import DocumentationPage from '@/pages/Documentation';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ContentAnalysis from '@/pages/admin/ContentAnalysis';
import ContentUploader from '@/pages/admin/ContentUploader';
import FileUploader from '@/pages/admin/FileUploader';
import SystemSettings from '@/pages/admin/SystemSettings';
import SystemLogs from '@/pages/admin/SystemLogs';
import SystemTests from '@/pages/admin/SystemTests';
import EmailSettings from '@/pages/admin/EmailSettings';
import EmailConfigurationPanel from '@/pages/admin/EmailConfigurationPanel';
import SupportTickets from '@/pages/admin/SupportTickets';
import AIManagement from '@/pages/admin/AIManagement';
import ChatbotManagement from '@/pages/admin/ChatbotManagement';
import AdManagement from '@/pages/admin/AdManagement';
import AdminAnalyticsDashboard from '@/pages/admin/AdminAnalyticsDashboard';

// Protected routes
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Initialize services
import AdService from '@/services/AdService';
AdService.initializeSampleData();

// Create a client
const queryClient = new QueryClient();

import '@/styles/main.css';
import '@/App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <AuthProvider>
            <NotificationsProvider>
              <UserPreferencesProvider>
                <AIUtilsProvider>
                  <BrowserRouter>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Index />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="reset-password" element={<ResetPassword />} />
                        <Route path="email-verification" element={<EmailVerification />} />
                        <Route path="privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="support-center" element={<SupportCenter />} />
                        <Route path="subscription" element={<SubscriptionPage />} />
                        <Route path="documentation" element={<DocumentationPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>

                      {/* Dashboard Routes */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<Dashboard />} />
                        <Route path="flashcards" element={<Flashcards />} />
                        <Route path="multiple-choice" element={<MultipleChoice />} />
                        <Route path="writing" element={<Writing />} />
                        <Route path="speaking" element={<Speaking />} />
                        <Route path="listening" element={<Listening />} />
                        <Route path="calendar" element={<CalendarPage />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="support" element={<Support />} />
                      </Route>

                      {/* Admin Routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute adminOnly>
                          <AdminLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="content-analysis" element={<ContentAnalysis />} />
                        <Route path="content-uploader" element={<ContentUploader />} />
                        <Route path="file-uploader" element={<FileUploader />} />
                        <Route path="system-settings" element={<SystemSettings />} />
                        <Route path="system-logs" element={<SystemLogs />} />
                        <Route path="system-tests" element={<SystemTests />} />
                        <Route path="email-settings" element={<EmailSettings />} />
                        <Route path="email-configuration" element={<EmailConfigurationPanel />} />
                        <Route path="support-tickets" element={<SupportTickets />} />
                        <Route path="ai-management" element={<AIManagement />} />
                        <Route path="chatbot-management" element={<ChatbotManagement />} />
                        <Route path="ad-management" element={<AdManagement />} />
                        <Route path="analytics" element={<AdminAnalyticsDashboard />} />
                      </Route>
                    </Routes>
                  </BrowserRouter>
                  <Toaster />
                </AIUtilsProvider>
              </UserPreferencesProvider>
            </NotificationsProvider>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
