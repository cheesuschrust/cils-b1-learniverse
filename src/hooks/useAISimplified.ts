
import { useState, useCallback, useRef } from 'react';
import { UseAIReturn } from '@/types/ai';
import AIServiceStub from '@/services/AIServiceStub';

/**
 * Simplified hook for AI capabilities
 */
export const useAISimplified = (): UseAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState('idle');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a new abort controller
  const createAbortController = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  };

  // Generate text using the AI model
  const generateText = useCallback(async (prompt: string, options?: any): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the stub service
      const result = await AIServiceStub.generateText(prompt, options);
      
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(errorMessage as Error);
      throw errorMessage;
    }
  }, []);

  // Get confidence score for a content type
  const getConfidenceScore = useCallback(async (text: string, contentType: string): Promise<number> => {
    try {
      // Simply return the confidence score from the stub service
      return AIServiceStub.getConfidenceScore(contentType);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to get confidence score');
      setError(errorMessage as Error);
      return 60; // Default fallback score
    }
  }, []);

  // Classify text content
  const classifyText = useCallback(async (text: string): Promise<any> => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Use the stub service for classification
      const classifications = await AIServiceStub.classifyText(text);
      
      setIsProcessing(false);
      return {
        contentType: 'writing', // Default content type
        confidence: 0.75,
        classifications
      };
    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to classify text');
      setError(errorMessage as Error);
      throw errorMessage;
    }
  }, []);

  // Generate flashcards
  const generateFlashcards = useCallback(async (
    topic: string, 
    count: number = 5, 
    difficulty: string = 'intermediate'
  ): Promise<any[]> => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Use the stub service
      const flashcards = await AIServiceStub.generateFlashcards(topic, count, difficulty);
      
      setIsProcessing(false);
      return flashcards;
    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to generate flashcards');
      setError(errorMessage as Error);
      throw errorMessage;
    }
  }, []);

  // Generate questions
  const generateQuestions = useCallback(async (
    content: string, 
    count: number = 5, 
    type: string = 'multiple-choice'
  ): Promise<any[]> => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Use the stub service
      const questions = await AIServiceStub.generateQuestions(content, count, type);
      
      setIsProcessing(false);
      return questions;
    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to generate questions');
      setError(errorMessage as Error);
      throw errorMessage;
    }
  }, []);

  // Load model
  const loadModel = useCallback(async (modelName: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setStatus(`Loading model: ${modelName}...`);
      
      // Simulate model loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsModelLoaded(true);
      setStatus('Model loaded successfully');
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      setStatus('Error loading model');
      const errorMessage = err instanceof Error ? err : new Error('Failed to load model');
      setError(errorMessage as Error);
      return false;
    }
  }, []);

  // Abort ongoing requests
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setIsProcessing(false);
    }
    
    // Also abort all requests in the service
    AIServiceStub.abortAllRequests();
  }, []);

  return {
    generateText,
    getConfidenceScore,
    isLoading,
    error,
    abort,
    generateFlashcards,
    isProcessing,
    classifyText,
    isModelLoaded,
    status,
    loadModel,
    generateQuestions
  };
};

export default useAISimplified;
