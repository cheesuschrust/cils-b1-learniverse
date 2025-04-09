
import React from 'react';
import EnhancedAnalyticsDashboard from '@/components/admin/EnhancedAnalyticsDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DynamicSEO from '@/components/marketing/DynamicSEO';

interface AdminAnalyticsDashboardPageProps {}

const AdminAnalyticsDashboardPage: React.FC<AdminAnalyticsDashboardPageProps> = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="Analytics Dashboard"
        description="Comprehensive analytics dashboard with insights on user activity, content performance, and revenue metrics."
        keywords="analytics, dashboard, metrics, user data, performance, admin"
        type="website"
      />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <EnhancedAnalyticsDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default AdminAnalyticsDashboardPage;
