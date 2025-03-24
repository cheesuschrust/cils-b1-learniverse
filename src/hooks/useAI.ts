
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useAI = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Mock functionality for demo purposes
  // In a real app, this would initialize actual AI models
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Simulate AI model loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsModelLoaded(true);
      } catch (err) {
        console.error('Error loading AI model:', err);
        setError('Failed to load AI model');
        toast({
          title: 'AI Initialization Error',
          description: 'There was a problem loading the AI models. Some features may be limited.',
          variant: 'destructive',
        });
      }
    };
    
    loadModel();
  }, [toast]);
  
  const toggleAI = useCallback(() => {
    if (isProcessing) {
      return isModelLoaded; // Don't toggle while processing
    }
    
    setIsModelLoaded(prev => !prev);
    return !isModelLoaded;
  }, [isModelLoaded, isProcessing]);
  
  const runAITask = useCallback(async <T>(
    task: () => Promise<T>,
    taskName: string = 'AI task'
  ): Promise<T> => {
    if (!isModelLoaded) {
      throw new Error('AI is disabled. Enable it in settings to use this feature.');
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await task();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Error during ${taskName}`;
      setError(errorMessage);
      console.error(`AI error during ${taskName}:`, err);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [isModelLoaded]);
  
  return {
    isModelLoaded,
    isProcessing,
    error,
    toggleAI,
    runAITask
  };
};
