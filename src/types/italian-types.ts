
// Core Types 
export type ItalianLevel = 'A1' | 'A2' | 'B1' | 'B1-Citizenship' | 'B2' | 'C1' | 'C2';
export type ItalianTestSection = 'listening' | 'reading' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' | 'culture';
export type CILSExamType = 'A1' | 'A2' | 'B1' | 'B1-Citizenship' | 'B2' | 'C1' | 'C2';

// AI Content Types
export interface QuestionGenerationParams {
  italianLevel: ItalianLevel;
  testSection: ItalianTestSection;
  isCitizenshipFocused: boolean;
  topics?: string[];
  count?: number;
}

export interface AIGeneratedQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  isCitizenshipRelevant: boolean;
}

export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}
