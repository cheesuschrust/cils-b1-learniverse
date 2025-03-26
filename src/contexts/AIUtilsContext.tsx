
import React, { createContext, useContext, useState } from 'react';

// Define the types for AI settings
interface AISettings {
  enabled: boolean;
  model: string;
  temperature: number;
  responseLength: number;
  contextWindow: number;
  learningStyle: string;
  contentTypes: string[];
  preferredVoice: string;
  assistantName: string;
  feedbackLevel: 'detailed' | 'summary' | 'minimal';
}

// Define the context type
interface AIUtilsContextType {
  settings: AISettings;
  updateSettings: (newSettings: Partial<AISettings>) => void;
  resetSettings: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  lastQuery: string;
  setLastQuery: (query: string) => void;
  generateContent: (prompt: string, type: string) => Promise<string>;
  analyzePerformance: (data: any) => Promise<any>;
}

// Default settings
const defaultSettings: AISettings = {
  enabled: true,
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  responseLength: 250,
  contextWindow: 5,
  learningStyle: 'balanced',
  contentTypes: ['writing', 'speaking', 'listening', 'multiple-choice', 'flashcards'],
  preferredVoice: 'natural',
  assistantName: 'LinguaAssistant',
  feedbackLevel: 'summary'
};

// Create the context with default values
const AIUtilsContext = createContext<AIUtilsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  lastQuery: '',
  setLastQuery: () => {},
  generateContent: async () => '',
  analyzePerformance: async () => ({})
});

// Provider component
export const AIUtilsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [settings, setSettings] = useState<AISettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem('ai-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  // Update settings and save to localStorage
  const updateSettings = (newSettings: Partial<AISettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('ai-settings', JSON.stringify(updatedSettings));
  };

  // Reset settings to default
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('ai-settings', JSON.stringify(defaultSettings));
  };

  // Simulate content generation - in a real app, this would call an API
  const generateContent = async (prompt: string, type: string): Promise<string> => {
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = `Generated ${type} content based on: "${prompt}"`;
      return response;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate performance analysis
  const analyzePerformance = async (data: any): Promise<any> => {
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        strengths: ['Vocabulary usage', 'Grammar application'],
        weaknesses: ['Pronunciation', 'Listening comprehension'],
        recommendations: ['Practice more listening exercises', 'Focus on pronunciation drills']
      };
    } catch (error) {
      console.error('Error analyzing performance:', error);
      throw new Error('Failed to analyze performance');
    } finally {
      setIsProcessing(false);
    }
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
    isProcessing,
    setIsProcessing,
    lastQuery,
    setLastQuery,
    generateContent,
    analyzePerformance
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

// Custom hook to use the context
export const useAIUtils = () => {
  const context = useContext(AIUtilsContext);
  if (!context) {
    throw new Error('useAIUtils must be used within an AIUtilsProvider');
  }
  return context;
};

export default AIUtilsContext;
