
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Star, Trophy, Building, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionPlan, SubscriptionPlanDetails, SubscriptionInterval } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

const plans: SubscriptionPlanDetails[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for casual learners just getting started',
    type: 'basic',
    prices: [
      {
        interval: 'monthly',
        amount: 4.99,
        currency: 'USD',
        trialDays: 7,
      },
      {
        interval: 'annual',
        amount: 49.99,
        currency: 'USD',
        trialDays: 14,
      }
    ],
    features: [
      { id: 'basic-1', name: 'Daily Questions', description: 'Get 5 questions per day', value: 5 },
      { id: 'basic-2', name: 'Ad Experience', description: 'Reduced ads', value: 'reduced' },
      { id: 'basic-3', name: 'Content Access', description: 'Access to standard content', value: true },
      { id: 'basic-4', name: 'Progress Tracking', description: 'Basic progress tracking', value: true },
    ],
    limitations: {
      questionsPerDay: 5,
      exercisesPerDay: 5,
      maxSavedItems: 50,
      downloadableContent: false,
      adsRemoved: false,
      prioritySupport: false,
    },
    recommended: false,
    availableForPurchase: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-01'),
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Our most popular plan for dedicated learners',
    type: 'premium',
    prices: [
      {
        interval: 'monthly',
        amount: 9.99,
        currency: 'USD',
        trialDays: 7,
      },
      {
        interval: 'annual',
        amount: 99.99,
        currency: 'USD',
        trialDays: 14,
      }
    ],
    features: [
      { id: 'premium-1', name: 'Daily Questions', description: 'Unlimited questions', value: 'unlimited' },
      { id: 'premium-2', name: 'Ad Experience', description: 'No ads', value: 'none' },
      { id: 'premium-3', name: 'Content Access', description: 'Access to all content', value: true },
      { id: 'premium-4', name: 'Progress Tracking', description: 'Advanced progress tracking', value: true },
      { id: 'premium-5', name: 'Downloadable Content', description: 'Download materials for offline use', value: true },
      { id: 'premium-6', name: 'Priority Support', description: 'Get faster support responses', value: true },
    ],
    limitations: {
      questionsPerDay: Infinity,
      exercisesPerDay: Infinity,
      maxSavedItems: 500,
      downloadableContent: true,
      adsRemoved: true,
      prioritySupport: true,
    },
    recommended: true,
    availableForPurchase: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-01'),
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'For schools and educational institutions',
    type: 'educational',
    prices: [
      {
        interval: 'annual',
        amount: 299.99,
        currency: 'USD',
        trialDays: 30,
      }
    ],
    features: [
      { id: 'edu-1', name: 'Users', description: 'Up to 30 students', value: 30 },
      { id: 'edu-2', name: 'Ad Experience', description: 'No ads', value: 'none' },
      { id: 'edu-3', name: 'Content Access', description: 'All content plus education-specific material', value: true },
      { id: 'edu-4', name: 'Progress Tracking', description: 'Detailed student progress reports', value: true },
      { id: 'edu-5', name: 'Admin Dashboard', description: 'Teacher administration tools', value: true },
      { id: 'edu-6', name: 'Custom Content', description: 'Create custom lessons for your class', value: true },
    ],
    limitations: {
      questionsPerDay: Infinity,
      exercisesPerDay: Infinity,
      maxSavedItems: 1000,
      downloadableContent: true,
      adsRemoved: true,
      prioritySupport: true,
      maxUsers: 30,
    },
    recommended: false,
    availableForPurchase: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-01'),
  },
];

interface SubscriptionPlansProps {
  selectedInterval?: 'monthly' | 'annual' | 'quarterly';
  onIntervalChange?: (interval: 'monthly' | 'annual' | 'quarterly') => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  selectedInterval = 'monthly',
  onIntervalChange 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleSubscribe = (plan: SubscriptionPlanDetails) => {
    // In a real implementation, this would redirect to a payment page
    toast({
      title: "Subscription Started",
      description: `You've started the process to subscribe to the ${plan.name} plan.`,
    });
    
    // Simulate redirection to payment page
    console.log(`Subscribing to ${plan.name} plan`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center rounded-full border p-1 bg-muted">
          <Button
            variant={selectedInterval === 'monthly' ? "default" : "ghost"}
            size="sm"
            onClick={() => onIntervalChange?.('monthly')}
            className="rounded-full"
          >
            Monthly
          </Button>
          <Button
            variant={selectedInterval === 'annual' ? "default" : "ghost"}
            size="sm"
            onClick={() => onIntervalChange?.('annual')}
            className="rounded-full"
          >
            Annual
            <Badge variant="outline" className="ml-2 bg-primary/20 text-primary">
              Save 15%
            </Badge>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          // Find the price for the selected interval
          const price = plan.prices.find(p => p.interval === selectedInterval) || plan.prices[0];
          
          // Skip educational plan in the grid view if showing monthly
          if (plan.type === 'educational' && selectedInterval === 'monthly') {
            return null;
          }
          
          const isCurrentPlan = user?.subscription === plan.type;
          
          return (
            <Card 
              key={plan.id} 
              className={`flex flex-col ${plan.recommended ? 'border-primary shadow-md relative' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <Badge className="bg-primary hover:bg-primary">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {plan.type === 'basic' && <Trophy className="h-5 w-5 text-orange-500" />}
                  {plan.type === 'premium' && <Star className="h-5 w-5 text-amber-500" />}
                  {plan.type === 'educational' && <Building className="h-5 w-5 text-blue-500" />}
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <span className="text-3xl font-bold">${price.amount}</span>
                  <span className="text-muted-foreground">/{price.interval}</span>
                  
                  {price.trialDays && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Includes {price.trialDays}-day free trial
                    </p>
                  )}
                </div>
                
                <ul className="space-y-2 mt-6">
                  {plan.features.map((feature) => (
                    <li key={feature.id} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{feature.name}: </span>
                        <span className="text-muted-foreground">{feature.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={isCurrentPlan ? "outline" : (plan.recommended ? "default" : "outline")}
                  disabled={isCurrentPlan}
                  onClick={() => handleSubscribe(plan)}
                >
                  {isCurrentPlan ? (
                    "Current Plan"
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {selectedInterval === 'monthly' && (
        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-500" />
              <CardTitle>Educational Plans</CardTitle>
            </div>
            <CardDescription>
              Perfect for schools, universities, and educational institutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Our educational plans are billed annually and offer special features for teaching environments.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => onIntervalChange?.('annual')}
            >
              <Users className="h-4 w-4 mr-2" />
              View Educational Plans
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>All plans include access to our core learning features.</p>
        <p className="mt-1">Need a custom plan for your organization? <a href="#" className="underline text-primary">Contact our sales team</a>.</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
