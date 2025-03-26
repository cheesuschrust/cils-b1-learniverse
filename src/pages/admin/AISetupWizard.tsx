
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AISetupWizard from '@/components/ai/AISetupWizard';

const AISetupWizardPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AI Setup Wizard</title>
      </Helmet>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <AISetupWizard />
      </div>
    </>
  );
};

export default AISetupWizardPage;
