
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface QuestionLimitReturn {
  dailyLimit: number;
  usedToday: number;
  remaining: number;
  isPremium: boolean;
  hasReachedLimit: boolean;
  isLoading: boolean;
  lastUpdated: Date;
  useQuestion: () => Promise<boolean>;
  canUseQuestion: () => boolean;
  loadUsageData: () => Promise<{ used: number, limit: number }>;
  canAccessContent: boolean;
  remainingQuestions: number | "unlimited";
  trackQuestionUsage: () => Promise<boolean>;
}

export function useQuestionLimit(contentType?: string): QuestionLimitReturn {
  const { user } = useAuth();
  const isPremium = user?.isPremiumUser || false;
  
  // Default limits based on user type
  const dailyLimit = isPremium ? 1000 : 20;
  
  const [usedToday, setUsedToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Calculate remaining
  const remaining = Math.max(dailyLimit - usedToday, 0);
  const hasReachedLimit = remaining <= 0 && !isPremium;
  
  // Aliases for compatibility with existing code
  const canAccessContent = isPremium || !hasReachedLimit;
  const remainingQuestions = isPremium ? "unlimited" : remaining;
  
  // Load usage data from local storage or API
  const loadUsageData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get today's date string for storage key
      const today = new Date().toISOString().split('T')[0];
      const storageKey = `questionUsage_${today}_${contentType || 'general'}_${user?.id || 'anonymous'}`;
      
      // Load from local storage
      const stored = localStorage.getItem(storageKey);
      const usedCount = stored ? parseInt(stored, 10) : 0;
      
      setUsedToday(usedCount);
      return { used: usedCount, limit: dailyLimit };
    } catch (error) {
      console.error('Error loading question usage data:', error);
      return { used: 0, limit: dailyLimit };
    } finally {
      setIsLoading(false);
    }
  }, [contentType, dailyLimit, user?.id]);
  
  // Update usage count in storage
  const updateUsageCount = useCallback(async (newCount: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const storageKey = `questionUsage_${today}_${contentType || 'general'}_${user?.id || 'anonymous'}`;
      
      localStorage.setItem(storageKey, newCount.toString());
      setUsedToday(newCount);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error updating question usage data:', error);
    }
  }, [contentType, user?.id]);
  
  // Check if user can use a question
  const canUseQuestion = useCallback(() => {
    return isPremium || remaining > 0;
  }, [isPremium, remaining]);
  
  // Use a question and update the count
  const useQuestion = useCallback(async () => {
    if (!canUseQuestion()) {
      return false;
    }
    
    await updateUsageCount(usedToday + 1);
    return true;
  }, [canUseQuestion, updateUsageCount, usedToday]);
  
  // Alias for trackQuestionUsage for compatibility with existing code
  const trackQuestionUsage = useCallback(async () => {
    return await useQuestion();
  }, [useQuestion]);
  
  // Load initial data
  useEffect(() => {
    loadUsageData();
  }, [loadUsageData]);
  
  return {
    dailyLimit,
    usedToday,
    remaining,
    isPremium,
    hasReachedLimit,
    isLoading,
    lastUpdated,
    useQuestion,
    canUseQuestion,
    loadUsageData,
    canAccessContent,
    remainingQuestions,
    trackQuestionUsage
  };
}

export default useQuestionLimit;
