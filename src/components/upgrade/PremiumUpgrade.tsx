
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { updateUserSubscription } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface PremiumUpgradeProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ onSuccess, onCancel }) => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const isPremium = user?.subscription === 'premium';
  
  const handleUpgrade = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // In a real app, this would redirect to a payment processor
      // For demo purposes, we'll just update the user's subscription directly
      const success = await updateUserSubscription(user.id, 'premium');
      
      if (success) {
        toast({
          title: "Upgrade Successful",
          description: "You now have premium access to all features!",
        });
        
        // Refresh user data to update UI
        await refreshUser();
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Failed to update subscription");
      }
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      toast({
        title: "Upgrade Failed",
        description: "There was a problem upgrading your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDowngrade = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // For demo purposes
      const success = await updateUserSubscription(user.id, 'free');
      
      if (success) {
        toast({
          title: "Downgrade Successful",
          description: "Your account has been downgraded to the free plan.",
        });
        
        // Refresh user data to update UI
        await refreshUser();
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Failed to update subscription");
      }
    } catch (error) {
      console.error('Error downgrading subscription:', error);
      toast({
        title: "Downgrade Failed",
        description: "There was a problem updating your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Premium Access</CardTitle>
            <CardDescription>Unlock unlimited learning potential</CardDescription>
          </div>
          {isPremium && (
            <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
              PREMIUM
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isPremium ? (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-start gap-3 border border-green-200 dark:border-green-700">
            <Check className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">You have Premium Access</h4>
              <p className="text-sm text-muted-foreground">
                Enjoy unlimited questions and all premium features.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md flex items-start gap-3 border border-amber-200 dark:border-amber-700">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium">You're on the Free Plan</h4>
              <p className="text-sm text-muted-foreground">
                Upgrade to premium to unlock unlimited access.
              </p>
            </div>
          </div>
        )}
        
        <div className="pt-4 space-y-3">
          <div className="flex gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <p>Unlimited questions daily</p>
          </div>
          <div className="flex gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <p>All question types unlocked</p>
          </div>
          <div className="flex gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <p>Advanced AI-powered content generation</p>
          </div>
          <div className="flex gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <p>No ads or restrictions</p>
          </div>
          <div className="flex gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <p>Priority support</p>
          </div>
        </div>
        
        {!isPremium && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <div className="flex justify-center">
              <div className="text-center">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Cancel anytime. No commitment required.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onCancel}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        
        {isPremium ? (
          <Button
            variant="default"
            className="flex-1 bg-red-500 hover:bg-red-600"
            onClick={handleDowngrade}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Downgrade to Free'
            )}
          </Button>
        ) : (
          <Button
            variant="default"
            className="flex-1"
            onClick={handleUpgrade}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Upgrade Now'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PremiumUpgrade;
