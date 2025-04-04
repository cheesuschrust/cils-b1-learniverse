
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AIProcessingOptions, QuestionGenerationParams, UseAIReturn } from '@/types/core-types';
import { AISettings } from '@/types/app-types';

interface AIUtilsContextType {
  settings: AISettings;
  updateSettings: (settings: Partial<AISettings>) => void;
  getSpeechVoice: (language: string) => SpeechSynthesisVoice | null;
  speakText: (text: string, options?: any) => void;
  stopSpeaking: () => void;
  isLoading: boolean;
  processContent: (content: string, options?: AIProcessingOptions) => Promise<{label: string, score: number}[]>;
  generateQuestions: (params: QuestionGenerationParams) => Promise<any[]>;
  analyzeGrammar: (text: string, language?: string) => Promise<any>;
  translateText: (text: string, targetLanguage?: string) => Promise<string>;
  generateText: (prompt: string, options?: any) => Promise<string>;
  evaluateWriting: (text: string, level?: string) => Promise<any>;
  isProcessing: boolean;
}

const defaultSettings: AISettings = {
  modelSize: 'medium',
  useGPU: false,
  voiceEnabled: true,
  autoTranslate: false,
  feedbackLevel: 'detailed',
  confidenceDisplay: true,
  language: 'italian',
  pronunciation: true,
  grammar: true,
  vocabulary: true
};

const AIUtilsContext = createContext<AIUtilsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  getSpeechVoice: () => null,
  speakText: () => {},
  stopSpeaking: () => {},
  isLoading: false,
  processContent: async () => [],
  generateQuestions: async () => [],
  analyzeGrammar: async () => ({}),
  translateText: async () => "",
  generateText: async () => "",
  evaluateWriting: async () => ({}),
  isProcessing: false
});

export const AIUtilsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [settings, setSettings] = useState<AISettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple implementation of the context methods
  const updateSettings = useCallback((newSettings: Partial<AISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const getSpeechVoice = useCallback((language: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    return voices.find(voice => voice.lang.includes(language)) || null;
  }, []);

  const speakText = useCallback((text: string, options?: any) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (options?.language) {
      const voice = getSpeechVoice(options.language);
      if (voice) utterance.voice = voice;
    }
    
    if (options?.rate) utterance.rate = options.rate;
    if (options?.pitch) utterance.pitch = options.pitch;
    if (options?.volume) utterance.volume = options.volume;
    
    window.speechSynthesis.speak(utterance);
  }, [getSpeechVoice]);

  const stopSpeaking = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }, []);

  // Mocked API functions for content processing and questions
  const processContent = useCallback(async (content: string, options?: AIProcessingOptions) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data with CILS B1 alignment
      const level = options?.level || 'intermediate';
      let score = 0;
      
      if (level === 'beginner') score = 80;
      else if (level === 'intermediate') score = 65; // B1 level
      else score = 40;
      
      return [{ label: 'CILS B1 Alignment', score }];
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const generateQuestions = useCallback(async (params: QuestionGenerationParams) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock questions
      return Array(params.count).fill(0).map((_, i) => ({
        id: `q-${i}`,
        text: `Sample ${params.difficulty} question about ${params.topics[0] || 'Italian'}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: 'This is important for CILS B1 certification.',
        type: params.contentTypes[0] || 'grammar',
        difficulty: params.difficulty,
        questionType: 'multiple-choice',
        isCitizenshipRelevant: params.isCitizenshipFocused || false
      }));
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const analyzeGrammar = useCallback(async (text: string, language?: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        score: 75,
        feedback: 'Good grammar usage overall.',
        corrections: [
          { original: 'io va', suggested: 'io vado', explanation: 'Correct verb conjugation for first person singular.' }
        ]
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const translateText = useCallback(async (text: string, targetLanguage?: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return `Translated: ${text}`;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const generateText = useCallback(async (prompt: string, options?: any) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return `Generated content based on: ${prompt}`;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const evaluateWriting = useCallback(async (text: string, level?: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        score: 70,
        feedback: 'Good effort! Your writing shows intermediate proficiency.',
        strengths: ['Good vocabulary usage', 'Decent sentence structure'],
        weaknesses: ['Some grammar issues', 'Limited advanced expressions'],
        cilsB1Alignment: 75
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <AIUtilsContext.Provider value={{
      settings,
      updateSettings,
      getSpeechVoice,
      speakText,
      stopSpeaking,
      isLoading,
      processContent,
      generateQuestions,
      analyzeGrammar,
      translateText,
      generateText,
      evaluateWriting,
      isProcessing
    }}>
      {children}
    </AIUtilsContext.Provider>
  );
};

export const useAIUtils = () => useContext(AIUtilsContext);

export default AIUtilsContext;
