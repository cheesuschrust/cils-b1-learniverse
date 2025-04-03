
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Define the return type for our hook
interface UseAIReturn {
  status: 'idle' | 'loading' | 'ready' | 'error';
  isModelLoaded: boolean;
  modelName: string;
  confidence: number;
  lastUpdated: Date | null;
}

export function useAI(): UseAIReturn {
  const { toast } = useToast();
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [modelName, setModelName] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const checkAIStatus = async () => {
      try {
        setStatus('loading');
        
        // Fetch the latest AI model performance data
        const { data, error } = await supabase
          .from('ai_model_performance')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const modelInfo = data[0];
          setModelName(modelInfo.model_name);
          setConfidence(modelInfo.confidence_score);
          setLastUpdated(new Date(modelInfo.created_at));
          setIsModelLoaded(true);
          setStatus('ready');
        } else {
          // No model data found, set defaults
          setModelName('Default Italian Language Model');
          setConfidence(85);
          setLastUpdated(new Date());
          setIsModelLoaded(true);
          setStatus('ready');
        }
      } catch (error) {
        console.error('Error checking AI status:', error);
        setStatus('error');
        toast({
          title: "AI Service Error",
          description: "Failed to load AI service status. Some features may be limited.",
          variant: "destructive"
        });
      }
    };
    
    checkAIStatus();
  }, [toast]);
  
  return {
    status,
    isModelLoaded,
    modelName,
    confidence,
    lastUpdated
  };
}
