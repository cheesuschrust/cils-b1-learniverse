
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, X, CreditCard, ShieldCheck, Zap, Clock, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { SubscriptionPlanDetails } from '@/types/subscription';

const PricingPage: React.FC = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlanDetails[]>([]);
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, fetch plans from the database
        // For now, we'll use mock data that matches our SubscriptionPlanDetails type
        const mockPlans: SubscriptionPlanDetails[] = [
          {
            id: 'free',
            name: 'Free',
            description: 'Basic features for casual learners',
            type: 'free',
            prices: [
              {
                interval: 'monthly',
                amount: 0,
                currency: 'EUR'
              },
              {
                interval: 'annual',
                amount: 0,
                currency: 'EUR'
              }
            ],
            features: [
              { id: 'daily-q', name: 'Daily Questions', description: 'Access to basic questions', value: 1 },
              { id: 'flashcards', name: 'Flashcards', description: 'Limited flashcard sets', value: 20 },
              { id: 'listening', name: 'Listening Exercises', description: 'Basic listening exercises', value: 5 },
              { id: 'community', name: 'Community Access', description: 'Read-only access to community forums', value: true }
            ],
            limitations: {
              questionsPerDay: 1,
              exercisesPerDay: 3,
              maxSavedItems: 20,
              downloadableContent: false,
              adsRemoved: false,
              prioritySupport: false
            },
            availableForPurchase: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'basic',
            name: 'Basic',
            description: 'Essential features for serious learners',
            type: 'basic',
            prices: [
              {
                interval: 'monthly',
                amount: 9.99,
                currency: 'EUR'
              },
              {
                interval: 'annual',
                amount: 99.99,
                currency: 'EUR',
                trialDays: 7
              }
            ],
            features: [
              { id: 'daily-q', name: 'Daily Questions', description: 'Access to all questions', value: 5 },
              { id: 'flashcards', name: 'Flashcards', description: 'Unlimited flashcard sets', value: 'Unlimited' },
              { id: 'listening', name: 'Listening Exercises', description: 'Full listening exercises', value: 'Unlimited' },
              { id: 'community', name: 'Community Access', description: 'Full access to community forums', value: true },
              { id: 'mock-tests', name: 'Mock Tests', description: 'Access to practice exams', value: 2 },
              { id: 'ads', name: 'Ad-Free Experience', description: 'No advertisements', value: true }
            ],
            limitations: {
              questionsPerDay: 5,
              exercisesPerDay: 10,
              maxSavedItems: 100,
              downloadableContent: true,
              adsRemoved: true,
              prioritySupport: false
            },
            availableForPurchase: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'premium',
            name: 'Premium',
            description: 'Complete package for citizenship success',
            type: 'premium',
            prices: [
              {
                interval: 'monthly',
                amount: 19.99,
                currency: 'EUR'
              },
              {
                interval: 'annual',
                amount: 179.99,
                currency: 'EUR',
                trialDays: 14
              }
            ],
            features: [
              { id: 'daily-q', name: 'Daily Questions', description: 'Unlimited personalized questions', value: 'Unlimited' },
              { id: 'flashcards', name: 'Flashcards', description: 'Advanced spaced repetition system', value: 'Unlimited' },
              { id: 'listening', name: 'Listening Exercises', description: 'Advanced listening and speaking', value: 'Unlimited' },
              { id: 'community', name: 'Community Access', description: 'Priority community access', value: true },
              { id: 'mock-tests', name: 'Mock Tests', description: 'Unlimited practice exams', value: 'Unlimited' },
              { id: 'ai-feedback', name: 'AI Feedback', description: 'Personalized AI tutor', value: true },
              { id: 'tutor', name: 'Expert Review', description: 'Expert review of your progress', value: true },
              { id: 'priority', name: 'Priority Support', description: '24-hour response time', value: true }
            ],
            limitations: {
              questionsPerDay: Infinity,
              exercisesPerDay: Infinity,
              maxSavedItems: Infinity,
              downloadableContent: true,
              adsRemoved: true,
              prioritySupport: true
            },
            recommended: true,
            availableForPurchase: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'educational',
            name: 'Educational',
            description: 'For schools and learning institutions',
            type: 'educational',
            prices: [
              {
                interval: 'monthly',
                amount: 99.99,
                currency: 'EUR'
              },
              {
                interval: 'annual',
                amount: 999.99,
                currency: 'EUR'
              }
            ],
            features: [
              { id: 'users', name: 'User Accounts', description: 'Multiple user accounts', value: 10 },
              { id: 'admin', name: 'Admin Dashboard', description: 'Track student progress', value: true },
              { id: 'resources', name: 'Teaching Resources', description: 'Lesson plans and materials', value: true },
              { id: 'everything', name: 'All Premium Features', description: 'Everything in Premium plan', value: true }
            ],
            limitations: {
              questionsPerDay: Infinity,
              exercisesPerDay: Infinity,
              maxSavedItems: Infinity,
              downloadableContent: true,
              adsRemoved: true,
              prioritySupport: true,
              maxUsers: 10
            },
            availableForPurchase: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        setPlans(mockPlans);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
        toast({
          title: 'Error loading plans',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [toast]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please sign in or create an account to subscribe',
        variant: 'default',
      });
      navigate('/auth/login', { state: { redirectTo: '/pricing' } });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would connect to a payment processor
      // For now we'll simulate the subscription update
      toast({
        title: 'Processing subscription...',
        description: 'Please wait while we update your subscription.',
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the selected plan
      const selectedPlan = plans.find(plan => plan.id === planId);
      
      if (!selectedPlan) {
        throw new Error('Invalid plan selected');
      }
      
      // Update user profile with subscription info
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          is_premium: selectedPlan.type !== 'free',
          premium_until: selectedPlan.type !== 'free' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            : null
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Subscription updated!',
        description: `You are now on the ${selectedPlan.name} plan.`,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Subscription update failed',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the savings for annual billing
  const calculateSavings = (plan: SubscriptionPlanDetails): number => {
    const monthlyPrice = plan.prices.find(price => price.interval === 'monthly')?.amount || 0;
    const annualPrice = plan.prices.find(price => price.interval === 'annual')?.amount || 0;
    
    if (monthlyPrice === 0 || annualPrice === 0) return 0;
    
    const monthlyCostPerYear = monthlyPrice * 12;
    return Math.round((1 - (annualPrice / monthlyCostPerYear)) * 100);
  };

  // Get the current price for the selected billing interval
  const getCurrentPrice = (plan: SubscriptionPlanDetails): number => {
    return plan.prices.find(price => 
      price.interval === (billingInterval === 'monthly' ? 'monthly' : 'annual')
    )?.amount || 0;
  };

  return (
    <>
      <Helmet>
        <title>Pricing Plans | CILS Italian Citizenship Test Preparation</title>
        <meta name="description" content="Choose the perfect plan for your Italian citizenship exam preparation. Free, Basic, and Premium options available to match your learning needs." />
      </Helmet>

      <div className="container max-w-7xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Choose Your Perfect Plan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Select the plan that matches your citizenship preparation needs and budget.
          </p>

          <div className="flex justify-center mb-8">
            <Tabs 
              value={billingInterval} 
              onValueChange={(value) => setBillingInterval(value as 'monthly' | 'annual')}
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">
                  Annual 
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-100">
                    Save up to 20%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const price = getCurrentPrice(plan);
            const isCurrentPlan = isPremium && plan.type === 'premium' || !isPremium && plan.type === 'free';
            const savings = calculateSavings(plan);
            
            return (
              <Card key={plan.id} className={`flex flex-col transition-shadow hover:shadow-md overflow-hidden ${plan.recommended ? 'border-primary border-2 relative' : ''}`}>
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                    Recommended
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      {plan.name}
                      {billingInterval === 'annual' && savings > 0 && (
                        <Badge className="ml-2 bg-green-50 text-green-600" variant="outline">
                          Save {savings}%
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <div className="text-3xl font-bold">
                      {price === 0 ? 'Free' : `€${price.toFixed(2)}`}
                    </div>
                    {price > 0 && (
                      <div className="text-sm text-gray-500">
                        per {billingInterval === 'monthly' ? 'month' : 'year'}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature.id} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">{feature.name}:</span> {feature.value.toString()}
                        </div>
                      </li>
                    ))}
                    
                    {plan.limitations && (
                      <>
                        <li className="flex items-start">
                          {plan.limitations.downloadableContent ? (
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                          )}
                          <div>Downloadable materials</div>
                        </li>
                        <li className="flex items-start">
                          {plan.limitations.adsRemoved ? (
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                          )}
                          <div>Ad-free experience</div>
                        </li>
                        <li className="flex items-start">
                          {plan.limitations.prioritySupport ? (
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                          )}
                          <div>Priority support</div>
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button 
                    className="w-full" 
                    variant={plan.recommended ? "default" : "outline"}
                    disabled={isLoading || isCurrentPlan}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isCurrentPlan 
                      ? 'Current Plan' 
                      : isPremium && plan.type === 'free' 
                        ? 'Downgrade to Free' 
                        : `Subscribe to ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          <div className="bg-gray-50 p-8 rounded-xl">
            <div className="flex mb-4">
              <ShieldCheck className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold">Satisfaction Guarantee</h3>
            </div>
            <p className="text-gray-600 mb-4">
              We're confident you'll love our platform. If you're not satisfied with your paid plan within the first 14 days, we'll refund your payment—no questions asked.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl">
            <div className="flex mb-4">
              <CreditCard className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold">Secure Payments</h3>
            </div>
            <p className="text-gray-600 mb-4">
              All payments are processed securely through Stripe. We never store your full credit card information on our servers.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-xl">
          <h3 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex mb-2">
                <HelpCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <h4 className="font-medium">Can I upgrade or downgrade at any time?</h4>
              </div>
              <p className="text-gray-600 pl-7">Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, your new plan will take effect at the end of your current billing period.</p>
            </div>
            
            <div>
              <div className="flex mb-2">
                <HelpCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <h4 className="font-medium">How does the free trial work?</h4>
              </div>
              <p className="text-gray-600 pl-7">Annual plans come with a free trial period. You won't be charged until the trial ends, and you can cancel anytime during the trial period.</p>
            </div>
            
            <div>
              <div className="flex mb-2">
                <HelpCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <h4 className="font-medium">What payment methods do you accept?</h4>
              </div>
              <p className="text-gray-600 pl-7">We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Some regions also support local payment methods.</p>
            </div>
            
            <div>
              <div className="flex mb-2">
                <HelpCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <h4 className="font-medium">Do you offer team or educational discounts?</h4>
              </div>
              <p className="text-gray-600 pl-7">Yes! We offer special pricing for educational institutions and groups. Contact our support team for more information.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is happy to help you choose the perfect plan for your needs.
          </p>
          <Button asChild>
            <Link to="/support-center">Contact Support</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
