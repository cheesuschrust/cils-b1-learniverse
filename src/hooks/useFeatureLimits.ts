
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FeatureLimits } from '@/types';

const FEATURE_LIMITS: FeatureLimits = {
  flashcards: { free: 100, premium: 1000 },
  dailyQuestions: { free: 5, premium: 20 },
  listeningExercises: { free: 3, premium: 15 },
  writingExercises: { free: 2, premium: 10 },
  speakingExercises: { free: 2, premium: 10 }
};

export function useFeatureLimits() {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<Record<string, number>>({});

  // Local storage key for usage tracking
  const storageKey = `usage_${user?.id || 'anonymous'}`;

  useEffect(() => {
    // Load usage data from local storage
    const storedUsage = localStorage.getItem(storageKey);
    if (storedUsage) {
      try {
        setUsageData(JSON.parse(storedUsage));
      } catch (error) {
        console.error('Failed to parse usage data:', error);
        // Reset usage data if it's corrupted
        localStorage.setItem(storageKey, JSON.stringify({}));
        setUsageData({});
      }
    }
  }, [storageKey]);

  /**
   * Check if user has reached the limit for a specific feature
   */
  const hasReachedLimit = (featureKey: keyof FeatureLimits): boolean => {
    if (!user) return false; // No limits for unauthenticated users (they'll be redirected)
    
    const isPremium = user.isPremiumUser || false;
    const currentUsage = usageData[featureKey] || 0;
    const limit = isPremium ? FEATURE_LIMITS[featureKey].premium : FEATURE_LIMITS[featureKey].free;
    
    return currentUsage >= limit;
  };

  /**
   * Get the usage limit for a specific feature
   */
  const getLimit = (featureKey: keyof FeatureLimits): number => {
    if (!user) return 0;
    return user.isPremiumUser 
      ? FEATURE_LIMITS[featureKey].premium 
      : FEATURE_LIMITS[featureKey].free;
  };

  /**
   * Get current usage for a specific feature
   */
  const getUsage = (featureKey: string): number => {
    return usageData[featureKey] || 0;
  };

  /**
   * Increment usage counter for a specific feature
   */
  const incrementUsage = (featureKey: string): void => {
    const newUsage = { 
      ...usageData, 
      [featureKey]: (usageData[featureKey] || 0) + 1 
    };
    
    setUsageData(newUsage);
    localStorage.setItem(storageKey, JSON.stringify(newUsage));
  };

  /**
   * Reset usage counters (e.g., at the start of a new day)
   */
  const resetUsage = (): void => {
    setUsageData({});
    localStorage.setItem(storageKey, JSON.stringify({}));
  };

  return {
    hasReachedLimit,
    getLimit,
    getUsage,
    incrementUsage,
    resetUsage,
    FEATURE_LIMITS
  };
}

export default useFeatureLimits;
