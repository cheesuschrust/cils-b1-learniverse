
import { isValidDate } from './voice';

/**
 * Legacy field names for backward compatibility
 */
export interface LegacyFields {
  photo_url?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  preferred_language?: string;
  created_at?: Date;
}

/**
 * User settings and preferences
 */
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  reviewInterval: number;
  dailyGoal: number;
  audioEnabled: boolean;
  autoAdvance: boolean;
}

/**
 * User performance metrics
 */
export interface UserPerformance {
  totalReviews: number;
  correctStreak: number;
  lastReviewDate?: Date;
  averageAccuracy: number;
  dailyStats?: {
    date: string;
    completed: number;
    accuracy: number;
  }[];
}

/**
 * User role in the system
 */
export type UserRole = 'user' | 'admin' | 'moderator' | 'teacher' | 'editor';

/**
 * Complete user information
 */
export interface User extends Partial<LegacyFields> {
  uid: string;
  id?: string;
  email: string;
  photoURL: string;
  displayName: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  preferredLanguage?: 'english' | 'italian' | 'both';
  settings: UserSettings;
  lastActive?: Date;
  isPremium?: boolean;
  performance: UserPerformance;
  role?: UserRole;
  language?: 'english' | 'italian' | 'both' | 'en' | 'it';
  isVerified?: boolean;
  lastLogin?: Date;
  status?: 'active' | 'inactive' | 'suspended';
  subscription?: 'free' | 'premium' | 'trial';
}

/**
 * Normalized user object with default values
 */
export const normalizeUser = (input: Record<string, any>): User => {
  const parseDate = (date: any): Date => {
    if (isValidDate(date)) return date;
    if (!date) return new Date();
    try {
      const parsed = new Date(date);
      return isValidDate(parsed) ? parsed : new Date();
    } catch {
      return new Date();
    }
  };

  const defaultSettings: UserSettings = {
    theme: 'system',
    notifications: true,
    reviewInterval: 24,
    dailyGoal: 10,
    audioEnabled: true,
    autoAdvance: false
  };

  const defaultPerformance: UserPerformance = {
    totalReviews: 0,
    correctStreak: 0,
    averageAccuracy: 0,
    dailyStats: []
  };

  return {
    uid: input.uid || input.id || '',
    id: input.id || input.uid || '',
    email: input.email || '',
    photoURL: input.photoURL || input.photo_url || '',
    displayName: input.displayName || input.display_name || '',
    firstName: input.firstName || input.first_name || '',
    lastName: input.lastName || input.last_name || '',
    createdAt: parseDate(input.createdAt || input.created_at),
    preferredLanguage: input.preferredLanguage || input.preferred_language || 'english',
    settings: { ...defaultSettings, ...input.settings },
    lastActive: parseDate(input.lastActive),
    isPremium: Boolean(input.isPremium),
    performance: { ...defaultPerformance, ...input.performance },
    role: input.role || 'user',
    language: input.language || input.preferredLanguage || 'english',
    isVerified: Boolean(input.isVerified),
    lastLogin: parseDate(input.lastLogin),
    status: input.status || 'active',
    subscription: input.subscription || 'free',

    // Legacy fields preservation
    ...(input.photo_url && { photo_url: input.photo_url }),
    ...(input.display_name && { display_name: input.display_name }),
    ...(input.first_name && { first_name: input.first_name }),
    ...(input.last_name && { last_name: input.last_name }),
    ...(input.created_at && { created_at: parseDate(input.created_at) })
  };
};

/**
 * Normalizes user records, ensuring consistent property naming
 */
export const normalizeUserRecords = (users: any[]): User[] => {
  if (!users || !Array.isArray(users)) return [];
  return users.map(user => normalizeUser(user));
};

/**
 * Convert legacy user object to current User format
 */
export const convertLegacyUser = (user: any): User => {
  return normalizeUser(user);
};
