
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  AIGeneratedQuestion, 
  ItalianQuestionGenerationParams, 
  AIGenerationResult 
} from '@/types/italian-types';
import { v4 as uuidv4 } from 'uuid';

export interface AIUtilsContextType {
  generateQuestions: (params: ItalianQuestionGenerationParams) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
}

// Create the initial context
const AIUtilsContext = createContext<AIUtilsContextType>({
  generateQuestions: async () => ({ questions: [] }),
  isGenerating: false,
  remainingCredits: 0,
  usageLimit: 0
});

// Export the hook for using the context
export const useAIUtils = () => useContext(AIUtilsContext);

export interface AIUtilsProviderProps {
  children: ReactNode;
}

export const AIUtilsProvider: React.FC<AIUtilsProviderProps> = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(100);
  const [usageLimit, setUsageLimit] = useState(500);

  // Mock function to generate questions
  const generateQuestions = async (params: ItalianQuestionGenerationParams): Promise<AIGenerationResult> => {
    setIsGenerating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock questions based on params
      const mockQuestions: AIGeneratedQuestion[] = Array(params.count || 5).fill(null).map((_, idx) => ({
        id: uuidv4(),
        text: `Sample question ${idx + 1} for ${params.contentTypes[0]}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: `This is an explanation for ${params.contentTypes[0]} question ${idx + 1}`,
        type: params.contentTypes[0],
        difficulty: params.difficulty,
        questionType: 'multipleChoice',
        isCitizenshipRelevant: params.isCitizenshipFocused || false
      }));
      
      // Deduct credits
      setRemainingCredits(prev => Math.max(0, prev - 5));
      
      return { questions: mockQuestions };
    } catch (error) {
      console.error("Error generating questions:", error);
      return { questions: [], error: "Failed to generate questions" };
    } finally {
      setIsGenerating(false);
    }
  };

  const value: AIUtilsContextType = {
    generateQuestions,
    isGenerating,
    remainingCredits,
    usageLimit
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};
