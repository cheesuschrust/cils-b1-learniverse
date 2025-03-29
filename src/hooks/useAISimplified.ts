
import { useState, useCallback } from 'react';
import { serviceFactory } from '@/services/ServiceFactory';
import { AIOptions, UseAIReturn } from '@/types/ai';
import { errorMonitoring } from '@/utils/errorMonitoring';

const useAISimplified = (): UseAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const aiService = serviceFactory.get('aiService');
  
  const generateText = useCallback(async (prompt: string, options?: AIOptions): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await aiService.generateText(prompt, options);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('AI text generation failed');
      setError(error);
      errorMonitoring.captureError(error);
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [aiService]);
  
  const getConfidenceScore = useCallback(async (text: string, contentType: string): Promise<number> => {
    try {
      return aiService.getConfidenceScore(contentType) || 0;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get confidence score');
      errorMonitoring.captureError(error);
      return 0;
    }
  }, [aiService]);
  
  const abort = useCallback(() => {
    try {
      aiService.abortAllRequests();
    } catch (error) {
      console.error('Failed to abort AI requests:', error);
    }
  }, [aiService]);
  
  return {
    generateText,
    getConfidenceScore,
    isLoading,
    error,
    abort
  };
};

export default useAISimplified;
