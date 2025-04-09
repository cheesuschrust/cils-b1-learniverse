
import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedSubscriptionSelector from '@/components/subscription/EnhancedSubscriptionSelector';

const SubscriptionPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Subscription Plans | Language Learning Platform</title>
      </Helmet>
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Choose Your Perfect Plan</h1>
          <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">
            Unlock premium features and take your language learning to the next level 
            with our flexible subscription options.
          </p>
        </div>

        <EnhancedSubscriptionSelector />
      </div>
    </>
  );
};

export default SubscriptionPage;
