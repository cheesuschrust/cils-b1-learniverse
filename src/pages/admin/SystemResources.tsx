
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SystemResourceDashboard from '@/components/admin/SystemResourceDashboard';
import DynamicSEO from '@/components/marketing/DynamicSEO';

const SystemResourcesPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="System Resources"
        description="Monitor and manage system resources, database performance, and infrastructure health."
        keywords="system resources, monitoring, performance, database, admin dashboard"
        type="website"
      />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <SystemResourceDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default SystemResourcesPage;
