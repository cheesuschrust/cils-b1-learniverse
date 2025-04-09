
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DatabasePerformanceDashboard from '@/components/admin/DatabasePerformanceDashboard';
import DynamicSEO from '@/components/marketing/DynamicSEO';

const DatabasePerformancePage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="Database Performance"
        description="Monitor and optimize database performance, query efficiency, and table statistics."
        keywords="database performance, query optimization, SQL performance, admin dashboard"
        type="website"
      />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <DatabasePerformanceDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default DatabasePerformancePage;
