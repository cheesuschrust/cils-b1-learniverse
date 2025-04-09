
import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DynamicSEO from '@/components/marketing/DynamicSEO';
import AISetupWizard from '@/components/ai/AISetupWizard';

const AISetupWizardPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="AI Setup Wizard"
        description="Configure and optimize AI models, voice systems, and training data for your application."
        keywords="AI setup, machine learning, configuration, models, training"
        type="website"
      />
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <AISetupWizard />
      </div>
    </ProtectedRoute>
  );
};

export default AISetupWizardPage;
