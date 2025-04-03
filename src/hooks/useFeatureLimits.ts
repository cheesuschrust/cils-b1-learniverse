
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

// Free tier usage limits
const FREE_TIER_LIMITS = {
  questionsPerDay: 10,
  flashcardsPerDay: 20,
  exercisesPerDay: 5
};

export function useFeatureLimits() {
  const { user, isPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if user can use a feature within limits
  const checkFeatureAccess = useCallback(async (featureType: string): Promise<boolean> => {
    // Premium users always have access
    if (isPremium) return true;
    
    // Not logged in
    if (!user) return false;

    setIsLoading(true);
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Check current usage from Supabase
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('count')
        .eq('user_id', user.id)
        .eq('feature_type', featureType)
        .eq('date', today)
        .single();
        
      if (error && error.code !== 'PGRST116') { // Not found is okay
        console.error('Error checking feature access:', error);
        return true; // Allow access on error to avoid blocking users
      }
      
      const currentCount = data?.count || 0;
      const limit = FREE_TIER_LIMITS[featureType as keyof typeof FREE_TIER_LIMITS] || 0;
      
      return currentCount < limit;
      
    } catch (error) {
      console.error('Error in checkFeatureAccess:', error);
      return true; // Allow access on error
    } finally {
      setIsLoading(false);
    }
  }, [user, isPremium]);

  // Track feature usage
  const trackFeatureUsage = useCallback(async (featureType: string): Promise<void> => {
    if (!user || isPremium) return; // Don't track for premium users
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if record exists for today
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('id, count')
        .eq('user_id', user.id)
        .eq('feature_type', featureType)
        .eq('date', today)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        // Update existing record
        await supabase
          .from('usage_tracking')
          .update({ count: data.count + 1 })
          .eq('id', data.id);
      } else {
        // Create new record
        await supabase
          .from('usage_tracking')
          .insert({
            user_id: user.id,
            feature_type: featureType,
            date: today,
            count: 1
          });
      }
    } catch (error) {
      console.error('Error tracking feature usage:', error);
    }
  }, [user, isPremium]);

  // Use a feature with limit checking
  const useFeature = useCallback(async (featureType: string): Promise<boolean> => {
    if (isPremium) return true; // Premium users always have access
    
    const canAccess = await checkFeatureAccess(featureType);
    
    if (canAccess) {
      await trackFeatureUsage(featureType);
      return true;
    } else {
      // Show upgrade prompt
      toast({
        title: "Free Plan Limit Reached",
        description: `You've reached the daily limit for this feature. Upgrade to Premium for unlimited access.`,
        action: (
          <a href="/subscription" className="bg-primary text-white px-3 py-2 text-xs rounded-md font-medium">
            Upgrade
          </a>
        ),
      });
      return false;
    }
  }, [checkFeatureAccess, trackFeatureUsage, isPremium, toast]);

  return {
    isLoading,
    limits: FREE_TIER_LIMITS,
    checkFeatureAccess,
    trackFeatureUsage,
    useFeature
  };
}
