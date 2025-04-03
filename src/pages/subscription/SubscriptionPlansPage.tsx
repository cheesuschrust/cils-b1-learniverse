
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  popular?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic features for learning Italian",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: "1 daily question", included: true },
      { name: "Basic vocabulary tools", included: true },
      { name: "Community forum access", included: true },
      { name: "Progress tracking", included: true },
      { name: "Advanced learning modules", included: false },
      { name: "Personalized learning path", included: false },
      { name: "Mock exams and tests", included: false },
      { name: "Premium study materials", included: false },
      { name: "AI-powered assistance", included: false },
    ]
  },
  {
    id: "premium",
    name: "Premium",
    description: "All features for serious learners",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    popular: true,
    features: [
      { name: "Unlimited daily questions", included: true },
      { name: "Advanced vocabulary tools", included: true },
      { name: "Community forum access", included: true },
      { name: "Progress tracking", included: true },
      { name: "Advanced learning modules", included: true },
      { name: "Personalized learning path", included: true },
      { name: "Mock exams and tests", included: true },
      { name: "Premium study materials", included: true },
      { name: "AI-powered assistance", included: true },
    ]
  }
];

const SubscriptionPlansPage: React.FC = () => {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      if (planId === "free") {
        // Handle downgrade logic
        toast({
          title: "Subscription updated",
          description: "You have successfully downgraded to the free plan.",
        });
      } else {
        // Navigate to payment page
        navigate(`/subscription/checkout/${planId}?interval=${billingInterval}`);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription error",
        description: "There was a problem with your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Calculate savings for yearly plans
  const calculateSavings = (monthlyPrice: number, yearlyPrice: number): number => {
    const monthlyCost = monthlyPrice * 12;
    return Math.round((1 - yearlyPrice / monthlyCost) * 100);
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <Helmet>
        <title>Subscription Plans - CILS Italian Citizenship</title>
      </Helmet>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Choose Your Perfect Plan</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the plan that suits your learning needs. Upgrade anytime to unlock more features.
        </p>
        
        <div className="mt-8 inline-flex items-center rounded-lg border p-1 shadow-sm">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="monthly" 
              className={billingInterval === "monthly" ? "bg-primary" : "bg-transparent"} 
              onClick={() => setBillingInterval("monthly")}
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger 
              value="yearly" 
              className={billingInterval === "yearly" ? "bg-primary" : "bg-transparent"} 
              onClick={() => setBillingInterval("yearly")}
            >
              Yearly <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs">Save 20%</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => {
          const price = billingInterval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const currentPlan = isPremium ? "premium" : "free";
          const isCurrentPlan = plan.id === currentPlan;
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit">
                  <Badge className="bg-primary hover:bg-primary">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl flex justify-between items-baseline">
                  {plan.name}
                  {price > 0 && (
                    <div className="text-right">
                      <span className="text-3xl font-bold">${price}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        /{billingInterval === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                  )}
                  {price === 0 && (
                    <div className="text-right">
                      <span className="text-2xl font-bold">Free</span>
                    </div>
                  )}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {plan.description}
                </CardDescription>
                {billingInterval === "yearly" && plan.monthlyPrice > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Save {calculateSavings(plan.monthlyPrice, plan.yearlyPrice)}% with annual billing
                  </p>
                )}
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button
                  className={`w-full ${plan.popular ? 'bg-primary' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={isProcessing || isCurrentPlan}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {isProcessing ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : plan.id === "free" ? (
                    "Downgrade to Free"
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-12 bg-muted rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Can I cancel anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to premium features until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">How do I change my plan?</h3>
            <p className="text-sm text-muted-foreground">
              You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately or at the end of your billing cycle.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Is there a refund policy?</h3>
            <p className="text-sm text-muted-foreground">
              We offer a 14-day money-back guarantee if you're not satisfied with your premium subscription.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Do you offer team or group plans?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, we offer special rates for groups and educational institutions. Please contact our support team for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;
