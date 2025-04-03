
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import useOnlineStatus from './useOnlineStatus';
import { supabase } from '@/lib/supabase-client';

export type FeatureLimitConfig = {
  free: number;
  premium: number;
};

export type FeatureLimits = {
  flashcards: FeatureLimitConfig;
  writingExercises: FeatureLimitConfig;
  aiSuggestions: FeatureLimitConfig;
  downloads: FeatureLimitConfig;
  listeningExercises: FeatureLimitConfig;
  readingExercises: FeatureLimitConfig;
  speakingExercises: FeatureLimitConfig;
};

const DEFAULT_LIMITS: FeatureLimits = {
  flashcards: { free: 50, premium: 1000 },
  writingExercises: { free: 5, premium: 100 },
  aiSuggestions: { free: 10, premium: 500 },
  downloads: { free: 3, premium: 100 },
  listeningExercises: { free: 5, premium: 100 },
  readingExercises: { free: 5, premium: 100 },
  speakingExercises: { free: 5, premium: 100 },
};

export type UsageMetrics = {
  [key: string]: number;
};

/**
 * Hook for managing feature limitations based on subscription tier
 */
export const useFeatureLimits = () => {
  const { isPremium, isAuthenticated, user } = useAuth();
  const isOnline = useOnlineStatus();
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load usage metrics from local storage or API
  useEffect(() => {
    const loadUsageMetrics = async () => {
      try {
        // If offline, get from localStorage only
        if (!isOnline) {
          const storedMetrics = localStorage.getItem('usageMetrics');
          if (storedMetrics) {
            setUsageMetrics(JSON.parse(storedMetrics));
          }
          setIsLoading(false);
          return;
        }

        // If online and authenticated, get from API and update local storage
        if (isAuthenticated && user) {
          try {
            // In a real implementation, we would fetch from API
            // const response = await api.getUserMetrics();
            // For now, attempt to fetch from Supabase
            const today = new Date().toISOString().split('T')[0];
            
            const { data, error } = await supabase
              .from('usage_tracking')
              .select('question_type, count')
              .eq('user_id', user.id)
              .eq('date', today);
            
            if (error) throw error;
            
            const metricsFromDb = data?.reduce((acc: UsageMetrics, current) => {
              acc[current.question_type] = current.count;
              return acc;
            }, {}) || {};
            
            setUsageMetrics(metricsFromDb);
            localStorage.setItem('usageMetrics', JSON.stringify(metricsFromDb));
          } catch (error) {
            console.error('Error fetching usage metrics from API:', error);
            
            // Fallback to localStorage if API fails
            const storedMetrics = localStorage.getItem('usageMetrics');
            if (storedMetrics) {
              setUsageMetrics(JSON.parse(storedMetrics));
            }
          }
        } else {
          // Not authenticated, use whatever is in localStorage
          const storedMetrics = localStorage.getItem('usageMetrics');
          if (storedMetrics) {
            setUsageMetrics(JSON.parse(storedMetrics));
          }
        }
      } catch (error) {
        console.error('Error loading usage metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsageMetrics();
  }, [isAuthenticated, isOnline, user]);

  /**
   * Check if a feature has reached its limit
   */
  const hasReachedLimit = (feature: keyof FeatureLimits): boolean => {
    // Premium users have no limits
    if (isPremium) return false;
    
    const limit = getLimit(feature);
    const currentUsage = usageMetrics[feature] || 0;
    return currentUsage >= limit;
  };

  /**
   * Get the limit for a specific feature based on subscription
   */
  const getLimit = (feature: keyof FeatureLimits): number => {
    const tier = isPremium ? 'premium' : 'free';
    return DEFAULT_LIMITS[feature][tier];
  };

  /**
   * Get current usage for a feature
   */
  const getUsage = (feature: keyof FeatureLimits): number => {
    return usageMetrics[feature] || 0;
  };

  /**
   * Increment usage for a feature
   */
  const incrementUsage = async (feature: keyof FeatureLimits): Promise<boolean> => {
    try {
      // Premium users don't increment usage
      if (isPremium) return true;
      
      const currentUsage = usageMetrics[feature] || 0;
      const newUsage = currentUsage + 1;
      
      // Update local state
      setUsageMetrics(prev => ({
        ...prev,
        [feature]: newUsage
      }));
      
      // Save to localStorage
      localStorage.setItem('usageMetrics', JSON.stringify({
        ...usageMetrics,
        [feature]: newUsage
      }));
      
      // If online and authenticated, update the server
      if (isAuthenticated && isOnline && user) {
        try {
          // Get today's date in YYYY-MM-DD format
          const today = new Date().toISOString().split('T')[0];
          
          // Use upsert to either insert or update
          await supabase.from('usage_tracking').upsert(
            {
              user_id: user.id,
              question_type: feature,
              date: today,
              count: newUsage
            },
            { onConflict: 'user_id,question_type,date' }
          );
        } catch (error) {
          console.error(`Error updating server usage for ${feature}:`, error);
          // Continue even if server update fails
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error incrementing usage for ${feature}:`, error);
      return false;
    }
  };

  /**
   * Reset usage for testing purposes
   */
  const resetUsage = (feature: keyof FeatureLimits) => {
    setUsageMetrics(prev => ({
      ...prev,
      [feature]: 0
    }));
    
    const updatedMetrics = {
      ...usageMetrics,
      [feature]: 0
    };
    
    localStorage.setItem('usageMetrics', JSON.stringify(updatedMetrics));
  };

  return {
    hasReachedLimit,
    getLimit,
    getUsage,
    incrementUsage,
    resetUsage,
    isLoading,
    DEFAULT_LIMITS
  };
};

export default useFeatureLimits;
