
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';

interface FeatureLimits {
  flashcards: number;
  readingExercises: number;
  writingExercises: number;
  listeningExercises: number;
  speakingExercises: number;
  grammarExercises: number;
  vocabularyExercises: number;
  aiCorrectionRequests: number;
}

interface DailyUsage {
  [key: string]: number;
}

export const useFeatureLimits = () => {
  const { user, isAuthenticated } = useAuth();
  const [limits, setLimits] = useState<FeatureLimits>({
    flashcards: 10,
    readingExercises: 3,
    writingExercises: 2,
    listeningExercises: 3,
    speakingExercises: 2,
    grammarExercises: 5,
    vocabularyExercises: 5,
    aiCorrectionRequests: 3,
  });
  const [usage, setUsage] = useState<DailyUsage>({});
  const [isPremium, setIsPremium] = useState(false);

  // Fetch user's premium status and daily usage
  useEffect(() => {
    const fetchLimitsAndUsage = async () => {
      if (!isAuthenticated || !user) return;

      try {
        // Check if user is premium
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData) {
          setIsPremium(profileData.is_premium);
        }

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Fetch today's usage
        const { data: usageData, error: usageError } = await supabase
          .from('usage_tracking')
          .select('feature_type, count')
          .eq('user_id', user.id)
          .eq('date', today);

        if (!usageError && usageData) {
          const usageMap: DailyUsage = {};
          usageData.forEach((item) => {
            usageMap[item.feature_type] = item.count;
          });
          setUsage(usageMap);
        }
      } catch (error) {
        console.error('Error fetching feature limits:', error);
      }
    };

    fetchLimitsAndUsage();
  }, [user, isAuthenticated]);

  const getLimit = (feature: keyof FeatureLimits) => {
    if (isPremium) {
      return Infinity; // Premium users have unlimited access
    }
    return limits[feature];
  };

  const getUsage = (feature: string) => {
    return usage[feature] || 0;
  };

  const hasReachedLimit = (feature: keyof FeatureLimits) => {
    if (isPremium) return false; // Premium users have no limits
    return getUsage(feature) >= getLimit(feature);
  };

  const incrementUsage = async (feature: string) => {
    if (!isAuthenticated || !user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentUsage = getUsage(feature);
      
      // First check if there's an existing record
      const { data: existingData, error: fetchError } = await supabase
        .from('usage_tracking')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .eq('feature_type', feature)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error checking usage:', fetchError);
        return;
      }
      
      if (existingData) {
        // Update existing record
        await supabase
          .from('usage_tracking')
          .update({ count: currentUsage + 1 })
          .eq('id', existingData.id);
      } else {
        // Create new record
        await supabase
          .from('usage_tracking')
          .insert({
            user_id: user.id,
            date: today,
            feature_type: feature,
            count: 1
          });
      }
      
      // Update local state
      setUsage({
        ...usage,
        [feature]: currentUsage + 1
      });
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  return {
    getLimit,
    getUsage,
    hasReachedLimit,
    incrementUsage,
    isPremium
  };
};
