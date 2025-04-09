
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlanCard } from './SubscriptionPlanCard';
import { useAuth } from '@/contexts/AuthContext';

const EnhancedSubscriptionSelector: React.FC = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleSelectPlan = (planId: string) => {
    setLoadingPlan(planId);
    
    // Simulate API call to update subscription
    setTimeout(() => {
      setLoadingPlan(null);
      
      toast({
        title: 'Subscription Updated',
        description: `You have successfully subscribed to the ${planId} plan.`,
      });
    }, 1500);
  };
  
  // Define subscription plans
  const freePlan = {
    name: 'Free',
    description: 'Basic access to language learning tools',
    price: 'Free',
    features: [
      { text: 'Basic flashcards', included: true },
      { text: 'Limited question sets', included: true },
      { text: 'Community support', included: true },
      { text: 'Ad-supported experience', included: true },
      { text: 'Progress tracking', included: true },
      { text: 'Advanced features', included: false },
      { text: 'AI-powered assistance', included: false },
      { text: 'Offline access', included: false },
    ],
    buttonText: 'Current Plan',
    isCurrentPlan: user?.subscription === 'free',
  };
  
  const standardPlan = {
    name: 'Standard',
    description: 'Enhanced learning experience',
    price: billingInterval === 'monthly' ? '$9.99' : '$99.99',
    interval: billingInterval,
    features: [
      { text: 'All Free features', included: true },
      { text: 'Unlimited flashcards', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Advanced progress analytics', included: true },
      { text: 'Enhanced content', included: true },
      { text: 'Priority support', included: true },
      { text: 'Advanced AI features', included: false },
      { text: 'Custom curriculum', included: false },
    ],
    buttonText: user?.subscription === 'standard' ? 'Current Plan' : 'Subscribe',
    isCurrentPlan: user?.subscription === 'standard',
    isPopular: true,
    isLoading: loadingPlan === 'standard',
    onSelect: () => handleSelectPlan('standard'),
  };
  
  const premiumPlan = {
    name: 'Premium',
    description: 'Ultimate language learning',
    price: billingInterval === 'monthly' ? '$19.99' : '$199.99',
    interval: billingInterval,
    features: [
      { text: 'All Standard features', included: true },
      { text: 'Unlimited everything', included: true },
      { text: 'Advanced AI tutoring', included: true },
      { text: 'Custom curriculum builder', included: true },
      { text: 'Exclusive content', included: true },
      { text: 'Personal learning coach', included: true },
      { text: 'Multi-language access', included: true },
      { text: 'Early feature access', included: true },
    ],
    buttonText: user?.subscription === 'premium' ? 'Current Plan' : 'Subscribe',
    isCurrentPlan: user?.subscription === 'premium',
    isLoading: loadingPlan === 'premium',
    onSelect: () => handleSelectPlan('premium'),
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Tabs 
          defaultValue={billingInterval} 
          onValueChange={(value) => setBillingInterval(value as 'monthly' | 'annual')}
          className="w-full max-w-md"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Monthly
              </TabsTrigger>
              <TabsTrigger value="annual" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Annual
                <Badge variant="outline" className="ml-2 bg-primary/20 text-primary">
                  Save 16%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="monthly" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SubscriptionPlanCard {...freePlan} />
              <SubscriptionPlanCard {...standardPlan} />
              <SubscriptionPlanCard {...premiumPlan} />
            </div>
          </TabsContent>
          
          <TabsContent value="annual" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SubscriptionPlanCard {...freePlan} />
              <SubscriptionPlanCard {...standardPlan} />
              <SubscriptionPlanCard {...premiumPlan} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>All plans include access to our core learning features.</p>
        <p className="mt-2">Need a custom enterprise plan? <a href="#" className="underline text-primary">Contact our sales team</a>.</p>
      </div>
    </div>
  );
};

export default EnhancedSubscriptionSelector;
