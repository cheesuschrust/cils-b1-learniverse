
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Sparkles, Zap, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Feature {
  name: string;
  free: boolean | string | number;
  premium: boolean | string | number;
}

interface UpgradePromptProps {
  title?: string;
  description?: string;
  featureType?: 'complete' | 'limited' | string;
  limitReached?: boolean;
  buttonText?: string;
  features?: Feature[];
  children?: React.ReactNode;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  title = "Upgrade to Premium",
  description = "Unlock all features and maximize your learning experience",
  featureType = "limited",
  limitReached = false,
  buttonText = "Unlock Premium",
  features = defaultFeatures,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPremium } = useAuth();

  // Don't show for premium users
  if (isPremium) {
    return <>{children}</>;
  }

  // Default feature comparison
  return (
    <>
      {limitReached ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Card className="border-primary/40 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-primary">
                  <Lock className="h-5 w-5 mr-2" />
                  {getFeatureTitle(featureType)}
                </CardTitle>
                <CardDescription>
                  {getFeatureDescription(featureType, limitReached)}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-3">
                <Button className="w-full" onClick={() => setIsOpen(true)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          </DialogTrigger>
          <UpgradeDialog 
            title={title} 
            description={description} 
            features={features} 
          />
        </Dialog>
      ) : (
        <>
          {children}
          {!isPremium && (
            <div className="mt-4 p-4 rounded-lg border border-primary/40 bg-primary/5">
              <div className="flex items-start">
                <Zap className="h-5 w-5 text-primary mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary mb-1">
                    {getFeatureTitle(featureType)}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {getFeatureDescription(featureType, limitReached)}
                  </p>
                  <Button size="sm" asChild>
                    <Link to="/pricing">
                      <Sparkles className="h-4 w-4 mr-2" />
                      {buttonText}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

// Helper function for feature titles based on type
function getFeatureTitle(featureType: string): string {
  switch (featureType) {
    case 'flashcards':
      return 'Flashcard Limit Reached';
    case 'questions':
      return 'Daily Question Limit Reached';
    case 'listening':
      return 'Listening Exercise Limit Reached';
    case 'speaking':
      return 'Speaking Exercise Limit Reached';
    case 'writing':
      return 'Writing Exercise Limit Reached';
    case 'mock-test':
      return 'Mock Tests are a Premium Feature';
    case 'ai-feedback':
      return 'AI Feedback is a Premium Feature';
    case 'downloads':
      return 'Downloads are a Premium Feature';
    case 'limited':
      return 'You\'re using a limited version';
    default:
      return 'Upgrade to Premium for More';
  }
}

// Helper function for feature descriptions based on type
function getFeatureDescription(featureType: string, limitReached: boolean): string {
  if (limitReached) {
    switch (featureType) {
      case 'flashcards':
        return 'You\'ve reached your daily flashcard limit. Upgrade to Premium for unlimited flashcards.';
      case 'questions':
        return 'You\'ve used all your free daily questions. Premium users get unlimited questions.';
      case 'listening':
        return 'You\'ve reached your free listening exercise limit. Premium unlocks all exercises.';
      case 'speaking':
        return 'You\'ve used all your free speaking exercises today. Premium gives you unlimited access.';
      case 'writing':
        return 'You\'ve reached your writing exercise limit. Premium users get unlimited writing practice.';
      case 'mock-test':
        return 'Full mock tests are available to Premium users. Upgrade to access complete CILS exam simulations.';
      case 'ai-feedback':
        return 'AI-powered feedback and analysis is a Premium feature. Upgrade to get personalized insights.';
      case 'downloads':
        return 'Downloadable resources are available to Premium users. Upgrade to access study materials.';
      default:
        return 'You\'ve reached your free usage limit. Upgrade to Premium for unlimited access.';
    }
  } else {
    return 'Upgrade to Premium to unlock all features, including unlimited usage, downloadable resources, and more.';
  }
}

// Default features for comparison
const defaultFeatures: Feature[] = [
  { name: 'Daily Practice Questions', free: '1 per day', premium: 'Unlimited' },
  { name: 'Flashcards', free: '20 cards', premium: 'Unlimited' },
  { name: 'Listening Exercises', free: '5 per day', premium: 'Unlimited' },
  { name: 'Reading Exercises', free: '3 per day', premium: 'Unlimited' },
  { name: 'Writing Feedback', free: false, premium: true },
  { name: 'Speaking Practice', free: '2 per day', premium: 'Unlimited' },
  { name: 'Mock Tests', free: '1 per month', premium: 'Unlimited' },
  { name: 'AI-Powered Feedback', free: false, premium: true },
  { name: 'Downloadable Materials', free: false, premium: true },
  { name: 'Ad-Free Experience', free: false, premium: true },
  { name: 'Priority Support', free: false, premium: true },
];

// Separate component for the upgrade dialog
export const UpgradeDialog: React.FC<{
  title: string;
  description: string;
  features: Feature[];
}> = ({ title, description, features }) => {
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          {title}
        </DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-3 text-center py-4">
        <div></div>
        <div className="text-sm font-medium text-muted-foreground">Free</div>
        <div className="text-sm font-medium text-primary">Premium</div>
      </div>
      
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="grid grid-cols-3 items-center py-2 border-t border-border">
            <div className="text-sm font-medium">{feature.name}</div>
            <div className="text-center">
              {typeof feature.free === 'boolean' ? (
                feature.free ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                )
              ) : (
                <span className="text-sm text-muted-foreground">{feature.free}</span>
              )}
            </div>
            <div className="text-center">
              {typeof feature.premium === 'boolean' ? (
                feature.premium ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                )
              ) : (
                <span className="text-sm font-medium text-primary">{feature.premium}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
        <Button variant="outline" className="sm:flex-1" asChild>
          <Link to="/dashboard">Continue with Free</Link>
        </Button>
        <Button className="sm:flex-1" asChild>
          <Link to="/pricing">
            <Sparkles className="h-4 w-4 mr-2" />
            View Premium Plans
          </Link>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UpgradePrompt;
