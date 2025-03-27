
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
  const [status, setStatus] = useState<string>('idle');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a new abort controller
  const createAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  // Generate text using the AI model
  const generateText = useCallback(async (prompt: string, options?: any): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create abort controller for this request
      createAbortController();
      
      // Use the stub service
      const result = await AIServiceStub.generateText(prompt, options);
      
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(errorMessage);
      throw errorMessage;
    }
  }, [createAbortController]);

  // Get confidence score for a content type
  const getConfidenceScore = useCallback(async (text: string, contentType: string): Promise<number> => {
    try {
      // Simply return the confidence score from the stub service
      return AIServiceStub.getConfidenceScore(contentType);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to get confidence score');
      setError(errorMessage);
      return 60; // Default fallback score
    }
  }, []);

  // Classify text content
  const classifyText = useCallback(async (text: string): Promise<any> => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Create abort controller for this request
      createAbortController();
      
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
      setError(errorMessage);
      throw errorMessage;
    }
  }, [createAbortController]);

  // Generate flashcards
  const generateFlashcards = useCallback(async (
    topic: string, 
    count: number = 5, 
    difficulty: string = 'intermediate'
  ): Promise<any[]> => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Create abort controller for this request
      createAbortController();
      
      // Use the stub service
      const flashcards = await AIServiceStub.generateFlashcards(topic, count, difficulty);
      
      setIsProcessing(false);
      return flashcards;
    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to generate flashcards');
      setError(errorMessage);
      throw errorMessage;
    }
  }, [createAbortController]);

  // Generate questions
  const generateQuestions = useCallback(async (
    content: string, 
    count: number = 5, 
    type: string = 'multiple-choice'
  ): Promise<any[]> => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Create abort controller for this request
      createAbortController();
      
      // Use the stub service
      const questions = await AIServiceStub.generateQuestions(content, count, type);
      
      setIsProcessing(false);
      return questions;
    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to generate questions');
      setError(errorMessage);
      throw errorMessage;
    }
  }, [createAbortController]);

  // Translate text to target language
  const translateText = useCallback(async (
    text: string, 
    targetLang: 'english' | 'italian'
  ): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create abort controller for this request
      createAbortController();
      
      // Use prompt template for translation
      const sourceLang = targetLang === 'english' ? 'italian' : 'english';
      const prompt = `Translate the following ${sourceLang} text to ${targetLang}: ${text}`;
      
      // Use the generative text API for translation
      const result = await AIServiceStub.generateText(prompt, { temperature: 0.3 });
      
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to translate text');
      setError(errorMessage);
      throw errorMessage;
    }
  }, [createAbortController, generateText]);

  // Check grammar and provide corrections
  const checkGrammar = useCallback(async (
    text: string, 
    lang: 'english' | 'italian'
  ): Promise<{text: string, corrections: any[]}> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create abort controller for this request
      createAbortController();
      
      // Use prompt template for grammar checking
      const prompt = `Check the grammar of the following ${lang} text and provide corrections: ${text}`;
      
      // Use the generative text API for grammar checking
      const result = await AIServiceStub.generateText(prompt, { temperature: 0.2 });
      
      // Parse corrections from the result (simplified mock implementation)
      const corrections: any[] = [];
      
      // Add a few mock corrections
      if (text.length > 10) {
        corrections.push({
          original: text.split(' ')[0],
          correction: text.split(' ')[0] + ' (corrected)',
          position: 0
        });
      }
      
      setIsLoading(false);
      return {
        text: result,
        corrections
      };
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to check grammar');
      setError(errorMessage);
      throw errorMessage;
    }
  }, [createAbortController, generateText]);

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
      setError(errorMessage);
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
    generateQuestions,
    translateText,
    checkGrammar
  };
};

export default useAISimplified;
