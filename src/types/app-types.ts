
// Define application-specific types that build on core-types

import { DifficultyLevel, AIQuestion, AIGenerationResult } from './core-types';

// Flashcard types
export interface Flashcard {
  id: string;
  front: string; 
  back: string;
  italian?: string;
  english?: string;
  level: number;
  difficulty: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  set_id?: string;
  tags?: string[];
  nextReview?: Date;
  last_reviewed?: Date;
  mastered?: boolean;
  progress?: any;
  isDue?: boolean;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  language: string;
  category?: string;
  tags?: string[];
  user_id?: string;
  is_public: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  cards?: Flashcard[];
  dueCount?: number;
  totalCards?: number;
  lastStudied?: string;
}

// AI utilities context types
export interface QuestionGenerationParams {
  contentTypes: string[];
  topics: string[];
  difficulty: DifficultyLevel;
  count: number;
  isCitizenshipFocused?: boolean;
}

export interface AIUtilsContextType {
  generateQuestions: (params: QuestionGenerationParams) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
}

// Content processing types
export interface ContentProcessorProps {
  onProcessed?: (result: any) => void;
  initialContent?: string;
  initialContentType?: string;
  userId?: string;
}

export interface ProcessingResult {
  contentType: string;
  confidence: number;
  language: string;
  topics: string[];
  questions?: AIQuestion[];
}

// AI Assistant types
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  translation?: string;
}

export interface ChatContext {
  topic?: string;
  language?: 'italian' | 'english' | 'both';
  difficulty?: DifficultyLevel;
  userLevel?: DifficultyLevel;
}

// AI Feedback types
export interface FeedbackItem {
  text: string;
  explanation: string;
  suggestion?: string;
  severity: 'minor' | 'major' | 'critical';
}

export interface GrammarAnalysisResult {
  score: number;
  feedback: string;
  grammarIssues: FeedbackItem[];
  vocabularyFeedback?: string;
  structureFeedback?: string;
  overallScore: number;
}

// Speech analysis types
export interface SpeechAnalysisResult {
  transcribedText: string;
  similarityScore: number;
  feedback: string;
  wordLevelAnalysis?: Array<{
    word: string;
    confidence: number;
    startTime: number;
    endTime: number;
  }>;
}

// Model training types
export interface TrainingExample {
  input: string;
  output: string;
  metadata?: {
    difficulty: DifficultyLevel;
    language: string;
    contentType: string;
  };
}

// Content visualization types
export interface ContentImpact {
  contentId: string;
  impactScore: number;
  usageCount: number;
  userProgress: number;
  confidenceScore: number;
}

export interface UserContribution {
  userId: string;
  contributionCount: number;
  qualityScore: number;
  contentTypes: Record<string, number>;
  lastContribution: Date;
}

// Health indicators
export interface ContentHealthIndicator {
  contentId: string;
  score: number;
  issues: string[];
  recommendations: string[];
}
