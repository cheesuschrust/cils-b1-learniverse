
// Define core type definitions used across the application

// User types
export interface User {
  id: string;
  email: string;
  isPremium?: boolean;
  isPremiumUser?: boolean;
  displayName?: string;
  avatarUrl?: string;
  createdAt?: string;
}

// Learning content types
export type ContentType = 'flashcards' | 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'citizenship';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ItalianLevel = 'beginner' | 'intermediate' | 'advanced';
export type ItalianTestSection = 'grammar' | 'vocabulary' | 'culture' | 'listening' | 'reading' | 'writing' | 'speaking' | 'citizenship';

// Exercise types
export interface Exercise {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  difficulty: DifficultyLevel;
  content: any;
  created_at?: string;
  updated_at?: string;
}

// Learning progress tracking
export interface Progress {
  userId: string;
  contentId: string;
  progress: number;
  completed: boolean;
  score?: number;
  lastActivity: Date;
}

// Analytics types for tracking user performance
export interface PerformanceMetrics {
  accuracy: number;
  speed?: number;
  consistency?: number;
  retention?: number;
}

// AI-related types
export interface AIContentAnalysis {
  contentType: ContentType;
  confidence: number;
  language: 'italian' | 'english' | 'mixed';
  topics: string[];
  complexity: DifficultyLevel;
}

export interface AIQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: 'multiple-choice' | 'open-ended' | 'true-false';
  difficulty: DifficultyLevel;
}

export interface AIGenerationResult {
  questions: AIQuestion[];
  error?: string;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface AudioProcessingResult {
  text: string;
  confidence: number;
  language: string;
}

// Document processing types
export interface ProcessedDocument {
  id: string;
  title?: string;
  content: string;
  contentType: ContentType;
  analysis: AIContentAnalysis;
  questions?: AIQuestion[];
  created_at: string;
  created_by: string;
}

// Model training data types
export interface TrainingData {
  id: string;
  inputText: string;
  expectedOutput: string;
  contentType: string;
  difficulty: DifficultyLevel;
  language: string;
  created_at?: string;
  created_by?: string;
}

export interface ModelPerformance {
  id: string;
  modelName: string;
  version: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  trainingDate: string;
}
