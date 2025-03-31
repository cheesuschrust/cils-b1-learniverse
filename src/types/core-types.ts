
/**
 * Core type definitions for the application
 * This file consolidates types from various modules for consistency
 */

// Re-export specific types from modules to prevent naming conflicts
import { 
  DifficultyLevel,
  ContentType,
  ButtonVariant,
  AIQuestion,
  EnhancedErrorBoundaryProps,
  AIContentProcessorProps,
  ProcessContentOptions,
  ConfidenceIndicatorProps,
  LevelBadgeProps,
  AIUtilsContextType,
  QuestionGenerationParams as AppQuestionGenerationParams,
} from './app-types';

import {
  ItalianLevel,
  ItalianTestSection,
  ItalianQuestionGenerationParams,
  AIGeneratedQuestion as ItalianAIGeneratedQuestion,
  AIGenerationResult as ItalianAIGenerationResult,
  CILSExamType,
  UserProfile as ItalianUserProfile
} from './italian-types';

import {
  AIModel,
  AIProvider,
  AIServiceOptions,
  AIPreference,
  UseAIReturn,
  AIService,
  AIStatus,
  AIOptions,
  AIFeedbackSettings
} from './ai';

import {
  SpeakableWordProps,
  Flashcard,
  FlashcardComponentProps,
  ReviewSchedule,
  ReviewPerformance,
  User,
  AISettings,
  FlashcardSet,
  FlashcardStats,
  ImportFormat
} from './interface-fixes';

import {
  LicenseType,
  LicenseStatus,
  RenewalStatus,
  License,
  LicenseUserAssignment,
  LicenseFeature,
  LicenseInvoice
} from './License';

// Voice and Speech types
export interface VoicePreference {
  englishVoiceURI: string;
  italianVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
}

export interface TextToSpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
}

export interface VoiceOptions extends TextToSpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export interface SpeechState {
  isReady: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  voices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
}

// User Management Types
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailNotifications: boolean;
  language: string;
  difficulty: DifficultyLevel;
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
  onboardingCompleted?: boolean;
}

// These helper functions ensure consistent handling of types
export function normalizeFlashcard(card: any): Flashcard {
  if (!card) {
    return null as any;
  }
  
  return {
    id: card.id || '',
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    italian: card.italian || card.front || '',
    english: card.english || card.back || '',
    difficulty: typeof card.difficulty === 'number' ? card.difficulty : 1,
    tags: card.tags || [],
    lastReviewed: card.lastReviewed || null,
    nextReview: card.nextReview || null,
    createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : undefined,
    reviewHistory: card.reviewHistory || [],
    level: card.level || 0,
    mastered: card.mastered || false,
    explanation: card.explanation || '',
    examples: card.examples || [],
    imageUrl: card.imageUrl || card.metadata?.imageUrl || '',
    audioUrl: card.audioUrl || card.metadata?.audioUrl || ''
  };
}

export function calculateReviewPerformance(answers: any[]): ReviewPerformance {
  if (!answers || answers.length === 0) {
    return {
      score: 0,
      time: 0,
      date: new Date()
    };
  }
  
  return {
    score: answers.filter(a => a.isCorrect).length / answers.length * 100,
    time: answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
    date: new Date(),
  };
}

// Utility function to check if a date is valid
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

// Utility function to normalize string fields
export function normalizeFields<T extends object>(data: T): T {
  if (!data) return data;
  
  const mappings: Record<string, string> = {
    photo_url: 'photoURL',
    display_name: 'displayName',
    first_name: 'firstName',
    last_name: 'lastName',
    is_verified: 'isVerified',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    last_login: 'lastLogin',
    last_active: 'lastActive',
    phone_number: 'phoneNumber',
    preferred_language: 'preferredLanguage'
  };

  return Object.entries(data).reduce((acc, [key, value]) => {
    const newKey = mappings[key] || key;
    return { ...acc, [newKey]: value };
  }, {} as T);
}

// Re-export key types
export type { 
  DifficultyLevel,
  ContentType,
  ButtonVariant,
  AIQuestion,
  EnhancedErrorBoundaryProps,
  AIContentProcessorProps,
  ProcessContentOptions,
  ConfidenceIndicatorProps,
  LevelBadgeProps,
  AIUtilsContextType,
  
  // Italian-specific types
  ItalianLevel,
  ItalianTestSection,
  ItalianQuestionGenerationParams,
  
  // AI types
  AIModel,
  AIProvider,
  AIServiceOptions,
  AIPreference,
  UseAIReturn,
  AIService,
  AIStatus,
  AIOptions,
  AIFeedbackSettings,
  AISettings,
  
  // Interface fixes
  SpeakableWordProps,
  Flashcard,
  FlashcardComponentProps,
  ReviewSchedule,
  ReviewPerformance,
  User,
  FlashcardSet,
  FlashcardStats,
  ImportFormat,
  
  // License types
  LicenseType,
  LicenseStatus,
  RenewalStatus,
  License,
  LicenseUserAssignment,
  LicenseFeature,
  LicenseInvoice
};

// Define unified types to handle the different versions
export type QuestionGenerationParams = AppQuestionGenerationParams & ItalianQuestionGenerationParams;

// Export consistently named types to prevent ambiguity
export { 
  ItalianAIGeneratedQuestion as AIGeneratedQuestion,
  ItalianAIGenerationResult as AIGenerationResult,
  ItalianUserProfile as UserProfile
};
