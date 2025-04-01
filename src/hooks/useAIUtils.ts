
import { useState } from 'react';
import { 
  AIGenerationResult, 
  AIGeneratedQuestion,
  ItalianQuestionGenerationParams 
} from '@/types/italian-types';
import AIService from '@/services/AIService';

export interface UseAIReturn {
  generateQuestions: (params: ItalianQuestionGenerationParams) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
}

export const useAIUtils = (): UseAIReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState<number>(100);
  const [usageLimit] = useState<number>(100);

  const generateQuestions = async (params: ItalianQuestionGenerationParams): Promise<AIGenerationResult> => {
    setIsGenerating(true);
    
    try {
      // Here we would normally make an API call, but for now we'll generate mock data
      // This simulates what would happen in a real application
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock questions based on requested parameters
      const mockQuestions: AIGeneratedQuestion[] = Array(params.count || 5).fill(null).map((_, idx) => ({
        id: `q-${params.contentTypes[0]}-${idx}`,
        text: `Sample ${params.contentTypes[0]} question ${idx + 1} for ${params.difficulty} level`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "This is an explanation for the correct answer.",
        type: params.contentTypes[0],
        difficulty: params.difficulty,
        isCitizenshipRelevant: params.isCitizenshipFocused || false,
        question: `Question ${idx + 1}?`,
        questionType: "multipleChoice"
      }));
      
      // Decrease credits
      setRemainingCredits(prev => Math.max(0, prev - 1));
      
      return {
        questions: mockQuestions
      };
    } catch (error) {
      console.error("Failed to generate questions:", error);
      return {
        questions: [],
        error: "Failed to generate questions"
      };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateQuestions,
    isGenerating,
    remainingCredits,
    usageLimit
  };
};
