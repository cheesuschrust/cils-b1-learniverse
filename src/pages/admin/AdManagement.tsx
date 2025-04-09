
import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedAdManager from '@/components/admin/EnhancedAdManager';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const AdManagementPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <Helmet>
        <title>Ad Management - Admin</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <EnhancedAdManager />
      </div>
    </ProtectedRoute>
  );
};

export default AdManagementPage;
