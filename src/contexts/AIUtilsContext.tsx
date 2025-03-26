
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ContentType } from '@/types/contentType';
import { AIPreference, AIUtilsContextType } from '@/types/interface-fixes';
import AIService, { getConfidenceScore } from '@/services/AIService';

// Default AI preferences
const defaultAIPreference: AIPreference = {
  enabled: true,
  modelSize: 'medium',
  cacheResponses: true,
  voiceEnabled: true,
  defaultLanguage: 'english',
  voiceRate: 1.0,
  voicePitch: 1.0,
  italianVoiceURI: '',
  englishVoiceURI: '',
  defaultModelSize: 'medium',
  useWebGPU: false,
  anonymousAnalytics: true,
  processOnDevice: false,
  cacheModels: true,
  temperature: 0.7,
  contentFiltering: true,
  dataCollection: false,
  assistanceLevel: 'intermediate',
  processingSetting: 'balanced',
  autoLoadModels: false
};

// Default feedback settings
const defaultFeedbackSettings = {
  detailedFeedback: true,
  includeExamples: true,
  suggestCorrections: true,
  language: 'english',
  feedbackLevel: 'intermediate'
};

// Create context
const AIUtilsContext = createContext<AIUtilsContextType>({
  settings: defaultAIPreference,
  updateSettings: () => {},
  speakText: async () => {},
  stopSpeaking: () => {},
  voices: [],
  isLoading: false,
  isModelLoaded: false,
  isProcessing: false,
  status: 'idle',
  feedbackSettings: defaultFeedbackSettings,
  updateFeedbackSettings: () => {},
  confidenceScores: {
    'multiple-choice': 78,
    'flashcards': 82,
    'writing': 69,
    'speaking': 74,
    'listening': 65
  },
  updateConfidenceScore: () => {},
  resetSettings: () => {},
  trainingData: [],
  addTrainingExample: () => {},
  loadModel: async () => false
});

// Provider component
export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AIPreference>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('ai-preferences');
    return savedSettings ? { ...defaultAIPreference, ...JSON.parse(savedSettings) } : defaultAIPreference;
  });
  
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('idle');
  const [feedbackSettings, setFeedbackSettings] = useState(defaultFeedbackSettings);
  const [confidenceScores, setConfidenceScores] = useState<Record<ContentType, number>>({
    'multiple-choice': getConfidenceScore('multiple-choice'),
    'flashcards': getConfidenceScore('flashcards'),
    'writing': getConfidenceScore('writing'),
    'speaking': getConfidenceScore('speaking'),
    'listening': getConfidenceScore('listening')
  });
  const [trainingData, setTrainingData] = useState<any[]>([]);
  
  // Initialize voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default voice URIs if not set
      if (!settings.italianVoiceURI || !settings.englishVoiceURI) {
        const italianVoice = availableVoices.find(voice => voice.lang === 'it-IT') || availableVoices[0];
        const englishVoice = availableVoices.find(voice => voice.lang === 'en-US') || availableVoices[0];
        
        setSettings(prev => ({
          ...prev,
          italianVoiceURI: italianVoice?.voiceURI || '',
          englishVoiceURI: englishVoice?.voiceURI || ''
        }));
      }
    };
    
    // Load voices immediately if available
    loadVoices();
    
    // Chrome loads voices asynchronously, so we need to listen for the voiceschanged event
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('ai-preferences', JSON.stringify(settings));
  }, [settings]);
  
  // Update settings
  const updateSettings = useCallback((newSettings: Partial<AIPreference>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    setSettings(defaultAIPreference);
    setFeedbackSettings(defaultFeedbackSettings);
  }, []);
  
  // Update feedback settings
  const updateFeedbackSettings = useCallback((newSettings: any) => {
    setFeedbackSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  // Update confidence score for a content type
  const updateConfidenceScore = useCallback((contentType: ContentType, score: number) => {
    setConfidenceScores(prev => ({ ...prev, [contentType]: score }));
  }, []);
  
  // Add training example
  const addTrainingExample = useCallback((example: any) => {
    setTrainingData(prev => [...prev, example]);
  }, []);
  
  // Speak text using the Web Speech API
  const speakText = useCallback(async (text: string, language: 'english' | 'italian' = 'english') => {
    if (!settings.voiceEnabled) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceURI = language === 'italian' ? settings.italianVoiceURI : settings.englishVoiceURI;
    
    // Set voice if available
    if (voiceURI) {
      const voice = voices.find(v => v.voiceURI === voiceURI);
      if (voice) utterance.voice = voice;
    }
    
    // Set other speech settings
    utterance.rate = settings.voiceRate;
    utterance.pitch = settings.voicePitch;
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
    
    // Return a promise that resolves when speech is complete
    return new Promise<void>((resolve) => {
      utterance.onend = () => resolve();
    });
  }, [settings, voices]);
  
  // Stop speaking
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);
  
  // Load model
  const loadModel = useCallback(async (modelName: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setStatus(`Loading model: ${modelName}...`);
      
      // Simulate model loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsModelLoaded(true);
      setStatus('Model loaded successfully');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      setStatus('Error loading model');
      setIsLoading(false);
      return false;
    }
  }, []);
  
  const value = {
    settings,
    updateSettings,
    speakText,
    stopSpeaking,
    voices,
    isLoading,
    isModelLoaded,
    isProcessing,
    status,
    feedbackSettings,
    updateFeedbackSettings,
    confidenceScores,
    updateConfidenceScore,
    resetSettings,
    trainingData,
    addTrainingExample,
    loadModel
  };
  
  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

// Hook for using the AI utils context
export const useAIUtils = () => {
  const context = useContext(AIUtilsContext);
  if (context === undefined) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
};

export default AIUtilsContext;
