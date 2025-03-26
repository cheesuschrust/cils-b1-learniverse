
import { useState, useCallback } from 'react';
import { AIStatus } from '@/types/ai';

export interface UseAIReturn {
  isModelLoaded: boolean;
  isProcessing: boolean;
  error: string;
  status: AIStatus;
  toggleAI: () => boolean;
  runAITask: <T>(task: () => Promise<T>, taskName?: string) => Promise<T>;
  classifyText: (text: string) => Promise<{ type: string; confidence: number }>;
  checkPronunciation: (text: string, recording: Blob) => Promise<{ accuracy: number; feedback: string }>;
  speakText: (text: string, language?: 'english' | 'italian') => Promise<void>;
  stopSpeaking: () => void;
  isEnabled: boolean;
}

export const useAI = (): UseAIReturn => {
  const [isModelLoaded, setIsModelLoaded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<AIStatus>('ready');
  const [isEnabled, setIsEnabled] = useState(true);
  
  const toggleAI = useCallback(() => {
    setIsEnabled(prev => !prev);
    return !isEnabled;
  }, [isEnabled]);
  
  const runAITask = useCallback(async <T>(task: () => Promise<T>, taskName?: string): Promise<T> => {
    if (!isEnabled) {
      throw new Error('AI is disabled');
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const result = await task();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error in AI task';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [isEnabled]);
  
  const classifyText = useCallback(async (text: string): Promise<{ type: string; confidence: number }> => {
    return runAITask(async () => {
      // Mock implementation
      return { type: 'general', confidence: 87 };
    }, 'classify text');
  }, [runAITask]);
  
  const checkPronunciation = useCallback(async (text: string, recording: Blob): Promise<{ accuracy: number; feedback: string }> => {
    return runAITask(async () => {
      // Mock implementation
      return { 
        accuracy: 84, 
        feedback: 'Good pronunciation! Work on the stress in "difficile".' 
      };
    }, 'check pronunciation');
  }, [runAITask]);
  
  const speakText = useCallback(async (text: string, language = 'english'): Promise<void> => {
    return runAITask(async () => {
      // Mock implementation
      console.log(`Speaking: "${text}" in ${language}`);
    }, 'speak text');
  }, [runAITask]);
  
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);
  
  return {
    isModelLoaded,
    isProcessing,
    error,
    status,
    toggleAI,
    runAITask,
    classifyText,
    checkPronunciation,
    speakText,
    stopSpeaking,
    isEnabled
  };
};
