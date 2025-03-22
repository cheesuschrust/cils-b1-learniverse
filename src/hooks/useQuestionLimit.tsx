
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

type QuestionType = "flashcards" | "multipleChoice" | "listening" | "writing" | "speaking";

interface UseQuestionLimitResult {
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
  
  // Convert type to match the keys in dailyQuestionCounts
  const countKey = type === "multipleChoice" ? "multipleChoice" : type;
  
  // Get the current count for this question type (safely)
  const getCurrentCount = (): number => {
    if (!user || !user.dailyQuestionCounts) return 0;
    return user.dailyQuestionCounts[countKey] || 0;
  };
  
  // Check if user can access content
  const canAccessContent = (): boolean => {
    if (!isAuthenticated || !user) return false;
    
    // Premium users can always access content
    if (user.subscription === "premium") return true;
    
    // Free users can access if they haven't used their daily limit
    return getCurrentCount() < 1;
  };
  
  // Get remaining questions
  const getRemainingQuestions = (): number | "unlimited" => {
    if (!user) return 0;
    
    if (user.subscription === "premium") {
      return "unlimited";
    }
    
    return Math.max(0, 1 - getCurrentCount());
  };
  
  // Track question usage
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
      // Attempt to increment the counter
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
  
  return {
    canAccessContent: canAccessContent(),
    isLoading,
    remainingQuestions: getRemainingQuestions(),
    usedQuestions: getCurrentCount(),
    trackQuestionUsage
  };
};
