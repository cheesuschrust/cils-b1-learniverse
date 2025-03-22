
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Define the question types
type QuestionType = "flashcards" | "multipleChoice" | "listening" | "writing" | "speaking";

// Define the return type for our hook
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
  
  // Handle the case where type is "multipleChoice"
  const countKey = type === "multipleChoice" ? "multipleChoice" : type;
  
  // Function to get current question count
  const getCurrentCount = (): number => {
    if (!user || !user.dailyQuestionCounts) {
      return 0;
    }
    return user.dailyQuestionCounts[countKey] || 0;
  };
  
  // Function to check if user can access content
  const canAccessContent = (): boolean => {
    if (!isAuthenticated || !user) {
      return false;
    }
    
    if (user.subscription === "premium") {
      return true;
    }
    
    return getCurrentCount() < 1;
  };
  
  // Function to get remaining questions
  const getRemainingQuestions = (): number | "unlimited" => {
    if (!user) {
      return 0;
    }
    
    if (user.subscription === "premium") {
      return "unlimited";
    }
    
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
  
  // Return the hook result
  return {
    canAccessContent: canAccessContent(),
    isLoading,
    remainingQuestions: getRemainingQuestions(),
    usedQuestions: getCurrentCount(),
    trackQuestionUsage
  };
};
