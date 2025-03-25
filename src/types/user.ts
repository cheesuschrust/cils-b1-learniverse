
// Type definitions for user management

export type UserRole = 'user' | 'admin' | 'teacher' | 'student';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'banned';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';
export type AuthProvider = 'email' | 'google' | 'apple' | 'facebook' | 'twitter';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  subscription: {
    tier: SubscriptionTier;
    startDate?: Date;
    endDate?: Date;
    autoRenew?: boolean;
    paymentMethod?: string;
  };
  preferences?: UserPreferences;
  profile?: UserProfile;
  stats?: UserStats;
  avatar?: string;
  authProvider?: AuthProvider;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  contentPreferences?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    categories?: string[];
    hideSensitiveContent?: boolean;
  };
  aiPreferences?: {
    enabled: boolean;
    confidenceThreshold?: number;
    contentTypePreferences?: Record<string, boolean>;
    voicePreferences?: {
      voice: string;
      rate: number;
      pitch: number;
    };
  };
  studyPreferences?: {
    dailyGoal?: number;
    reminderTime?: string;
    weeklySchedule?: boolean[];
  };
  accessibility?: {
    fontSize?: 'small' | 'medium' | 'large';
    highContrast?: boolean;
    reduceAnimations?: boolean;
    screenReader?: boolean;
  };
}

export interface UserProfile {
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
  };
  education?: {
    level?: string;
    institution?: string;
    fieldOfStudy?: string;
    yearCompleted?: number;
  };
  languages?: {
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  }[];
  professional?: {
    company?: string;
    title?: string;
    industry?: string;
    yearsOfExperience?: number;
  };
}

export interface UserStats {
  totalStudyTime: number; // in minutes
  longestStreak: number; // in days
  currentStreak: number; // in days
  totalPoints: number;
  level: number;
  badges: string[];
  completedLessons: number;
  completedCourses: number;
  averageScore: number;
  quizzesTaken: number;
  flashcardsMastered: number;
  lastActive: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  ipAddress: string;
  device: string;
  browser: string;
  location?: string;
  startTime: Date;
  endTime?: Date;
  active: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'login' | 'logout' | 'study' | 'quiz' | 'flashcard' | 'subscription' | 'profile-update';
  timestamp: Date;
  details?: Record<string, any>;
  duration?: number; // in seconds
  progress?: number; // 0-100
  result?: any;
}
