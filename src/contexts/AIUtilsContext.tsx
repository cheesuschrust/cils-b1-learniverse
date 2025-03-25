
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAI } from '@/hooks/useAI';
import { ContentType, detectLanguage } from '@/utils/textAnalysis';

// Define SpeechRecognition types for browsers
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((event: SpeechRecognitionError) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

// Declare the SpeechRecognition types for the global window object
declare global {
  interface Window { 
    SpeechRecognition?: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
    };
  }
}

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
  speakText: (text: string, language?: string) => Promise<void>;
  isSpeaking: boolean;
  cancelSpeech: () => void;
  getConfidenceLevel: (contentType: ContentType) => 'low' | 'medium' | 'high';
  getVoiceForLanguage: (language: string) => SpeechSynthesisVoice | null;
  detectTextLanguage: (text: string) => string;
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
  stopAudioProcessing: () => {},
  speakText: async () => {},
  isSpeaking: false,
  cancelSpeech: () => {},
  getConfidenceLevel: () => 'medium',
  getVoiceForLanguage: () => null,
  detectTextLanguage: () => 'en'
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const { isProcessing, toggleAI, isModelLoaded } = useAI();
  const { toast } = useToast();
  
  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      setAvailableVoices(voices);
    };
    
    loadVoices();
    
    if (window.speechSynthesis) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);
  
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
    
    // Save to local storage for persistence
    const savedScores = JSON.parse(localStorage.getItem('ai-confidence-scores') || '{}');
    localStorage.setItem('ai-confidence-scores', JSON.stringify({
      ...savedScores,
      [contentType]: score
    }));
  };
  
  const storeResults = (results: any[]) => {
    setLastGeneratedResults(results);
  };
  
  const clearResults = () => {
    setLastGeneratedResults([]);
  };
  
  const detectTextLanguage = (text: string): string => {
    const language = detectLanguage(text);
    
    switch (language) {
      case 'english': return 'en-US';
      case 'italian': return 'it-IT';
      case 'spanish': return 'es-ES';
      case 'french': return 'fr-FR';
      case 'german': return 'de-DE';
      default: return 'en-US';
    }
  };
  
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Enhanced error handling for unsupported language pairs
      const supportedSourceLangs = ['en', 'it', 'es', 'fr', 'de'];
      const supportedTargetLangs = ['en', 'it', 'es', 'fr', 'de'];
      
      if (!supportedSourceLangs.includes(sourceLang)) {
        throw new Error(`Source language "${sourceLang}" is not supported.`);
      }
      
      if (!supportedTargetLangs.includes(targetLang)) {
        throw new Error(`Target language "${targetLang}" is not supported.`);
      }
      
      // Simple dictionary-based translation for common Italian words (when AI is disabled or for demo)
      if (sourceLang === 'it' && targetLang === 'en') {
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
          'vita': 'life',
          'mangiare': 'to eat',
          'bere': 'to drink',
          'dormire': 'to sleep',
          'parlare': 'to speak',
          'ascoltare': 'to listen',
          'leggere': 'to read',
          'scrivere': 'to write',
          'studiare': 'to study',
          'andare': 'to go',
          'venire': 'to come'
        };
        
        const words = text.toLowerCase().split(' ');
        const translatedWords = words.map(word => {
          const cleanWord = word.replace(/[.,?!;:]/g, '');
          const translation = translations[cleanWord] || word;
          const punctuation = word.substring(cleanWord.length);
          return translation + punctuation;
        });
        
        return translatedWords.join(' ');
      }
      
      // English to Italian
      if (sourceLang === 'en' && targetLang === 'it') {
        const translations: Record<string, string> = {
          'hello': 'ciao',
          'thank you': 'grazie',
          'house': 'casa',
          'cat': 'gatto',
          'dog': 'cane',
          'good morning': 'buongiorno',
          'goodbye': 'arrivederci',
          'pleasure': 'piacere',
          'how are you': 'come stai',
          'well': 'bene',
          'boy': 'ragazzo',
          'girl': 'ragazza',
          'school': 'scuola',
          'book': 'libro',
          'city': 'città',
          'work': 'lavoro',
          'time': 'tempo',
          'day': 'giorno',
          'year': 'anno',
          'life': 'vita',
          'to eat': 'mangiare',
          'to drink': 'bere',
          'to sleep': 'dormire',
          'to speak': 'parlare',
          'to listen': 'ascoltare',
          'to read': 'leggere',
          'to write': 'scrivere',
          'to study': 'studiare',
          'to go': 'andare',
          'to come': 'venire'
        };
        
        const words = text.toLowerCase().split(' ');
        const translatedWords = words.map(word => {
          const cleanWord = word.replace(/[.,?!;:]/g, '');
          const translation = translations[cleanWord] || word;
          const punctuation = word.substring(cleanWord.length);
          return translation + punctuation;
        });
        
        return translatedWords.join(' ');
      }
      
      // For other language pairs, return a placeholder
      return `[Translation from ${sourceLang} to ${targetLang}] ${text}`;
      
    } catch (error) {
      console.error('Translation error:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Failed to translate text. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  }, [isAIEnabled]);
  
  const transcribeAudio = useCallback(async (audioData: Blob): Promise<string> => {
    if (!isAIEnabled) {
      throw new Error('AI features are disabled. Enable them in settings.');
    }
    
    setIsTranscribing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return "This is a simulated transcription result. In a production app, this would be the actual text transcribed from your audio.";
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  }, [isAIEnabled]);
  
  const checkMicrophoneAccess = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasActiveMicrophone(true);
      return true;
    } catch (err) {
      console.error('Microphone access error:', err);
      setHasActiveMicrophone(false);
      return false;
    }
  }, []);
  
  const processAudioStream = useCallback(async (
    onResult: (text: string, isFinal: boolean) => void
  ): Promise<() => void> => {
    if (!isAIEnabled) {
      throw new Error('AI features are disabled. Enable them in settings.');
    }
    
    // Get the appropriate SpeechRecognition constructor
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionConstructor) {
      throw new Error('Speech recognition is not supported in this browser.');
    }
    
    const hasMicAccess = await checkMicrophoneAccess();
    if (!hasMicAccess) {
      throw new Error('Microphone access is required for speech recognition.');
    }
    
    try {
      const recognition = new SpeechRecognitionConstructor();
      setRecognitionInstance(recognition);
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'it-IT';
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        const isFinal = event.results[event.results.length - 1].isFinal;
        onResult(transcript, isFinal);
      };
      
      recognition.onerror = (event: SpeechRecognitionError) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected');
        } else {
          throw new Error(`Speech recognition error: ${event.error}`);
        }
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsTranscribing(false);
      };
      
      recognition.start();
      setIsTranscribing(true);
      
      return () => {
        recognition.stop();
        setIsTranscribing(false);
        setRecognitionInstance(null);
      };
    } catch (error) {
      console.error('Speech processing error:', error);
      setIsTranscribing(false);
      throw error instanceof Error 
        ? error 
        : new Error('Failed to start speech recognition. Please try again.');
    }
  }, [isAIEnabled, checkMicrophoneAccess]);
  
  const stopAudioProcessing = useCallback(() => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsTranscribing(false);
      setRecognitionInstance(null);
    }
  }, [recognitionInstance]);
  
  // Get the best voice for a given language
  const getVoiceForLanguage = useCallback((language: string): SpeechSynthesisVoice | null => {
    if (!window.speechSynthesis || availableVoices.length === 0) {
      return null;
    }
    
    // Get language code (e.g., 'it' from 'it-IT')
    const langCode = language.split('-')[0].toLowerCase();
    
    // Find voices for this language
    const matchingVoices = availableVoices.filter(voice => 
      voice.lang.toLowerCase().startsWith(langCode)
    );
    
    if (matchingVoices.length === 0) {
      return null;
    }
    
    // Prefer female voices for language learning
    const femaleVoice = matchingVoices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('donna') ||
      voice.name.toLowerCase().includes('alice') ||
      voice.name.toLowerCase().includes('laura')
    );
    
    return femaleVoice || matchingVoices[0];
  }, [availableVoices]);

  // Define cancelSpeech before it's used
  const cancelSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeechSynthesis(null);
  }, []);
  
  const speakText = useCallback(async (text: string, language: string = 'it-IT'): Promise<void> => {
    if (!isAIEnabled) {
      toast({
        title: "Feature Disabled",
        description: "Text-to-speech requires AI features to be enabled.",
        variant: "destructive",
      });
      return;
    }
    
    // Cancel any ongoing speech
    cancelSpeech();
    
    try {
      if (!window.speechSynthesis) {
        throw new Error('Speech synthesis is not supported in this browser.');
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9; // Slightly slower for language learning
      
      // Select a voice that matches the language
      const voice = getVoiceForLanguage(language);
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeechSynthesis(null);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        setSpeechSynthesis(null);
        
        toast({
          title: "Text-to-Speech Error",
          description: "There was an error with the text-to-speech service.",
          variant: "destructive",
        });
      };
      
      setSpeechSynthesis(utterance);
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
      
      toast({
        title: "Text-to-Speech Error",
        description: error instanceof Error ? error.message : "Failed to synthesize speech",
        variant: "destructive",
      });
    }
  }, [isAIEnabled, toast, getVoiceForLanguage, cancelSpeech]);
  
  // Get confidence level category based on score
  const getConfidenceLevel = useCallback((contentType: ContentType): 'low' | 'medium' | 'high' => {
    const score = confidenceScores[contentType] || 0;
    
    if (score < 60) return 'low';
    if (score < 80) return 'medium';
    return 'high';
  }, [confidenceScores]);
  
  // Load confidence scores from local storage
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('ai-confidence-scores');
      if (savedScores) {
        const parsedScores = JSON.parse(savedScores);
        setConfidenceScores(prev => ({
          ...prev,
          ...parsedScores
        }));
      }
    } catch (error) {
      console.error('Error loading confidence scores:', error);
    }
  }, []);
  
  useEffect(() => {
    checkMicrophoneAccess().catch(console.error);
    
    // Cleanup
    return () => {
      cancelSpeech();
      stopAudioProcessing();
    };
  }, [checkMicrophoneAccess, cancelSpeech, stopAudioProcessing]);
  
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
    stopAudioProcessing,
    speakText,
    isSpeaking,
    cancelSpeech,
    getConfidenceLevel,
    getVoiceForLanguage,
    detectTextLanguage
  };
  
  return (
    <AIUtilsContext.Provider value={contextValue}>
      {children}
    </AIUtilsContext.Provider>
  );
};
