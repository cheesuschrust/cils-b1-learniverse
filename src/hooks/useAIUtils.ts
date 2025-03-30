
import { useContext } from 'react';
import { AIUtilsContext } from '@/contexts/AIUtilsContext';

/**
 * Custom hook to access AI utility functions from AIUtilsContext
 * This provides type-safe access to all AI-related functionality
 */
export const useAIUtils = () => {
  const context = useContext(AIUtilsContext);
  
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  
  return context;
};

export default useAIUtils;
