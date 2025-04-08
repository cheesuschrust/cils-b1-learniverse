
import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  AIGenerationResult, 
  AIQuestion,
  QuestionGenerationParams,
  AIProcessingOptions,
  TTSOptions,
  AIGeneratedQuestion,
  ItalianTestSection,
  AIUtilsContextType
} from '@/types/ai';
import { AISettings } from '@/types/ai-settings';

// Create context with default values
const AIUtilsContext = createContext<AIUtilsContextType>({
  processContent: async () => [],
  generateQuestions: async () => ({ questions: [] }),
  analyzeGrammar: async () => ({}),
  translateText: async () => "",
  generateText: async () => "",
  evaluateWriting: async () => ({}),
  isProcessing: false,
  isGenerating: false,
  remainingCredits: 100,
  usageLimit: 100,
  isAIEnabled: true,
  speak: async () => {},
  isSpeaking: false,
  status: 'ready',
  isModelLoaded: true,
  compareTexts: async () => ({ similarity: 0, differences: [] }),
  loadModel: async () => {},
  classifyText: async () => ({ category: '', confidence: 0 }),
  transcribeSpeech: async () => ({ text: '', confidence: 0 }),
  processAudioStream: async () => {},
  stopAudioProcessing: () => {},
  isTranscribing: false,
  hasActiveMicrophone: false,
  checkMicrophoneAccess: async () => false,
  generateContent: async () => ({}),
  analyzeContent: async () => ({})
});

export function AIUtilsProvider({ children }: { children: React.ReactNode }) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [remainingCredits, setRemainingCredits] = useState<number>(100);
  const [usageLimit] = useState<number>(100);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('ready');
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(true);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [hasActiveMicrophone, setHasActiveMicrophone] = useState<boolean>(false);

  // Process content
  const processContent = useCallback(async (content: string, options?: AIProcessingOptions) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [{ label: 'Sample', score: 0.85 }];
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Generate questions
  const generateQuestions = useCallback(async (params: QuestionGenerationParams): Promise<AIGenerationResult> => {
    setIsGenerating(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockQuestions: AIGeneratedQuestion[] = [
        {
          id: '1',
          text: 'Sample question',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A',
          explanation: 'This is an explanation',
          type: (params.contentTypes?.[0] || 'grammar') as ItalianTestSection,
          difficulty: params.difficulty || 'intermediate',
          questionType: 'multiple-choice',
          isCitizenshipRelevant: false
        }
      ];
      
      setRemainingCredits(prev => Math.max(0, prev - 1));
      
      return { questions: mockQuestions };
    } catch (error) {
      console.error('Error generating questions:', error);
      return { questions: [], error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Analyze grammar
  const analyzeGrammar = useCallback(async (text: string, language?: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { analysis: true, corrections: [] };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Translate text
  const translateText = useCallback(async (text: string, targetLanguage?: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return `Translated: ${text}`;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Generate text
  const generateText = useCallback(async (prompt: string, options?: any) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return `Generated text based on: ${prompt}`;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Evaluate writing
  const evaluateWriting = useCallback(async (text: string, level?: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        score: 85, 
        feedback: 'Good work!',
        corrections: []
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Text-to-speech
  const speak = useCallback(async (text: string | TTSOptions, options?: TTSOptions | string) => {
    setIsSpeaking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log(`Speaking: ${typeof text === 'string' ? text : text.text || ''}`);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  // Compare texts
  const compareTexts = useCallback(async (text1: string, text2: string) => {
    return { similarity: 0.8, differences: [] };
  }, []);

  // Load AI model
  const loadModel = useCallback(async (modelName?: string) => {
    console.log(`Loading model: ${modelName || 'default'}`);
    setIsModelLoaded(true);
    return true;
  }, []);

  // Classify text
  const classifyText = useCallback(async (text: string, categories: string[]) => {
    return { category: categories[0] || 'unknown', confidence: 0.9 };
  }, []);

  // Speech-to-text
  const transcribeSpeech = useCallback(async (audioData: Blob) => {
    return { text: "Transcribed text", confidence: 0.8 };
  }, []);

  // Process audio stream
  const processAudioStream = useCallback(async (stream: MediaStream) => {
    setIsTranscribing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  // Stop audio processing
  const stopAudioProcessing = useCallback(() => {
    setIsTranscribing(false);
  }, []);

  // Check microphone access
  const checkMicrophoneAccess = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setHasActiveMicrophone(true);
      return true;
    } catch (error) {
      setHasActiveMicrophone(false);
      return false;
    }
  }, []);

  // Generate content
  const generateContent = useCallback(async (prompt: string, options?: any) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { content: `Generated content for: ${prompt}` };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Analyze content
  const analyzeContent = useCallback(async (content: string, contentType: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      return { 
        analysis: { 
          type: contentType,
          sentiment: 'positive',
          complexity: 'medium',
          topics: ['grammar', 'vocabulary']
        } 
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const contextValue: AIUtilsContextType = {
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
    isAIEnabled: true,
    speak,
    isSpeaking,
    status,
    isModelLoaded,
    compareTexts,
    loadModel,
    classifyText,
    transcribeSpeech,
    processAudioStream,
    stopAudioProcessing,
    isTranscribing,
    hasActiveMicrophone,
    checkMicrophoneAccess,
    generateContent,
    analyzeContent
  };

  return (
    <AIUtilsContext.Provider value={contextValue}>
      {children}
    </AIUtilsContext.Provider>
  );
}

export function useAIUtils(): AIUtilsContextType {
  const context = useContext(AIUtilsContext);
  if (context === undefined) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
}

export { AIUtilsContext };
