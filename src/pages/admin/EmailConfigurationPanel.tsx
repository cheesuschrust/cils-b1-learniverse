
import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DynamicSEO from '@/components/marketing/DynamicSEO';
import EmailConfigurationPanel from '@/components/admin/EmailConfigurationPanel';

const EmailConfigurationPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="Email Configuration - Admin Dashboard"
        description="Configure email providers, templates, and notification settings for your application."
        keywords="email setup, SMTP, templates, notifications, admin"
        type="website"
      />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <EmailConfigurationPanel />
      </div>
    </ProtectedRoute>
  );
};

export default EmailConfigurationPage;
