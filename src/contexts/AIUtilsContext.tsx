
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAI } from '@/hooks/useAI';
import { useAIUtils } from '@/hooks/useAIUtils';
import { useToast } from '@/hooks/use-toast';

// Combine the AI utilities from both hooks
type AIUtilsContextType = ReturnType<typeof useAIUtils> & ReturnType<typeof useAI>;

const AIUtilsContext = createContext<AIUtilsContextType | undefined>(undefined);

export function useAIUtils(): AIUtilsContextType {
  const context = useContext(AIUtilsContext);
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
}

interface AIUtilsProviderProps {
  children: ReactNode;
}

export function AIUtilsProvider({ children }: AIUtilsProviderProps) {
  const aiUtils = useAIUtils();
  const aiHook = useAI();
  const { toast } = useToast();
  
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize AI models on component mount
    const initializeAI = async () => {
      try {
        await aiUtils.loadModel('text-processing');
        setIsInitialized(true);
        console.log('AI models initialized successfully');
      } catch (error) {
        console.error('Error initializing AI models:', error);
        toast({
          title: 'AI Initialization Failed',
          description: 'Some AI features may be limited. Please refresh the page to try again.',
          variant: 'destructive',
        });
      }
    };

    initializeAI();
  }, []);

  // Combine the utilities from both hooks
  const combinedUtils: AIUtilsContextType = {
    ...aiUtils,
    ...aiHook,
    isAIEnabled: isInitialized && (aiUtils.isAIEnabled || aiHook.isAIEnabled),
  };

  return (
    <AIUtilsContext.Provider value={combinedUtils}>
      {children}
    </AIUtilsContext.Provider>
  );
}
