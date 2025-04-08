
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  features: PlanFeature[];
  buttonText: string;
  isPopular?: boolean;
  isPremium: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    description: "Essential features for preparation",
    price: "€0",
    features: [
      { text: "Basic CILS B2 practice questions", included: true },
      { text: "Limited flashcards", included: true },
      { text: "Basic reading exercises", included: true },
      { text: "Basic listening exercises", included: true },
      { text: "Full mock tests", included: false },
      { text: "AI-powered feedback", included: false },
      { text: "Premium question bank", included: false },
    ],
    buttonText: "Current Plan",
    isPremium: false
  },
  {
    name: "Premium",
    description: "Comprehensive preparation for success",
    price: "€9.99",
    features: [
      { text: "Unlimited CILS B2 practice questions", included: true },
      { text: "Full flashcard library", included: true },
      { text: "Advanced reading exercises", included: true },
      { text: "Advanced listening exercises", included: true },
      { text: "Full mock tests", included: true },
      { text: "AI-powered feedback", included: true },
      { text: "Premium question bank", included: true },
    ],
    buttonText: "Upgrade Now",
    isPopular: true,
    isPremium: true
  }
];

const SubscriptionPage = () => {
  const { isPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would redirect to a payment processor
      // or handle subscription activation
      
      // For now, just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Something went wrong processing your subscription');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg">
          Enhance your CILS B2 citizenship exam preparation with our premium features.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="max-w-md mx-auto mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`overflow-hidden ${plan.isPopular ? 'border-primary shadow-lg relative' : ''}`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground py-1 px-4 text-sm font-medium">
                Popular
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.name !== "Free" && <span className="text-muted-foreground ml-1">/month</span>}
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
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
                variant={plan.isPremium ? "default" : "outline"}
                disabled={(isPremium && plan.isPremium) || (!isPremium && !plan.isPremium) || isLoading}
                onClick={plan.isPremium ? handleSubscribe : undefined}
              >
                {isLoading && plan.isPremium ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.buttonText
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="max-w-lg mx-auto mt-10 text-center">
        <h3 className="text-lg font-medium mb-2">100% Satisfaction Guarantee</h3>
        <p className="text-muted-foreground">
          If you're not satisfied with our premium plan, contact us within 30 days for a full refund. No questions asked.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage;
