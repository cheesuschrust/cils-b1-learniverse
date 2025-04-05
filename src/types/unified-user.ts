
import { ThemeOption } from './user';

export type UserRole = 'user' | 'admin' | 'moderator' | 'teacher' | 'editor';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type UserSubscription = 'free' | 'premium' | 'enterprise' | 'educational' | 'trial';
export type LanguagePreference = 'english' | 'italian' | 'both';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface UserPreferences {
  theme: ThemeOption;
  language: string;
  notifications: boolean;
  onboardingCompleted: boolean;
  emailNotifications?: boolean;
  difficulty?: Difficulty;
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

export interface DailyQuestionCounts {
  flashcards: number;
  multipleChoice: number;
  speaking: number;
  writing: number;
  listening: number;
  [key: string]: number;
}

export interface UserMetrics {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  [key: string]: any;
}

export interface UnifiedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  avatar?: string;
  profileImage?: string;
  username?: string;
  role?: UserRole;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  lastActive?: Date;
  status?: UserStatus;
  subscription?: UserSubscription;
  isPremiumUser?: boolean;
  isPremium?: boolean;
  phoneNumber?: string;
  address?: string;
  preferredLanguage?: LanguagePreference;
  preferences?: UserPreferences;
  dailyQuestionCounts?: DailyQuestionCounts;
  metrics?: UserMetrics;
  isAdmin?: boolean;
  avatar_url?: string;
  display_name?: string;
  token?: string;
}

// Helper functions to normalize user objects
export function normalizeUser(user: any): UnifiedUser {
  if (!user) return null as any;
  
  return {
    id: user.id || user.uid || '',
    email: user.email || '',
    firstName: user.firstName || user.first_name || '',
    lastName: user.lastName || user.last_name || '',
    displayName: user.displayName || user.display_name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    photoURL: user.photoURL || user.photo_url || user.avatar || user.profileImage || user.avatar_url || '',
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
    isPremiumUser: user.isPremiumUser || user.is_premium || user.isPremium || (user.subscription && user.subscription !== 'free') || false,
    preferredLanguage: user.preferredLanguage || user.preferred_language || 'english'
  };
}

export function normalizeUserRecords(users: any[]): UnifiedUser[] {
  if (!users || !Array.isArray(users)) return [];
  return users.map(normalizeUser);
}

// Export types to be used throughout the app
export type User = UnifiedUser;
