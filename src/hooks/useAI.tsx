
import { useState, useEffect } from 'react';
import * as AIService from '@/services/AIService';
import { useToast } from '@/components/ui/use-toast';
import { ContentType } from '@/utils/textAnalysis';

type AIStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface AIServiceProps {
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export const useAI = (options?: AIServiceProps) => {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [lastProcessedAt, setLastProcessedAt] = useState<Date | null>(null);
  const [isCacheEnabled, setIsCacheEnabled] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const { toast } = useToast();

  // Mock functions for missing methods
  const initialize = async (config: any) => {
    try {
      setStatus('ready');
      setIsModelLoaded(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize');
      setStatus('error');
      throw err;
    }
  };

  const loadModel = async (modelType: string) => {
    try {
      setIsModelLoaded(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to load model');
      throw err;
    }
  };

  const toggleAI = () => {
    const newState = !isModelLoaded;
    setIsModelLoaded(newState);
    return newState;
  };

  const generateText = async (prompt: string, options = {}) => {
    setIsProcessing(true);
    try {
      const result = await AIService.generateText(prompt, options);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to generate text');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const classifyText = async (text: string) => {
    setIsProcessing(true);
    try {
      const result = await AIService.classifyText(text);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to classify text');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Update to ensure ContentType is properly used
  const generateQuestions = async (
    content: string,
    contentType: ContentType,
    count: number = 5,
    difficulty: "Beginner" | "Intermediate" | "Advanced" = "Intermediate"
  ) => {
    setIsProcessing(true);
    try {
      const result = await AIService.generateQuestions(content, contentType, count, difficulty);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to generate questions');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Initialize AI on component mount
  useEffect(() => {
    const initializeAI = async () => {
      setStatus('loading');
      try {
        await initialize({
          modelName: options?.modelName || 'gpt-3.5-turbo',
          temperature: options?.temperature || 0.7,
          maxTokens: options?.maxTokens || 2000,
          topP: options?.topP || 0.9,
          frequencyPenalty: options?.frequencyPenalty || 0,
          presencePenalty: options?.presencePenalty || 0
        });
        
        setStatus('ready');
        setIsCacheEnabled(true);
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Failed to initialize AI');
        toast({
          title: 'AI Initialization Failed',
          description: err.message || 'Could not initialize AI system',
          variant: 'destructive',
        });
      }
    };

    initializeAI();
  }, [options, toast]);

  const processText = async (text: string, processingType: string) => {
    setIsProcessing(true);
    try {
      // Simulate processing text
      const result = {
        text: text,
        processingType: processingType,
        confidence: Math.random() * 100,
      };
      setConfidence(result.confidence || 0);
      setLastProcessedAt(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to process text');
      toast({
        title: 'AI Processing Failed',
        description: err.message || 'Could not process text',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const processImage = async (imageUrl: string, prompt: string) => {
    setIsProcessing(true);
    try {
      // Simulate processing image
      const result = {
        imageUrl: imageUrl,
        prompt: prompt,
        confidence: Math.random() * 100,
      };
      setConfidence(result.confidence || 0);
      setLastProcessedAt(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
      toast({
        title: 'Image Processing Failed',
        description: err.message || 'Could not process image',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Add speech recognition capabilities
  const recognizeSpeech = async (
    audioBlob: Blob,
    language: 'it' | 'en' = 'it'
  ) => {
    setIsProcessing(true);
    try {
      const result = await AIService.recognizeSpeech(audioBlob, language);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to recognize speech');
      toast({
        title: 'Speech Recognition Failed',
        description: err.message || 'Could not process speech input',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Add speech evaluation capabilities
  const evaluateSpeech = async (
    spokenText: string,
    referenceText: string,
    language: 'it' | 'en' = 'it'
  ) => {
    setIsProcessing(true);
    try {
      const result = await AIService.evaluateSpeech(spokenText, referenceText, language);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate speech');
      toast({
        title: 'Speech Evaluation Failed',
        description: err.message || 'Could not evaluate speech quality',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate speech exercises
  const generateSpeechExercises = async (
    level: 'beginner' | 'intermediate' | 'advanced',
    count: number = 5,
    language: 'it' | 'en' = 'it'
  ) => {
    setIsProcessing(true);
    try {
      const result = await AIService.generateSpeechExercises(level, count, language);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to generate speech exercises');
      toast({
        title: 'Speech Exercise Generation Failed',
        description: err.message || 'Could not generate speech exercises',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    status,
    error,
    isProcessing,
    confidence,
    lastProcessedAt,
    isCacheEnabled,
    isModelLoaded,
    loadModel,
    generateText,
    classifyText,
    generateQuestions,
    processText,
    processImage,
    toggleAI,
    isEnabled: isModelLoaded,
    recognizeSpeech,
    evaluateSpeech,
    generateSpeechExercises
  };
};
