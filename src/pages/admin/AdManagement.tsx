
import React from 'react';
import EnhancedAdManager from '@/components/admin/EnhancedAdManager';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SEO from '@/components/marketing/SEO';

const AdManagementPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <SEO 
        title="Advertisement Management"
        description="Admin dashboard for managing advertisements, campaigns, and monetization strategies across the platform."
        keywords="admin, advertisement, campaigns, revenue, analytics"
      />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <EnhancedAdManager />
      </div>
    </ProtectedRoute>
  );
};

export default AdManagementPage;
