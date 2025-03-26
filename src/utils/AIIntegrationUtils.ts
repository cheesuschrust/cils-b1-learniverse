
import { ContentType } from '@/types/contentType';
import { Flashcard } from '@/types/flashcard';
import { Question, QuestionSet } from '@/types/question';
import { calculateNextReview } from '@/utils/spacedRepetition';
import { analyzeContent } from '@/utils/AITrainingUtils';
import { useAIUtils } from '@/contexts/AIUtilsContext';

/**
 * Integrates AI capabilities with the spaced repetition system
 * to optimize study scheduling based on user performance.
 */
export const optimizeStudySchedule = (
  flashcards: Flashcard[], 
  performance: { [id: string]: number },
  confidenceThreshold: number = 0.7
): Flashcard[] => {
  return flashcards.map(card => {
    // Get performance data for this card (0-1 range)
    const cardPerformance = performance[card.id] || 0.5;
    
    // Calculate confidence adjustment based on performance
    // Lower performance means we need to review sooner
    const confidenceAdjustment = 1 - Math.min(cardPerformance, confidenceThreshold);
    
    // Get current values or defaults
    const currentFactor = card.difficultyFactor || 2.5;
    const consecutiveCorrect = card.consecutiveCorrect || 0;
    
    // Adjust the review schedule based on performance
    const { nextReviewDate, difficultyFactor } = calculateNextReview(
      cardPerformance > 0.6, // Consider correct if performance above 60%
      currentFactor,
      consecutiveCorrect,
      confidenceAdjustment // Pass the adjustment factor
    );
    
    return {
      ...card,
      nextReview: nextReviewDate,
      difficultyFactor: difficultyFactor,
      level: Math.floor(difficultyFactor * 2 - 2) // Map difficulty factor to level (0-5)
    };
  });
};

/**
 * Generates personalized challenges based on user progress and AI insights
 */
export const generatePersonalizedChallenges = async (
  userData: any,
  contentTypes: ContentType[],
  count: number = 3
): Promise<any[]> => {
  // Default challenges if AI is not available
  const defaultChallenges = [
    {
      id: "daily-streak",
      title: "Daily Streak",
      description: "Practice for 5 consecutive days",
      type: "streak",
      target: 5,
      reward: 50,
      difficulty: "easy"
    },
    {
      id: "master-flashcards",
      title: "Flashcard Master",
      description: "Master 10 new flashcards",
      type: "mastery",
      target: 10,
      reward: 75,
      difficulty: "medium"
    },
    {
      id: "perfect-quiz",
      title: "Perfect Quiz",
      description: "Complete a quiz with 100% accuracy",
      type: "achievement",
      target: 1,
      reward: 100,
      difficulty: "hard"
    }
  ];
  
  try {
    // Get user's weak areas
    const weakAreas = userData.weakAreas || [];
    const strengths = userData.strengths || [];
    
    // Select content types to focus on
    const focusTypes = weakAreas.length > 0 
      ? weakAreas 
      : contentTypes.filter(t => strengths.indexOf(t) === -1);
    
    // If we have enough information, generate personalized challenges
    if (focusTypes.length > 0 && userData.level) {
      // Create challenges focusing on weak areas with appropriate difficulty
      return defaultChallenges.map(challenge => ({
        ...challenge,
        focusArea: focusTypes[Math.floor(Math.random() * focusTypes.length)],
        difficulty: userData.level < 5 ? "easy" : 
                   userData.level < 15 ? "medium" : "hard",
        target: Math.max(challenge.target, Math.floor(userData.level / 3))
      }));
    }
    
    return defaultChallenges;
  } catch (error) {
    console.error("Error generating personalized challenges:", error);
    return defaultChallenges;
  }
};

/**
 * Enhances existing content with AI-generated suggestions and insights
 */
export const enhanceContentWithAI = async (
  content: string,
  contentType: ContentType,
  difficulty: string
): Promise<{
  enhancedContent: string;
  suggestions: string[];
  relatedConcepts: string[];
}> => {
  // Default response
  const defaultResponse = {
    enhancedContent: content,
    suggestions: [],
    relatedConcepts: []
  };
  
  try {
    // Analyze content to understand it better
    const analysis = analyzeContent(content);
    
    // If we have a high confidence in our analysis, provide suggestions
    if (analysis.confidence > 0.7) {
      // Look at the content features to generate suggestions
      if (analysis.features.wordCount > 100) {
        defaultResponse.suggestions.push("Consider breaking this into smaller sections for easier learning");
      }
      
      if (analysis.features.questionMarks && analysis.features.questionMarks > 5) {
        defaultResponse.suggestions.push("This content has many questions. Try creating a quiz from these questions.");
      }
      
      // Add related concepts based on content type
      if (contentType === 'writing') {
        defaultResponse.relatedConcepts = ['grammar', 'vocabulary', 'sentence structure'];
      } else if (contentType === 'speaking') {
        defaultResponse.relatedConcepts = ['pronunciation', 'intonation', 'fluency'];
      } else if (contentType === 'flashcards') {
        defaultResponse.relatedConcepts = ['spaced repetition', 'memory techniques', 'active recall'];
      }
    }
    
    return defaultResponse;
  } catch (error) {
    console.error("Error enhancing content with AI:", error);
    return defaultResponse;
  }
};

/**
 * Generates contextual suggestions based on user activity and current page
 */
export const getContextualSuggestions = (
  currentPage: string,
  userActivity: any,
  userPreferences: any
): string[] => {
  const suggestions: string[] = [];
  
  // General suggestions
  if (userActivity.lastActive && 
      (new Date().getTime() - userActivity.lastActive.getTime()) > 3 * 24 * 60 * 60 * 1000) {
    suggestions.push("Welcome back! Continue your learning journey where you left off.");
  }
  
  // Page-specific suggestions
  switch (currentPage) {
    case 'dashboard':
      if (userActivity.streak && userActivity.streak > 0) {
        suggestions.push(`You're on a ${userActivity.streak}-day streak! Keep it going!`);
      }
      break;
      
    case 'flashcards':
      if (userActivity.dueCards && userActivity.dueCards > 0) {
        suggestions.push(`You have ${userActivity.dueCards} flashcards due for review.`);
      }
      if (!userActivity.hasUsedSpacedRepetition) {
        suggestions.push("Try the spaced repetition system to remember more effectively.");
      }
      break;
      
    case 'multiple-choice':
      if (userActivity.questionAttempts && userActivity.questionAttempts > 10) {
        suggestions.push("Try creating your own quiz to test your knowledge.");
      }
      break;
      
    case 'writing':
      suggestions.push("Use the AI grammar checker to improve your writing.");
      break;
      
    case 'speaking':
      if (userPreferences.preferredVoice) {
        suggestions.push("Listen to pronunciation examples to improve your accent.");
      }
      break;
  }
  
  return suggestions;
};

// Export additional utility functions
export default {
  optimizeStudySchedule,
  generatePersonalizedChallenges,
  enhanceContentWithAI,
  getContextualSuggestions
};
