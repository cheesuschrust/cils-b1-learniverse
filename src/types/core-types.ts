
// Core types for the CILS Italian Citizenship Question of the Day platform
import { User as SupabaseUser } from '@supabase/supabase-js';

// User Types
export type UserRole = 'user' | 'admin' | 'teacher' | 'moderator';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  preferences?: UserPreferences;
  dailyQuestionCounts?: {
    flashcards: number;
    multipleChoice: number;
    speaking: number;
    writing: number;
    listening: number;
  };
  lastActive?: Date;
  subscription: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  metrics?: {
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
  };
  preferredLanguage?: 'english' | 'italian';
  isPremiumUser?: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailNotifications: boolean;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  onboardingCompleted: boolean;
}

// Italian Learning Types
export type ItalianLevel = 'beginner' | 'intermediate' | 'advanced';

export type ItalianTestSection = 
  | 'grammar' 
  | 'vocabulary' 
  | 'culture' 
  | 'listening' 
  | 'reading' 
  | 'writing' 
  | 'speaking'
  | 'citizenship';

export interface AIGeneratedQuestion {
  id: string;
  text?: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: ItalianTestSection;
  difficulty: ItalianLevel;
  isCitizenshipRelevant?: boolean;
  question?: string;
  questionType: 'multipleChoice' | 'flashcards' | 'writing' | 'speaking' | 'listening';
}

export interface ItalianQuestionGenerationParams {
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count?: number;
  isCitizenshipFocused?: boolean;
  language?: 'english' | 'italian' | 'both';
}

export interface AIGenerationResult {
  questions: AIGeneratedQuestion[];
  error?: string;
}

export interface AnswerResults {
  score: number;
  time: number;
}

// Flashcard Types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian: string;
  english: string;
  difficulty: number | ItalianLevel;
  level: number;
  mastered: boolean;
  tags: string[];
  nextReview: Date;
  lastReviewed?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  explanation?: string;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  difficulty: ItalianLevel;
  tags: string[];
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPublic: boolean;
  category?: string;
  totalCards?: number;
}

// AI Types
export type AIModel = 
  | 'gpt-4o-mini'
  | 'gpt-4o' 
  | 'gpt-4-turbo' 
  | 'claude-instant' 
  | 'claude-2';

export interface AISettings {
  model: AIModel;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  contentFiltering: boolean;
}

export interface AIServiceOptions {
  temperature?: number;
  maxLength?: number;
  model?: AIModel;
}

export interface AIServiceInterface {
  generateText: (prompt: string, options?: AIServiceOptions) => Promise<string>;
  classifyText: (text: string) => Promise<Array<{ label: string; score: number }>>;
  getConfidenceScore: (contentType: string) => number;
  addTrainingExamples: (contentType: string, examples: any[]) => number;
  generateFlashcards: (topic: string, count?: number, difficulty?: string) => Promise<any[]>;
  generateQuestions: (content: string, count?: number, type?: string) => Promise<any[]>;
  abortRequest: (requestId: string) => void;
  abortAllRequests: () => void;
}

export interface ContentType {
  type: string;
  confidence: number;
  features: ContentFeatures;
}

export interface ContentFeatures {
  wordCount: number;
  sentenceCount: number;
  paragraphCount?: number;
  questionMarks?: number;
  language?: 'english' | 'italian' | 'mixed' | 'unknown';
}

// Hook return types
export interface UseAIReturn {
  generateQuestions: (params: ItalianQuestionGenerationParams) => Promise<AIGenerationResult>;
  isGenerating: boolean;
  remainingCredits: number;
  usageLimit: number;
  
  // Additional AI utilities that might be referenced in components
  loadModel?: (modelName: string) => Promise<boolean>;
  speak?: (text: string, language?: string) => Promise<void>;
  recognizeSpeech?: (audio: Blob) => Promise<string>;
  compareTexts?: (text1: string, text2: string) => Promise<number>;
  isAIEnabled?: boolean;
  status?: string;
  isModelLoaded?: boolean;
  processContent?: (content: string, options?: any) => Promise<any>;
}

export type AIUtilsContextType = UseAIReturn & {
  processContent: (content: string, options?: any) => Promise<any>;
  settings: AISettings;
  updateSettings: (settings: Partial<AISettings>) => void;
  generateContent: (prompt: string, options?: any) => Promise<string>;
  isSpeaking: boolean;
  processAudioStream: (stream: MediaStream) => Promise<string>;
  translateText: (text: string, targetLanguage: string) => Promise<string>;
  analyzeGrammar: (text: string, language: string) => Promise<any>;
  getVoices: () => SpeechSynthesisVoice[];
  stopSpeaking: () => void;
  detectLanguage: (text: string) => Promise<string>;
  getConfidenceLevel: (text: string, type: string) => Promise<number>;
  createEmbeddings: (text: string) => Promise<number[]>;
  compareSimilarity: (text1: string, text2: string) => Promise<number>;
  isProcessing: boolean;
  error: Error | null;
  abort: () => void;
  classifyText: (text: string) => Promise<any>;
  generateFlashcards: (topic: string, count?: number, difficulty?: string) => Promise<any[]>;
};

// Question Types
export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  category: string;
  difficulty: ItalianLevel;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  points: number;
}

export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: ItalianLevel;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPublic: boolean;
  completionCount: number;
  averageScore: number;
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category: string;
  difficulty: ItalianLevel;
  tags?: string[];
}

export interface QuestionGenerationParams {
  contentTypes: ItalianTestSection[];
  difficulty: ItalianLevel;
  count?: number;
  isCitizenshipFocused?: boolean;
  language?: 'english' | 'italian' | 'both';
}

export * from './italian-types';
export type { User, UserPreferences, UserRole };
