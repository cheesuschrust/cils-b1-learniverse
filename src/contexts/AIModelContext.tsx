
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AIModel } from '@/types/ai-types';
import { useToast } from '@/hooks/use-toast';

type AIModelContextType = {
  models: AIModel[];
  loadModel: (modelId: string) => Promise<boolean>;
  unloadModel: (modelId: string) => void;
  isModelLoaded: (modelId: string) => boolean;
  activeModels: AIModel[];
  isLoading: boolean;
  error: string | null;
};

const defaultContext: AIModelContextType = {
  models: [],
  loadModel: async () => false,
  unloadModel: () => {},
  isModelLoaded: () => false,
  activeModels: [],
  isLoading: false,
  error: null,
};

const AIModelContext = createContext<AIModelContextType>(defaultContext);

export const useAIModel = () => useContext(AIModelContext);

interface AIModelProviderProps {
  children: ReactNode;
}

// Sample models for development purposes
const SAMPLE_MODELS: AIModel[] = [
  {
    id: 'embed-model',
    name: 'MixedBread Embeddings',
    type: 'embedding',
    size: 50,
    isLoaded: false,
    isActive: true,
    accuracy: 0.92,
    version: '1.0',
  },
  {
    id: 'trans-model',
    name: 'Opus MT Translation',
    type: 'translation',
    size: 85,
    isLoaded: false,
    isActive: true,
    accuracy: 0.89,
    version: '1.2',
  },
  {
    id: 'speech-model',
    name: 'Whisper Tiny',
    type: 'speech',
    size: 75,
    isLoaded: false,
    isActive: true,
    accuracy: 0.78,
    version: '1.1',
  },
];

const AIModelProvider: React.FC<AIModelProviderProps> = ({ children }) => {
  const [models, setModels] = useState<AIModel[]>(SAMPLE_MODELS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // For demonstration purposes, this simulates loading a model
  const loadModel = async (modelId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Find the model
      const modelIndex = models.findIndex(m => m.id === modelId);
      if (modelIndex === -1) {
        throw new Error(`Model with ID ${modelId} not found`);
      }
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update model state
      const updatedModels = [...models];
      updatedModels[modelIndex] = {
        ...updatedModels[modelIndex],
        isLoaded: true,
      };
      
      setModels(updatedModels);
      
      toast({
        title: "Model Loaded",
        description: `${models[modelIndex].name} has been loaded successfully.`,
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading model';
      setError(errorMessage);
      
      toast({
        title: "Failed to Load Model",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const unloadModel = (modelId: string) => {
    const modelIndex = models.findIndex(m => m.id === modelId);
    if (modelIndex !== -1) {
      const updatedModels = [...models];
      updatedModels[modelIndex] = {
        ...updatedModels[modelIndex],
        isLoaded: false,
      };
      
      setModels(updatedModels);
      
      toast({
        title: "Model Unloaded",
        description: `${models[modelIndex].name} has been unloaded.`,
      });
    }
  };
  
  const isModelLoaded = (modelId: string): boolean => {
    const model = models.find(m => m.id === modelId);
    return model ? model.isLoaded : false;
  };
  
  const activeModels = models.filter(model => model.isActive && model.isLoaded);
  
  return (
    <AIModelContext.Provider
      value={{
        models,
        loadModel,
        unloadModel,
        isModelLoaded,
        activeModels,
        isLoading,
        error,
      }}
    >
      {children}
    </AIModelContext.Provider>
  );
};

export default AIModelProvider;
