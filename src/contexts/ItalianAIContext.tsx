
import React, { createContext, useContext, useState } from 'react';  
import {   
  AIUtilsContextType,   
  QuestionGenerationParams,   
  AIGenerationResult,
  AIQuestion,
  DifficultyLevel
} from '../types/app-types';  
import { useAuth } from './AuthContext';  

// Create context with the proper type  
const ItalianAIContext = createContext<AIUtilsContextType | undefined>(undefined);  

export function ItalianAIProvider({ children }: { children: React.ReactNode }) {  
  const { user } = useAuth();  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);  
  const [remainingCredits, setRemainingCredits] = useState<number>(100);  
  const [usageLimit] = useState<number>(100);  

  // Generate Italian citizenship test questions  
  async function generateQuestions(params: QuestionGenerationParams): Promise<AIGenerationResult> {  
    if (!user) {  
      return {   
        questions: [],  
        error: 'User not authenticated'   
      };  
    }  

    if (remainingCredits <= 0) {  
      return {   
        questions: [],  
        error: 'Usage limit reached'   
      };  
    }  

    setIsGenerating(true);  

    try {  
      // API call to generate questions  
      const response = await fetch('/api/generate-italian-questions', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          userId: user.id,  
          ...params  
        }),  
      });  

      if (!response.ok) {  
        const errorData = await response.json();  
        throw new Error(errorData.message || 'Failed to generate Italian questions');  
      }  

      const result = await response.json();  
      
      // Deduct credits  
      setRemainingCredits(prev => Math.max(0, prev - 1));  

      return {   
        questions: result.questions as AIQuestion[]  
      };  
    } catch (error) {  
      console.error('Error generating Italian questions:', error);  
      return {   
        questions: [],  
        error: error instanceof Error ? error.message : 'Unknown error generating questions'  
      };  
    } finally {  
      setIsGenerating(false);  
    }  
  }  

  // Generate explanations in Italian  
  async function generateItalianExplanation(italianText: string, level: DifficultyLevel): Promise<string> {  
    if (!user || remainingCredits <= 0) {  
      return 'Unable to generate explanation. Please check your account status.';  
    }  

    setIsGenerating(true);  

    try {  
      const response = await fetch('/api/generate-italian-explanation', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          userId: user.id,  
          italianText,  
          level  
        }),  
      });  

      if (!response.ok) {  
        throw new Error('Failed to generate explanation');  
      }  

      const result = await response.json();  
      setRemainingCredits(prev => Math.max(0, prev - 1));  
      
      return result.explanation;  
    } catch (error) {  
      console.error('Error generating explanation:', error);  
      return 'Error generating explanation. Please try again.';  
    } finally {  
      setIsGenerating(false);  
    }  
  }  

  // Translate Italian to English  
  async function translateToEnglish(italianText: string): Promise<string> {  
    if (!user || remainingCredits <= 0) {  
      return 'Translation service unavailable.';  
    }  

    setIsGenerating(true);  

    try {  
      const response = await fetch('/api/translate-italian', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          userId: user.id,  
          italianText  
        }),  
      });  

      if (!response.ok) {  
        throw new Error('Failed to translate text');  
      }  

      const result = await response.json();  
      setRemainingCredits(prev => Math.max(0, prev - 1));  
      
      return result.englishText;  
    } catch (error) {  
      console.error('Error translating text:', error);  
      return 'Error translating text. Please try again.';  
    } finally {  
      setIsGenerating(false);  
    }  
  }  

  // Evaluate written Italian responses  
  async function evaluateWrittenResponse(  
    response: string,   
    prompt: string,   
    level: DifficultyLevel  
  ): Promise<{score: number; feedback: string}> {  
    if (!user || remainingCredits <= 0) {  
      return {  
        score: 0,  
        feedback: 'Evaluation service unavailable. Please check your account status.'  
      };  
    }  

    setIsGenerating(true);  

    try {  
      const apiResponse = await fetch('/api/evaluate-italian-writing', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          userId: user.id,  
          response,  
          prompt,  
          level  
        }),  
      });  

      if (!apiResponse.ok) {  
        throw new Error('Failed to evaluate writing');  
      }  

      const result = await apiResponse.json();  
      setRemainingCredits(prev => Math.max(0, prev - 1));  
      
      return {  
        score: result.score,  
        feedback: result.feedback  
      };  
    } catch (error) {  
      console.error('Error evaluating writing:', error);  
      return {  
        score: 0,  
        feedback: 'Error evaluating your response. Please try again.'  
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

  return <ItalianAIContext.Provider value={value}>{children}</ItalianAIContext.Provider>;  
}  

export function useItalianAI(): AIUtilsContextType {  
  const context = useContext(ItalianAIContext);  
  if (context === undefined) {  
    throw new Error('useItalianAI must be used within an ItalianAIProvider');  
  }  
  return context;  
}  

export { ItalianAIContext };
