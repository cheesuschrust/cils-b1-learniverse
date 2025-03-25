
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
  isTranscribing: boolean;
  isTranslating: boolean;
  hasActiveMicrophone: boolean;
  checkMicrophoneAccess: () => Promise<boolean>;
  processAudioStream: (onResult: (text: string, isFinal: boolean) => void) => Promise<() => void>;
  stopAudioProcessing: () => void;
}

const defaultContextData: AIContextData = {
  isAIEnabled: true,
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
  isTranscribing: false,
  isTranslating: false,
  hasActiveMicrophone: false,
  checkMicrophoneAccess: async () => false,
  processAudioStream: async () => () => {},
  stopAudioProcessing: () => {}
};

const AIUtilsContext = createContext<AIContextData>(defaultContextData);

export const useAIUtils = () => useContext(AIUtilsContext);

export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(true);
  const [modelSize, setModelSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [confidenceScores, setConfidenceScores] = useState<Record<ContentType, number>>(defaultContextData.confidenceScores);
  const [lastGeneratedResults, setLastGeneratedResults] = useState<any[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  
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
  
  // Translation function with multiple language support
  const translateText = useCallback(async (
    text: string, 
    sourceLang: string = 'it', 
    targetLang: string = 'en'
  ): Promise<string> => {
    if (!isAIEnabled) {
      throw new Error('AI features are disabled. Enable them in settings.');
    }
    
    setIsTranslating(true);
    
    try {
      // This is a placeholder - in a real app, you would use an actual AI model or API
      // Mock translation for testing purposes
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
      
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
          'ragazzo': 'boy',
          'ragazza': 'girl',
          'scuola': 'school',
          'libro': 'book',
          'città': 'city',
          'lavoro': 'work',
          'tempo': 'time',
          'giorno': 'day',
          'anno': 'year',
          'vita': 'life'
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
      
      // For other language combinations, just return the original text with a note
      return `[Translation from ${sourceLang} to ${targetLang}] ${text}`;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  }, [isAIEnabled]);
  
  // Audio transcription (speech-to-text)
  const transcribeAudio = useCallback(async (audioData: Blob): Promise<string> => {
    if (!isAIEnabled) {
      throw new Error('AI features are disabled. Enable them in settings.');
    }
    
    setIsTranscribing(true);
    
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
    } finally {
      setIsTranscribing(false);
    }
  }, [isAIEnabled]);
  
  // Check if the browser has microphone access
  const checkMicrophoneAccess = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Clean up the stream after checking
      stream.getTracks().forEach(track => track.stop());
      setHasActiveMicrophone(true);
      return true;
    } catch (err) {
      console.error('Microphone access error:', err);
      setHasActiveMicrophone(false);
      return false;
    }
  }, []);
  
  // Process audio stream with Web Speech API (if available)
  const processAudioStream = useCallback(async (
    onResult: (text: string, isFinal: boolean) => void
  ): Promise<() => void> => {
    if (!isAIEnabled) {
      throw new Error('AI features are disabled. Enable them in settings.');
    }
    
    // Check if Speech Recognition is available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new Error('Speech recognition is not supported in this browser.');
    }
    
    // Check microphone access
    const hasMicAccess = await checkMicrophoneAccess();
    if (!hasMicAccess) {
      throw new Error('Microphone access is required for speech recognition.');
    }
    
    try {
      // Create a new speech recognition instance
      const recognition = new SpeechRecognition();
      setRecognitionInstance(recognition);
      
      // Configure the recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'it-IT'; // Default to Italian
      
      // Set up event handlers
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        const isFinal = event.results[event.results.length - 1].isFinal;
        onResult(transcript, isFinal);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Don't throw for no speech, just log it
          console.log('No speech detected');
        } else {
          throw new Error(`Speech recognition error: ${event.error}`);
        }
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsTranscribing(false);
      };
      
      // Start recognition
      recognition.start();
      setIsTranscribing(true);
      
      // Return a function to stop the recognition
      return () => {
        recognition.stop();
        setIsTranscribing(false);
        setRecognitionInstance(null);
      };
    } catch (error) {
      console.error('Speech processing error:', error);
      setIsTranscribing(false);
      throw new Error('Failed to start speech recognition. Please try again.');
    }
  }, [isAIEnabled, checkMicrophoneAccess]);
  
  // Stop audio processing
  const stopAudioProcessing = useCallback(() => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsTranscribing(false);
      setRecognitionInstance(null);
    }
  }, [recognitionInstance]);
  
  // Check microphone access on component mount
  useEffect(() => {
    checkMicrophoneAccess().catch(console.error);
  }, [checkMicrophoneAccess]);
  
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
    transcribeAudio,
    isTranscribing,
    isTranslating,
    hasActiveMicrophone,
    checkMicrophoneAccess,
    processAudioStream,
    stopAudioProcessing
  };
  
  return (
    <AIUtilsContext.Provider value={contextValue}>
      {children}
    </AIUtilsContext.Provider>
  );
};
