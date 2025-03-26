
import React, { createContext, useContext, useState } from 'react';
import { speak, stopSpeaking as stopSpeech } from '@/utils/textToSpeech';

interface AIUtilsContextType {
  isAIEnabled: boolean;
  toggleAI: () => void;
  isSpeaking: boolean;
  isTranscribing: boolean;
  speakText: (text: string, language?: string) => Promise<void>;
  cancelSpeech: () => void;
  processAudioStream: (callback: (transcript: string, isFinal: boolean) => void) => Promise<() => void>;
  stopAudioProcessing: () => void;
  translateText?: (text: string, targetLanguage: string) => Promise<string>;
  isTranslating?: boolean;
  hasActiveMicrophone?: boolean;
  checkMicrophoneAccess?: () => Promise<boolean>;
}

const AIUtilsContext = createContext<AIUtilsContextType>({
  isAIEnabled: true,
  toggleAI: () => {},
  isSpeaking: false,
  isTranscribing: false,
  speakText: async () => {},
  cancelSpeech: () => {},
  processAudioStream: async () => () => {},
  stopAudioProcessing: () => {},
  translateText: async () => '',
  isTranslating: false,
  hasActiveMicrophone: false,
  checkMicrophoneAccess: async () => false
});

export const useAIUtils = () => useContext(AIUtilsContext);

export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState(false);
  
  const toggleAI = () => {
    setIsAIEnabled(prev => !prev);
    return !isAIEnabled;
  };
  
  const speakText = async (text: string, language = 'en-US') => {
    if (!isAIEnabled) {
      throw new Error('AI features are disabled');
    }
    
    setIsSpeaking(true);
    try {
      await speak(text, language === 'it' ? 'it' : 'en');
    } finally {
      setIsSpeaking(false);
    }
  };
  
  const cancelSpeech = () => {
    stopSpeech();
    setIsSpeaking(false);
  };
  
  const processAudioStream = async (callback: (transcript: string, isFinal: boolean) => void): Promise<() => void> => {
    if (!isAIEnabled) {
      throw new Error('AI features are disabled');
    }
    
    setIsTranscribing(true);
    
    // This would be a real implementation with the Web Speech API or a custom speech recognition service
    // For now, we'll simulate transcription
    const timer = setTimeout(() => {
      callback("Simulated transcription", true);
      setIsTranscribing(false);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      setIsTranscribing(false);
    };
  };
  
  const stopAudioProcessing = () => {
    setIsTranscribing(false);
    // In a real implementation, this would stop the audio processing
  };
  
  const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    if (!isAIEnabled) {
      throw new Error('AI features are disabled');
    }
    
    setIsTranslating(true);
    try {
      // This would be a real implementation with a translation API
      // For now, we'll simulate translation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const translatedText = `Translated text to ${targetLanguage}: ${text}`;
      return translatedText;
    } finally {
      setIsTranslating(false);
    }
  };
  
  const checkMicrophoneAccess = async (): Promise<boolean> => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // If we got here, access was granted
      setHasActiveMicrophone(true);
      
      // Stop all tracks to release the microphone
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error("Microphone access denied:", error);
      setHasActiveMicrophone(false);
      return false;
    }
  };
  
  return (
    <AIUtilsContext.Provider
      value={{
        isAIEnabled,
        toggleAI,
        isSpeaking,
        isTranscribing,
        speakText,
        cancelSpeech,
        processAudioStream,
        stopAudioProcessing,
        translateText,
        isTranslating,
        hasActiveMicrophone,
        checkMicrophoneAccess
      }}
    >
      {children}
    </AIUtilsContext.Provider>
  );
};
