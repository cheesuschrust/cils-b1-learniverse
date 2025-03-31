
import { useContext } from 'react';
import { AIUtilsContext } from '@/contexts/AIUtilsContext';
import { v4 as uuidv4 } from 'uuid';
import { 
  AIGenerationResult, 
  QuestionGenerationParams,
  AIGeneratedQuestion,
  ItalianLevel,
  ItalianTestSection
} from '@/types';

/**
 * Custom hook to access AI utility functions from AIUtilsContext
 * This provides type-safe access to all AI-related functionality
 */
export const useAIUtils = () => {
  const context = useContext(AIUtilsContext);
  
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  
  // Add adapter function to handle Italian-specific question generation
  const generateQuestions = async (params: QuestionGenerationParams): Promise<AIGenerationResult> => {
    try {
      // Convert Italian types to app-types for compatibility
      const adaptedParams = {
        language: 'italian',
        difficulty: params.italianLevel || params.difficulty,
        contentTypes: params.contentTypes || [params.testSection],
        focusAreas: params.topics || params.focusAreas || [],
        count: params.count || 5,
        isCitizenshipFocused: params.isCitizenshipFocused,
        italianLevel: params.italianLevel,
        testSection: params.testSection
      };
      
      // Call the original function with converted parameters
      const result = await context.generateQuestions(adaptedParams);
      
      // Convert back to Italian-specific types
      return {
        questions: result.questions.map(q => ({
          id: q.id || uuidv4(),
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          type: q.type as ItalianTestSection,
          difficulty: q.difficulty as ItalianLevel,
          isCitizenshipRelevant: q.isCitizenshipRelevant || false
        })) as AIGeneratedQuestion[],
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
  
  return {
    ...context,
    generateQuestions,
    speak: context.speak || (async (text: string, language?: string) => {
      if (context.speakText) {
        await context.speakText(text, language);
      }
    }),
    recognizeSpeech: context.recognizeSpeech || (async (audioBlob: Blob) => {
      return "Simulated speech recognition result";
    }),
    compareTexts: context.compareTexts || (async (text1: string, text2: string) => {
      return 0.8; // Simulated similarity score
    }),
    processContent: context.processContent || (async (prompt: string) => {
      return "Simulated AI content";
    }),
    isProcessing: context.isProcessing || false,
    isAIEnabled: context.isAIEnabled || true
  };
};

export default useAIUtils;
