
import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { UserPreferencesContext } from './UserPreferencesContext';
import { textToSpeech } from '@/utils/textToSpeech';
import { recognizeSpeech, translateText } from '@/utils/huggingFaceIntegration';

// Grammar check types
export interface GrammarCorrection {
  original: string;
  suggestion: string;
  explanation: string;
  offset: number;
  length: number;
}

export interface GrammarCheckResult {
  text: string;
  corrections: GrammarCorrection[];
}

// Settings interface
export interface AIUtilsSettings {
  enabled: boolean;
  defaultModelSize: string;
  useWebGPU: boolean;
  voiceRate: number;
  voicePitch: number;
  italianVoiceURI: string;
  englishVoiceURI: string;
  defaultLanguage: string;
  processOnDevice: boolean;
  confidenceThreshold: number;
  maxTokens: number;
  temperature: number;
  grammarCheckEnabled: boolean;
  pronunciationCorrectionEnabled: boolean;
  automaticFeedback: boolean;
  contentFiltering: boolean;
}

// Context type definition
export interface AIUtilsContextType {
  settings: AIUtilsSettings;
  isAIEnabled: boolean;
  enableAI: () => void;
  disableAI: () => void;
  updateSettings: (settings: Partial<AIUtilsSettings>) => void;
  resetSettings: () => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  lastQuery: string | null;
  setLastQuery: (query: string | null) => void;
  generateText: (prompt: string, options?: any) => Promise<string>;
  translateText: (text: string, from: 'it' | 'en', to: 'it' | 'en') => Promise<string>;
  grammarCheck: (text: string) => Promise<GrammarCheckResult>;
  explainGrammar: (text: string, language: 'it' | 'en') => Promise<string>;
  generateExercise: (topic: string, level: string, type: string) => Promise<any>;
  checkAnswer: (question: string, userAnswer: string, correctAnswer: string) => Promise<{ isCorrect: boolean; explanation: string }>;
  provideFeedback: (text: string, language: 'it' | 'en') => Promise<string>;
  generateHint: (question: string) => Promise<string>;
  isSpeaking: boolean;
  speakText: (text: string, language?: 'it' | 'en') => Promise<void>;
  cancelSpeech: () => void;
  analyzePronunciation: (original: string, userRecording: Blob, language: 'it' | 'en') => Promise<any>;
}

// Default settings
const defaultSettings: AIUtilsSettings = {
  enabled: true,
  defaultModelSize: 'medium',
  useWebGPU: false,
  voiceRate: 1,
  voicePitch: 1,
  italianVoiceURI: '',
  englishVoiceURI: '',
  defaultLanguage: 'it',
  processOnDevice: false,
  confidenceThreshold: 0.7,
  maxTokens: 256,
  temperature: 0.7,
  grammarCheckEnabled: true,
  pronunciationCorrectionEnabled: true,
  automaticFeedback: true,
  contentFiltering: false
};

// Create context with default values
export const AIUtilsContext = createContext<AIUtilsContextType>({
  settings: defaultSettings,
  isAIEnabled: true,
  enableAI: () => {},
  disableAI: () => {},
  updateSettings: () => {},
  resetSettings: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  lastQuery: null,
  setLastQuery: () => {},
  generateText: async () => '',
  translateText: async () => '',
  grammarCheck: async () => ({ text: '', corrections: [] }),
  explainGrammar: async () => '',
  generateExercise: async () => ({}),
  checkAnswer: async () => ({ isCorrect: false, explanation: '' }),
  provideFeedback: async () => '',
  generateHint: async () => '',
  isSpeaking: false,
  speakText: async () => {},
  cancelSpeech: () => {},
  analyzePronunciation: async () => ({})
});

// Provider component
export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userPreferences = useContext(UserPreferencesContext);
  const [settings, setSettings] = useState<AIUtilsSettings>({
    ...defaultSettings,
    enabled: userPreferences?.preferences?.aiEnabled !== undefined 
      ? userPreferences.preferences.aiEnabled 
      : true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Update settings when user preferences change
  useEffect(() => {
    if (userPreferences?.preferences?.aiEnabled !== undefined) {
      setSettings(prev => ({ ...prev, enabled: userPreferences.preferences.aiEnabled! }));
    }
  }, [userPreferences?.preferences?.aiEnabled]);

  const enableAI = useCallback(() => {
    setSettings(prev => ({ ...prev, enabled: true }));
  }, []);

  const disableAI = useCallback(() => {
    setSettings(prev => ({ ...prev, enabled: false }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AIUtilsSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  // Generate text based on prompt
  const generateText = useCallback(async (prompt: string, options = {}): Promise<string> => {
    if (!settings.enabled) return '';

    setIsProcessing(true);
    setLastQuery(prompt);
    
    try {
      // Implement AI text generation
      // This is a placeholder for actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = `Generated response for: ${prompt}`;
      return response;
    } catch (error) {
      console.error('Error generating text:', error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Translate text between languages
  const translateText = useCallback(async (text: string, from: 'it' | 'en', to: 'it' | 'en'): Promise<string> => {
    if (!settings.enabled) return text;

    setIsProcessing(true);
    
    try {
      return await recognizeSpeech(text);
    } catch (error) {
      console.error('Error translating text:', error);
      return text;
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Check grammar in text
  const grammarCheck = useCallback(async (text: string): Promise<GrammarCheckResult> => {
    if (!settings.enabled) {
      return { text, corrections: [] };
    }
    
    setIsProcessing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple mock implementation - without using 'this'
      const corrections: GrammarCorrection[] = [];
      
      // Look for common errors
      if (text.includes('i am')) {
        corrections.push({
          original: 'i am',
          suggestion: 'I am',
          explanation: 'Capitalize the pronoun "I"',
          offset: text.indexOf('i am'),
          length: 4
        });
      }
      
      // Check for double spaces
      const doubleSpaceMatch = text.match(/\s\s+/g);
      if (doubleSpaceMatch) {
        doubleSpaceMatch.forEach(match => {
          corrections.push({
            original: match,
            suggestion: ' ',
            explanation: 'Remove extra space',
            offset: text.indexOf(match),
            length: match.length
          });
        });
      }
      
      // Return the result directly
      return {
        text,
        corrections
      };
    } catch (error) {
      console.error('Error checking grammar:', error);
      return { text, corrections: [] };
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Explain grammar points in text
  const explainGrammar = useCallback(async (text: string, language: 'it' | 'en'): Promise<string> => {
    if (!settings.enabled) return '';

    setIsProcessing(true);
    
    try {
      // Implement grammar explanation
      // This is a placeholder for actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const explanation = `Grammar explanation for: ${text} in ${language}`;
      return explanation;
    } catch (error) {
      console.error('Error explaining grammar:', error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Generate language learning exercise
  const generateExercise = useCallback(async (topic: string, level: string, type: string): Promise<any> => {
    if (!settings.enabled) return {};

    setIsProcessing(true);
    
    try {
      // Implement exercise generation
      // This is a placeholder for actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        title: `${topic} Exercise (${level})`,
        type,
        questions: [
          {
            text: 'Sample question?',
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correctAnswer: 'Option 2'
          }
        ]
      };
    } catch (error) {
      console.error('Error generating exercise:', error);
      return {};
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Check user answer against correct answer
  const checkAnswer = useCallback(async (question: string, userAnswer: string, correctAnswer: string): Promise<{ isCorrect: boolean; explanation: string }> => {
    if (!settings.enabled) {
      const isCorrect = userAnswer === correctAnswer;
      return { 
        isCorrect, 
        explanation: isCorrect ? 'Correct!' : `The correct answer is: ${correctAnswer}`
      };
    }

    setIsProcessing(true);
    
    try {
      // Implement answer checking with AI
      // This is a placeholder for actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isCorrect = userAnswer === correctAnswer;
      
      return {
        isCorrect,
        explanation: isCorrect 
          ? 'Great job! Your answer is correct.' 
          : `The correct answer is: "${correctAnswer}". Your answer "${userAnswer}" was incorrect.`
      };
    } catch (error) {
      console.error('Error checking answer:', error);
      return { 
        isCorrect: false, 
        explanation: 'Unable to check answer due to an error.'
      };
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Provide feedback on user's language practice
  const provideFeedback = useCallback(async (text: string, language: 'it' | 'en'): Promise<string> => {
    if (!settings.enabled) return '';

    setIsProcessing(true);
    
    try {
      // Implement feedback generation
      // This is a placeholder for actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return `Here's some feedback on your ${language === 'it' ? 'Italian' : 'English'}: Your text shows good understanding of basic concepts.`;
    } catch (error) {
      console.error('Error providing feedback:', error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Generate hint for a question
  const generateHint = useCallback(async (question: string): Promise<string> => {
    if (!settings.enabled) return '';

    setIsProcessing(true);
    
    try {
      // Implement hint generation
      // This is a placeholder for actual implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return `Hint: Think about the context of the question.`;
    } catch (error) {
      console.error('Error generating hint:', error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Speak text aloud
  const speakText = useCallback(async (text: string, language: 'it' | 'en' = 'it'): Promise<void> => {
    if (!settings.enabled) return;

    try {
      setIsSpeaking(true);
      
      // Use the textToSpeech utility
      await textToSpeech(text, {
        language,
        rate: settings.voiceRate,
        pitch: settings.voicePitch,
        voiceURI: language === 'en' ? settings.englishVoiceURI : settings.italianVoiceURI
      });
      
      setIsSpeaking(false);
    } catch (error) {
      setIsSpeaking(false);
      console.error('Error speaking text:', error);
      throw error;
    }
  }, [settings]);

  // Cancel ongoing speech
  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Analyze pronunciation from recorded audio
  const analyzePronunciation = useCallback(async (original: string, userRecording: Blob, language: 'it' | 'en'): Promise<any> => {
    if (!settings.enabled) return { score: 0, feedback: 'AI features are disabled' };

    setIsProcessing(true);
    
    try {
      // Implement pronunciation analysis
      // In a real implementation, we would:
      // 1. Convert the blob to audio data
      // 2. Use speech recognition to get transcription
      // 3. Compare transcription to original text
      // 4. Provide feedback based on similarity
      
      // For now, just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        score: 0.85,
        confidence: 0.9,
        feedback: 'Good pronunciation! Pay attention to the stress in the third syllable.',
        detailedFeedback: [
          { word: 'example', score: 0.9, feedback: 'Excellent' },
          { word: 'word', score: 0.8, feedback: 'Good' }
        ]
      };
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      return { score: 0, feedback: 'Error analyzing pronunciation' };
    } finally {
      setIsProcessing(false);
    }
  }, [settings.enabled]);

  // Value object for context provider
  const value: AIUtilsContextType = {
    settings,
    isAIEnabled: settings.enabled,
    enableAI,
    disableAI,
    updateSettings,
    resetSettings,
    isProcessing,
    setIsProcessing,
    lastQuery,
    setLastQuery,
    generateText,
    translateText,
    grammarCheck,
    explainGrammar,
    generateExercise,
    checkAnswer,
    provideFeedback,
    generateHint,
    isSpeaking,
    speakText,
    cancelSpeech,
    analyzePronunciation
  };

  return (
    <AIUtilsContext.Provider value={value}>
      {children}
    </AIUtilsContext.Provider>
  );
};

export default AIUtilsProvider;
