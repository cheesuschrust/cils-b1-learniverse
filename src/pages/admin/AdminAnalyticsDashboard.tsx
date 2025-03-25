
import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedAnalyticsDashboard from '@/components/admin/EnhancedAnalyticsDashboard';

const AdminAnalyticsDashboardPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Analytics Dashboard - Admin</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <EnhancedAnalyticsDashboard />
      </div>
    </>
  );
};

export default AdminAnalyticsDashboardPage;
