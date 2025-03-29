
// Core interfaces and type compatibility functions

// VoicePreference interfaces
export interface VoiceOptions {
  voice: string;
  rate: number;
  pitch: number;
}

export interface TextToSpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  language?: string;
}

export interface SpeechState {
  speaking: boolean;
  voices: SpeechSynthesisVoice[];
  currentVoice: string | null;
  error?: string;  // Added for error handling
}

export interface VoicePreference {
  englishVoiceURI: string;
  italianVoiceURI: string;
  voiceRate: number;
  voicePitch: number;
  preferredLanguage?: string;  // Added based on file analysis
}

// Base interfaces for type safety  
export interface AIOptions {  
  temperature?: number;  
  maxTokens?: number;  
  model?: string;  
  context?: string;  // Added based on usage patterns
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
  
  // Legacy compatibility
  italian?: string;
  english?: string;
  dueDate?: Date;
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
  
  // Legacy compatibility fields
  photo_url?: string;  
  display_name?: string;  
  first_name?: string;  
  last_name?: string;
  
  // Additional fields from the existing User interfaces
  isVerified?: boolean;
  lastLogin?: Date;
  lastActive?: Date;
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
  preferred_language?: 'english' | 'italian' | 'both';
}

// Import UserRole from the user types
import { UserRole } from '@/types/user';

// Type normalization functions

/**
 * Normalizes flashcard data to ensure consistency across the application
 */
export function normalizeFlashcard(card: any): Flashcard {
  if (!card) return null as any;
  
  return {
    id: card.id || '',
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    level: typeof card.level === 'number' ? card.level : 0,
    tags: card.tags || [],
    nextReview: card.nextReview || card.dueDate || null,
    createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : new Date(),
    mastered: card.mastered || false,
    language: card.language || undefined,
    lastReviewed: card.lastReviewed instanceof Date ? card.lastReviewed : undefined,
    italian: card.italian || card.front,
    english: card.english || card.back
  };
}

/**
 * Normalizes user object properties to ensure compatibility across the codebase
 */
export function normalizeUser(user: any): User {
  if (!user) return null as any;
  
  return {
    id: user.id || user.uid,
    uid: user.uid,
    email: user.email,
    firstName: user.firstName || user.first_name,
    lastName: user.lastName || user.last_name,
    displayName: user.displayName || user.display_name || user.name,
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
    },
    
    // Legacy compatibility fields
    photo_url: user.photo_url || user.photoURL,
    display_name: user.display_name || user.displayName,
    first_name: user.first_name || user.firstName,
    last_name: user.last_name || user.lastName,
    is_verified: user.is_verified || user.isVerified
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
