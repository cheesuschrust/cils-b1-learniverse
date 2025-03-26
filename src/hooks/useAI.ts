
import { useState, useEffect, useCallback } from 'react';
import { UseAIReturn } from '@/types/interface-fixes';
import * as AIService from '@/services/AIService';

export const useAI = (): UseAIReturn => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0.85);
  const [lastProcessedAt, setLastProcessedAt] = useState<Date | null>(null);
  const [isCacheEnabled, setIsCacheEnabled] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const prepareModel = useCallback(async (modelType: string = 'basic'): Promise<boolean> => {
    try {
      setStatus('loading');
      const success = await AIService.prepareModel(modelType);
      if (success) {
        setIsModelLoaded(true);
        setStatus('ready');
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load AI model');
      setStatus('error');
      return false;
    }
  }, []);

  const toggleAI = useCallback((): boolean => {
    setIsEnabled(prev => !prev);
    return !isEnabled;
  }, [isEnabled]);

  const initialize = useCallback(async (config: any): Promise<boolean> => {
    try {
      setStatus('loading');
      // Implementation would go here
      setStatus('ready');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize AI');
      setStatus('error');
      return false;
    }
  }, []);

  const generateText = useCallback(async (prompt: string, options?: any): Promise<string> => {
    if (!isEnabled) {
      throw new Error('AI is disabled');
    }
    
    setIsProcessing(true);
    try {
      const response = await AIService.generateText(prompt, options);
      setLastProcessedAt(new Date());
      return response;
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled]);

  const classifyText = useCallback(async (text: string): Promise<any[]> => {
    if (!isEnabled) {
      throw new Error('AI is disabled');
    }
    
    setIsProcessing(true);
    try {
      const result = await AIService.classifyText(text);
      setLastProcessedAt(new Date());
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled]);

  const generateQuestions = useCallback(async (
    content: string, 
    contentType: string, 
    count: number = 5, 
    difficulty: string = 'intermediate'
  ): Promise<any[]> => {
    if (!isEnabled) {
      throw new Error('AI is disabled');
    }
    
    setIsProcessing(true);
    try {
      const questions = await AIService.generateQuestions(content, contentType, count, difficulty);
      setLastProcessedAt(new Date());
      return questions;
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled]);

  const processText = useCallback(async (text: string, processingType: string): Promise<any> => {
    if (!isEnabled) {
      throw new Error('AI is disabled');
    }
    
    setIsProcessing(true);
    try {
      // Implementation would depend on processingType
      const result = { processed: true, text: `Processed: ${text}` };
      setLastProcessedAt(new Date());
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled]);

  const processImage = useCallback(async (imageUrl: string, prompt: string): Promise<any> => {
    if (!isEnabled) {
      throw new Error('AI is disabled');
    }
    
    setIsProcessing(true);
    try {
      // Implementation would go here
      const result = { processed: true, description: `Processed image with prompt: ${prompt}` };
      setLastProcessedAt(new Date());
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled]);

  const recognizeSpeech = useCallback(async (audioBlob: Blob, language: 'it' | 'en' = 'en'): Promise<string> => {
    if (!isEnabled) {
      throw new Error('AI is disabled');
    }
    
    setIsProcessing(true);
    try {
      // Implementation would go here
      const result = 'Transcribed speech would appear here';
      setLastProcessedAt(new Date());
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled]);

  const evaluateSpeech = useCallback(async (
    spokenText: string, 
    referenceText: string, 
    language: 'it' | 'en' = 'en'
  ): Promise<any> => {
    if (!isEnabled) {
      throw new Error('AI is disabled');
    }
    
    setIsProcessing(true);
    try {
      // Implementation would go here
      const result = { 
        accuracy: 0.85, 
        errors: [], 
        suggestions: [] 
      };
      setLastProcessedAt(new Date());
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled]);

  const generateSpeechExercises = useCallback(async (
    level: string, 
    count: number = 5, 
    language: 'it' | 'en' = 'it'
  ): Promise<any[]> => {
    if (!isEnabled) {
      throw new Error('AI is disabled');
    }
    
    setIsProcessing(true);
    try {
      // Implementation would go here
      const exercises = [];
      for (let i = 0; i < count; i++) {
        exercises.push({
          prompt: `Exercise ${i + 1} for ${level} level`,
          hint: 'Say this sentence clearly',
          reference: 'Reference text for comparison'
        });
      }
      setLastProcessedAt(new Date());
      return exercises;
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled]);

  const generateFlashcards = useCallback(async (
    content: string, 
    count: number = 10, 
    difficulty: string = 'intermediate'
  ): Promise<any[]> => {
    if (!isEnabled) {
      throw new Error('AI is disabled');
    }
    
    setIsProcessing(true);
    try {
      const flashcards = await AIService.generateFlashcards(content, count, difficulty);
      setLastProcessedAt(new Date());
      return flashcards;
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled]);

  const getContentTypeConfidence = useCallback((contentType: string): number => {
    return AIService.getConfidenceScore(contentType);
  }, []);

  // Load model automatically when hook is used if enabled
  useEffect(() => {
    if (isEnabled && !isModelLoaded && status === 'idle') {
      prepareModel().catch(error => {
        console.error('Failed to automatically load AI model:', error);
      });
    }
  }, [isEnabled, isModelLoaded, prepareModel, status]);

  return {
    status,
    error,
    isProcessing,
    confidence,
    lastProcessedAt,
    isCacheEnabled,
    isModelLoaded,
    isEnabled,
    toggleAI,
    prepareModel,
    initialize,
    generateText,
    classifyText,
    generateQuestions,
    processText,
    processImage,
    recognizeSpeech,
    evaluateSpeech,
    generateSpeechExercises,
    generateFlashcards,
    getContentTypeConfidence
  };
};

export default useAI;
