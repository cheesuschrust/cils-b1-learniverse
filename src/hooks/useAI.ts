
import { useState, useEffect } from 'react';
import { useAIModel } from '@/contexts/AIModelContext';
import { AIModelStatus } from '@/types/ai-types';

interface UseAIResult {
  status: AIModelStatus;
  isModelLoaded: boolean;
  loadModels: () => Promise<void>;
  unloadModels: () => void;
  isProcessing: boolean;
  confidence: number | null;
}

export const useAI = (): UseAIResult => {
  const { models, loadModel, unloadModel, activeModels } = useAIModel();
  const [status, setStatus] = useState<AIModelStatus>('inactive');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);

  // Check the overall status of AI models
  useEffect(() => {
    if (models.length === 0) {
      setStatus('inactive');
      return;
    }

    if (activeModels.length > 0) {
      setStatus('active');
      return;
    }

    // Check if any models are in the process of loading
    if (models.some(model => model.isActive && !model.isLoaded)) {
      setStatus('loading');
      return;
    }

    setStatus('inactive');
  }, [models, activeModels]);

  // Function to load all active models
  const loadModels = async (): Promise<void> => {
    setStatus('loading');
    
    try {
      const activeModelIds = models
        .filter(model => model.isActive)
        .map(model => model.id);
      
      if (activeModelIds.length === 0) {
        setStatus('inactive');
        return;
      }
      
      // Load all active models sequentially
      for (const modelId of activeModelIds) {
        await loadModel(modelId);
      }
      
      // Final check to see if all models loaded successfully
      if (models.filter(m => m.isActive).every(m => m.isLoaded)) {
        setStatus('active');
      }
    } catch (error) {
      console.error('Error loading AI models:', error);
      setStatus('error');
    }
  };

  // Function to unload all models
  const unloadModels = (): void => {
    activeModels.forEach(model => {
      unloadModel(model.id);
    });
    
    setStatus('inactive');
  };

  // Get loading status of any model
  const isModelLoaded = activeModels.length > 0;

  return {
    status,
    isModelLoaded,
    loadModels,
    unloadModels,
    isProcessing,
    confidence,
  };
};
