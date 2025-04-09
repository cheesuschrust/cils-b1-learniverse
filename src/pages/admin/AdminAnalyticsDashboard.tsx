
import React from 'react';
import EnhancedAnalyticsDashboard from '@/components/admin/EnhancedAnalyticsDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SEO from '@/components/marketing/SEO';

interface AdminAnalyticsDashboardPageProps {}

const AdminAnalyticsDashboardPage: React.FC<AdminAnalyticsDashboardPageProps> = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <SEO 
        title="Analytics Dashboard"
        description="Comprehensive analytics dashboard with insights on user activity, content performance, and revenue metrics."
        keywords="analytics, dashboard, metrics, user data, performance, admin"
      />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <EnhancedAnalyticsDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default AdminAnalyticsDashboardPage;
