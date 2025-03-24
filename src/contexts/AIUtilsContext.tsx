
import React, { createContext, useContext, useState, useEffect } from 'react';
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
}

const defaultContextData: AIContextData = {
  isAIEnabled: false,
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
};

const AIUtilsContext = createContext<AIContextData>(defaultContextData);

export const useAIUtils = () => useContext(AIUtilsContext);

export const AIUtilsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(true);
  const [modelSize, setModelSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [confidenceScores, setConfidenceScores] = useState<Record<ContentType, number>>(defaultContextData.confidenceScores);
  const [lastGeneratedResults, setLastGeneratedResults] = useState<any[]>([]);
  
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
    updateConfidenceScore
  };
  
  return (
    <AIUtilsContext.Provider value={contextValue}>
      {children}
    </AIUtilsContext.Provider>
  );
};
