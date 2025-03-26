
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ContentType } from '@/types/contentType';

// Define the types for AI settings
interface AISettings {
  enabled: boolean;
  model: string;
  temperature: number;
  responseLength: number;
  contextWindow: number;
  learningStyle: string;
  contentTypes: string[];
  preferredVoice: string;
  assistantName: string;
  feedbackLevel: 'detailed' | 'summary' | 'minimal';
}

// Define the context type
interface AIUtilsContextType {
  settings: AISettings;
  updateSettings: (newSettings: Partial<AISettings>) => void;
  resetSettings: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  lastQuery: string;
  setLastQuery: (query: string) => void;
  generateContent: (prompt: string, type: string) => Promise<string>;
  analyzePerformance: (data: any) => Promise<any>;
  isAIEnabled: boolean;
  toggleAI: () => boolean;
  speakText: (text: string, language?: string) => Promise<void>;
  isSpeaking: boolean; 
  cancelSpeech: () => void;
  processAudioStream: (callback: (transcript: string, isFinal: boolean) => void) => Promise<() => void>;
  stopAudioProcessing: () => void;
  isTranscribing: boolean;
  translateText: (text: string, targetLang: 'english' | 'italian') => Promise<string>;
  isTranslating: boolean;
  hasActiveMicrophone: boolean;
  checkMicrophoneAccess: () => Promise<boolean>;
}

// Default settings
const defaultSettings: AISettings = {
  enabled: true,
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  responseLength: 250,
  contextWindow: 5,
  learningStyle: 'balanced',
  contentTypes: ['writing', 'speaking', 'listening', 'multiple-choice', 'flashcards'],
  preferredVoice: 'natural',
  assistantName: 'LinguaAssistant',
  feedbackLevel: 'summary'
};

// Create the context with default values
const AIUtilsContext = createContext<AIUtilsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  lastQuery: '',
  setLastQuery: () => {},
  generateContent: async () => '',
  analyzePerformance: async () => ({}),
  isAIEnabled: true,
  toggleAI: () => true,
  speakText: async () => {},
  isSpeaking: false,
  cancelSpeech: () => {},
  processAudioStream: async () => () => {},
  stopAudioProcessing: () => {},
  isTranscribing: false,
  translateText: async () => '',
  isTranslating: false,
  hasActiveMicrophone: false,
  checkMicrophoneAccess: async () => false
});

// Provider component
export const AIUtilsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Load settings from local storage or use defaults
  const [settings, setSettings] = useState<AISettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem('ai-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState(false);

  // Flag for AI features enabled/disabled
  const isAIEnabled = settings.enabled;

  // Toggle AI features on/off
  const toggleAI = useCallback(() => {
    const newEnabled = !settings.enabled;
    updateSettings({ enabled: newEnabled });
    return newEnabled;
  }, [settings.enabled]);

  // Update settings and save to localStorage
  const updateSettings = (newSettings: Partial<AISettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('ai-settings', JSON.stringify(updatedSettings));
  };

  // Reset settings to default
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('ai-settings', JSON.stringify(defaultSettings));
  };

  // Simulate content generation
  const generateContent = async (prompt: string, type: string): Promise<string> => {
    if (!settings.enabled) {
      return "AI features are currently disabled. Enable them in settings to use this feature.";
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = `Generated ${type} content based on: "${prompt}"`;
      return response;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate performance analysis
  const analyzePerformance = async (data: any): Promise<any> => {
    if (!settings.enabled) {
      return {
        error: "AI features are disabled",
        message: "Enable AI features in settings to use performance analysis."
      };
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        strengths: ['Vocabulary usage', 'Grammar application'],
        weaknesses: ['Pronunciation', 'Listening comprehension'],
        recommendations: ['Practice more listening exercises', 'Focus on pronunciation drills']
      };
    } catch (error) {
      console.error('Error analyzing performance:', error);
      throw new Error('Failed to analyze performance');
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-speech functionality
  const speakText = async (text: string, language = 'it-IT'): Promise<void> => {
    if (!settings.enabled) {
      throw new Error('AI features are disabled');
    }
    
    try {
      // Cancel any ongoing speech
      if (isSpeaking) {
        cancelSpeech();
      }
      
      setIsSpeaking(true);
      
      // Use browser's built-in speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      
      // Set voice if specified and available
      if (settings.preferredVoice !== 'default') {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes(settings.preferredVoice.toLowerCase())
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      // Create a promise that resolves when speech ends
      const speechPromise = new Promise<void>((resolve) => {
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        utterance.onerror = (event) => {
          console.error('Speech error:', event);
          setIsSpeaking(false);
          resolve(); // Resolve anyway to prevent hanging promises
        };
      });
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      
      return speechPromise;
    } catch (error) {
      setIsSpeaking(false);
      console.error('Error speaking text:', error);
      throw new Error('Failed to speak text');
    }
  };

  // Cancel any ongoing speech
  const cancelSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Process audio for speech recognition
  const processAudioStream = async (callback: (transcript: string, isFinal: boolean) => void): Promise<() => void> => {
    if (!settings.enabled) {
      throw new Error('AI features are disabled');
    }
    
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition is not supported in this browser');
    }
    
    try {
      setIsTranscribing(true);
      
      // @ts-ignore - SpeechRecognition is not in the standard lib.dom yet
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript;
        const isFinal = lastResult.isFinal;
        
        callback(transcript, isFinal);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsTranscribing(false);
        throw new Error(`Speech recognition error: ${event.error}`);
      };
      
      recognition.onend = () => {
        setIsTranscribing(false);
      };
      
      // Start listening
      recognition.start();
      
      // Return a function to stop listening
      return () => {
        recognition.stop();
        setIsTranscribing(false);
      };
    } catch (error) {
      setIsTranscribing(false);
      console.error('Error starting speech recognition:', error);
      throw new Error('Failed to start speech recognition');
    }
  };

  // Stop audio processing
  const stopAudioProcessing = () => {
    // This is a placeholder - the actual stop function is returned by processAudioStream
    // This function is useful for cases where you don't have access to the returned stop function
    setIsTranscribing(false);
  };

  // Translate text between languages
  const translateText = async (text: string, targetLang: 'english' | 'italian'): Promise<string> => {
    if (!settings.enabled) {
      throw new Error('AI features are disabled');
    }
    
    setIsTranslating(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple word replacement for demo purposes
      const italianWords = {
        hello: 'ciao',
        goodbye: 'arrivederci',
        please: 'per favore',
        thanks: 'grazie',
        yes: 'sì',
        no: 'no'
      };
      
      const englishWords = {
        ciao: 'hello',
        arrivederci: 'goodbye',
        'per favore': 'please',
        grazie: 'thanks',
        sì: 'yes',
        no: 'no'
      };
      
      // Very simple translation demo
      let translatedText = text;
      
      if (targetLang === 'italian') {
        Object.entries(italianWords).forEach(([en, it]) => {
          translatedText = translatedText.replace(new RegExp(`\\b${en}\\b`, 'gi'), it);
        });
      } else {
        Object.entries(englishWords).forEach(([it, en]) => {
          translatedText = translatedText.replace(new RegExp(`\\b${it}\\b`, 'gi'), en);
        });
      }
      
      return `[Translated to ${targetLang}]: ${translatedText}`;
    } catch (error) {
      console.error('Error translating text:', error);
      throw new Error('Failed to translate text');
    } finally {
      setIsTranslating(false);
    }
  };

  // Check microphone access
  const checkMicrophoneAccess = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
      setHasActiveMicrophone(true);
      return true;
    } catch (error) {
      console.error('Microphone access error:', error);
      setHasActiveMicrophone(false);
      return false;
    }
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
    isProcessing,
    setIsProcessing,
    lastQuery,
    setLastQuery,
    generateContent,
    analyzePerformance,
    isAIEnabled,
    toggleAI,
    speakText,
    isSpeaking,
    cancelSpeech,
    processAudioStream,
    stopAudioProcessing,
    isTranscribing,
    translateText,
    isTranslating,
    hasActiveMicrophone,
    checkMicrophoneAccess
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

// Custom hook to use the context
export const useAIUtils = () => {
  const context = useContext(AIUtilsContext);
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
};

export default AIUtilsContext;
