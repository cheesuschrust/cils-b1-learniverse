
import { useContext } from 'react';
import { AIUtilsContext, AIUtilsContextType } from '@/contexts/AIUtilsContext';

/**
 * Custom hook to access AI utility functions from AIUtilsContext
 * This provides type-safe access to all AI-related functionality
 */
export const useAIUtils = (): AIUtilsContextType => {
  const context = useContext<AIUtilsContextType | undefined>(AIUtilsContext);
  
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  
  return {
    ...context,
    // Add missing methods to prevent errors
    speak: async (text: string, language?: string) => {
      if (context.speakText) {
        await context.speakText(text, language);
      }
    },
    recognizeSpeech: async (audioBlob: Blob) => {
      // This would be implemented in a real app
      console.log("Speech recognition requested for audio blob");
      return "Simulated speech recognition result";
    },
    compareTexts: async (text1: string, text2: string) => {
      // This would be implemented in a real app
      console.log(`Comparing: "${text1}" with "${text2}"`);
      return 0.8; // Simulated similarity score
    },
    processContent: context.processContent || (async (prompt: string) => {
      console.log("Processing content:", prompt);
      return "Simulated AI content";
    }),
    isProcessing: false,
    isAIEnabled: true
  };
};

export default useAIUtils;
