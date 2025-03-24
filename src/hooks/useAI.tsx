
import { useState, useEffect } from 'react';
import * as AIService from '@/services/AIService';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  // Initialize AI on component mount
  useEffect(() => {
    const initializeAI = async () => {
      setStatus('loading');
      try {
        await AIService.initialize({
          modelName: options?.modelName || 'gpt-3.5-turbo',
          temperature: options?.temperature || 0.7,
          maxTokens: options?.maxTokens || 2000,
          topP: options?.topP || 0.9,
          frequencyPenalty: options?.frequencyPenalty || 0,
          presencePenalty: options?.presencePenalty || 0
        });
        
        setStatus('ready');
        setIsCacheEnabled(AIService.isCacheEnabled());
      } catch (err) {
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
      const result = await AIService.processText(text, processingType);
      setConfidence(result.confidence || 0);
      setLastProcessedAt(new Date());
      return result;
    } catch (err) {
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
      const result = await AIService.processImage(imageUrl, prompt, {
        modelName: options?.modelName,
        temperature: options?.temperature,
        maxTokens: options?.maxTokens,
        topP: options?.topP,
        frequencyPenalty: options?.frequencyPenalty,
        presencePenalty: options?.presencePenalty
      });
      setConfidence(result.confidence || 0);
      setLastProcessedAt(new Date());
      return result;
    } catch (err) {
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

  return {
    status,
    error,
    isProcessing,
    confidence,
    lastProcessedAt,
    isCacheEnabled,
    processText,
    processImage,
  };
};
