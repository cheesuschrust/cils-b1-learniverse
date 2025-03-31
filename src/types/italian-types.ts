
// Italian language learning specific types

// Re-export the types from app-types for consistency
export * from './app-types';

// Define ItalianLevel for type compatibility
export type ItalianLevel = 'A1' | 'A2' | 'B1' | 'B1-Citizenship' | 'B2' | 'C1' | 'C2';

// Define ItalianTestSection for type compatibility
export type ItalianTestSection = 'listening' | 'reading' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' | 'culture';

// Define CILSExamType for type compatibility
export type CILSExamType = 'A1' | 'A2' | 'B1' | 'B1-Citizenship' | 'B2' | 'C1' | 'C2';

// User Profile for Italian learning
export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  italian_level?: ItalianLevel;
  target_exam_date?: string;
  citizenship_application_status?: 'not_started' | 'in_progress' | 'submitted' | 'approved';
  study_streak_days: number;
  last_study_date?: string;
}

// Question generation params
export interface QuestionGenerationParams {
  italianLevel: ItalianLevel;
  testSection: ItalianTestSection;
  isCitizenshipFocused: boolean;
  topics?: string[];
  count?: number;
}

// AI generated question
export interface AIGeneratedQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: number;
  isCitizenshipRelevant: boolean;
}

// AI generation result
export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}
