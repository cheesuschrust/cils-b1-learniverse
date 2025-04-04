
import { type AIOptions, type AIProcessingOptions, type AIServiceOptions } from './ai';
import { type AppLevel } from './config-types';
import { type ItalianLevel, type ItalianTestSection } from './italian-types';

/**
 * Italian language levels aligned with CILS certification
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Question generation parameters
 */
export interface QuestionGenerationParams {
  topics: string[];
  contentTypes: string[];
  difficulty: string;
  count: number;
  isCitizenshipFocused?: boolean;
}

/**
 * Result of AI generation
 */
export interface AIGenerationResult {
  questions: AIQuestion[];
  error?: string;
}

/**
 * AI generated question
 */
export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  questionType: 'multipleChoice' | 'flashcards' | 'writing' | 'speaking' | 'listening';
  isCitizenshipRelevant: boolean;
}

/**
 * AI Utils Context Type
 */
export interface AIUtilsContextType {
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
}

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  isPremiumUser: boolean;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User | null;
  error?: string;
  token?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * React component that accepts children
 */
export interface ChildrenProps {
  children: React.ReactNode;
}

/**
 * Progress tracking interface
 */
export interface ProgressData {
  skill: ItalianTestSection;
  score: number;
  maxScore: number;
  lastUpdated: Date;
  confidence: number;
}

/**
 * CILS B1 exam section progress
 */
export interface CILSExamProgress {
  section: ItalianTestSection;
  score: number;
  requiredScore: number;
  completed: boolean;
  lastAttempt?: Date;
}
