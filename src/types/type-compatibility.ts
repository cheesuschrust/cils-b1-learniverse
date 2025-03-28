// This file provides type compatibility between different type naming conventions
// across the codebase, reducing the need for type assertions

import { UserRole, User, UserPreferences } from './user';
import { Notification, NotificationType, NotificationAction } from './notification';
import { AIModel, AIStatus, AIPreferences } from './ai';
import { Flashcard, FlashcardSet } from './flashcard';
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
    id: user.id,
    email: user.email,
    firstName: user.firstName || user.first_name,
    lastName: user.lastName || user.last_name,
    displayName: user.displayName || user.display_name,
    photoURL: user.photoURL || user.photo_url || user.avatar || user.profileImage,
    role: user.role || 'user',
    isVerified: user.isVerified || user.is_verified || false,
    createdAt: user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at) : new Date(),
    updatedAt: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
    lastLogin: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
    lastActive: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
    status: user.status || 'active',
    subscription: user.subscription || 'free',
    phoneNumber: user.phoneNumber || user.phone_number,
    address: user.address,
    preferences: user.preferences || {},
    preferredLanguage: user.preferredLanguage || user.preferred_language || 'english',
    language: user.language || user.preferredLanguage || user.preferred_language || 'english',
    metrics: user.metrics || { totalQuestions: 0, correctAnswers: 0, streak: 0 },
    dailyQuestionCounts: user.dailyQuestionCounts || { 
      flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 
    }
  };
};

// License normalization
export const normalizeLicense = (license: any): License => {
  if (!license) return null as any;

  // Ensure customization has domain property
  const customization = {
    ...license.customization || {},
    domain: license.customization?.domain || license.domain || '',
    logo: license.customization?.logo || '',
    colors: license.customization?.colors || { primary: '#000000', secondary: '#ffffff' }
  };

  return {
    id: license.id,
    name: license.name,
    type: license.type,
    plan: license.plan,
    seats: license.seats,
    usedSeats: license.usedSeats,
    startDate: license.startDate,
    endDate: license.endDate,
    status: license.status,
    contactName: license.contactName,
    contactEmail: license.contactEmail,
    customization,
    domain: license.domain || customization.domain,
    value: license.value,
    renewalStatus: license.renewalStatus
  };
};

// Function to normalize user record arrays that use snake_case
export const normalizeUserRecords = (users: any[]): User[] => {
  if (!users || !Array.isArray(users)) return [];
  
  return users.map(user => normalizeUser(user));
};

export default {
  normalizeUser,
  normalizeUserRecords,
  normalizeDifficulty,
  normalizeLanguage,
  normalizeAIModel,
  normalizeLicense
};
