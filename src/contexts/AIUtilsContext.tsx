
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAI } from '@/hooks/useAI';
import { ContentType } from '@/utils/textAnalysis';

export interface AIContextData {
  isAIEnabled: boolean;
  toggleAI: () => boolean;
  modelSize: 'small' | 'medium' | 'large';
  setModelSize: (size: 'small' | 'medium' | 'large') => void;
  confidenceScores: Record<ContentType, number>;
  isProcessing: boolean;
  lastGeneratedResults: any[];
  clearResults: () => void;
  storeResults: (results: any[]) => void;
  updateConfidenceScore: (contentType: ContentType, score: number) => void;
  transcribeAudio?: (audioData: Blob) => Promise<string>;
  translateText?: (text: string, sourceLang: string, targetLang: string) => Promise<string>;
}

const defaultContextData: AIContextData = {
  isAIEnabled: false,
  toggleAI: () => false,
  modelSize: 'medium',
  setModelSize: () => {},
  confidenceScores: {
    'multiple-choice': 85,
    'flashcards': 78, 
    'writing': 72,
    'speaking': 68,
    'listening': 80
  },
  isProcessing: false,
  lastGeneratedResults: [],
  clearResults: () => {},
  storeResults: () => {},
  updateConfidenceScore: () => {},
};

const AIUtilsContext = createContext<AIContextData>(defaultContextData);

export const useAIUtils = () => useContext(AIUtilsContext);

export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(true);
  const [modelSize, setModelSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [confidenceScores, setConfidenceScores] = useState<Record<ContentType, number>>(defaultContextData.confidenceScores);
  const [lastGeneratedResults, setLastGeneratedResults] = useState<any[]>([]);
  
  const { isProcessing, toggleAI, isModelLoaded } = useAI();
  const { toast } = useToast();
  
  useEffect(() => {
    setIsAIEnabled(isModelLoaded);
  }, [isModelLoaded]);
  
  const handleToggleAI = () => {
    const newState = toggleAI();
    setIsAIEnabled(newState);
    
    toast({
      title: newState ? "AI Enabled" : "AI Disabled",
      description: newState 
        ? "AI features are now enabled for your session." 
        : "AI features have been disabled.",
    });
    
    return newState;
  };
  
  const handleSetModelSize = (size: 'small' | 'medium' | 'large') => {
    setModelSize(size);
    
    toast({
      title: "Model Size Updated",
      description: `AI model size has been set to ${size}.`,
    });
  };
  
  const updateConfidenceScore = (contentType: ContentType, score: number) => {
    setConfidenceScores(prev => ({
      ...prev,
      [contentType]: score
    }));
  };
  
  const storeResults = (results: any[]) => {
    setLastGeneratedResults(results);
  };
  
  const clearResults = () => {
    setLastGeneratedResults([]);
  };
  
  // Translation function
  const translateText = useCallback(async (
    text: string, 
    sourceLang: string = 'it', 
    targetLang: string = 'en'
  ): Promise<string> => {
    if (!isAIEnabled) {
      throw new Error('AI features are disabled. Enable them in settings.');
    }
    
    try {
      // This is a placeholder - in a real app, you would use an actual AI model or API
      // Mock translation for testing purposes
      if (sourceLang === 'it' && targetLang === 'en') {
        // Common Italian words mock translation
        const translations: Record<string, string> = {
          'ciao': 'hello',
          'grazie': 'thank you',
          'casa': 'house',
          'gatto': 'cat',
          'cane': 'dog',
          'buongiorno': 'good morning',
          'arrivederci': 'goodbye',
          'piacere': 'pleasure',
          'come stai': 'how are you',
          'bene': 'well',
        };
        
        // Very simple word-by-word translation for demo purposes
        const words = text.toLowerCase().split(' ');
        const translatedWords = words.map(word => {
          const cleanWord = word.replace(/[.,?!;:]/g, '');
          const translation = translations[cleanWord] || word;
          // Preserve punctuation
          const punctuation = word.substring(cleanWord.length);
          return translation + punctuation;
        });
        
        return translatedWords.join(' ');
      }
      
      // For other language combinations, just return the original text
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text. Please try again.');
    }
  }, [isAIEnabled]);
  
  // Audio transcription (speech-to-text)
  const transcribeAudio = useCallback(async (audioData: Blob): Promise<string> => {
    if (!isAIEnabled) {
      throw new Error('AI features are disabled. Enable them in settings.');
    }
    
    try {
      // In a real app, you would send the audio to an AI service for transcription
      // For now, we'll just pretend it worked
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return a mock result
      return "This is a simulated transcription result. In a production app, this would be the actual text transcribed from your audio.";
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }, [isAIEnabled]);
  
  const contextValue: AIContextData = {
    isAIEnabled,
    toggleAI: handleToggleAI,
    modelSize,
    setModelSize: handleSetModelSize,
    confidenceScores,
    isProcessing,
    lastGeneratedResults,
    clearResults,
    storeResults,
    updateConfidenceScore,
    translateText,
    transcribeAudio
  };
  
  return (
    <AIUtilsContext.Provider value={contextValue}>
      {children}
    </AIUtilsContext.Provider>
  );
};
