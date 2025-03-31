
import { useState, useCallback } from 'react';
import { AIServiceOptions, UseAIReturn } from '@/types/ai';

const useAISimplified = (): UseAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Safely get the AI service
  const getAIService = useCallback(() => {
    try {
      // Mock the service for now
      return {
        generateText: async (prompt: string, options?: any) => {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          return `AI response to: ${prompt}`;
        },
        getConfidenceScore: (contentType: string) => 0.8,
        abortAllRequests: () => {}
      };
    } catch (err) {
      console.error("Error getting AI service:", err);
      return null;
    }
  }, []);
  
  const generateText = useCallback(async (prompt: string, options?: AIServiceOptions): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const aiService = getAIService();
      if (!aiService) {
        throw new Error("AI service not available");
      }
      
      const response = await aiService.generateText(prompt, options);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('AI text generation failed');
      setError(error);
      console.error("AI generation error:", error);
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [getAIService]);
  
  const getConfidenceScore = useCallback(async (text: string, contentType: string): Promise<number> => {
    try {
      const aiService = getAIService();
      if (!aiService) {
        return 0;
      }
      
      return aiService.getConfidenceScore(contentType) || 0;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get confidence score');
      console.error("Confidence score error:", error);
      return 0;
    }
  }, [getAIService]);
  
  const abort = useCallback(() => {
    try {
      const aiService = getAIService();
      if (aiService) {
        aiService.abortAllRequests();
      }
    } catch (error) {
      console.error('Failed to abort AI requests:', error);
    }
  }, [getAIService]);
  
  return {
    generateText,
    getConfidenceScore,
    isLoading,
    error,
    abort
  };
};

export default useAISimplified;
