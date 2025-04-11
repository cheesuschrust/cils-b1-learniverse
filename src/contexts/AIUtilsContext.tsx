
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAIModel } from './AIModelContext';
import { useToast } from '@/hooks/use-toast';

type AIUtilsContextType = {
  processContent: (content: string, options?: any) => Promise<any>;
  generateQuestions: (params: any) => Promise<any>;
  analyzeGrammar: (text: string, language?: string) => Promise<any>;
  translateText: (text: string, targetLanguage?: string) => Promise<any>;
  generateText: (prompt: string, options?: any) => Promise<string>;
  evaluateWriting: (text: string, level?: string) => Promise<any>;
  isProcessing: boolean;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
  isAIEnabled: boolean;
  speak: (text: string | any, options?: any) => Promise<void>;
  isSpeaking: boolean;
  status: string;
  isModelLoaded: boolean;
  compareTexts: (text1: string, text2: string) => Promise<any>;
  loadModel: () => Promise<boolean>;
  classifyText: (text: string, categories: string[]) => Promise<any>;
  transcribeSpeech: (audioData: Blob) => Promise<any>;
  processAudioStream: (stream: MediaStream) => Promise<any>;
  stopAudioProcessing: () => void;
  isTranscribing: boolean;
  hasActiveMicrophone: boolean;
  checkMicrophoneAccess: () => Promise<boolean>;
  generateContent: (prompt: string, options?: any) => Promise<any>;
  analyzeContent: (content: string, contentType: string) => Promise<any>;
};

const defaultContext: AIUtilsContextType = {
  processContent: async () => ({}),
  generateQuestions: async () => ({}),
  analyzeGrammar: async () => ({}),
  translateText: async () => '',
  generateText: async () => '',
  evaluateWriting: async () => ({}),
  isProcessing: false,
  isGenerating: false,
  remainingCredits: 100,
  usageLimit: 100,
  isAIEnabled: true,
  speak: async () => {},
  isSpeaking: false,
  status: 'inactive',
  isModelLoaded: false,
  compareTexts: async () => ({ similarity: 0, differences: [] }),
  loadModel: async () => false,
  classifyText: async () => ({ category: '', confidence: 0 }),
  transcribeSpeech: async () => ({ text: '', confidence: 0 }),
  processAudioStream: async () => ({}),
  stopAudioProcessing: () => {},
  isTranscribing: false,
  hasActiveMicrophone: false,
  checkMicrophoneAccess: async () => false,
  generateContent: async () => ({ content: '' }),
  analyzeContent: async () => ({ analysis: {} }),
};

const AIUtilsContext = createContext<AIUtilsContextType>(defaultContext);

export const useAIUtils = () => useContext(AIUtilsContext);

interface AIUtilsProviderProps {
  children: ReactNode;
}

export const AIUtilsProvider: React.FC<AIUtilsProviderProps> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState(false);
  const { models, loadModel: loadModelFromContext } = useAIModel();
  const { toast } = useToast();
  
  // For demonstration purposes
  const remainingCredits = 75;
  const usageLimit = 100;
  const isAIEnabled = true;
  const status = models.some(m => m.isLoaded) ? 'active' : 'inactive';
  const isModelLoaded = models.some(m => m.isLoaded);
  
  // Placeholder AI functions
  const processContent = async (content: string, options?: any) => {
    if (!isModelLoaded) {
      toast({
        title: "AI Models Not Loaded",
        description: "Please load AI models first to use this feature.",
        variant: "destructive",
      });
      return {};
    }
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { processed: true, content };
    } finally {
      setIsProcessing(false);
    }
  };
  
  const generateQuestions = async (params: any) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        questions: [
          {
            id: '1',
            question: 'Come ti chiami?',
            questionTranslation: 'What is your name?',
            type: 'open_ended',
            difficulty: 'beginner',
          },
          {
            id: '2',
            question: 'Qual è la capitale d\'Italia?',
            questionTranslation: 'What is the capital of Italy?',
            type: 'multiple_choice',
            options: ['Roma', 'Milano', 'Napoli', 'Firenze'],
            optionsTranslations: ['Rome', 'Milan', 'Naples', 'Florence'],
            correctAnswer: 'Roma',
            difficulty: 'beginner',
          },
        ]
      };
    } finally {
      setIsGenerating(false);
    }
  };
  
  const analyzeGrammar = async (text: string, language?: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        errors: [],
        suggestions: ['Sample suggestion'],
        correctedText: text,
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  const translateText = async (text: string, targetLanguage?: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simple demo translation
      if (text.toLowerCase().includes('hello')) {
        return targetLanguage === 'it' ? 'Ciao' : 'Hello';
      }
      return text + ' (translated)';
    } finally {
      setIsProcessing(false);
    }
  };
  
  const generateText = async (prompt: string, options?: any) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return `Generated text based on: ${prompt}`;
    } finally {
      setIsGenerating(false);
    }
  };
  
  const evaluateWriting = async (text: string, level?: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        score: 85,
        feedback: 'Good writing sample, with minor grammar issues.',
        areas: {
          grammar: 80,
          vocabulary: 85,
          structure: 90,
        }
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  const speak = async (text: string | any, options?: any) => {
    setIsSpeaking(true);
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          typeof text === 'string' ? text : text.text
        );
        
        if (options) {
          if (typeof options === 'string') {
            // Language code passed directly
            utterance.lang = options;
          } else {
            // Options object
            if (options.voice) {
              const voices = window.speechSynthesis.getVoices();
              const selectedVoice = voices.find(voice => 
                voice.name.includes(options.voice) || 
                voice.voiceURI.includes(options.voice)
              );
              if (selectedVoice) utterance.voice = selectedVoice;
            }
            
            if (options.speed) utterance.rate = options.speed;
            if (options.pitch) utterance.pitch = options.pitch;
          }
        }
        
        window.speechSynthesis.speak(utterance);
        
        return new Promise<void>((resolve) => {
          utterance.onend = () => {
            setIsSpeaking(false);
            resolve();
          };
          utterance.onerror = () => {
            setIsSpeaking(false);
            resolve();
          };
        });
      } else {
        console.error('Speech synthesis not supported');
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  };
  
  const compareTexts = async (text1: string, text2: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const similarity = 0.85; // Mock similarity score
      return {
        similarity,
        differences: ['sample difference']
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  const loadModelFunc = async () => {
    try {
      const results = await Promise.all(
        models
          .filter(model => model.isActive && !model.isLoaded)
          .map(model => loadModelFromContext(model.id))
      );
      
      return results.some(result => result === true);
    } catch (error) {
      console.error('Error loading models:', error);
      return false;
    }
  };
  
  const classifyText = async (text: string, categories: string[]) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      return {
        category: categories[0],
        confidence: 0.85
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  const transcribeSpeech = async (audioData: Blob) => {
    setIsTranscribing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        text: "This is a sample transcription from audio.",
        confidence: 0.78
      };
    } finally {
      setIsTranscribing(false);
    }
  };
  
  const processAudioStream = async (stream: MediaStream) => {
    setIsTranscribing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        text: "This is a sample transcription from a live audio stream.",
        confidence: 0.82
      };
    } finally {
      setIsTranscribing(false);
    }
  };
  
  const stopAudioProcessing = () => {
    setIsTranscribing(false);
  };
  
  const checkMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasActiveMicrophone(true);
      return true;
    } catch (error) {
      console.error('Microphone access error:', error);
      setHasActiveMicrophone(false);
      return false;
    }
  };
  
  const generateContent = async (prompt: string, options?: any) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1300));
      return { 
        content: `Generated content based on the prompt: ${prompt}`,
        metadata: {
          model: 'sample-model',
          tokens: 42,
          processingTime: 1.2
        }
      };
    } finally {
      setIsGenerating(false);
    }
  };
  
  const analyzeContent = async (content: string, contentType: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      return { 
        analysis: {
          sentiment: 'positive',
          topics: ['italian', 'learning'],
          complexity: 'intermediate'
        },
        metadata: {
          model: 'sample-model',
          processingTime: 0.9
        }
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <AIUtilsContext.Provider
      value={{
        processContent,
        generateQuestions,
        analyzeGrammar,
        translateText,
        generateText,
        evaluateWriting,
        isProcessing,
        isGenerating,
        remainingCredits,
        usageLimit,
        isAIEnabled,
        speak,
        isSpeaking,
        status,
        isModelLoaded,
        compareTexts,
        loadModel: loadModelFunc,
        classifyText,
        transcribeSpeech,
        processAudioStream,
        stopAudioProcessing,
        isTranscribing,
        hasActiveMicrophone,
        checkMicrophoneAccess,
        generateContent,
        analyzeContent
      }}
    >
      {children}
    </AIUtilsContext.Provider>
  );
};

export default AIUtilsContext;
