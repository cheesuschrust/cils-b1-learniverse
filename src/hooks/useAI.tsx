
import { useState, useCallback, useRef } from 'react';
import { ContentType } from '@/types/contentType';
import AIService from '@/services/AIService';
import { analyzeContent } from '@/utils/AITrainingUtils';
import { UseAIReturn } from '@/types/interface-fixes';
import { normalizeFlashcard, convertLegacyUser } from '@/types/core';

export const useAI = (): UseAIReturn => {
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
      
      const result = await AIService.generateText(prompt, options);
      
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(errorMessage);
      throw errorMessage;
    }
  }, []);

  // Generate flashcards based on a topic
  const generateFlashcards = useCallback(async (topic: string, count: number = 5, difficulty: string = 'intermediate') => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const flashcards = await AIService.generateFlashcards(topic, count, difficulty);
      
      setIsProcessing(false);
      return flashcards;
    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to generate flashcards');
      setError(errorMessage);
      throw errorMessage;
    }
  }, []);

  // Analyze and classify text
  const classifyText = useCallback(async (text: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // First use local analysis
      const localAnalysis = analyzeContent(text);
      
      // Then try to get more detailed classification from the API
      let apiClassification;
      try {
        apiClassification = await AIService.classifyText(text);
      } catch (err) {
        console.warn('API classification failed, using local analysis only:', err);
        apiClassification = [];
      }
      
      setIsProcessing(false);
      return {
        contentType: localAnalysis.contentType,
        confidence: localAnalysis.confidence,
        features: localAnalysis.features,
        classifications: apiClassification
      };
    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to classify text');
      setError(errorMessage);
      throw errorMessage;
    }
  }, []);

  // Get confidence score for a content type
  const getConfidenceScore = useCallback(async (text: string, contentType: ContentType): Promise<number> => {
    try {
      // If text is provided, analyze it to adjust the confidence score
      if (text) {
        const analysis = analyzeContent(text);
        if (analysis.contentType === contentType) {
          return analysis.confidence * 100;
        }
      }
      
      // Otherwise return the base confidence score for the content type
      return AIService.getConfidenceScore(contentType);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to get confidence score');
      setError(errorMessage);
      return 60; // Default fallback score
    }
  }, []);

  // Translate text to target language
  const translateText = useCallback(async (text: string, targetLang: 'english' | 'italian'): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const sourceLang = targetLang === 'english' ? 'italian' : 'english';
      const prompt = `Translate the following ${sourceLang} text to ${targetLang}: ${text}`;
      
      const result = await AIService.generateText(prompt, {
        temperature: 0.3 // Lower temperature for more accurate translations
      });
      
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to translate text');
      setError(errorMessage);
      throw errorMessage;
    }
  }, []);

  // Check grammar and provide corrections
  const checkGrammar = useCallback(async (text: string, lang: 'english' | 'italian'): Promise<{text: string, corrections: any[]}> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const prompt = `Check the grammar of the following ${lang} text and provide corrections: ${text}`;
      
      const result = await AIService.generateText(prompt, {
        temperature: 0.2 // Lower temperature for more accurate grammar checking
      });
      
      // Parse corrections from the result
      // This is a simplified approach - in a real app, you'd use a more structured API response
      const corrections: any[] = [];
      const correctedText = result.trim();
      
      // Simple regex to extract corrections in the format "original -> correction"
      const correctionRegex = /(\w+)\s*->\s*(\w+)/g;
      let match;
      
      while ((match = correctionRegex.exec(correctedText)) !== null) {
        corrections.push({
          original: match[1],
          correction: match[2],
          position: text.indexOf(match[1])
        });
      }
      
      setIsLoading(false);
      return {
        text: correctedText,
        corrections
      };
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to check grammar');
      setError(errorMessage);
      throw errorMessage;
    }
  }, []);

  // Generate questions based on content
  const generateQuestions = useCallback(async (content: string, count: number = 5, type: string = 'multiple-choice') => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const questions = await AIService.generateQuestions(content, count, type);
      
      setIsProcessing(false);
      return questions;
    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err : new Error('Failed to generate questions');
      setError(errorMessage);
      throw errorMessage;
    }
  }, []);

  // Load model
  const loadModel = useCallback(async (modelName: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setStatus(`Loading model: ${modelName}...`);
      
      // Simulate model loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
  }, []);

  return {
    generateText,
    getConfidenceScore,
    translateText,
    checkGrammar,
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

// Export the normalization functions from core.ts
export { normalizeFlashcard, convertLegacyUser };
export default useAI;
