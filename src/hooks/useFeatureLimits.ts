
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';

interface FeatureLimits {
  flashcards: number;
  listeningExercises: number;
  speakingExercises: number;
  writingExercises: number;
  readingExercises: number;
  multipleChoice: number;
}

interface FeatureUsage {
  flashcards: number;
  listeningExercises: number;
  speakingExercises: number;
  writingExercises: number;
  readingExercises: number;
  multipleChoice: number;
}

export function useFeatureLimits() {
  const { user } = useAuth();
  const [limits, setLimits] = useState<FeatureLimits>({
    flashcards: 20,
    listeningExercises: 3,
    speakingExercises: 3,
    writingExercises: 3,
    readingExercises: 5,
    multipleChoice: 10,
  });
  
  const [usage, setUsage] = useState<FeatureUsage>({
    flashcards: 0,
    listeningExercises: 0,
    speakingExercises: 0,
    writingExercises: 0,
    readingExercises: 0,
    multipleChoice: 0,
  });

  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is premium
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching premium status:', profileError);
        } else {
          setIsPremium(userProfile?.is_premium || false);
        }

        // Get today's usage
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        const { data: usageData, error: usageError } = await supabase
          .from('usage_tracking')
          .select('feature, count')
          .eq('user_id', user.id)
          .eq('date', today);

        if (usageError) {
          console.error('Error fetching usage data:', usageError);
        } else if (usageData) {
          const newUsage = { ...usage };
          
          usageData.forEach((item) => {
            if (item.feature in newUsage) {
              newUsage[item.feature as keyof FeatureUsage] = item.count;
            }
          });
          
          setUsage(newUsage);
        }
      } catch (error) {
        console.error('Error in useFeatureLimits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const incrementUsage = async (feature: keyof FeatureUsage) => {
    if (!user) return false;
    
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // First, check if there's an existing record
      const { data: existingData, error: existingError } = await supabase
        .from('usage_tracking')
        .select('id, count')
        .eq('user_id', user.id)
        .eq('feature', feature)
        .eq('date', today)
        .single();
      
      if (existingError && existingError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        console.error('Error checking usage tracking:', existingError);
        return false;
      }
      
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('usage_tracking')
          .update({ count: existingData.count + 1 })
          .eq('id', existingData.id);
        
        if (updateError) {
          console.error('Error updating usage:', updateError);
          return false;
        }
        
        // Update local state
        setUsage(prev => ({
          ...prev,
          [feature]: prev[feature] + 1
        }));
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('usage_tracking')
          .insert({
            user_id: user.id,
            feature,
            count: 1,
            date: today
          });
        
        if (insertError) {
          console.error('Error inserting usage:', insertError);
          return false;
        }
        
        // Update local state
        setUsage(prev => ({
          ...prev,
          [feature]: 1
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  const hasReachedLimit = (feature: keyof FeatureUsage): boolean => {
    if (isPremium) return false; // Premium users have no limits
    return usage[feature] >= limits[feature];
  };

  const getLimit = (feature: keyof FeatureLimits): number => {
    return isPremium ? Infinity : limits[feature];
  };

  const getUsage = (feature: keyof FeatureUsage): number => {
    return usage[feature];
  };

  return {
    hasReachedLimit,
    getLimit,
    getUsage,
    incrementUsage,
    isPremium,
    isLoading,
  };
}
