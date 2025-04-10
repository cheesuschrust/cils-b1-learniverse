
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAI } from '@/hooks/useAI';

interface AIUtilsContextType {
  isInitialized: boolean;
  isLoading: boolean;
  modelInfo: {
    name: string;
    version: string;
    capabilities: string[];
  };
  loadStatus: 'unloaded' | 'loading' | 'loaded' | 'error';
  initialize: () => Promise<boolean>;
}

const defaultModelInfo = {
  name: 'Italian Language Assistant',
  version: '1.0.0',
  capabilities: [
    'Vocabulary generation',
    'Grammar analysis',
    'Exercise generation',
    'Translation assistance',
    'Pronunciation guidance'
  ]
};

const AIUtilsContext = createContext<AIUtilsContextType>({
  isInitialized: false,
  isLoading: false,
  modelInfo: defaultModelInfo,
  loadStatus: 'unloaded',
  initialize: async () => false,
});

export const useAIUtils = () => useContext(AIUtilsContext);

export const AIUtilsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadStatus, setLoadStatus] = useState<'unloaded' | 'loading' | 'loaded' | 'error'>('unloaded');
  const [modelInfo, setModelInfo] = useState(defaultModelInfo);
  
  const ai = useAI();

  const initialize = async (): Promise<boolean> => {
    if (isInitialized) return true;
    if (isLoading) return false;
    
    setIsLoading(true);
    setLoadStatus('loading');
    
    try {
      const { success } = await ai.loadModel();
      
      if (success) {
        setIsInitialized(true);
        setLoadStatus('loaded');
        return true;
      } else {
        setLoadStatus('error');
        return false;
      }
    } catch (error) {
      console.error('Failed to initialize AI:', error);
      setLoadStatus('error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIUtilsContext.Provider value={{
      isInitialized,
      isLoading,
      modelInfo,
      loadStatus,
      initialize,
    }}>
      {children}
    </AIUtilsContext.Provider>
  );
};
