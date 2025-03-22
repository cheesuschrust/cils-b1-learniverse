
import { useState, useEffect } from "react";
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

export const useQuestionLimit = (type: QuestionType): UseQuestionLimitResult => {
  const { user, incrementDailyQuestionCount, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert type to match the keys in dailyQuestionCounts
  const mapTypeToKey = (questionType: QuestionType): string => {
    switch (questionType) {
      case "multipleChoice":
        return "multipleChoice";
      default:
        return questionType;
    }
  };
  
  const countKey = mapTypeToKey(type) as keyof typeof user?.dailyQuestionCounts;
  
  // Check if user is premium and can access content
  const canAccessContent = (): boolean => {
    if (!isAuthenticated || !user) return false;
    
    return user.subscription === "premium" || 
           (user.dailyQuestionCounts && user.dailyQuestionCounts[countKey] < 1);
  };
  
  // Get remaining questions
  const getRemainingQuestions = (): number | "unlimited" => {
    if (!user) return 0;
    
    if (user.subscription === "premium") {
      return "unlimited";
    }
    
    return Math.max(0, 1 - (user.dailyQuestionCounts[countKey] || 0));
  };
  
  // Get used questions today
  const getUsedQuestions = (): number => {
    if (!user) return 0;
    return user.dailyQuestionCounts[countKey] || 0;
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
    usedQuestions: getUsedQuestions(),
    trackQuestionUsage
  };
};
