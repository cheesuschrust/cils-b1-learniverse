
import React from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Index from './pages/index';
import Dashboard from './pages/dashboard';
import ProgressPage from './pages/progress';
import NotFound from './pages/NotFound';
import Analytics from './pages/Analytics';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ContentManager from './pages/admin/ContentManager';
import AIManagement from './pages/admin/AIManagement';
import SubscriptionManager from './pages/admin/SubscriptionManager';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import SupportTickets from './pages/admin/SupportTickets';
import SystemHealth from './pages/admin/SystemHealth';
import UserManagement from './pages/admin/UserManagement';
import InstitutionalLicensingManager from './components/admin/InstitutionalLicensingManager';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
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
      { path: 'ai-management', element: <AIManagement /> },
      { path: 'subscriptions', element: <SubscriptionManager /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'support-tickets', element: <SupportTickets /> },
      { path: 'system-health', element: <SystemHealth /> },
      { path: 'licensing', element: <InstitutionalLicensingManager /> },
    ],
  },
];

export default routes;
