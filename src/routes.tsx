
import React from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Index from './pages/index';
import Dashboard from './pages/dashboard';
import ProgressPage from './pages/progress';
import NotFound from './pages/NotFound';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ContentManager from './pages/admin/ContentManager';
import InstitutionalLicensingManager from './components/admin/InstitutionalLicensingManager';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'progress', element: <ProgressPage /> },
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
      { path: 'users', element: <ManageUsers /> },
      { path: 'content', element: <ContentManager /> },
      { path: 'licensing', element: <InstitutionalLicensingManager /> },
    ],
  },
];

export default routes;
