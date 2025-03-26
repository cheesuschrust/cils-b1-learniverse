
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
}

const AIUtilsContext = createContext<AIUtilsContextType>({
  isAIEnabled: true,
  toggleAI: () => {},
  isSpeaking: false,
  isTranscribing: false,
  speakText: async () => {},
  cancelSpeech: () => {},
  processAudioStream: async () => () => {},
  stopAudioProcessing: () => {}
});

export const useAIUtils = () => useContext(AIUtilsContext);

export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
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
        stopAudioProcessing
      }}
    >
      {children}
    </AIUtilsContext.Provider>
  );
};
