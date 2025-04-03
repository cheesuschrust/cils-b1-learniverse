
import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedAnalyticsDashboard from '@/components/admin/EnhancedAnalyticsDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Define interface for props if needed
interface AdminAnalyticsDashboardPageProps {}

const AdminAnalyticsDashboardPage: React.FC<AdminAnalyticsDashboardPageProps> = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <Helmet>
        <title>Analytics Dashboard - Admin</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <EnhancedAnalyticsDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default AdminAnalyticsDashboardPage;
