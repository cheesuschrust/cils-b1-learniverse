
import { useContext } from 'react';
import { AIUtilsContext } from '@/contexts/AIUtilsContext';
import { v4 as uuidv4 } from 'uuid';
import { 
  AIGenerationResult, 
  QuestionGenerationParams,
  AIUtilsContextType
} from '@/types/app-types';

import {
  AIGeneratedQuestion,
  ItalianLevel,
  ItalianTestSection,
  mapToItalianTypes
} from '@/types/italian-types';

/**
 * Custom hook to access AI utility functions from AIUtilsContext
 * This provides type-safe access to all AI-related functionality
 */
export const useAIUtils = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  
  // Add adapter function to handle Italian-specific question generation
  const originalGenerateQuestions = context.generateQuestions;
  
  const adaptedGenerateQuestions = async (params: QuestionGenerationParams): Promise<AIGenerationResult> => {
    try {
      // Convert types for compatibility
      const result = await originalGenerateQuestions(params);
      
      // Ensure consistent id and types
      const adaptedQuestions = result.questions.map(q => ({
        ...q,
        id: q.id || uuidv4(),
        type: (q.type || params.testSection || params.contentTypes?.[0] || 'grammar') as ItalianTestSection,
        difficulty: (q.difficulty || params.difficulty || params.italianLevel || 'intermediate') as ItalianLevel,
        isCitizenshipRelevant: q.isCitizenshipRelevant || params.isCitizenshipFocused || false
      }));
      
      return {
        questions: adaptedQuestions as AIGeneratedQuestion[],
        error: result.error
      };
    } catch (error) {
      console.error("Error in generateQuestions adapter:", error);
      return {
        questions: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };
  
  // Return the context with the adapted function
  return {
    ...context,
    generateQuestions: adaptedGenerateQuestions
  };
};

export default useAIUtils;
