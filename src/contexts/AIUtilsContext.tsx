
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import { useTTS } from '@/hooks/useTTS';
import * as HuggingFace from '@/utils/huggingFaceIntegration';
import { AISettings, ContentType } from '@/types/ai';

export interface AIUtilsContextType {
  // Core state
  isAIEnabled: boolean;
  isLoading: boolean;
  isProcessing: boolean;
  lastQuery: string;
  lastResult: any;
  settings: AISettings;
  enableAI: () => void;
  disableAI: () => void;
  setIsProcessing: (processing: boolean) => void;
  resetSettings: () => Promise<void>;
  
  // Speech functions
  speak: (text: string, language?: 'en' | 'it') => Promise<void>;
  stopSpeaking: () => void;
  
  // Text analysis
  analyzeContent: (text: string, contentType?: ContentType) => Promise<{
    type: ContentType;
    confidence: number;
    language: 'english' | 'italian' | 'unknown';
  }>;
  
  // Translation
  translateText: (text: string, from: 'en' | 'it', to: 'en' | 'it') => Promise<string>;
  
  // Speech recognition
  recognizeSpeech: (audioBlob: Blob) => Promise<string>;
  
  // Text comparison
  compareTexts: (text1: string, text2: string) => Promise<number>;
  
  // Settings management
  updateSettings: (newSettings: Partial<AISettings>) => Promise<void>;
  
  // Model management
  getAvailableModels: () => Promise<string[]>;
  getCurrentModel: () => string;
  setModel: (modelName: string) => Promise<void>;
  checkWebGPUSupport: () => Promise<boolean>;
  
  // Errors handling
  error: Error | null;
  clearError: () => void;
}

export const defaultAISettings: AISettings = {
  defaultModelSize: 'small',
  useWebGPU: true,
  voiceRate: 1.0,
  voicePitch: 1.0,
  italianVoiceURI: '',
  englishVoiceURI: '',
  defaultLanguage: 'english',
  processOnDevice: true,
  useLocalModels: false,
  useCaching: true,
  contentGeneration: true,
  contentAnalysis: true,
  errorCorrection: true,
  personalization: true,
  pronunciationHelp: true,
  conversationalLearning: true,
  progressTracking: true,
  autoTranslation: true,
  sentimentAnalysis: false,
  advancedExplanations: false,
  contentFiltering: true,
};

const AIUtilsContext = createContext<AIUtilsContextType | undefined>(undefined);

export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences } = useUserPreferences();
  const { speakText, stopSpeaking: stopTTS } = useTTS();
  
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [lastResult, setLastResult] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [settings, setSettings] = useState<AISettings>({
    ...defaultAISettings,
  });

  // Initialize settings from preferences if available
  useEffect(() => {
    if (preferences) {
      setSettings(prev => ({
        ...prev,
        defaultLanguage: preferences.language || 'english',
      }));
    }
  }, [preferences]);

  // Initialize HuggingFace integration
  useEffect(() => {
    const initializeAI = async () => {
      if (isAIEnabled) {
        setIsLoading(true);
        try {
          await HuggingFace.initializeHuggingFace();
          // Check WebGPU support and update settings accordingly
          const hasWebGPU = await HuggingFace.checkWebGPUSupport();
          setSettings(prev => ({
            ...prev,
            useWebGPU: hasWebGPU
          }));
        } catch (error) {
          console.error('Failed to initialize AI:', error);
          setError(error instanceof Error ? error : new Error('Failed to initialize AI'));
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeAI();
  }, [isAIEnabled]);

  // Enable AI features
  const enableAI = useCallback(() => {
    setIsAIEnabled(true);
  }, []);

  // Disable AI features
  const disableAI = useCallback(() => {
    setIsAIEnabled(false);
  }, []);

  // Reset settings to defaults
  const resetSettings = useCallback(async () => {
    setSettings(defaultAISettings);
    return Promise.resolve();
  }, []);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<AISettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    return Promise.resolve();
  }, []);

  // Speak text
  const speak = useCallback(async (text: string, language: 'en' | 'it' = 'en') => {
    if (!isAIEnabled) return;
    
    try {
      await speakText(text, {
        language,
        rate: settings.voiceRate,
        pitch: settings.voicePitch,
        voiceURI: language === 'en' ? settings.englishVoiceURI : settings.italianVoiceURI
      });
    } catch (error) {
      console.error('Error in speak function:', error);
      setError(error instanceof Error ? error : new Error('Failed to speak text'));
    }
  }, [isAIEnabled, speakText, settings]);

  // Analyze content
  const analyzeContent = useCallback(async (text: string, contentType?: ContentType) => {
    if (!isAIEnabled) {
      return {
        type: contentType || 'flashcards',
        confidence: 100,
        language: 'english'
      };
    }

    setIsProcessing(true);
    setLastQuery(text);
    
    try {
      // Use simple heuristics for language detection
      const italianWords = ["il", "la", "i", "gli", "le", "un", "uno", "una", "e", "è", "ma", "se", "perché", "come", "quando"];
      const words = text.toLowerCase().split(/\s+/);
      const italianWordCount = words.filter(word => italianWords.includes(word)).length;
      const language = italianWordCount > 3 ? 'italian' : 'english';

      // Use simple heuristics for content type detection if not specified
      let type = contentType || 'flashcards';
      let confidence = 70; // Default confidence

      if (!contentType) {
        if (text.includes('?') && (text.includes('1)') || text.includes('A)') || text.includes('a)'))) {
          type = 'multiple-choice';
          confidence = 85;
        } else if (text.includes(':') && text.split('\n').length > 3) {
          type = 'flashcards';
          confidence = 90;
        } else if (text.length > 200 && !text.includes('?')) {
          type = 'writing';
          confidence = 75;
        } else if (text.includes('Listen') || text.includes('Audio')) {
          type = 'listening';
          confidence = 80;
        } else if (text.includes('Speak') || text.includes('Pronounce')) {
          type = 'speaking';
          confidence = 80;
        }
      }

      const result = {
        type,
        confidence,
        language: language as 'english' | 'italian' | 'unknown'
      };

      setLastResult(result);
      return result;
    } catch (error) {
      console.error('Error analyzing content:', error);
      setError(error instanceof Error ? error : new Error('Failed to analyze content'));
      return {
        type: contentType || 'flashcards',
        confidence: 50,
        language: 'unknown' as 'english' | 'italian' | 'unknown'
      };
    } finally {
      setIsProcessing(false);
    }
  }, [isAIEnabled]);

  // Translate text using HuggingFace models
  const translateText = useCallback(async (text: string, from: 'en' | 'it', to: 'en' | 'it') => {
    if (!isAIEnabled) return text;
    
    setIsProcessing(true);
    setLastQuery(text);
    
    try {
      const translatedText = await HuggingFace.translateText(text, from, to);
      setLastResult(translatedText);
      return translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      setError(error instanceof Error ? error : new Error('Failed to translate text'));
      return text;
    } finally {
      setIsProcessing(false);
    }
  }, [isAIEnabled]);

  // Recognize speech from audio blob
  const recognizeSpeech = useCallback(async (audioBlob: Blob) => {
    if (!isAIEnabled) return '';
    
    setIsProcessing(true);
    
    try {
      const result = await HuggingFace.recognizeSpeech(audioBlob);
      setLastResult(result.text);
      return result.text;
    } catch (error) {
      console.error('Error recognizing speech:', error);
      setError(error instanceof Error ? error : new Error('Failed to recognize speech'));
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [isAIEnabled]);

  // Compare two texts for similarity
  const compareTexts = useCallback(async (text1: string, text2: string) => {
    if (!isAIEnabled) return 0.8; // Default similarity score
    
    setIsProcessing(true);
    
    try {
      const similarity = await HuggingFace.getTextSimilarity(text1, text2);
      return similarity;
    } catch (error) {
      console.error('Error comparing texts:', error);
      setError(error instanceof Error ? error : new Error('Failed to compare texts'));
      return 0.5; // Fallback similarity score
    } finally {
      setIsProcessing(false);
    }
  }, [isAIEnabled]);

  // Get available models
  const getAvailableModels = useCallback(async () => {
    // This would normally fetch available models from the API
    return Promise.resolve([
      'mixedbread-ai/mxbai-embed-xsmall-v1',
      'onnx-community/whisper-tiny.en',
      'Helsinki-NLP/opus-mt-en-it',
      'Helsinki-NLP/opus-mt-it-en',
      'distilbert-base-uncased-finetuned-sst-2-english'
    ]);
  }, []);

  // Get current model
  const getCurrentModel = useCallback(() => {
    return settings.defaultModelSize;
  }, [settings.defaultModelSize]);

  // Set model
  const setModel = useCallback(async (modelName: string) => {
    setSettings(prev => ({
      ...prev,
      defaultModelSize: modelName
    }));
    return Promise.resolve();
  }, []);

  // Check WebGPU support
  const checkWebGPUSupport = useCallback(async () => {
    return HuggingFace.checkWebGPUSupport();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AIUtilsContextType = {
    isAIEnabled,
    isLoading,
    isProcessing,
    lastQuery,
    lastResult,
    settings,
    error,
    enableAI,
    disableAI,
    setIsProcessing,
    resetSettings,
    speak,
    stopSpeaking: stopTTS,
    analyzeContent,
    translateText,
    recognizeSpeech,
    compareTexts,
    updateSettings,
    getAvailableModels,
    getCurrentModel,
    setModel,
    checkWebGPUSupport,
    clearError
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

// Custom hook to use the AIUtils context
export const useAIUtils = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  if (context === undefined) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
};

export default useAIUtils;
