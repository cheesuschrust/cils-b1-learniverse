
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly');
  };
  
  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Basic access to essential study materials',
      price: {
        monthly: 0,
        yearly: 0
      },
      features: [
        { name: 'Daily question of the day', included: true },
        { name: 'Basic flashcards (100 cards)', included: true },
        { name: 'Community forum access', included: true },
        { name: 'Limited practice exercises', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'AI-generated content', included: false },
        { name: 'Mock exams', included: false },
        { name: 'Speaking practice with feedback', included: false },
        { name: 'Writing assessment', included: false },
        { name: 'Personalized study plan', included: false },
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Complete exam preparation toolkit',
      price: {
        monthly: 9.99,
        yearly: 99.99
      },
      features: [
        { name: 'Everything in Free plan', included: true },
        { name: 'Unlimited flashcards', included: true },
        { name: 'Full practice exercise library', included: true },
        { name: 'All mock exams', included: true },
        { name: 'AI-generated practice questions', included: true },
        { name: 'Basic speaking practice', included: true },
        { name: 'Basic writing feedback', included: true },
        { name: 'Personalized study plan', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
      ],
      cta: 'Start Premium',
      popular: true
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Advanced preparation with expert guidance',
      price: {
        monthly: 19.99,
        yearly: 199.99
      },
      features: [
        { name: 'Everything in Premium plan', included: true },
        { name: 'Advanced speaking practice with detailed feedback', included: true },
        { name: 'Expert writing assessment', included: true },
        { name: 'One-on-one tutoring session (monthly)', included: true },
        { name: 'Advanced analytics and insights', included: true },
        { name: 'Priority support', included: true },
        { name: 'Guaranteed pass or money back', included: true },
        { name: 'Citizenship application guidance', included: true },
        { name: 'Official certificate preparation', included: true },
        { name: 'Exam day strategies session', included: true },
      ],
      cta: 'Go Professional',
      popular: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing | CILS B1 Italian Citizenship Test Prep</title>
        <meta name="description" content="Choose the right plan for your Italian CILS B1 citizenship exam preparation. Flexible pricing options to fit your needs." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that best fits your Italian citizenship exam preparation needs
            </p>
            
            <div className="flex items-center justify-center space-x-4 pt-4">
              <Label htmlFor="billing-toggle" className={billingCycle === 'monthly' ? 'font-medium' : ''}>Monthly</Label>
              <Switch 
                id="billing-toggle" 
                checked={billingCycle === 'yearly'} 
                onCheckedChange={toggleBillingCycle} 
              />
              <div className="flex items-center gap-2">
                <Label htmlFor="billing-toggle" className={billingCycle === 'yearly' ? 'font-medium' : ''}>Yearly</Label>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Save 20%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg relative' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 right-4">Most Popular</Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {plan.price[billingCycle] === 0 ? 'Free' : `$${plan.price[billingCycle]}`}
                    </span>
                    {plan.price[billingCycle] > 0 && (
                      <span className="text-muted-foreground ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`${!feature.included ? 'text-muted-foreground' : ''}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    asChild 
                    className="w-full" 
                    variant={plan.id === 'free' ? 'outline' : 'default'}
                  >
                    <Link to={plan.id === 'free' ? '/signup' : '/checkout'}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, your new plan will take effect at the end of your current billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Is there a money-back guarantee?</h3>
              <p className="text-muted-foreground">
                Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, you can request a full refund within 14 days of your purchase.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">How does the guaranteed pass work?</h3>
              <p className="text-muted-foreground">
                Professional plan members who complete at least 80% of their study plan and still don't pass their CILS B1 exam can request a full refund of their subscription fees paid in the last 6 months. Proof of exam failure is required.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Can I use the platform on multiple devices?</h3>
              <p className="text-muted-foreground">
                Yes, your subscription works across all your devices. Simply log in to your account on any device to access your learning materials and progress.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All payments are securely processed and your payment information is never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Our team is here to help you choose the right plan for your Italian citizenship test preparation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingPage;
