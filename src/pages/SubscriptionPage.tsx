import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShieldCheck, Star } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Subscription Plans | Language Learning Platform</title>
      </Helmet>
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight">Choose Your Perfect Plan</h1>
          <p className="text-muted-foreground mt-2">
            Unlock premium features and take your language learning to the next level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <Card className="bg-muted shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold">Free</CardTitle>
              <CardDescription className="text-muted-foreground">
                Get started with basic features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">$0<span className="text-sm text-muted-foreground">/month</span></div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Access to basic lessons
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Limited flashcards
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Community support
                </li>
              </ul>
            </CardContent>
            <Button variant="secondary" className="w-full justify-center" onClick={() => {
              const element = document.getElementById('free-plan-button');
              if (element) {
                element.click();
              }
            }}>
              Get Started
            </Button>
            <a href="/" id="free-plan-button" className="hidden">Free Plan</a>
          </Card>

          {/* Basic Plan */}
          <Card className="bg-muted shadow-md">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold">Basic</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enhanced learning experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">$9<span className="text-sm text-muted-foreground">/month</span></div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Access to all lessons
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Unlimited flashcards
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Ad-free experience
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Email support
                </li>
              </ul>
            </CardContent>
            <Button variant="secondary" className="w-full justify-center" onClick={() => {
              const element = document.getElementById('basic-plan-button');
              if (element) {
                element.click();
              }
            }}>
              Choose Basic
            </Button>
            <a href="/" id="basic-plan-button" className="hidden">Basic Plan</a>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-muted shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold">Premium</CardTitle>
              <CardDescription className="text-muted-foreground">
                The ultimate learning package.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">$19<span className="text-sm text-muted-foreground">/month</span></div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Everything in Basic
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Priority support
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Personalized learning path
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Exclusive content
                </li>
                <li className="flex items-center text-sm">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Early access to new features
                </li>
              </ul>
            </CardContent>
            <Button variant="secondary" className="w-full justify-center" onClick={() => {
              const element = document.getElementById('premium-plan-button');
              if (element) {
                element.click();
              }
            }}>
              Choose Premium
            </Button>
            <a href="/" id="premium-plan-button" className="hidden">Premium Plan</a>
          </Card>
        </div>

        <div className="mt-12 text-center text-muted-foreground">
          <p className="text-sm">
            Have questions? <a href="/support-center" className="text-primary hover:underline">Contact our support team</a>.
          </p>
        </div>
      </div>
    </>
  );
};

const handleFreePlanClick = () => {
  const element = document.getElementById('free-plan-button');
  if (element instanceof HTMLElement) {
    element.click();
  }
};

const handleBasicPlanClick = () => {
  const element = document.getElementById('basic-plan-button');
  if (element instanceof HTMLElement) {
    element.click();
  }
};

const handlePremiumPlanClick = () => {
  const element = document.getElementById('premium-plan-button');
  if (element instanceof HTMLElement) {
    element.click();
  }
};

export default SubscriptionPage;
