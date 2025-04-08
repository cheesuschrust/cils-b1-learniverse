
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: string;
  endpoint: string;
  apiKey?: string;
  isActive: boolean;
}

interface AIProviderConfig {
  id: string;
  name: string;
  apiKeyRequired: boolean;
  endpointRequired: boolean;
  modelTypes: string[];
  isConfigured: boolean;
}

interface AIModelContextType {
  models: AIModel[];
  providers: AIProviderConfig[];
  activeModel: AIModel | null;
  setActiveModel: (model: AIModel) => void;
  addModel: (model: AIModel) => void;
  updateModel: (id: string, updates: Partial<AIModel>) => void;
  deleteModel: (id: string) => void;
  isLoading: boolean;
  error: string | null;
}

const AIModelContext = createContext<AIModelContextType | undefined>(undefined);

export const useAIModel = () => {
  const context = useContext(AIModelContext);
  if (!context) {
    throw new Error('useAIModel must be used within an AIModelProvider');
  }
  return context;
};

interface AIModelProviderProps {
  children: ReactNode;
}

const AIModelProvider: React.FC<AIModelProviderProps> = ({ children }) => {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: '1',
      name: 'HuggingFace Chat Model',
      provider: 'huggingface',
      type: 'text-generation',
      endpoint: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      isActive: true
    },
    {
      id: '2',
      name: 'HuggingFace Embedding Model',
      provider: 'huggingface',
      type: 'feature-extraction',
      endpoint: 'https://api-inference.huggingface.co/models/mixedbread-ai/mxbai-embed-xsmall-v1',
      isActive: true
    }
  ]);
  
  const [providers, setProviders] = useState<AIProviderConfig[]>([
    {
      id: 'huggingface',
      name: 'HuggingFace',
      apiKeyRequired: true,
      endpointRequired: true,
      modelTypes: ['text-generation', 'feature-extraction', 'text-classification', 'token-classification'],
      isConfigured: false
    },
    {
      id: 'openai',
      name: 'OpenAI',
      apiKeyRequired: true,
      endpointRequired: false,
      modelTypes: ['text-generation', 'embeddings'],
      isConfigured: false
    }
  ]);
  
  const [activeModel, setActiveModel] = useState<AIModel | null>(models[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addModel = (model: AIModel) => {
    setModels([...models, model]);
  };

  const updateModel = (id: string, updates: Partial<AIModel>) => {
    setModels(models.map(model => model.id === id ? { ...model, ...updates } : model));
  };

  const deleteModel = (id: string) => {
    setModels(models.filter(model => model.id !== id));
  };

  const value = {
    models,
    providers,
    activeModel,
    setActiveModel,
    addModel,
    updateModel,
    deleteModel,
    isLoading,
    error
  };

  return (
    <AIModelContext.Provider value={value}>
      {children}
    </AIModelContext.Provider>
  );
};

export default AIModelProvider;
