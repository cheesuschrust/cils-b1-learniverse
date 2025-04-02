
import { useContext } from 'react';
import { AIUtilsContextType } from '@/types/core-types';
import AIUtilsContext from '@/contexts/AIUtilsContext';

/**
 * Hook for accessing AI utilities
 * @returns AIUtilsContextType - The AI utilities context
 */
export function useAI(): AIUtilsContextType {
  const context = useContext(AIUtilsContext);
  
  if (context === undefined) {
    throw new Error('useAI must be used within an AIUtilsProvider');
  }
  
  return context;
}

export default useAI;
