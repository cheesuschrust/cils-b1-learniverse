
import { useContext } from 'react';
import { AIUtilsContext } from '@/contexts/AIUtilsContext';
import { v4 as uuidv4 } from 'uuid';
import { 
  AIGenerationResult, 
  QuestionGenerationParams,
  AIUtilsContextType
} from '@/types/core-types';

/**
 * Custom hook to access AI utility functions from AIUtilsContext
 * This provides type-safe access to all AI-related functionality
 */
export const useAIUtils = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  
  return context;
};

export default useAIUtils;
