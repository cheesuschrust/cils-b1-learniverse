
import React, { createContext, useContext, useState, ReactNode } from 'react';
import AIService from '@/services/AIService';
import { ContentType } from '@/types/contentType';
import { defaultAISettings, AISettings, AIFeedbackSettings, defaultAIFeedbackSettings } from '@/components/ai/AISettingsTypes';

interface AIUtilsContextType {
  isModelLoaded: boolean;
  isProcessing: boolean;
  status: 'idle' | 'loading' | 'ready' | 'error';
  feedbackSettings: AIFeedbackSettings;
  aiSettings: AISettings;
  setFeedbackSettings: (settings: AIFeedbackSettings) => void;
  setAISettings: (settings: AISettings) => void;
  generateText: (prompt: string) => Promise<string>;
  classifyText: (text: string) => Promise<{ label: string; score: number }[]>;
  generateImage: (prompt: string, size?: '256x256' | '512x512' | '1024x1024') => Promise<string>;
  addTrainingExamples: (contentType: ContentType, examples: any[]) => number;
  getConfidenceScore: (contentType: ContentType) => number;
}

export const AIUtilsContext = createContext<AIUtilsContextType>({
  isModelLoaded: false,
  isProcessing: false,
  status: 'idle',
  feedbackSettings: defaultAIFeedbackSettings,
  aiSettings: defaultAISettings,
  setFeedbackSettings: () => {},
  setAISettings: () => {},
  generateText: async () => '',
  classifyText: async () => [],
  generateImage: async () => '',
  addTrainingExamples: () => 0,
  getConfidenceScore: () => 0,
});

export const useAI = () => useContext(AIUtilsContext);

export const AIUtilsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('ready');
  const [feedbackSettings, setFeedbackSettings] = useState<AIFeedbackSettings>(defaultAIFeedbackSettings);
  const [aiSettings, setAISettings] = useState<AISettings>(defaultAISettings);
  
  // Generate text using AI
  const generateText = async (prompt: string): Promise<string> => {
    try {
      setIsProcessing(true);
      const result = await AIService.generateText(prompt, {
        maxLength: aiSettings.maxTokens,
        temperature: aiSettings.temperature,
        model: aiSettings.model,
        stream: aiSettings.enableStreaming
      });
      return result;
    } catch (error) {
      console.error('Error in generateText:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Classify text using AI
  const classifyText = async (text: string): Promise<{ label: string; score: number }[]> => {
    try {
      setIsProcessing(true);
      return await AIService.classifyText(text);
    } catch (error) {
      console.error('Error in classifyText:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate image using AI
  const generateImage = async (prompt: string, size: '256x256' | '512x512' | '1024x1024' = '512x512'): Promise<string> => {
    try {
      setIsProcessing(true);
      return await AIService.generateImage(prompt, size);
    } catch (error) {
      console.error('Error in generateImage:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Add training examples
  const addTrainingExamples = (contentType: ContentType, examples: any[]): number => {
    return AIService.addTrainingExamples(contentType, examples);
  };
  
  // Get confidence score
  const getConfidenceScore = (contentType: ContentType): number => {
    return AIService.getConfidenceScore(contentType);
  };
  
  return (
    <AIUtilsContext.Provider
      value={{
        isModelLoaded,
        isProcessing,
        status,
        feedbackSettings,
        aiSettings,
        setFeedbackSettings,
        setAISettings,
        generateText,
        classifyText,
        generateImage,
        addTrainingExamples,
        getConfidenceScore,
      }}
    >
      {children}
    </AIUtilsContext.Provider>
  );
};
