
import React, { createContext, useState, useContext } from 'react';
import { 
  AIGeneratedQuestion, 
  AIGenerationResult,
  ItalianQuestionGenerationParams 
} from '@/types/italian-types';

interface AIUtilsContextType {
  generateQuestions: (params: ItalianQuestionGenerationParams) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
}

const AIUtilsContext = createContext<AIUtilsContextType | undefined>(undefined);

export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(10); // Default 10 credits for free users
  const [usageLimit] = useState(10); // Default limit for free users

  const generateQuestions = async (params: ItalianQuestionGenerationParams): Promise<AIGenerationResult> => {
    setIsGenerating(true);
    try {
      // Simulate API call for question generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock questions based on params
      const mockQuestions: AIGeneratedQuestion[] = Array(params.count || 5).fill(0).map((_, index) => ({
        id: `question-${index}-${Date.now()}`,
        question: `Sample ${params.contentTypes[0]} question ${index + 1}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: `This is an explanation for the sample ${params.contentTypes[0]} question.`,
        type: params.contentTypes[0],
        difficulty: params.difficulty,
        questionType: 'multipleChoice',
        isCitizenshipRelevant: params.isCitizenshipFocused || false,
      }));
      
      // Decrease remaining credits
      setRemainingCredits(prev => Math.max(0, prev - 1));
      
      return { questions: mockQuestions };
    } catch (error) {
      console.error('Error generating questions:', error);
      return { 
        questions: [], 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AIUtilsContext.Provider
      value={{
        generateQuestions,
        isGenerating,
        remainingCredits,
        usageLimit
      }}
    >
      {children}
    </AIUtilsContext.Provider>
  );
};

export const useAIUtils = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  
  if (context === undefined) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  
  return context;
};
