
import { useState, useCallback } from '@/adapters/ReactImports';

export const useFileProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const processFile = useCallback(async (
    file: File, 
    processor: (file: File) => Promise<any>
  ) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await processor(file);
      setIsProcessing(false);
      return { result, error: null };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsProcessing(false);
      return { result: null, error: err instanceof Error ? err.message : 'Unknown error occurred' };
    }
  }, []);
  
  return {
    isProcessing,
    error,
    processFile
  };
};

export default useFileProcessor;
