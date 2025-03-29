
// Core interfaces and type compatibility functions

// VoicePreference interfaces
export interface VoiceOptions {
  voice: string;
  rate: number;
  pitch: number;
  volume?: number;
}

export interface TextToSpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  language?: string;
  volume?: number;
}

export interface SpeechState {
  speaking: boolean;
  voices: SpeechSynthesisVoice[];
  currentVoice: string | null;
  error?: string;  
  isPaused?: boolean;
  isLoading?: boolean;
}

export interface VoicePreference {
  englishVoiceURI: string;
  italianVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
  preferredLanguage?: string;
  volume?: number;
  autoPlay?: boolean;
  useNative?: boolean;
}

// Base interfaces for type safety  
export interface AIOptions {  
  temperature?: number;  
  maxTokens?: number;  
  model?: string;  
  context?: string;
  systemPrompt?: string;
  streaming?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
}  

export interface ReviewHistory {  
  reviewedAt: Date;  
  performance: number;  
  timeTaken?: number;  
}

export interface Flashcard {  
  id?: string;
  front: string;  
  back: string;  
  nextReview: Date | null;  
  level: number;
  tags?: string[];
  mastered?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  language?: string;
  lastReviewed?: Date;
  
  // Additional metadata
  created?: Date;  
  modified?: Date;
  reviewHistory?: ReviewHistory[];
  streak?: number;
  
  // Legacy compatibility
  italian?: string;
  english?: string;
  dueDate?: Date;
}  

// Legacy User interface for backward compatibility
export interface LegacyUser {
  uid?: string;
  photo_url?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
  last_active?: Date;
  preferred_language?: string;
}

// Import UserRole from the user types
import { UserRole } from '@/types/user';

// User settings interface
export interface UserSettings {  
  theme?: 'light' | 'dark' | 'system';  
  notifications?: boolean;  
  reviewInterval?: number;  
  dailyGoal?: number;  
}

// User interface with all required fields
export interface User {  
  id: string;
  uid?: string;
  email: string;  
  photoURL?: string;  
  displayName?: string;  
  firstName?: string;  
  lastName?: string;  
  createdAt?: Date;  
  updatedAt: Date;
  role: UserRole;
  preferredLanguage?: string;
  settings?: UserSettings | Record<string, unknown>;
  isPremium?: boolean;
  lastActive?: Date;
  
  // Legacy compatibility fields
  photo_url?: string;  
  display_name?: string;  
  first_name?: string;  
  last_name?: string;
  created_at?: Date;
  
  // Additional fields from the existing User interfaces
  isVerified?: boolean;
  lastLogin?: Date;
  status?: 'active' | 'inactive' | 'suspended';
  subscription?: 'free' | 'premium' | 'trial';
  phoneNumber?: string;
  address?: string;
  preferences?: any;
  language?: string;
  metrics?: {
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
    [key: string]: any;
  };
  dailyQuestionCounts?: {
    flashcards: number;
    multipleChoice: number;
    listening: number;
    writing: number;
    speaking: number;
    [key: string]: number;
  };
  name?: string;
  isAdmin?: boolean;
}

// Type normalization functions

/**
 * Normalizes flashcard data to ensure consistency across the application
 */
export function normalizeFlashcard(card: any): Flashcard {
  if (!card) return null as any;
  
  const now = new Date();
  
  return {
    id: card.id || '',
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    level: typeof card.level === 'number' ? card.level : 0,
    tags: Array.isArray(card.tags) ? card.tags : [],
    mastered: card.mastered || false,
    nextReview: card.nextReview instanceof Date 
      ? card.nextReview 
      : card.nextReview 
        ? new Date(card.nextReview) 
        : null,
    createdAt: card.createdAt instanceof Date ? card.createdAt : card.created instanceof Date ? card.created : now,
    updatedAt: card.updatedAt instanceof Date ? card.updatedAt : card.modified instanceof Date ? card.modified : now,
    language: card.language || undefined,
    lastReviewed: card.lastReviewed instanceof Date 
      ? card.lastReviewed 
      : card.lastReviewed 
        ? new Date(card.lastReviewed) 
        : undefined,
    created: card.created instanceof Date ? card.created : now,
    modified: card.modified instanceof Date ? card.modified : now,
    reviewHistory: Array.isArray(card.reviewHistory) ? card.reviewHistory : [],
    streak: typeof card.streak === 'number' ? Math.max(0, card.streak) : 0,
    italian: card.italian || card.front,
    english: card.english || card.back
  };
}

/**
 * Normalizes user object properties to ensure compatibility across the codebase
 */
export function normalizeUser(user: any): User {
  if (!user) return null as any;
  
  // Ensure date is properly handled
  const createdAtDate = user.createdAt instanceof Date   
    ? user.createdAt   
    : user.createdAt   
      ? new Date(user.createdAt)   
      : user.created_at instanceof Date
        ? user.created_at
        : user.created_at
          ? new Date(user.created_at)
          : new Date();
  
  return {
    id: user.id || user.uid || '',
    uid: user.uid || user.id,
    email: user.email || '',
    firstName: user.firstName || user.first_name || '',
    lastName: user.lastName || user.last_name || '',
    displayName: user.displayName || user.display_name || user.name || '',
    photoURL: user.photoURL || user.photo_url || user.avatar || user.profileImage || '',
    role: user.role || 'user',
    isVerified: user.isVerified || user.is_verified || false,
    createdAt: createdAtDate,
    updatedAt: user.updatedAt || user.updated_at ? new Date(user.updatedAt || user.updated_at) : new Date(),
    lastLogin: user.lastLogin || user.last_login ? new Date(user.lastLogin || user.last_login) : undefined,
    lastActive: user.lastActive || user.last_active ? new Date(user.lastActive || user.last_active) : undefined,
    status: user.status || 'active',
    subscription: user.subscription || 'free',
    phoneNumber: user.phoneNumber || user.phone_number || '',
    address: user.address || '',
    preferences: user.preferences || {},
    preferredLanguage: user.preferredLanguage || user.preferred_language || '',
    language: user.language || user.preferredLanguage || user.preferred_language || '',
    settings: user.settings || {},
    metrics: user.metrics || { totalQuestions: 0, correctAnswers: 0, streak: 0 },
    dailyQuestionCounts: user.dailyQuestionCounts || { 
      flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 
    },
    isPremium: Boolean(user.isPremium),
    
    // Legacy compatibility fields
    photo_url: user.photo_url || user.photoURL || '',
    display_name: user.display_name || user.displayName || '',
    first_name: user.first_name || user.firstName || '',
    last_name: user.last_name || user.lastName || '',
    created_at: user.created_at ? new Date(user.created_at) : createdAtDate,
    isAdmin: user.isAdmin || user.role === 'admin' || false
  };
}

/**
 * Convert legacy user object to current User format
 */
export function convertLegacyUser(user: any): User {
  return normalizeUser(user);
}

/**
 * Normalizes user records, ensuring consistent property naming
 */
export function normalizeUserRecords(users: any[]): User[] {
  if (!users || !Array.isArray(users)) return [];
  return users.map(user => normalizeUser(user));
}

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

// Export all from this central location
export default {
  normalizeUser,
  normalizeUserRecords,
  normalizeFlashcard,
  convertLegacyUser,
  normalizeFields
};
