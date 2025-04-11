
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

type QuestionType = 'flashcards' | 'multiple-choice' | 'speaking' | 'writing' | 'listening';

interface UsageData {
  dailyLimit: number;
  usedToday: number;
  remaining: number;
  isPremium: boolean;
  hasReachedLimit: boolean;
  isLoading: boolean;
  lastUpdated: Date;
}

export function useQuestionLimits(questionType: QuestionType) {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageData>({
    dailyLimit: 10,
    usedToday: 0,
    remaining: 10,
    isPremium: false,
    hasReachedLimit: false,
    isLoading: true,
    lastUpdated: new Date(),
  });

  const isPremium = user?.subscription === 'premium' || user?.isPremium;
  const dailyLimit = isPremium ? 999 : 10; // Unlimited for premium users, 10 for free users

  const loadUsageData = useCallback(async () => {
    if (!user) return;

    try {
      setUsageData(prev => ({ ...prev, isLoading: true }));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('question_type', questionType)
        .gte('date', today.toISOString().split('T')[0])
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned
        console.error('Error fetching usage data:', error);
      }

      const usedToday = data ? data.count : 0;
      const remaining = Math.max(0, dailyLimit - usedToday);

      setUsageData({
        dailyLimit,
        usedToday,
        remaining,
        isPremium,
        hasReachedLimit: usedToday >= dailyLimit && !isPremium,
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error in loadUsageData:', error);
      setUsageData(prev => ({ 
        ...prev, 
        isLoading: false,
        lastUpdated: new Date()
      }));
    }
  }, [user, questionType, dailyLimit, isPremium]);

  // Load usage data on mount and when dependencies change
  useEffect(() => {
    loadUsageData();
  }, [loadUsageData]);

  const useQuestion = async (): Promise<boolean> => {
    if (!user) return false;
    if (isPremium) return true; // Premium users can always use questions

    try {
      setUsageData(prev => ({ ...prev, isLoading: true }));

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // First, check if there's a record for today
      const { data: existingData, error: fetchError } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('question_type', questionType)
        .eq('date', today.toISOString().split('T')[0])
        .single();
      
      let newCount = 1;
      let success = false;
      
      if (fetchError && fetchError.code === 'PGRST116') {
        // No record exists for today, insert new record
        const { error: insertError } = await supabase
          .from('usage_tracking')
          .insert({
            user_id: user.id,
            question_type: questionType,
            date: today.toISOString().split('T')[0],
            count: 1,
            last_updated: new Date().toISOString()
          });
          
        if (!insertError) success = true;
      } else if (!fetchError) {
        // Record exists, update it if below limit
        newCount = existingData.count + 1;
        
        if (newCount <= dailyLimit || isPremium) {
          const { error: updateError } = await supabase
            .from('usage_tracking')
            .update({
              count: newCount,
              last_updated: new Date().toISOString()
            })
            .eq('id', existingData.id);
            
          if (!updateError) success = true;
        }
      }
      
      // Update local state
      if (success) {
        setUsageData(prev => ({
          ...prev,
          usedToday: newCount,
          remaining: Math.max(0, dailyLimit - newCount),
          hasReachedLimit: newCount >= dailyLimit && !isPremium,
          isLoading: false,
          lastUpdated: new Date()
        }));
      }
      
      return success && (newCount <= dailyLimit || isPremium);
    } catch (error) {
      console.error('Error using question:', error);
      setUsageData(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const canUseQuestion = (): boolean => {
    return isPremium || usageData.remaining > 0;
  };

  return {
    ...usageData,
    useQuestion,
    canUseQuestion,
    loadUsageData,
  };
}

export default useQuestionLimits;
