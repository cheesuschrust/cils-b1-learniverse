import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUserPreferences } from './UserPreferencesContext';
import { ContentType } from '@/types/contentType';
import { getInitialConfidenceScores } from '@/components/ai/AISettingsTypes';

interface AIUtilsContextType {
  isAIEnabled: boolean;
  toggleAI: () => void;
  modelSize: 'small' | 'medium' | 'large';
  setModelSize: (size: 'small' | 'medium' | 'large') => void;
  analyzeText: (text: string, contentType: ContentType) => Promise<any>;
  translateText: (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ) => Promise<string>;
  classifyText: (text: string) => Promise<string>;
  isProcessing: boolean;
  isTranslating: boolean;
  isClassifying: boolean;
  confidenceScores: Record<ContentType, number>;
  setConfidenceScores: React.Dispatch<
    React.SetStateAction<Record<ContentType, number>>
  >;
}

interface AIUtilsProviderProps {
  children: ReactNode;
}

const AIUtilsContext = createContext<AIUtilsContextType | undefined>(
  undefined
);

export const useAIUtils = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
};

export const AIUtilsProvider: React.FC<AIUtilsProviderProps> = ({ children }) => {
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [modelSize, setModelSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const { toast } = useToast();
  const { aiPreference } = useUserPreferences();
  
  // Initialize confidence scores for all content types
  const [confidenceScores, setConfidenceScores] = useState<Record<ContentType, number>>(
    getInitialConfidenceScores()
  );

  useEffect(() => {
    setIsAIEnabled(aiPreference.enabled);
  }, [aiPreference.enabled]);

  const toggleAI = () => {
    setIsAIEnabled((prev) => !prev);
    toast({
      title: 'AI Features',
      description: `AI features ${
        isAIEnabled ? 'disabled' : 'enabled'
      }. Please refresh the page for changes to take effect.`,
    });
  };

  const analyzeText = async (text: string, contentType: ContentType) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Text analysis complete.');
      return {
        summary: 'This is a summary of the text.',
        keywords: ['keyword1', 'keyword2'],
      };
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: 'Analysis Error',
        description: 'Failed to analyze the text. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const translateText = async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> => {
    setIsTranslating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Text translation complete.');
      return `Translated text from ${sourceLanguage} to ${targetLanguage}.`;
    } catch (error) {
      console.error('Error translating text:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate the text. Please try again.',
        variant: 'destructive',
      });
      return 'Translation failed.';
    } finally {
      setIsTranslating(false);
    }
  };

  const classifyText = async (text: string): Promise<string> => {
    setIsClassifying(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Text classification complete.');
      return 'Classified category.';
    } catch (error) {
      console.error('Error classifying text:', error);
      toast({
        title: 'Classification Error',
        description: 'Failed to classify the text. Please try again.',
        variant: 'destructive',
      });
      return 'Classification failed.';
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <AIUtilsContext.Provider
      value={{
        isAIEnabled,
        toggleAI,
        modelSize,
        setModelSize,
        analyzeText,
        translateText,
        classifyText,
        isProcessing,
        isTranslating,
        isClassifying,
        confidenceScores,
        setConfidenceScores,
      }}
    >
      {children}
    </AIUtilsContext.Provider>
  );
};
