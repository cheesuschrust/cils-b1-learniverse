
import React, { createContext, useContext, useState } from 'react';  
import {   
  AIUtilsContextType,   
  QuestionGenerationParams,   
  AIGenerationResult,
  AIQuestion  
} from '../types/app-types';  

// Create the context with proper typing  
const AIUtilsContext = createContext<AIUtilsContextType | undefined>(undefined);  

export function AIUtilsProvider({ children }: { children: React.ReactNode }) {  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);  
  const [remainingCredits, setRemainingCredits] = useState<number>(100);  
  const [usageLimit] = useState<number>(100);  

  // This is the function with the fixed parameter types  
  async function generateQuestions(params: QuestionGenerationParams): Promise<AIGenerationResult> {  
    setIsGenerating(true);  
    
    try {  
      // API call to generate questions would go here  
      const mockQuestions: AIQuestion[] = [  
        {  
          id: '1',  
          text: 'Qual è la capitale d\'Italia?',  
          options: ['Roma', 'Milano', 'Firenze', 'Napoli'],  
          correctAnswer: 'Roma',  
          explanation: 'Roma è la capitale dell\'Italia dal 1871.',  
          type: 'culture',  
          difficulty: 'B1'  
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

  const value: AIUtilsContextType = {  
    generateQuestions,  
    isGenerating,  
    remainingCredits,  
    usageLimit  
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
