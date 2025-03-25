
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AIService } from '@/services/AIService';
import { useUserPreferences } from './UserPreferencesContext';

// Type definitions
export interface AIPreference {
  enabled: boolean;
  confidenceThreshold: number;
  contentTypePreferences: Record<string, boolean>;
  voicePreferences: {
    voice: string;
    rate: number;
    pitch: number;
  };
}

export interface TranscriptionCallback {
  (transcript: string, isFinal: boolean): void;
}

export interface AIUtilsContextType {
  isAIEnabled: boolean;
  toggleAI: () => void;
  processByType: (content: string, contentType: string) => Promise<string>;
  searchKnowledgeBase: (query: string, limit?: number) => Promise<any[]>;
  setUserAIPreferences: (preferences: Partial<AIPreference>) => void;
  userAIPreferences: AIPreference;
  
  // Speech and audio related functions
  speakText: (text: string, language?: string) => Promise<void>;
  isSpeaking: boolean;
  cancelSpeech: () => void;
  processAudioStream: (callback: TranscriptionCallback) => Promise<() => void>;
  stopAudioProcessing: () => void;
  isTranscribing: boolean;
  hasActiveMicrophone: boolean;
  checkMicrophoneAccess: () => Promise<boolean>;
  
  // Confidence scores
  getConfidenceLevel: (contentType: string) => number;
}

const defaultAIPreferences: AIPreference = {
  enabled: true,
  confidenceThreshold: 70,
  contentTypePreferences: {
    'writing': true,
    'speaking': true,
    'listening': true,
    'multiple-choice': true,
    'flashcards': true
  },
  voicePreferences: {
    voice: 'default',
    rate: 1.0,
    pitch: 1.0
  }
};

export const AIUtilsContext = createContext<AIUtilsContextType | undefined>(undefined);

interface AIUtilsProviderProps {
  children: ReactNode;
}

export const AIUtilsProvider: React.FC<AIUtilsProviderProps> = ({ children }) => {
  const { preferences } = useUserPreferences();
  const [userAIPreferences, setUserAIPreferences] = useState<AIPreference>(defaultAIPreferences);
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState(false);
  
  useEffect(() => {
    // Initialize AI preferences from user preferences
    if (preferences?.aiPreferences) {
      setUserAIPreferences(preferences.aiPreferences);
      setIsAIEnabled(preferences.aiPreferences.enabled);
    }
    
    // Initialize microphone status
    checkMicrophoneAccess().then(setHasActiveMicrophone).catch(() => setHasActiveMicrophone(false));
  }, [preferences]);

  const toggleAI = () => {
    const newState = !isAIEnabled;
    setIsAIEnabled(newState);
    setUserAIPreferences(prev => ({ ...prev, enabled: newState }));
  };
  
  const processByType = async (content: string, contentType: string): Promise<string> => {
    if (!isAIEnabled) {
      throw new Error('AI processing is disabled');
    }
    
    try {
      // Simulate AI processing
      return await AIService.processContent(content, contentType);
    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error('Failed to process content with AI');
    }
  };
  
  const searchKnowledgeBase = async (query: string, limit = 5): Promise<any[]> => {
    if (!isAIEnabled) {
      return [];
    }
    
    try {
      // Simulate knowledge base search
      return await AIService.searchKnowledgeBase(query, limit);
    } catch (error) {
      console.error('Knowledge base search error:', error);
      return [];
    }
  };
  
  // Speech synthesis
  const speakText = async (text: string, language = 'en-US'): Promise<void> => {
    if (!isAIEnabled) {
      throw new Error('AI text-to-speech is disabled');
    }
    
    try {
      setIsSpeaking(true);
      await AIService.textToSpeech(text, language, userAIPreferences.voicePreferences);
      setIsSpeaking(false);
    } catch (error) {
      setIsSpeaking(false);
      console.error('Text-to-speech error:', error);
      throw new Error('Failed to speak text');
    }
  };
  
  const cancelSpeech = (): void => {
    AIService.cancelSpeech();
    setIsSpeaking(false);
  };
  
  // Speech recognition
  const processAudioStream = async (callback: TranscriptionCallback): Promise<() => void> => {
    if (!isAIEnabled) {
      throw new Error('AI speech recognition is disabled');
    }
    
    try {
      setIsTranscribing(true);
      const stopFn = await AIService.startSpeechRecognition(callback);
      return () => {
        stopFn();
        setIsTranscribing(false);
      };
    } catch (error) {
      setIsTranscribing(false);
      console.error('Speech recognition error:', error);
      throw new Error('Failed to start speech recognition');
    }
  };
  
  const stopAudioProcessing = (): void => {
    AIService.stopSpeechRecognition();
    setIsTranscribing(false);
  };
  
  const checkMicrophoneAccess = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  };
  
  const getConfidenceLevel = (contentType: string): number => {
    // Return confidence score from 0-100 for the content type
    const confidenceScores: Record<string, number> = {
      'multiple-choice': 85,
      'flashcards': 90,
      'writing': 75,
      'speaking': 70,
      'listening': 80,
      'audio': 65,
      'unknown': 50,
      'csv': 95,
      'json': 95,
      'txt': 90,
      'pdf': 85
    };
    
    return confidenceScores[contentType] || 50;
  };
  
  const updateAIPreferences = (preferences: Partial<AIPreference>) => {
    setUserAIPreferences(prev => ({
      ...prev,
      ...preferences
    }));
  };

  return (
    <AIUtilsContext.Provider
      value={{
        isAIEnabled,
        toggleAI,
        processByType,
        searchKnowledgeBase,
        setUserAIPreferences: updateAIPreferences,
        userAIPreferences,
        speakText,
        isSpeaking,
        cancelSpeech,
        processAudioStream,
        stopAudioProcessing,
        isTranscribing,
        hasActiveMicrophone,
        checkMicrophoneAccess,
        getConfidenceLevel
      }}
    >
      {children}
    </AIUtilsContext.Provider>
  );
};

export const useAIUtils = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  if (context === undefined) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
};
