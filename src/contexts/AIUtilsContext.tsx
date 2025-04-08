
import React, { createContext, useContext, ReactNode } from 'react';
import { useAIUtils } from '@/hooks/useAIUtils';

// Create a context with a default value
export const AIUtilsContext = createContext<ReturnType<typeof useAIUtils> | undefined>(undefined);

// Create a provider component
export const AIUtilsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const aiUtils = useAIUtils();
  
  return (
    <AIUtilsContext.Provider value={aiUtils}>
      {children}
    </AIUtilsContext.Provider>
  );
};

// Create a custom hook to use the AIUtils context
export const useAIUtils = () => {
  const context = useContext(AIUtilsContext);
  
  if (context === undefined) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  
  return context;
};
