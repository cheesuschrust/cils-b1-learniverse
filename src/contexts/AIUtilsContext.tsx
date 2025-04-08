
import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSystemLog } from '@/hooks/use-system-log';

export interface AIUtilsContextType {
  generateText: (prompt: string, options?: {
    length?: 'short' | 'medium' | 'long';
    style?: 'formal' | 'conversational' | 'educational';
    language?: 'english' | 'italian' | 'both';
  }) => Promise<string>;
  translateText: (text: string, targetLanguage: 'english' | 'italian') => Promise<string>;
  analyzeUserInput: (input: string) => Promise<{
    confidence: number;
    correction?: string;
    feedback?: string;
  }>;
  detectLanguage: (text: string) => Promise<'english' | 'italian' | 'unknown'>;
  isProcessing: boolean;
  lastError: string | null;
}

// Create the context with a default value
export const AIUtilsContext = createContext<AIUtilsContextType | undefined>(undefined);

interface AIUtilsProviderProps {
  children: ReactNode;
}

export const AIUtilsProvider: React.FC<AIUtilsProviderProps> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const { logAIAction } = useSystemLog();
  
  // Generate text based on prompt
  const generateText = useCallback(async (
    prompt: string, 
    options = { length: 'medium', style: 'educational', language: 'english' }
  ) => {
    if (!prompt) return '';
    
    setIsProcessing(true);
    setLastError(null);
    
    try {
      // In a real implementation, this would call an edge function to generate text
      // For now, we'll simulate a response based on the prompt
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logAIAction('Generated text', { prompt, options });
      
      let response = '';
      
      // Create a mock response based on options
      if (options.style === 'educational') {
        response = `Here's an educational explanation: ${prompt}`;
      } else if (options.style === 'conversational') {
        response = `Let's chat about ${prompt}`;
      } else {
        response = `Formal response regarding ${prompt}`;
      }
      
      if (options.length === 'short') {
        response = response.slice(0, 50) + '...';
      } else if (options.length === 'long') {
        response = response + ' ' + response + ' ' + response;
      }
      
      if (options.language === 'italian') {
        // Mock translation to Italian
        response = `[Italian] ${response}`;
      } else if (options.language === 'both') {
        // Mock bilingual response
        response = `English: ${response}\nItalian: [Italian] ${response}`;
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(errorMessage);
      
      toast({
        title: 'AI Generation Failed',
        description: 'There was an error generating the text. Please try again.',
        variant: 'destructive',
      });
      
      console.error('Error generating text:', error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, [logAIAction, toast]);
  
  // Translate text to target language
  const translateText = useCallback(async (text: string, targetLanguage: 'english' | 'italian') => {
    if (!text) return '';
    
    setIsProcessing(true);
    setLastError(null);
    
    try {
      // In a real implementation, this would call an edge function to translate text
      await new Promise(resolve => setTimeout(resolve, 800));
      
      logAIAction('Translated text', { text, targetLanguage });
      
      // Mock translation
      return targetLanguage === 'italian' 
        ? `[Italian] ${text}` 
        : `[English] ${text}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(errorMessage);
      
      toast({
        title: 'Translation Failed',
        description: 'There was an error translating the text. Please try again.',
        variant: 'destructive',
      });
      
      console.error('Error translating text:', error);
      return text;
    } finally {
      setIsProcessing(false);
    }
  }, [logAIAction, toast]);
  
  // Analyze user input for language learning feedback
  const analyzeUserInput = useCallback(async (input: string) => {
    if (!input) return { confidence: 0 };
    
    setIsProcessing(true);
    setLastError(null);
    
    try {
      // In a real implementation, this would call an edge function to analyze input
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      logAIAction('Analyzed user input', { input });
      
      // Mock analysis
      const hasErrors = Math.random() > 0.7;
      
      if (hasErrors) {
        return {
          confidence: 0.6,
          correction: input.replace(/a/g, 'x'),
          feedback: 'Consider revising your grammar.'
        };
      }
      
      return {
        confidence: 0.9,
        feedback: 'Great job! Your Italian is improving.'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(errorMessage);
      
      toast({
        title: 'Analysis Failed',
        description: 'There was an error analyzing your input. Please try again.',
        variant: 'destructive',
      });
      
      console.error('Error analyzing user input:', error);
      return { confidence: 0 };
    } finally {
      setIsProcessing(false);
    }
  }, [logAIAction, toast]);
  
  // Detect language of input text
  const detectLanguage = useCallback(async (text: string) => {
    if (!text?.trim()) return 'unknown';
    
    setIsProcessing(true);
    setLastError(null);
    
    try {
      // In a real implementation, this would call an edge function to detect language
      await new Promise(resolve => setTimeout(resolve, 500));
      
      logAIAction('Detected language', { text });
      
      // Mock detection based on common Italian words
      const italianWords = ['ciao', 'buongiorno', 'grazie', 'prego', 'arrivederci'];
      const lowerText = text.toLowerCase();
      
      for (const word of italianWords) {
        if (lowerText.includes(word)) {
          return 'italian';
        }
      }
      
      return 'english';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(errorMessage);
      
      console.error('Error detecting language:', error);
      return 'unknown';
    } finally {
      setIsProcessing(false);
    }
  }, [logAIAction]);
  
  // Create the context value object
  const contextValue: AIUtilsContextType = {
    generateText,
    translateText,
    analyzeUserInput,
    detectLanguage,
    isProcessing,
    lastError
  };
  
  return (
    <AIUtilsContext.Provider value={contextValue}>
      {children}
    </AIUtilsContext.Provider>
  );
};
