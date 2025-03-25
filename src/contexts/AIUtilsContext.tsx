
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import { ContentType } from '@/types/contentType';
import { getInitialConfidenceScores, AIPreferences, getDefaultAIPreferences } from '@/components/ai/AISettingsTypes';
import * as AIService from '@/services/AIService';
import * as HuggingFaceService from '@/services/HuggingFaceService';

// Type definitions
export interface AIUtilsContextType {
  isAIEnabled: boolean;
  toggleAI: () => void;
  speakText: (text: string, language?: string) => Promise<void>;
  isSpeaking: boolean;
  cancelSpeech: () => void;
  processAudioStream: (callback: (transcript: string, isFinal: boolean) => void) => Promise<() => void>;
  stopAudioProcessing: () => void;
  isTranscribing: boolean;
  modelSize: 'small' | 'medium' | 'large';
  setModelSize: (size: 'small' | 'medium' | 'large') => void;
  confidenceScores: Record<ContentType, number>;
  isProcessing: boolean;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  isTranslating: boolean;
}

// Create the context with a default value
const AIUtilsContext = createContext<AIUtilsContextType | undefined>(undefined);

// Provider component
export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { aiPreference } = useUserPreferences();
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modelSize, setModelSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [confidenceScores, setConfidenceScores] = useState<Record<ContentType, number>>(
    getInitialConfidenceScores()
  );
  
  // Set default preferences if not available
  const preferences = aiPreference || getDefaultAIPreferences();
  
  // Initialize AI service when the component mounts
  useEffect(() => {
    const initAI = async () => {
      try {
        await AIService.initialize({
          preloadModels: [],
          useWebGPU: true
        });
        console.log('AI service initialized');
      } catch (error) {
        console.error('Failed to initialize AI service:', error);
      }
    };
    
    initAI();
  }, []);

  // Toggle AI functionality
  const toggleAI = () => {
    setIsAIEnabled(prev => !prev);
  };

  // Text-to-speech function
  const speakText = async (text: string, language = 'en-US'): Promise<void> => {
    if (!isAIEnabled) {
      throw new Error("AI features are currently disabled");
    }
    
    try {
      setIsSpeaking(true);
      
      // Simple implementation using Web Speech API
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = preferences.voiceRate || 1;
      utterance.pitch = preferences.voicePitch || 1;
      
      // Select voice based on language
      if (language.startsWith('it') && preferences.italianVoiceURI) {
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.voiceURI === preferences.italianVoiceURI);
        if (selectedVoice) utterance.voice = selectedVoice;
      } else if (preferences.englishVoiceURI) {
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.voiceURI === preferences.englishVoiceURI);
        if (selectedVoice) utterance.voice = selectedVoice;
      }
      
      // Handle completion
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      setIsSpeaking(false);
      throw error;
    }
  };
  
  // Cancel speech
  const cancelSpeech = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };
  
  // Process audio for speech recognition
  const processAudioStream = async (callback: (transcript: string, isFinal: boolean) => void): Promise<() => void> => {
    if (!isAIEnabled) {
      throw new Error("AI features are currently disabled");
    }
    
    try {
      setIsTranscribing(true);
      
      // If HuggingFace's models are loaded, use those for speech recognition
      // Otherwise, fall back to Web Speech API
      
      // Currently, HuggingFace's ASR models require audio files, not streams
      // So we'll use Web Speech API for streaming recognition
      const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error("Speech recognition not supported in this browser");
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        const isFinal = event.results[0].isFinal;
        callback(transcript, isFinal);
        
        if (isFinal) {
          recognition.stop();
          setIsTranscribing(false);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        setIsTranscribing(false);
        throw new Error(`Speech recognition error: ${event.error}`);
      };
      
      recognition.onend = () => {
        setIsTranscribing(false);
      };
      
      recognition.start();
      
      // Return function to stop recording
      return () => {
        recognition.stop();
        setIsTranscribing(false);
      };
    } catch (error) {
      setIsTranscribing(false);
      throw error;
    }
  };
  
  // Stop audio processing
  const stopAudioProcessing = () => {
    setIsTranscribing(false);
    // Additional cleanup if needed
  };

  // Translation function
  const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    if (!isAIEnabled) {
      throw new Error("AI features are currently disabled");
    }
    
    try {
      setIsTranslating(true);
      
      // Use HuggingFace translation if available
      const sourceLanguage = targetLanguage === 'it' ? 'en' : 'it';
      const translatedText = await HuggingFaceService.translateText(text, sourceLanguage, targetLanguage);
      
      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      
      // Fallback translation for common phrases
      if (text === "Hello" && targetLanguage === "it") {
        return "Ciao";
      } else if (text === "Thank you" && targetLanguage === "it") {
        return "Grazie";
      } else if (text === "Goodbye" && targetLanguage === "it") {
        return "Arrivederci";
      } else if (text === "Ciao" && targetLanguage === "en") {
        return "Hello";
      } else if (text === "Grazie" && targetLanguage === "en") {
        return "Thank you";
      } else if (text === "Arrivederci" && targetLanguage === "en") {
        return "Goodbye";
      }
      
      throw error;
    } finally {
      setIsTranslating(false);
    }
  };
  
  // Context value
  const value: AIUtilsContextType = {
    isAIEnabled,
    toggleAI,
    speakText,
    isSpeaking,
    cancelSpeech,
    processAudioStream,
    stopAudioProcessing,
    isTranscribing,
    modelSize,
    setModelSize,
    confidenceScores,
    isProcessing,
    translateText,
    isTranslating
  };
  
  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

// Custom hook for using the context
export const useAIUtils = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  if (context === undefined) {
    throw new Error("useAIUtils must be used within an AIUtilsProvider");
  }
  return context;
};
