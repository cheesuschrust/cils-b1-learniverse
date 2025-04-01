
import React, { createContext, useContext, useState } from 'react';
import { 
  AIUtilsContextType, 
  AISettings, 
  AIGenerationResult,
  QuestionGenerationParams
} from '@/types/core-types';
import { useAIUtils } from '@/hooks/useAIUtils';

// Create context with default undefined value
const AIUtilsContext = createContext<AIUtilsContextType | undefined>(undefined);

// Default AI settings
const defaultAISettings: AISettings = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000,
  topP: 0.9,
  frequencyPenalty: 0.5,
  presencePenalty: 0.5,
  contentFiltering: true
};

// Provider component
export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AISettings>(defaultAISettings);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get base AI utils
  const {
    generateQuestions,
    isGenerating,
    remainingCredits,
    usageLimit,
    loadModel,
    speak,
    recognizeSpeech,
    compareTexts,
    processContent,
    isAIEnabled,
    status,
    isModelLoaded
  } = useAIUtils();

  // Update AI settings
  const updateSettings = (newSettings: Partial<AISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Generate content based on prompt
  const generateContent = async (prompt: string, options?: any): Promise<string> => {
    setIsProcessing(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = `Generated content based on prompt: ${prompt.substring(0, 20)}...`;
      setIsProcessing(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsProcessing(false);
      throw err;
    }
  };

  // Process audio stream
  const processAudioStream = async (stream: MediaStream): Promise<string> => {
    setIsProcessing(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = "This is a mock audio transcription";
      setIsProcessing(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsProcessing(false);
      throw err;
    }
  };

  // Get available speech synthesis voices
  const getVoices = (): SpeechSynthesisVoice[] => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  };

  // Stop speech synthesis
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Detect language of text
  const detectLanguage = async (text: string): Promise<string> => {
    // Mock implementation
    if (text.match(/[àèéìíòóùú]/)) return 'italian';
    return 'english';
  };

  // Get confidence level for content type
  const getConfidenceLevel = async (text: string, type: string): Promise<number> => {
    // Mock implementation
    return 0.85;
  };

  // Create text embeddings
  const createEmbeddings = async (text: string): Promise<number[]> => {
    // Mock implementation
    return Array(128).fill(0).map(() => Math.random());
  };

  // Compare similarity between texts
  const compareSimilarity = async (text1: string, text2: string): Promise<number> => {
    // Mock implementation
    return 0.7 + Math.random() * 0.3;
  };

  // Classify text
  const classifyText = async (text: string): Promise<any> => {
    setIsProcessing(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = [
        { label: 'Grammar', score: 0.85 },
        { label: 'Vocabulary', score: 0.76 },
        { label: 'Fluency', score: 0.92 }
      ];
      setIsProcessing(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsProcessing(false);
      throw err;
    }
  };

  // Generate flashcards
  const generateFlashcards = async (topic: string, count: number = 5, difficulty: string = 'intermediate') => {
    setIsProcessing(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const cards = Array(count).fill(null).map((_, i) => ({
        id: `flashcard-${i}`,
        front: `Italian term ${i + 1} for ${topic}`,
        back: `English definition ${i + 1} for ${topic}`,
        italian: `Italian term ${i + 1} for ${topic}`,
        english: `English definition ${i + 1} for ${topic}`,
        difficulty: 1,
        level: 1,
        mastered: false,
        tags: [topic, difficulty],
        nextReview: new Date(),
        lastReviewed: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      setIsProcessing(false);
      return cards;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsProcessing(false);
      throw err;
    }
  };

  // Text translation
  const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    setIsProcessing(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = `Translated text (to ${targetLanguage}): ${text.substring(0, 20)}...`;
      setIsProcessing(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsProcessing(false);
      throw err;
    }
  };

  // Analyze grammar
  const analyzeGrammar = async (text: string, language: string): Promise<any> => {
    setIsProcessing(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = {
        correctness: 0.85,
        errors: [],
        suggestions: []
      };
      setIsProcessing(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsProcessing(false);
      throw err;
    }
  };

  // Abort ongoing operations
  const abort = () => {
    console.log('Aborting ongoing AI operations');
    setIsProcessing(false);
    setIsSpeaking(false);
  };

  const value: AIUtilsContextType = {
    generateQuestions,
    isGenerating,
    remainingCredits,
    usageLimit,
    loadModel,
    speak,
    recognizeSpeech,
    compareTexts,
    processContent,
    isAIEnabled,
    status,
    isModelLoaded,
    settings,
    updateSettings,
    generateContent,
    isSpeaking,
    processAudioStream,
    translateText,
    analyzeGrammar,
    getVoices,
    stopSpeaking,
    detectLanguage,
    getConfidenceLevel,
    createEmbeddings,
    compareSimilarity,
    isProcessing,
    error,
    abort,
    classifyText,
    generateFlashcards
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

// Hook for using AI utils
export const useAIUtilsContext = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  
  if (!context) {
    throw new Error('useAIUtilsContext must be used within an AIUtilsProvider');
  }
  
  return context;
};
