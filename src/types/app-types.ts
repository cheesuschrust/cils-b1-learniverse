
import { ItalianLevel, ItalianTestSection } from './italian-types';

// Core application types
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentType = 'flashcards' | 'multiple-choice' | 'writing' | 'speaking' | 'listening';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';

// AI Question types
export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
}

// Error boundary props
export interface EnhancedErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  showDetails?: boolean;
  reportErrors?: boolean;
}

// AI Content Processor
export interface AIContentProcessorProps {
  content: string;
  onProcessed: (result: any) => void;
  processingOptions?: ProcessContentOptions;
}

export interface ProcessContentOptions {
  type?: ContentType;
  difficulty?: DifficultyLevel;
  language?: 'italian' | 'english' | 'both';
  maxResults?: number;
}

// UI Components
export interface ConfidenceIndicatorProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  contentType?: string;
}

export interface LevelBadgeProps {
  level: ItalianLevel;
  className?: string;
}

// AIUtils Context types
export interface AIUtilsContextType {
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
}

export interface QuestionGenerationParams {
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count?: number;
  isCitizenshipFocused?: boolean;
  language?: 'english' | 'italian' | 'both';
}

export interface AIGenerationResult {
  questions: AIQuestion[];
  error?: string;
}

// User Profile
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  language: string;
  difficulty: DifficultyLevel;
  createdAt: Date;
  updatedAt: Date;
  isPremiumUser: boolean;
}
