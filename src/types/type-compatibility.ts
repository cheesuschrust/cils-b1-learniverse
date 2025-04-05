
// This file provides type compatibility between different type naming conventions
// across the codebase, reducing the need for type assertions

import { UserRole, User } from './user';
import { UserSettings } from './user-types';
import { Notification, NotificationType, NotificationAction } from './notification';
import { AIModel, AIStatus, AIPreferences } from './ai';
import { Flashcard, FlashcardSet } from './flashcard-types';
import { License, LicenseType, LicenseStatus, RenewalStatus } from './license';
import { AdUnit, AdSettings, AdNetwork } from './ad';
import { Question, QuestionSet } from './question';

// Centralized type definitions with all variants
export type ContentTypeAll = 
  | 'flashcards' 
  | 'multiple-choice' 
  | 'listening' 
  | 'writing' 
  | 'speaking'
  | 'pdf'
  | 'document'
  | 'video'
  | 'audio'
  | 'image'
  | 'unknown'
  | string;

// Define common variant mappings
export const ContentTypeMap: Record<string, ContentTypeAll> = {
  'flashcard': 'flashcards',
  'multiple_choice': 'multiple-choice',
  'quiz': 'multiple-choice',
  'speech': 'speaking',
  'pronunciation': 'speaking',
  'text': 'writing',
  'essay': 'writing',
  'comprehension': 'listening',
  'audio': 'listening',
  'doc': 'document',
  'docx': 'document',
  'pdf': 'pdf',
  'mp3': 'audio',
  'mp4': 'video',
  'jpg': 'image',
  'jpeg': 'image',
  'png': 'image',
};

// Support for variant difficulty naming
export type DifficultyLevel = 
  | 'beginner' | 'Beginner' 
  | 'intermediate' | 'Intermediate' 
  | 'advanced' | 'Advanced';

export const normalizeDifficulty = (difficulty: DifficultyLevel): 'beginner' | 'intermediate' | 'advanced' => {
  const lowercase = difficulty.toLowerCase();
  if (lowercase === 'beginner') return 'beginner';
  if (lowercase === 'intermediate') return 'intermediate';
  if (lowercase === 'advanced') return 'advanced';
  return 'intermediate'; // Default
};

// Define language variants
export type LanguageOption = 'english' | 'italian' | 'both' | 'en' | 'it' | 'auto-detect' | 'auto';

export const normalizeLanguage = (language: LanguageOption): 'english' | 'italian' | 'both' => {
  if (language === 'en') return 'english';
  if (language === 'it') return 'italian';
  if (language === 'auto-detect' || language === 'auto') return 'both';
  if (language === 'english' || language === 'italian' || language === 'both') return language;
  return 'both'; // Default
};

// AI Model utilities
export const normalizeAIModel = (model: AIModel | string): 'small' | 'medium' | 'large' => {
  // Map external model names to our internal size classifications
  if (['gpt-4o-mini', 'mistral-small', 'small'].includes(model as string)) return 'small';
  if (['gpt-4o', 'claude-instant', 'medium'].includes(model as string)) return 'medium';
  if (['gpt-4', 'claude-2', 'large'].includes(model as string)) return 'large';
  return 'medium'; // Default
};

// Helper functions to handle snake_case to camelCase conversions for user objects
export const normalizeUser = (user: any): User => {
  if (!user) return null as any;
  
  return {
    id: user.id || user.uid || '',
    email: user.email || '',
    firstName: user.firstName || user.first_name || '',
    lastName: user.lastName || user.last_name || '',
    displayName: user.displayName || user.display_name || '',
    photoURL: user.photoURL || user.photo_url || user.avatar || user.profileImage || '',
    role: (user.role || 'user') as UserRole,
    createdAt: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
    updatedAt: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
    preferences: user.preferences || {
      theme: 'light',
      language: 'en',
      notifications: true,
      onboardingCompleted: true
    },
    dailyQuestionCounts: user.dailyQuestionCounts || {
      flashcards: 0,
      multipleChoice: 0,
      speaking: 0,
      writing: 0,
      listening: 0
    },
    lastActive: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
    subscription: user.subscription || 'free',
    status: user.status || 'active',
    metrics: user.metrics || {
      totalQuestions: 0,
      correctAnswers: 0,
      streak: 0
    },
    preferredLanguage: user.preferredLanguage || user.preferred_language || 'english'
  };
};

// Normalize flashcard data for consistency
export const normalizeFlashcard = (card: any): Flashcard => {
  if (!card) return null as any;
  
  return {
    id: card.id || '',
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    level: card.level || 0,
    tags: card.tags || [],
    nextReview: card.nextReview || card.dueDate || new Date(),
    createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : new Date(),
    mastered: card.mastered || false,
    italian: card.italian,
    english: card.english,
    difficulty: card.difficulty || 0,
    lastReviewed: card.lastReviewed || null
  };
};

/**
 * Normalized field mappings for supporting conversion between naming conventions
 */
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

/**
 * Convert legacy user object to current User format
 */
export function convertLegacyUser(user: any): User {
  return normalizeUser(user);
}

// Normalizes user records, ensuring consistent property naming
export const normalizeUserRecords = (users: any[]): User[] => {
  if (!users || !Array.isArray(users)) return [];
  return users.map(user => normalizeUser(user));
};

// Export for calculateReviewPerformance
export const calculateReviewPerformance = (correctCount: number, totalCount: number): number => {
  if (totalCount === 0) return 0;
  return (correctCount / totalCount) * 100;
};

export default {
  normalizeUser,
  normalizeUserRecords,
  normalizeDifficulty,
  normalizeLanguage,
  normalizeAIModel,
  normalizeFlashcard,
  convertLegacyUser,
  normalizeFields,
  calculateReviewPerformance
};
