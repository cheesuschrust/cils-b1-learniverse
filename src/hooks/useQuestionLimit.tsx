
import { useState, useEffect, useCallback } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to manage and enforce daily question limits based on subscription
 */
export const useQuestionLimit = () => {
  const { user, userProfile } = useAuth();
  const { preferences } = useUserPreferences();
  const { toast } = useToast();
  
  // State to manage limits and usage
  const [dailyLimit, setDailyLimit] = useState(10); // Default limit for free users
  const [usedToday, setUsedToday] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if current user is premium
  const isPremium = !!userProfile?.isPremiumUser || !!user?.isPremiumUser;
  
  // Determine if user has reached their limit
  const hasReachedLimit = usedToday >= dailyLimit && !isPremium;
  
  /**
   * Get the question count for today from user data
   */
  const loadUsageData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Set appropriate limit based on user type
      if (isPremium) {
        setDailyLimit(50); // Premium users get higher limits
      } else if (userProfile?.role === 'teacher') {
        setDailyLimit(25); // Teachers get higher limits than students
      } else {
        setDailyLimit(10); // Default limit for free users
      }
      
      // Get today's date as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we have a count for today
      const dailyCount = userProfile?.dailyQuestionCounts?.[today] || 0;
      setUsedToday(dailyCount);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error loading question limit data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isPremium, userProfile]);
  
  /**
   * Increment the question count when a question is used
   */
  const incrementQuestionCount = useCallback(async () => {
    if (!user) return false;
    
    try {
      // Get today's date as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      // Update local state immediately
      setUsedToday(prev => prev + 1);
      
      // Would update to database in a real implementation
      console.log(`Incrementing question count for user ${user.id} on ${today}`);
      
      return true;
    } catch (error) {
      console.error('Error updating question count:', error);
      return false;
    }
  }, [user]);
  
  /**
   * Check if user can use another question
   */
  const canUseQuestion = useCallback((): boolean => {
    // Premium users have unlimited questions
    if (isPremium) return true;
    
    // Check if user has reached their daily limit
    return usedToday < dailyLimit;
  }, [isPremium, usedToday, dailyLimit]);
  
  /**
   * Use a question and check if it's allowed
   */
  const useQuestion = useCallback(async (): Promise<boolean> => {
    // Check if user can use a question
    if (!canUseQuestion()) {
      toast({
        variant: "destructive",
        title: "Daily limit reached",
        description: "You've reached your daily question limit. Upgrade to premium for unlimited questions.",
      });
      return false;
    }
    
    // Increment the question count
    const success = await incrementQuestionCount();
    
    // Check if user has now reached their limit after increment
    if (success && usedToday + 1 >= dailyLimit && !isPremium) {
      toast({
        variant: "warning",
        title: "Approaching limit",
        description: "You've used your last free question for today. Upgrade to premium for unlimited questions.",
      });
    }
    
    return success;
  }, [canUseQuestion, incrementQuestionCount, toast, usedToday, dailyLimit, isPremium]);
  
  // Load usage data when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadUsageData();
    }
  }, [user, loadUsageData]);
  
  return {
    dailyLimit,
    usedToday,
    remaining: Math.max(0, dailyLimit - usedToday),
    isPremium,
    hasReachedLimit,
    isLoading,
    lastUpdated,
    useQuestion,
    canUseQuestion,
    loadUsageData
  };
};

export default useQuestionLimit;
