
import { useContext } from 'react';
import { AIUtilsContext } from '@/contexts/AIUtilsContext';

export const useAI = () => {
  const context = useContext(AIUtilsContext);
  
  if (context === undefined) {
    throw new Error('useAI must be used within an AIUtilsProvider');
  }
  
  return context;
};

export default useAI;
