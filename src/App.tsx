import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import RootLayout from '@/layouts/RootLayout';
import UserManagement from '@/pages/admin/UserManagement';
import ContentPage from '@/pages/ContentPage';
import ContentUploader from '@/pages/admin/ContentUploader';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Suspense } from 'react';
import { Loader2 } from '@/components/ui/loader';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPassword from '@/pages/ResetPassword';
import EmailVerification from '@/pages/EmailVerification';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Documentation from '@/pages/Documentation';
import SupportCenter from '@/pages/SupportCenter';
import Dashboard from '@/pages/Dashboard';
import UserProfile from '@/pages/UserProfile';
import Settings from '@/pages/Settings';
import Flashcards from '@/pages/Flashcards';
import MultipleChoice from '@/pages/MultipleChoice';
import Listening from '@/pages/Listening';
import Speaking from '@/pages/Speaking';
import Writing from '@/pages/Writing';
import Calendar from '@/pages/Calendar';
import Support from '@/pages/Support';
import SubscriptionPage from '@/pages/SubscriptionPage';
import Analytics from '@/pages/Analytics';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AIManagement from '@/pages/admin/AIManagement';
import AdminAnalyticsDashboardPage from '@/pages/admin/AdminAnalyticsDashboardPage';
import SupportTickets from '@/pages/admin/SupportTickets';
import ChatbotManagement from '@/pages/admin/ChatbotManagement';
import SystemSettings from '@/pages/admin/SystemSettings';
import SEOManager from '@/pages/admin/SEOManager';
import EmailSettings from '@/pages/admin/EmailSettings';
import AdManagement from '@/pages/admin/AdManagement';
import EcommerceIntegration from '@/pages/admin/EcommerceIntegration';
import AppStoreListing from '@/pages/admin/AppStoreListing';
import InstitutionalLicensing from '@/pages/admin/InstitutionalLicensing';
import AISetupWizard from '@/pages/admin/AISetupWizard';
import SystemLogs from '@/pages/admin/SystemLogs';
import ContentAnalysis from '@/pages/admin/ContentAnalysis';
import SystemTests from '@/pages/admin/SystemTests';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            }
          >
            <Router>
              <Routes>
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<EmailVerification />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/documentation" element={<Documentation />} />
                  <Route path="/support" element={<SupportCenter />} />

                  {/* Protected Routes */}
                  <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="flashcards" element={<Flashcards />} />
                    <Route path="multiple-choice" element={<MultipleChoice />} />
                    <Route path="listening" element={<Listening />} />
                    <Route path="speaking" element={<Speaking />} />
                    <Route path="writing" element={<Writing />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="support" element={<Support />} />
                    <Route path="subscription" element={<SubscriptionPage />} />
                    <Route path="analytics" element={<Analytics />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="ai-management" element={<AIManagement />} />
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="content-uploader" element={<ContentUploader />} />
                    <Route path="analytics-dashboard" element={<AdminAnalyticsDashboardPage />} />
                    <Route path="support-tickets" element={<SupportTickets />} />
                    <Route path="chatbot-management" element={<ChatbotManagement />} />
                    <Route path="system-settings" element={<SystemSettings />} />
                    <Route path="seo-manager" element={<SEOManager />} />
                    <Route path="email-settings" element={<EmailSettings />} />
                    <Route path="ad-management" element={<AdManagement />} />
                    <Route path="ecommerce" element={<EcommerceIntegration />} />
                    <Route path="app-store-listing" element={<AppStoreListing />} />
                    <Route path="institutional-licensing" element={<InstitutionalLicensing />} />
                    <Route path="ai-setup-wizard" element={<AISetupWizard />} />
                    <Route path="system-logs" element={<SystemLogs />} />
                    <Route path="content-analysis" element={<ContentAnalysis />} />
                    <Route path="system-tests" element={<SystemTests />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
          </Suspense>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
