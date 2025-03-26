
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { isPremiumUser, hasReachedDailyLimit } from "@/lib/supabase";

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
  const { user, incrementDailyQuestionCount, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Normalize type to match keys in dailyQuestionCounts
  const countKey = type === "multipleChoice" ? "multipleChoice" : type;
  
  // Get current count for this question type
  const getCurrentCount = (): number => {
    if (!user || !user.dailyQuestionCounts) {
      return 0;
    }
    return user.dailyQuestionCounts[countKey] || 0;
  };
  
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
    return getCurrentCount() < 1;
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
    return Math.max(0, 1 - getCurrentCount());
  };
  
  // Function to track question usage
  const trackQuestionUsage = async (): Promise<boolean> => {
    if (!isAuthenticated) {
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
      if (isPremiumUser(user?.subscription)) {
        return true;
      }
      
      // Check if user has already reached their daily limit
      if (user && await hasReachedDailyLimit(user.id, countKey)) {
        toast({
          title: "Daily Limit Reached",
          description: "You've reached your daily limit. Upgrade to premium for unlimited access.",
          variant: "destructive"
        });
        return false;
      }
      
      // Increment the counter and return the result
      const result = await incrementDailyQuestionCount(countKey);
      
      if (!result) {
        toast({
          title: "Daily Limit Reached",
          description: "You've reached your daily limit. Upgrade to premium for unlimited access.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error tracking question usage:", error);
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
    usedQuestions: getCurrentCount(),
    trackQuestionUsage
  };
};
