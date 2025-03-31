
import React from 'react';

// Core Types  
export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B1-Citizenship' | 'B2' | 'C1' | 'C2';  
export type ContentType = 'listening' | 'reading' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' | 'culture';  

// This is the critical type that's causing most of your errors  
export interface QuestionGenerationParams {  
  language: string;  
  difficulty: DifficultyLevel;  
  contentTypes: ContentType[];  
  focusAreas?: string[];  
  count?: number;  
  userId?: string;  
  context?: string;  
}  

export interface AIQuestion {  
  id: string;  
  text: string;  
  options?: string[];  
  correctAnswer: string;  
  explanation?: string;  
  type: ContentType;  
  difficulty: DifficultyLevel;  
}  

export interface AIGenerationResult {  
  questions: AIQuestion[];  
  error?: string;  
}  

// Component Props  
export interface EnhancedErrorBoundaryProps {  
  fallback?: React.ReactNode;  
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;  
  children: React.ReactNode;  
}  

export interface AIContentProcessorProps {  
  settings: {  
    language: string;  
    difficulty: DifficultyLevel;  
    contentTypes: ContentType[];  
    focusAreas?: string[];  
  };  
  onContentGenerated?: (content: AIQuestion[]) => void;  
  onError?: (error: string) => void;  
}  

// Context Types  
export interface AIUtilsContextType {  
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGenerationResult>;  
  isGenerating: boolean;  
  remainingCredits: number;  
  usageLimit: number;
}

// Add exports for Italian-specific types that were causing errors
export interface CitizenshipContentProps {  
  settings: {  
    italianLevel: DifficultyLevel;  
    testSection: ContentType;  
    isCitizenshipFocused: boolean;  
    topics: string[];  
  };  
  onContentGenerated?: (content: AIQuestion[]) => void;  
  onError?: (error: string) => void;  
}

export interface ItalianPracticeProps {  
  testSection: ContentType;  
  level: DifficultyLevel;  
  isCitizenshipMode: boolean;  
  onComplete?: (results: {score: number; time: number}) => void;  
}

export interface CitizenshipReadinessProps {  
  userId: string;  
  onStatusChange?: (readiness: number) => void;  
}

export interface ItalianTestSection {
  listening: 'listening';
  reading: 'reading';
  writing: 'writing';
  speaking: 'speaking';
  grammar: 'grammar';
  vocabulary: 'vocabulary';
  culture: 'culture';
}

export type AIGeneratedQuestion = AIQuestion;

// Export the necessary types to fix the errors in existing components
export type { SpeakableWordProps } from '../lib/interface-fixes';
