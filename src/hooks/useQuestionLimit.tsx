
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { isPremiumUser, hasReachedDailyLimit, trackQuestionUsage } from "@/lib/supabase";

// Define question types that can be tracked
export type QuestionType = "flashcards" | "multipleChoice" | "listening" | "writing" | "speaking";

// Define the return type for our hook
export interface UseQuestionLimitResult {
  canAccessContent: boolean;
  isLoading: boolean;
  remainingQuestions: number | "unlimited";
  usedQuestions: number;
  trackQuestionUsage: () => Promise<boolean>;
}

/**
 * Hook to manage question usage limits based on subscription status
 */
export const useQuestionLimit = (type: QuestionType): UseQuestionLimitResult => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [usedCount, setUsedCount] = useState(0);
  
  // Normalize type to match keys in dailyQuestionCounts
  const countKey = type === "multipleChoice" ? "multipleChoice" : type;
  
  // Load current count from Supabase when the component mounts
  useEffect(() => {
    const loadUsageCount = async () => {
      if (!isAuthenticated || !user) return;
      
      setIsLoading(true);
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('usage_tracking')
          .select('count')
          .eq('user_id', user.id)
          .eq('question_type', countKey)
          .eq('date', today)
          .single();
          
        if (!error && data) {
          setUsedCount(data.count);
        } else if (error && error.code !== 'PGSQL_EMPTY_RESULT') {
          console.error('Error fetching usage count:', error);
        }
      } catch (error) {
        console.error('Failed to load usage count:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsageCount();
  }, [isAuthenticated, user, countKey]);
  
  // Determine if user can access content based on subscription and usage
  const canAccessContent = (): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }
    
    // Premium users have unlimited access
    if (isPremiumUser(user.subscription)) {
      return true;
    }
    
    // Free users get 1 question per day
    return usedCount < 1;
  };
  
  // Calculate remaining questions based on subscription type
  const getRemainingQuestions = (): number | "unlimited" => {
    if (!user) {
      return 0;
    }
    
    if (isPremiumUser(user.subscription)) {
      return "unlimited";
    }
    
    // Free users get 1 question per day
    return Math.max(0, 1 - usedCount);
  };
  
  // Function to track question usage
  const handleTrackQuestionUsage = async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this content",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Check if user is premium (unlimited access)
      if (isPremiumUser(user.subscription)) {
        return true;
      }
      
      // Check if user has already reached their daily limit
      if (await hasReachedDailyLimit(user.id, countKey)) {
        toast({
          title: "Daily Limit Reached",
          description: "You've reached your daily limit. Upgrade to premium for unlimited access.",
          variant: "destructive"
        });
        return false;
      }
      
      // Track the usage in Supabase
      const result = await trackQuestionUsage(user.id, countKey);
      
      if (result) {
        // Update local state if tracking was successful
        setUsedCount(prev => prev + 1);
      } else {
        toast({
          title: "Error Tracking Usage",
          description: "There was a problem tracking your question usage. Please try again.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error tracking question usage:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Return the hook result
  return {
    canAccessContent: canAccessContent(),
    isLoading,
    remainingQuestions: getRemainingQuestions(),
    usedQuestions: usedCount,
    trackQuestionUsage: handleTrackQuestionUsage
  };
};
