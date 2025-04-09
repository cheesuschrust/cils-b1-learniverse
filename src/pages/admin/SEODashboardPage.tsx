
import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DynamicSEO from '@/components/marketing/DynamicSEO';
import SEODashboard from '@/components/admin/SEODashboard';

const SEODashboardPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="SEO Management Dashboard"
        description="Monitor and optimize your website's search engine performance with comprehensive SEO tools and analytics."
        keywords="SEO, search engine optimization, keywords, meta tags, analytics, performance"
      />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <SEODashboard />
      </div>
    </ProtectedRoute>
  );
};

export default SEODashboardPage;
