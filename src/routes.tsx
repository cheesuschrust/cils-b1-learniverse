
import React from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Index from './pages/Index';
import Dashboard from './pages/dashboard';
import ProgressPage from './pages/progress';
import NotFound from './pages/NotFound';
import Analytics from './pages/Analytics';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentManager from './pages/admin/ContentManager';
import AIManagement from './pages/admin/AIManagement';
import SubscriptionManager from './pages/admin/SubscriptionManager';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import SupportTickets from './pages/admin/SupportTickets';
import SystemHealth from './pages/admin/SystemHealth';
import ContentUploader from './pages/admin/ContentUploader';
import ContentAnalysis from './pages/admin/ContentAnalysis';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'content', element: <ContentManager /> },
      { path: 'content-upload', element: <ContentUploader /> },
      { path: 'content-analysis', element: <ContentAnalysis /> },
      { path: 'ai-management', element: <AIManagement /> },
      { path: 'subscriptions', element: <SubscriptionManager /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'support-tickets', element: <SupportTickets /> },
      { path: 'system-health', element: <SystemHealth /> },
    ],
  },
];

export default routes;
