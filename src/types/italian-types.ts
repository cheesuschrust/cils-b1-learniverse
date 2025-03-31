
/**
 * Italian Learning Specific Types
 * 
 * This file contains type definitions specific to the Italian language learning features
 * and CILS exam preparation system.
 */

// Italian-specific Core Types
export type ItalianLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type ItalianTestSection = 'listening' | 'reading' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' | 'culture';
export type CILSExamType = 'A1' | 'A2' | 'B1' | 'B1-Citizenship' | 'B2' | 'C1' | 'C2';

// Database Entity Types
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

export interface ItalianFlashcard {
  id: string;
  user_id: string;
  italian_text: string;
  english_translation: string;
  example_sentence?: string;
  category: string;
  last_reviewed?: string;
  next_review?: string;
  difficulty: number;
  created_at: string;
  is_citizenship_relevant: boolean;
}

export interface UserProgress {
  id: string;
  user_id: string;
  italian_level: ItalianLevel;
  xp_points: number;
  listening_score: number;
  reading_score: number;
  writing_score: number;
  speaking_score: number;
  grammar_score: number;
  vocabulary_score: number;
  culture_score: number;
  citizenship_test_readiness: number;
  last_activity_date: string;
}

export interface ItalianPracticeSession {
  id: string;
  user_id: string;
  session_type: ItalianTestSection;
  start_time: string;
  end_time?: string;
  score?: number;
  questions_answered: number;
  questions_correct: number;
  is_citizenship_focused: boolean;
}

export interface CitizenshipModule {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  content_type: ItalianTestSection;
  content: string;
  questions: CitizenshipQuestion[];
  cultural_notes?: string;
}

export interface CitizenshipQuestion {
  id: string;
  text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  category: 'history' | 'culture' | 'civics' | 'language' | 'daily_life';
  difficulty: 1 | 2 | 3;
}

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
  difficulty: number;
  isCitizenshipRelevant: boolean;
}

export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}

// Component Props
export interface CitizenshipContentProps {
  settings: {
    italianLevel: ItalianLevel;
    testSection: ItalianTestSection;
    isCitizenshipFocused: boolean;
    topics: string[];
  };
  onContentGenerated?: (content: AIGeneratedQuestion[]) => void;
  onError?: (error: string) => void;
}

export interface ItalianPracticeProps {
  testSection: ItalianTestSection;
  level: ItalianLevel;
  isCitizenshipMode: boolean;
  onComplete?: (results: {score: number; time: number}) => void;
}

export interface FlashcardManagerProps {
  userId: string;
  filter?: {
    category?: string;
    isCitizenshipRelevant?: boolean;
  };
  onFlashcardAdded?: (flashcard: ItalianFlashcard) => void;
}

export interface CitizenshipReadinessProps {
  userId: string;
  onStatusChange?: (readiness: number) => void;
}
