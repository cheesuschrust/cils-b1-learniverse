
import { useState, useCallback, useRef } from 'react';
import { UseAIReturn } from '@/types/ai';

/**
 * Simplified AI service stub for testing and development
 */
const AIServiceStub = {
  generateText: async (prompt: string, options?: any): Promise<string> => {
    // Simulate AI response based on prompt
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (prompt.includes('error')) {
      throw new Error('Simulated error in AI processing');
    }
    
    return `AI response to: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`;
  },
  
  classifyText: async (text: string): Promise<Array<{ label: string; score: number }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { label: 'grammar', score: 0.8 },
      { label: 'vocabulary', score: 0.7 },
      { label: 'comprehension', score: 0.6 }
    ];
  },
  
  getConfidenceScore: (contentType: string): number => {
    const scores: Record<string, number> = {
      'flashcards': 82,
      'multiple-choice': 78,
      'writing': 69,
      'speaking': 74,
      'listening': 65
    };
    
    return scores[contentType] || 70;
  },
  
  generateFlashcards: async (topic: string, count: number = 5, difficulty: string = 'intermediate'): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return Array.from({ length: count }, (_, i) => ({
      id: `card-${i + 1}`,
      front: `${topic} term ${i + 1}`,
      back: `Definition ${i + 1} for ${topic}`,
      difficulty
    }));
  },
  
  generateQuestions: async (content: string, count: number = 5, type: string = 'multiple-choice'): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return Array.from({ length: count }, (_, i) => ({
      id: `question-${i + 1}`,
      text: `Question ${i + 1} about ${content.substring(0, 20)}...`,
      type,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A'
    }));
  },
  
  abortRequest: (requestId: string): void => {
    console.log(`Aborting request ${requestId}`);
  },
  
  abortAllRequests: (): void => {
    console.log('Aborting all requests');
  },
  
  addTrainingExamples: (contentType: string, examples: any[]): number => {
    console.log(`Added ${examples.length} training examples for ${contentType}`);
    return examples.length;
  }
};

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
