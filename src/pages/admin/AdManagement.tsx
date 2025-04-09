
import React from 'react';
import EnhancedAdManager from '@/components/admin/EnhancedAdManager';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DynamicSEO from '@/components/marketing/DynamicSEO';

const AdManagementPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="Advertisement Management"
        description="Admin dashboard for managing advertisements, campaigns, and monetization strategies across the platform."
        keywords="admin, advertisement, campaigns, revenue, analytics"
        type="website"
      />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <EnhancedAdManager />
      </div>
    </ProtectedRoute>
  );
};

export default AdManagementPage;
