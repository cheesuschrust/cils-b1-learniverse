
import React, { createContext, useContext, useState } from 'react';  
import { 
  AIUtilsContextType, 
  AIGenerationResult,
  AIQuestion,
  QuestionGenerationParams,
  AIGeneratedQuestion,
  AIProcessingOptions,
  TTSOptions
} from '@/types/ai';  

// Create the context with proper typing  
const AIUtilsContext = createContext<AIUtilsContextType | undefined>(undefined);  

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

  // This is the function with the fixed parameter types  
  async function generateQuestions(params: QuestionGenerationParams): Promise<AIGenerationResult> {  
    setIsGenerating(true);  
    
    try {  
      // API call to generate questions would go here  
      const mockQuestions: AIGeneratedQuestion[] = [  
        {  
          id: '1',  
          text: 'Qual è la capitale d\'Italia?',  
          options: ['Roma', 'Milano', 'Firenze', 'Napoli'],  
          correctAnswer: 'Roma',  
          explanation: 'Roma è la capitale dell\'Italia dal 1871.',  
          type: 'culture',  
          difficulty: 'B1',
          questionType: 'multiple-choice',
          isCitizenshipRelevant: false
        }  
      ];  
      
      // Simulate API delay  
      await new Promise(resolve => setTimeout(resolve, 1000));  
      
      // Deduct credits  
      setRemainingCredits(prev => Math.max(0, prev - 1));  
      
      return {   
        questions: mockQuestions  
      };  
    } catch (error) {  
      console.error('Error generating questions:', error);  
      return {   
        questions: [],  
        error: error instanceof Error ? error.message : 'Unknown error'  
      };  
    } finally {  
      setIsGenerating(false);  
    }  
  }

  // Mock implementation for other required methods
  async function processContent(content: string, options?: AIProcessingOptions): Promise<any> {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { processed: true, result: [{ label: 'Sample', score: 0.85 }] };
    } finally {
      setIsProcessing(false);
    }
  }

  async function analyzeGrammar(text: string, language?: string): Promise<any> {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { analysis: true };
    } finally {
      setIsProcessing(false);
    }
  }

  async function translateText(text: string, targetLanguage?: string): Promise<any> {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return `Translated: ${text}`;
    } finally {
      setIsProcessing(false);
    }
  }

  async function generateText(prompt: string, options?: any): Promise<any> {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return `Generated: ${prompt}`;
    } finally {
      setIsProcessing(false);
    }
  }

  async function evaluateWriting(text: string, level?: string): Promise<any> {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { evaluation: true };
    } finally {
      setIsProcessing(false);
    }
  }

  async function speak(text: string, options?: TTSOptions | string): Promise<void> {
    setIsSpeaking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Speaking: ${text}`);
    } finally {
      setIsSpeaking(false);
    }
  }

  async function compareTexts(text1: string, text2: string): Promise<{ similarity: number, differences: string[] }> {
    return { similarity: 0.8, differences: [] };
  }

  async function loadModel(): Promise<void> {
    return Promise.resolve();
  }

  async function classifyText(text: string, categories: string[]): Promise<{ category: string, confidence: number }> {
    return { category: categories[0], confidence: 0.9 };
  }

  async function transcribeSpeech(audioData: Blob): Promise<{ text: string, confidence: number }> {
    return { text: "Transcribed text", confidence: 0.8 };
  }

  async function processAudioStream(stream: MediaStream): Promise<void> {
    setIsTranscribing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsTranscribing(false);
    }
  }

  function stopAudioProcessing(): void {}

  async function checkMicrophoneAccess(): Promise<boolean> {
    return true;
  }

  async function generateContent(prompt: string, options?: any): Promise<any> {
    return { content: "Generated content" };
  }

  async function analyzeContent(content: string, contentType: string): Promise<any> {
    return { analysis: true };
  }

  const value: AIUtilsContextType = {  
    generateQuestions,
    processContent,
    analyzeGrammar,
    translateText,
    generateText,
    evaluateWriting,
    isGenerating,
    isProcessing,
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

  return <AIUtilsContext.Provider value={value}>{children}</AIUtilsContext.Provider>;  
}  

export function useAIUtils(): AIUtilsContextType {  
  const context = useContext(AIUtilsContext);  
  if (context === undefined) {  
    throw new Error('useAIUtils must be used within an AIUtilsProvider');  
  }  
  return context;  
}  

export { AIUtilsContext };
