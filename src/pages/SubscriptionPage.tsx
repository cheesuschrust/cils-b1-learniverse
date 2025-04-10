
import React from 'react';
import EnhancedSubscriptionSelector from '@/components/subscription/EnhancedSubscriptionSelector';
import DynamicSEO from '@/components/marketing/DynamicSEO';
import Advertisement from '@/components/common/Advertisement';
import UsageLimits from '@/components/common/UsageLimits';
import StructuredDataService from '@/services/StructuredDataService';

const SubscriptionPage: React.FC = () => {
  // Create product structured data for better SEO
  const subscriptionStructuredData = StructuredDataService.generateProduct({
    name: "Premium Italian Language Learning Subscription",
    description: "Unlock your Italian language learning potential with our premium subscription plans. Access unlimited practice questions, AI-powered feedback, and ad-free experience.",
    price: "9.99",
    currency: "USD",
    sku: "CILS-SUB-PREMIUM",
    brand: "CILS Italian Citizenship Prep",
    url: window.location.href
  });

  // Create FAQ structured data for the FAQ section
  const faqStructuredData = StructuredDataService.generateFAQPage([
    {
      question: "How will a premium subscription help me?",
      answer: "Premium subscribers get unlimited access to all practice questions, personalized feedback, progress tracking, and an ad-free experience."
    },
    {
      question: "Can I cancel my subscription anytime?", 
      answer: "Yes, you can cancel your subscription anytime. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Is there a refund policy?", 
      answer: "We offer a 7-day money-back guarantee for all new subscribers if you're not satisfied with our premium features."
    }
  ]);

  // Combine both structured data objects
  const combinedStructuredData = [subscriptionStructuredData, faqStructuredData];

  return (
    <>
      <DynamicSEO 
        title="Premium Subscription Plans"
        description="Unlock your Italian language learning potential with our premium subscription plans. Access unlimited practice questions, AI-powered feedback, and ad-free experience."
        keywords="Italian language, CILS exam, subscription, language learning, premium plan"
        structuredData={combinedStructuredData}
        canonicalUrl={window.location.href}
      />
      
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Choose Your Perfect Plan</h1>
          <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">
            Unlock premium features and take your language learning to the next level 
            with our flexible subscription options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EnhancedSubscriptionSelector />
          </div>
          
          <div className="space-y-6">
            <UsageLimits showUpgradeButton={false} />
            <Advertisement position="sidebar" size="medium" />
          </div>
        </div>
        
        <div className="mt-16 bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">How will a premium subscription help me?</h3>
              <p className="text-muted-foreground">Premium subscribers get unlimited access to all practice questions, personalized feedback, progress tracking, and an ad-free experience.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Can I cancel my subscription anytime?</h3>
              <p className="text-muted-foreground">Yes, you can cancel your subscription anytime. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Is there a refund policy?</h3>
              <p className="text-muted-foreground">We offer a 7-day money-back guarantee for all new subscribers if you're not satisfied with our premium features.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
