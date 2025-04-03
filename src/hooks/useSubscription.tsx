
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { UserSubscription, SubscriptionStatus, SubscriptionPlan } from '@/types/subscription';

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSubscription = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setSubscription({
          id: data.id,
          userId: data.user_id,
          planId: data.plan_id,
          status: data.status as SubscriptionStatus,
          currentPeriod: {
            start: new Date(data.current_period_start),
            end: new Date(data.current_period_end),
          },
          interval: data.interval,
          price: {
            amount: data.price_amount,
            currency: data.price_currency,
          },
          paymentMethod: data.payment_method,
          autoRenew: data.auto_renew,
          startedAt: new Date(data.started_at),
          canceledAt: data.canceled_at ? new Date(data.canceled_at) : undefined,
          trialEnd: data.trial_end ? new Date(data.trial_end) : undefined,
          nextBillingDate: data.next_billing_date ? new Date(data.next_billing_date) : undefined,
          metadata: data.metadata,
        });
      }
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      setError(err.message || 'Failed to fetch subscription information');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (planType: SubscriptionPlan) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would connect to a payment processor
      // For now, we'll just simulate the subscription change
      
      toast({
        title: 'Processing subscription change...',
        description: 'Please wait while we update your subscription.',
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile with subscription info
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          is_premium: planType !== 'free',
          premium_until: planType !== 'free' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            : null
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Subscription updated!',
        description: `You are now on the ${planType} plan.`,
      });
      
      // Refresh subscription data
      await fetchSubscription();
      
      return true;
    } catch (err: any) {
      console.error('Error updating subscription:', err);
      setError(err.message || 'Failed to update subscription');
      
      toast({
        title: 'Subscription update failed',
        description: err.message || 'Please try again later',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user?.id || !subscription) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      toast({
        title: 'Processing cancellation...',
        description: 'Your subscription is being canceled.',
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          is_premium: false,
          premium_until: null
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Subscription canceled',
        description: 'You will have access until the end of your current period.',
      });
      
      // Refresh subscription data
      await fetchSubscription();
      
      return true;
    } catch (err: any) {
      console.error('Error canceling subscription:', err);
      setError(err.message || 'Failed to cancel subscription');
      
      toast({
        title: 'Cancellation failed',
        description: err.message || 'Please try again later',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has access to premium features
  const hasPremiumAccess = (): boolean => {
    if (!subscription) return false;
    
    const validStatuses: SubscriptionStatus[] = ['active', 'trialing'];
    
    return validStatuses.includes(subscription.status) &&
      (subscription.currentPeriod.end > new Date() || 
       !subscription.canceledAt);
  };

  useEffect(() => {
    if (user?.id) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    subscription,
    isLoading,
    error,
    updateSubscription,
    cancelSubscription,
    hasPremiumAccess,
    refreshSubscription: fetchSubscription
  };
}
