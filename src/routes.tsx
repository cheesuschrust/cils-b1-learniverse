
import React, { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import { Spinner } from './components/ui/spinner';

// Eagerly loaded components
import NotFound from './pages/NotFound';

// Create a loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-[50vh]">
    <Spinner size="lg" className="text-primary" />
  </div>
);

// Lazily loaded page components
const Index = lazy(() => import('./pages/Index'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const ProgressPage = lazy(() => import('./pages/progress'));
const Analytics = lazy(() => import('./pages/Analytics'));
const SupportCenter = lazy(() => import('./pages/SupportCenter'));
const SubscriptionPage = lazy(() => import('./pages/subscription/SubscriptionPage'));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const ContentManager = lazy(() => import('./pages/admin/ContentManager'));
const AIManagement = lazy(() => import('./pages/admin/AIManagement'));
const SubscriptionManager = lazy(() => import('./pages/admin/SubscriptionManager'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const SupportTickets = lazy(() => import('./pages/admin/SupportTickets'));
const SystemHealth = lazy(() => import('./pages/admin/SystemHealth'));
const ContentUploader = lazy(() => import('./pages/admin/ContentUploader'));
const ContentAnalysis = lazy(() => import('./pages/admin/ContentAnalysis'));
const ProjectStatus = lazy(() => import('./pages/admin/ProjectStatus'));

// Helper function to wrap components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(Index) },
      { path: 'dashboard', element: withSuspense(Dashboard) },
      { path: 'progress', element: withSuspense(ProgressPage) },
      { path: 'analytics', element: withSuspense(Analytics) },
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'signup', element: withSuspense(SignupPage) },
      { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: 'subscription', element: withSuspense(SubscriptionPage) },
      { path: 'support-center', element: withSuspense(SupportCenter) },
      { path: '*', element: <NotFound /> }, // Keep 404 eagerly loaded
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: withSuspense(AdminDashboard) },
      { path: 'dashboard', element: withSuspense(AdminDashboard) },
      { path: 'users', element: withSuspense(UserManagement) },
      { path: 'content', element: withSuspense(ContentManager) },
      { path: 'content-upload', element: withSuspense(ContentUploader) },
      { path: 'content-analysis', element: withSuspense(ContentAnalysis) },
      { path: 'project-status', element: withSuspense(ProjectStatus) },
      { path: 'ai-management', element: withSuspense(AIManagement) },
      { path: 'subscriptions', element: withSuspense(SubscriptionManager) },
      { path: 'analytics', element: withSuspense(AdminAnalytics) },
      { path: 'support-tickets', element: withSuspense(SupportTickets) },
      { path: 'system-health', element: withSuspense(SystemHealth) },
    ],
  },
];

export default routes;
