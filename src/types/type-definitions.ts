
/**
 * Core TypeScript Type Definitions
 * 
 * This file consolidates and documents key type definitions used across the application.
 * Import types from this file to ensure consistency.
 */

// User Types
export type UserRole = 'user' | 'admin' | 'teacher' | 'moderator' | 'editor';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type UserSubscription = 'free' | 'premium' | 'enterprise' | 'educational';
export type ThemeOption = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeOption;
  language: string;
  notifications: boolean;
  onboardingCompleted: boolean;
  emailNotifications: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  fontSize?: number;
  notificationsEnabled?: boolean;
  animationsEnabled?: boolean;
  preferredLanguage?: string;
  voiceSpeed?: number;
  autoPlayAudio?: boolean;
  showProgressMetrics?: boolean;
  aiEnabled?: boolean;
  aiModelSize?: string;
  aiProcessingOnDevice?: boolean;
  confidenceScoreVisible?: boolean;
  bio?: string;
}

export interface UserMetrics {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  [key: string]: any;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  avatar?: string;
  profileImage?: string;
  name?: string;
  username?: string;
  role: UserRole;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  lastActive?: Date;
  status?: UserStatus;
  subscription?: UserSubscription;
  phoneNumber?: string;
  address?: string;
  preferredLanguage?: string;
  isAdmin?: boolean;
  isPremiumUser?: boolean;
  isPremium?: boolean;
  preferences: UserPreferences;
  metrics?: UserMetrics;
  dailyQuestionCounts: {
    flashcards: number;
    multipleChoice: number;
    speaking: number;
    writing: number;
    listening: number;
    [key: string]: number;
  };
  usageMetrics?: {
    usedQuestions: number;
    totalQuestions: number;
    completedLessons: number;
  };
  
  // Add missing properties to fix errors
  hasCompletedOnboarding?: boolean;
}

// Content Types
export type ContentType = 
  | 'flashcards'
  | 'multiple-choice'
  | 'listening'
  | 'writing'
  | 'speaking'
  | 'pdf'
  | 'unknown'
  | 'json'; // Added json type to fix issues with variant-fixes.ts

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian?: string;
  english?: string;
  level: number;
  difficulty: number;
  tags: string[];
  mastered?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastReviewed?: Date | null;
  nextReview?: Date | null;
  examples?: string[];
  explanation?: string;
  reviewHistory?: any[];
  category?: string;
  status?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  language: 'english' | 'italian';
  category: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  creator: string;
  isPublic: boolean;
  isFavorite: boolean;
  totalCards: number;
  masteredCards: number;
  tags: string[];
  name?: string;
  difficulty?: string;
}

// UI Types
export type ExtendedAlertVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'warning'
  | 'success'
  | 'primary'
  | 'info';

export type ExtendedButtonVariant = 
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'success'
  | 'warning';

// AI Types
export type AIModelSize = 'small' | 'medium' | 'large';

export type AIModel = 
  | AIModelSize
  | 'gpt-4o' 
  | 'gpt-4o-mini' 
  | 'gpt-4' 
  | 'gpt-3.5-turbo'
  | 'mistral-small'
  | 'mistral-medium'
  | 'mistral-large'
  | 'claude-instant'
  | 'claude-2'
  | 'claude-3';

export type AIPreference = 'minimal' | 'balanced' | 'extensive';
export type AIStatus = 'idle' | 'loading' | 'generating' | 'error' | 'ready';

export interface AISettings {
  model: AIModel;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stop?: string[];
  showFeedback?: boolean;
  defaultModelSize?: string; 
  voiceRate?: number;
  voicePitch?: number;
  englishVoiceURI?: string;
  italianVoiceURI?: string;
  assistantName?: string;
  features?: {
    contentGeneration: boolean;
    contentAnalysis: boolean;
    errorCorrection: boolean;
    personalization: boolean;
    pronunciationHelp: boolean;
    conversationalLearning: boolean;
    progressTracking: boolean;
    difficultyAdjustment: boolean;
    languageTranslation: boolean;
    flashcards?: boolean;
    questions?: boolean;
    listening?: boolean;
    speaking?: boolean;
    writing?: boolean;
    translation?: boolean;
    explanation?: boolean;
    correction?: boolean;
    simplified?: boolean;
  };
}

// Component Props Types
export interface ProcessContentOptions {
  maxLength?: number;
  format?: string;
  temperature?: number;
  count?: number;
  difficulty?: string;
}

export interface ConfidenceIndicatorProps {
  contentType?: ContentType;
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface SpeakableWordProps {
  word: string;
  language?: string;
  size?: string;
  className?: string;
  showTooltip?: boolean;
  tooltipContent?: string;
  onClick?: () => void;
  onPlayComplete?: () => void;
  autoPlay?: boolean; // Added to fix errors
}

export interface LevelBadgeProps {
  level: number;
  showInfo?: boolean;
  size?: string; // Added to fix errors
}

// Context Types
export interface AIUtilsContextType {
  processContent: (prompt: string, options?: ProcessContentOptions) => Promise<string>;
  settings: AISettings;
  updateSettings: (settings: AISettings) => void;
  generateContent?: (prompt: string, options?: ProcessContentOptions) => Promise<string>;
  speakText?: (text: string, language?: string, onComplete?: () => void) => void;
  isSpeaking?: boolean;
  processAudioStream?: (stream: MediaStream) => Promise<string>;
  stopAudioProcessing?: () => void;
  isTranscribing?: boolean;
  hasActiveMicrophone?: boolean;
  checkMicrophoneAccess?: () => Promise<boolean>;
  generateQuestions?: (params: any) => Promise<any>; // Added to fix AIUtils context issues
  isGenerating?: boolean;
  remainingCredits?: number;
  usageLimit?: number;
  resetCredits?: () => Promise<void>;
}

// Error and Monitoring Types
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ErrorCategory {
  UI = 'UI',
  API = 'API',
  DATA = 'DATA',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSIONS = 'PERMISSIONS',
  VALIDATION = 'VALIDATION',
  PERFORMANCE = 'PERFORMANCE',
  STORAGE = 'STORAGE',
  UNKNOWN = 'UNKNOWN',
  FEATURE_FLAG = 'FEATURE_FLAG',
  AI_SERVICE = 'AI_SERVICE',
}

export interface ErrorMonitoringService {
  reportError: (errorData: {
    error: Error;
    errorInfo: React.ErrorInfo;
    category: ErrorCategory;
    severity: ErrorSeverity;
    boundary?: string;
    additionalInfo?: Record<string, any>;
  }) => void;
}

// Review and Metrics Types
export interface ReviewSchedule {
  interval: number;
  dueDate: Date;
  difficulty: number;
  overdue: number;
  upcoming: number;
  totalDue: number;
  nextWeekCount: number;
  dueToday: number;
  dueThisWeek: number;
  dueNextWeek: number;
  dueByDate: Record<string, number>;
}

export interface ReviewPerformance {
  score: number;
  time: number;
  date: Date;
  totalReviews?: number;
  correctReviews?: number;
  efficiency?: number;
  streakDays?: number;
  reviewsByCategory?: Record<string, number>;
  accuracy?: number;
  speed?: number;
  consistency?: number;
  retention?: number;
  overall?: number;
}

// Helper function to normalize ContentType
export function normalizeContentType(type: string): ContentType {
  const normalized = type.toLowerCase().replace('_', '-');
  
  if (normalized === 'flashcards' || 
      normalized === 'multiple-choice' || 
      normalized === 'listening' || 
      normalized === 'writing' || 
      normalized === 'speaking' || 
      normalized === 'pdf') {
    return normalized as ContentType;
  }
  
  // Map similar types
  if (normalized === 'flashcard') return 'flashcards';
  if (normalized === 'multiple choice' || normalized === 'quiz') return 'multiple-choice';
  if (normalized === 'audio') return 'listening';
  if (normalized === 'text') return 'writing';
  if (normalized === 'speech' || normalized === 'pronunciation') return 'speaking';
  if (normalized === 'document') return 'pdf';
  
  return 'unknown';
}

// Helper function to normalize AIModel
export function normalizeAIModel(model: string): AIModelSize {
  // Map external model names to our internal size classifications
  if (['gpt-4o-mini', 'mistral-small', 'small'].includes(model)) return 'small';
  if (['gpt-4o', 'claude-instant', 'medium'].includes(model)) return 'medium';
  if (['gpt-4', 'claude-2', 'large'].includes(model)) return 'large';
  return 'medium'; // Default
}
