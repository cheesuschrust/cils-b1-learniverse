
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, X, Loader2, Shield, BookOpen, List, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubscriptionPlan } from '@/types/subscription';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlanProps {
  name: string;
  description: string;
  price: string;
  interval: 'month' | 'year';
  features: PlanFeature[];
  buttonText: string;
  isPopular?: boolean;
  planType: SubscriptionPlan;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  isCurrentPlan: boolean;
  isLoading: boolean;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  name,
  description,
  price,
  interval,
  features,
  buttonText,
  isPopular,
  planType,
  onSelectPlan,
  isCurrentPlan,
  isLoading
}) => {
  return (
    <Card className={`overflow-hidden ${isPopular ? 'border-primary shadow-lg relative' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground py-1 px-4 text-sm font-medium">
          Popular
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          {interval && <span className="text-muted-foreground ml-1">/{interval}</span>}
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              {feature.included ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground mr-2" />
              )}
              <span className={!feature.included ? 'text-muted-foreground' : ''}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full"
          variant={isPopular ? "default" : "outline"}
          disabled={isCurrentPlan || isLoading}
          onClick={() => onSelectPlan(planType)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : (
            buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [error, setError] = useState<string | null>(null);
  
  const { 
    subscription, 
    isLoading, 
    updateSubscription, 
    hasPremiumAccess 
  } = useSubscription();
  
  const handleUpdateSubscription = async (plan: SubscriptionPlan) => {
    setError(null);
    
    if (!user) {
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }
    
    try {
      const success = await updateSubscription(plan);
      if (success) {
        // Show success message or redirect
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating your subscription');
    }
  };
  
  // Plan features
  const monthlyPlans = [
    {
      name: "Free",
      description: "Essential features for preparation",
      price: "€0",
      interval: 'month' as const,
      features: [
        { text: "Basic CILS B2 practice questions", included: true },
        { text: "Limited flashcards (20/day)", included: true },
        { text: "Basic reading exercises (3/day)", included: true },
        { text: "Basic listening exercises (3/day)", included: true },
        { text: "Full mock tests", included: false },
        { text: "AI-powered feedback", included: false },
        { text: "Premium question bank", included: false },
        { text: "Progress tracking", included: true },
        { text: "Community support", included: true },
      ],
      buttonText: "Get Started",
      planType: 'free' as SubscriptionPlan,
      isCurrentPlan: !hasPremiumAccess()
    },
    {
      name: "Premium",
      description: "Comprehensive preparation for success",
      price: "€9.99",
      interval: 'month' as const,
      features: [
        { text: "Unlimited CILS B2 practice questions", included: true },
        { text: "Full flashcard library", included: true },
        { text: "Advanced reading exercises", included: true },
        { text: "Advanced listening exercises", included: true },
        { text: "Full mock tests", included: true },
        { text: "AI-powered feedback", included: true },
        { text: "Premium question bank", included: true },
        { text: "Detailed progress analytics", included: true },
        { text: "Priority support", included: true },
      ],
      buttonText: "Upgrade Now",
      isPopular: true,
      planType: 'premium' as SubscriptionPlan,
      isCurrentPlan: hasPremiumAccess()
    }
  ];
  
  const yearlyPlans = [
    {
      name: "Free",
      description: "Essential features for preparation",
      price: "€0",
      interval: 'year' as const,
      features: [
        { text: "Basic CILS B2 practice questions", included: true },
        { text: "Limited flashcards (20/day)", included: true },
        { text: "Basic reading exercises (3/day)", included: true },
        { text: "Basic listening exercises (3/day)", included: true },
        { text: "Full mock tests", included: false },
        { text: "AI-powered feedback", included: false },
        { text: "Premium question bank", included: false },
        { text: "Progress tracking", included: true },
        { text: "Community support", included: true },
      ],
      buttonText: "Get Started",
      planType: 'free' as SubscriptionPlan,
      isCurrentPlan: !hasPremiumAccess()
    },
    {
      name: "Premium",
      description: "Comprehensive preparation for success",
      price: "€99.99",
      interval: 'year' as const,
      features: [
        { text: "Unlimited CILS B2 practice questions", included: true },
        { text: "Full flashcard library", included: true },
        { text: "Advanced reading exercises", included: true },
        { text: "Advanced listening exercises", included: true },
        { text: "Full mock tests", included: true },
        { text: "AI-powered feedback", included: true },
        { text: "Premium question bank", included: true },
        { text: "Detailed progress analytics", included: true },
        { text: "Priority support", included: true },
        { text: "2 months free", included: true },
      ],
      buttonText: "Upgrade Now",
      isPopular: true,
      planType: 'premium' as SubscriptionPlan,
      isCurrentPlan: hasPremiumAccess()
    }
  ];
  
  const plans = billingInterval === 'month' ? monthlyPlans : yearlyPlans;
  
  return (
    <>
      <Helmet>
        <title>Subscription Plans | CILS Italian Exam Prep</title>
      </Helmet>
      <div className="container py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Enhance your CILS B2 citizenship exam preparation with our premium features.
          </p>
          
          <div className="flex justify-center mb-8">
            <Tabs 
              defaultValue="month" 
              value={billingInterval}
              onValueChange={(value) => setBillingInterval(value as 'month' | 'year')}
              className="w-auto"
            >
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="month">Monthly</TabsTrigger>
                <TabsTrigger value="year">
                  Yearly
                  <Badge className="ml-2 bg-green-500 text-white hover:bg-green-600" variant="secondary">
                    Save 16%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="max-w-md mx-auto mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingPlan
              key={plan.name}
              {...plan}
              onSelectPlan={handleUpdateSubscription}
              isLoading={isLoading}
            />
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Premium Features</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-muted/40">
              <CardHeader className="pb-2">
                <Shield className="h-6 w-6 mb-2 text-primary" />
                <CardTitle className="text-xl">Complete Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access all practice materials, mock tests, and preparation resources needed to pass your CILS B2 exam.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/40">
              <CardHeader className="pb-2">
                <BookOpen className="h-6 w-6 mb-2 text-primary" />
                <CardTitle className="text-xl">Unlimited Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Remove daily limits on flashcards and exercises to maximize your learning and study at your own pace.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/40">
              <CardHeader className="pb-2">
                <MessageSquare className="h-6 w-6 mb-2 text-primary" />
                <CardTitle className="text-xl">AI-Powered Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get personalized feedback on your speaking and writing exercises from our advanced AI language model.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="max-w-lg mx-auto mt-16 text-center">
          <h3 className="text-lg font-medium mb-2">100% Satisfaction Guarantee</h3>
          <p className="text-muted-foreground">
            If you're not satisfied with our premium plan, contact us within 30 days for a full refund. No questions asked.
          </p>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
