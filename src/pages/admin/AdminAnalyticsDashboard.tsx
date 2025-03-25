
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';

const AdminAnalyticsDashboardPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Analytics Dashboard - Admin</title>
      </Helmet>
      <AdminAnalyticsDashboard />
    </>
  );
};

export default AdminAnalyticsDashboardPage;
