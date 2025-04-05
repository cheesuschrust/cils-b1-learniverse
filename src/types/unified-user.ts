
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailNotifications: boolean;
  language: string;
  difficulty: string;
  onboardingCompleted: boolean;
}

export type UserRole = 'user' | 'admin' | 'teacher' | 'premium' | 'institution';

export interface UserMetrics {
  lessonCompleted?: number;
  questionsAnswered?: number;
  correctAnswers?: number;
  timeSpent?: number;
  lastActivity?: Date;
  streak?: number;
}

export interface User {
  id: string;
  email: string;
  emailVerified?: boolean;
  created_at?: string;
  updated_at?: string;
  role?: UserRole;
  status?: 'active' | 'inactive' | 'banned' | 'pending';
  // Additional fields used across the application
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  username?: string;
  photoURL?: string;
  avatar?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  preferredLanguage?: string;
  isPremiumUser?: boolean;
  lastActive?: Date;
  createdAt?: Date;
  metrics?: UserMetrics;
  dailyQuestionCounts?: Record<string, number>;
  subscription?: {
    type: string;
    status: string;
    expiresAt: string;
    features: string[];
    limits: {
      daily: number;
      monthly: number;
    }
  };
  preferences?: UserPreferences;
  token?: string;
}

export function normalizeUser(userData: any): User {
  return {
    id: userData.id || userData.uid || '',
    email: userData.email || '',
    emailVerified: userData.emailVerified || userData.email_verified || false,
    created_at: userData.created_at || userData.createdAt || new Date().toISOString(),
    updated_at: userData.updated_at || userData.updatedAt,
    role: userData.role || 'user',
    // Map additional fields
    firstName: userData.firstName || userData.first_name || '',
    lastName: userData.lastName || userData.last_name || '',
    displayName: userData.displayName || userData.display_name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
    photoURL: userData.photoURL || userData.photo_url || userData.avatar_url || '',
    preferences: userData.preferences || {
      theme: 'system',
      notifications: true,
      emailNotifications: false,
      language: 'english',
      difficulty: 'intermediate',
      onboardingCompleted: false
    }
  };
}

export function normalizeUserRecords(users: any[]): User[] {
  return users.map(normalizeUser);
}
