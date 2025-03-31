
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
  lastActive?: Date;
  preferredLanguage?: string;
  isPremiumUser?: boolean;
  role?: 'user' | 'admin' | 'moderator' | 'teacher';
  status?: 'active' | 'inactive' | 'suspended';
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

// These helper functions ensure consistent handling of types
export function normalizeFlashcard(card: any): import('./interface-fixes').Flashcard {
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
    level: card.level || 0,
    mastered: card.mastered || false
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

// Utility function to check if a date is valid
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

// Utility function to normalize string fields
export function normalizeFields<T extends Record<string, any>>(data: T): T {
  const mappings = {
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
    const newKey = mappings[key as keyof typeof mappings] || key;
    return { ...acc, [newKey]: value };
  }, {} as T);
}
