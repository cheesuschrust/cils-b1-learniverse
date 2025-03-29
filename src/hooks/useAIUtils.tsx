
import { useContext } from 'react';
import { AIUtilsContext } from '@/contexts/AIUtilsContext';

export const useAIUtils = () => {
  const context = useContext(AIUtilsContext);
  if (context === undefined) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
};

export default useAIUtils;
