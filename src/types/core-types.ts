
/**
 * Core type definitions for the application
 * This file consolidates types from various modules for consistency
 */

// Re-export from existing modules for backward compatibility
export * from './app-types';
export * from './italian-types';
export * from './ai';
export * from './interface-fixes';

// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  preferredLanguage?: string;
  isPremiumUser?: boolean;
  role?: 'user' | 'admin' | 'moderator' | 'teacher';
  status?: 'active' | 'inactive' | 'suspended';
}

// Flashcard types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian?: string;
  english?: string;
  difficulty: number;
  tags: string[];
  lastReviewed: Date | null;
  nextReview: Date | null;
  createdAt: Date;
  updatedAt?: Date;
  reviewHistory?: ReviewHistory[];
}

export interface ReviewHistory {
  date: Date;
  performance: number;
  timeSpent: number;
}

// AI Content types
export interface AIContentSettings {
  language: string;
  difficulty: string;
  contentTypes: string[];
  focusAreas?: string[];
  count?: number;
}

export interface AIContentProcessorProps {
  content?: string;
  contentType?: string;
  onQuestionsGenerated?: (questions: any[]) => void;
  settings?: AIContentSettings;
  onContentGenerated?: (content: any) => void;
  onError?: (error: string) => void;
}

// Voice and Speech types
export interface VoicePreference {
  englishVoiceURI: string;
  italianVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
}

export interface SpeakableWordProps {
  word: string;
  language?: string;
  className?: string;
  showTooltip?: boolean;
  tooltipContent?: string;
  onPlayComplete?: () => void;
  autoPlay?: boolean;
  size?: string;
  onClick?: () => void;
  iconOnly?: boolean;
}

// These helper functions ensure consistent handling of types
export function normalizeFlashcard(card: any): Flashcard {
  return {
    id: card.id || '',
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    difficulty: typeof card.difficulty === 'number' ? card.difficulty : 1,
    tags: card.tags || [],
    lastReviewed: card.lastReviewed || null,
    nextReview: card.nextReview || null,
    createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : undefined,
    reviewHistory: card.reviewHistory || [],
    italian: card.italian || card.front,
    english: card.english || card.back,
  };
}

export function calculateReviewPerformance(answers: any[]): {
  score: number;
  time: number;
  date: Date;
} {
  return {
    score: answers.filter(a => a.isCorrect).length / answers.length * 100,
    time: answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
    date: new Date(),
  };
}
