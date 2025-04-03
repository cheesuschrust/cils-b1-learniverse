
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, Loader2 } from 'lucide-react';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface SubscriptionPlanCardProps {
  name: string;
  description: string;
  price: string;
  interval?: string;
  features: PlanFeature[];
  buttonText: string;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  isLoading?: boolean;
  onSelect?: () => void;
}

export function SubscriptionPlanCard({
  name,
  description,
  price,
  interval = 'month',
  features,
  buttonText,
  isPopular = false,
  isCurrentPlan = false,
  isLoading = false,
  onSelect
}: SubscriptionPlanCardProps) {
  return (
    <Card className={`overflow-hidden ${isPopular ? 'border-primary shadow-md relative' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground py-1 px-4 text-xs font-medium">
          Popular
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Free' && <span className="text-muted-foreground ml-1">/{interval}</span>}
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              {feature.included ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
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
          onClick={onSelect}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
