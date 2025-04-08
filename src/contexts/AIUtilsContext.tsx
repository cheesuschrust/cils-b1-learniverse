
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIUtilsContextType {
  isModelLoaded: boolean;
  loadModel: () => Promise<boolean>;
  unloadModel: () => void;
  analyzeText: (text: string) => Promise<any>;
  generateContent: (prompt: string) => Promise<string>;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
}

const AIUtilsContext = createContext<AIUtilsContextType | undefined>(undefined);

export const AIUtilsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const loadModel = async (): Promise<boolean> => {
    try {
      setStatus('loading');
      // Simulate model loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsModelLoaded(true);
      setStatus('ready');
      return true;
    } catch (err) {
      console.error('Error loading AI model:', err);
      setStatus('error');
      setError('Failed to load AI model. Please try again later.');
      return false;
    }
  };

  const unloadModel = () => {
    setIsModelLoaded(false);
    setStatus('idle');
    setError(null);
  };

  const analyzeText = async (text: string) => {
    if (!isModelLoaded) {
      throw new Error('AI model not loaded. Call loadModel() first.');
    }

    try {
      // Simulate text analysis
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock analysis results
      return {
        sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
        entities: ['person', 'location', 'organization'].filter(() => Math.random() > 0.5),
        difficulty: Math.floor(Math.random() * 5) + 1,
        keywords: ['italian', 'language', 'learning'].filter(() => Math.random() > 0.3),
        confidence: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
      };
    } catch (err) {
      console.error('Error analyzing text:', err);
      throw new Error('Failed to analyze text');
    }
  };

  const generateContent = async (prompt: string): Promise<string> => {
    if (!isModelLoaded) {
      throw new Error('AI model not loaded. Call loadModel() first.');
    }

    try {
      // Simulate content generation
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Return mock generated content
      const responses = [
        "Here's your generated Italian content based on the prompt.",
        "Ecco il contenuto generato in italiano basato sul prompt fornito.",
        "I've analyzed your request and created the following content.",
        "Based on your specifications, here's the Italian language material you requested."
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    } catch (err) {
      console.error('Error generating content:', err);
      throw new Error('Failed to generate content');
    }
  };

  return (
    <AIUtilsContext.Provider
      value={{
        isModelLoaded,
        loadModel,
        unloadModel,
        analyzeText,
        generateContent,
        status,
        error
      }}
    >
      {children}
    </AIUtilsContext.Provider>
  );
};

export const useAI = (): AIUtilsContextType => {
  const context = useContext(AIUtilsContext);
  if (!context) {
    throw new Error('useAI must be used within an AIUtilsProvider');
  }
  return context;
};
