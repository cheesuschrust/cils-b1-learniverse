
import { useState, useCallback, useContext } from 'react';
import { AIUtilsContext } from '@/contexts/AIUtilsContext';
import { useToast } from '@/components/ui/use-toast';
import { AIService } from '@/services/AIService';

export interface UseAIReturn {
  isLoading: boolean;
  isModelLoaded: boolean;
  prepareModel: () => Promise<void>;
  generateText: (prompt: string, options?: Record<string, any>) => Promise<string>;
  generateFlashcards: (topic: string, count: number, difficulty: string) => Promise<any[]>;
  generateQuestions: (content: string, count: number, difficulty: string) => Promise<any[]>;
  transcribeSpeech: (audioData: Blob) => Promise<string>;
  analyzeSpeech: (text: string, audioData: Blob) => Promise<any>;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  checkGrammar: (text: string) => Promise<any>;
  evaluateWriting: (text: string, prompt: string) => Promise<any>;
  performTextToSpeech: (text: string, voiceSettings?: any) => Promise<void>;
}

export const useAI = (): UseAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const { settings } = useContext(AIUtilsContext);
  const { toast } = useToast();

  const handleError = useCallback((error: any) => {
    console.error('AI Error:', error);
    toast({
      title: 'AI Error',
      description: error instanceof Error ? error.message : 'An error occurred with the AI service',
      variant: 'destructive',
    });
    throw error;
  }, [toast]);

  const prepareModel = useCallback(async () => {
    try {
      setIsLoading(true);
      // This is a placeholder for actual model loading code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsModelLoaded(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError(error);
    }
  }, [handleError]);

  const generateText = useCallback(async (prompt: string, options?: Record<string, any>) => {
    try {
      setIsLoading(true);
      // Placeholder for actual AI text generation
      const result = await AIService.generateText(prompt, options);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return handleError(error);
    }
  }, [handleError]);

  const generateFlashcards = useCallback(async (topic: string, count: number, difficulty: string) => {
    try {
      setIsLoading(true);
      // Placeholder for flashcard generation
      const prompt = `Generate ${count} ${difficulty} Italian flashcards about ${topic}`;
      const result = await AIService.generateFlashcards(prompt, count);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return handleError(error);
    }
  }, [handleError]);

  const generateQuestions = useCallback(async (content: string, count: number, difficulty: string) => {
    try {
      setIsLoading(true);
      // Placeholder for question generation
      const result = await AIService.generateQuestions(content, count, difficulty);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return handleError(error);
    }
  }, [handleError]);

  const transcribeSpeech = useCallback(async (audioData: Blob) => {
    try {
      setIsLoading(true);
      // Placeholder for speech transcription
      const result = await AIService.transcribeSpeech(audioData);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return handleError(error);
    }
  }, [handleError]);

  const analyzeSpeech = useCallback(async (text: string, audioData: Blob) => {
    try {
      setIsLoading(true);
      // Placeholder for speech analysis
      const result = await AIService.analyzeSpeech(text, audioData);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return handleError(error);
    }
  }, [handleError]);

  const translateText = useCallback(async (text: string, targetLanguage: string) => {
    try {
      setIsLoading(true);
      // Placeholder for text translation
      const result = await AIService.translateText(text, targetLanguage);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return handleError(error);
    }
  }, [handleError]);

  const checkGrammar = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      // Placeholder for grammar checking
      const result = await AIService.checkGrammar(text);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return handleError(error);
    }
  }, [handleError]);

  const evaluateWriting = useCallback(async (text: string, prompt: string) => {
    try {
      setIsLoading(true);
      // Placeholder for writing evaluation
      const result = await AIService.evaluateWriting(text, prompt);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return handleError(error);
    }
  }, [handleError]);

  const performTextToSpeech = useCallback(async (text: string, voiceSettings?: any) => {
    try {
      setIsLoading(true);
      // Placeholder for text-to-speech
      await AIService.textToSpeech(text, voiceSettings);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError(error);
    }
  }, [handleError]);

  return {
    isLoading,
    isModelLoaded,
    prepareModel,
    generateText,
    generateFlashcards,
    generateQuestions,
    transcribeSpeech,
    analyzeSpeech,
    translateText,
    checkGrammar,
    evaluateWriting,
    performTextToSpeech,
  };
};
