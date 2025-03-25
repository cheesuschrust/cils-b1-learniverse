
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useAI = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const { toast } = useToast();
  
  // Mock functionality for demo purposes
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Simulate AI model loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsModelLoaded(true);
        setStatus('ready');
      } catch (err) {
        console.error('Error loading AI model:', err);
        setError('Failed to load AI model');
        setStatus('error');
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

  // Add methods needed by components
  const loadModel = async (modelType: string) => {
    setIsProcessing(true);
    try {
      console.log(`Loading model: ${modelType}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsModelLoaded(true);
      setStatus('ready');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading model');
      setStatus('error');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const generateText = async (prompt: string, options = {}) => {
    console.log(`Generating text for prompt: ${prompt}`);
    return `Generated text based on: ${prompt}`;
  };

  const classifyText = async (text: string) => {
    console.log(`Classifying text: ${text}`);
    return [
      { label: "multiple-choice", score: 0.8 },
      { label: "flashcards", score: 0.3 },
    ];
  };

  const generateQuestions = async (
    content: string,
    contentType: string,
    count: number = 5,
    difficulty: string = "Intermediate"
  ) => {
    console.log(`Generating ${count} ${difficulty} questions for ${contentType}`);
    return Array(count).fill(null).map((_, i) => ({
      id: `q-${i}`,
      question: `Sample question ${i+1} about ${content.substring(0, 20)}...`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswerIndex: 0,
      difficulty,
      type: contentType
    }));
  };

  const recognizeSpeech = async (audioBlob: Blob, language: 'it' | 'en' = 'it') => {
    console.log(`Recognizing speech in ${language}`);
    return {
      text: language === 'it' ? 'Ciao, come stai?' : 'Hello, how are you?',
      confidence: 85
    };
  };

  const evaluateSpeech = async (
    spokenText: string,
    referenceText: string,
    language: 'it' | 'en' = 'it'
  ) => {
    console.log(`Evaluating speech: "${spokenText}" against "${referenceText}"`);
    return {
      score: 85,
      feedback: language === 'it' 
        ? 'Buona pronuncia, continua così!' 
        : 'Good pronunciation, keep it up!',
      errors: []
    };
  };

  const generateSpeechExercises = async (
    level: 'beginner' | 'intermediate' | 'advanced',
    count: number = 5,
    language: 'it' | 'en' = 'it'
  ) => {
    console.log(`Generating ${count} ${level} speech exercises`);
    return Array(count).fill(null).map((_, i) => ({
      id: `ex-${i}`,
      text: language === 'it' ? `Esercizio ${i+1}` : `Exercise ${i+1}`,
      translation: language === 'it' ? `Exercise ${i+1}` : `Esercizio ${i+1}`,
      difficulty: level
    }));
  };
  
  return {
    isModelLoaded,
    isProcessing,
    error,
    status,
    toggleAI,
    runAITask,
    loadModel,
    generateText,
    classifyText,
    generateQuestions,
    recognizeSpeech,
    evaluateSpeech,
    generateSpeechExercises,
    isEnabled: isModelLoaded
  };
};
