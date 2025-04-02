
import { ItalianLevel } from './italian-types';

export type UserRole = 'user' | 'admin' | 'moderator' | 'teacher' | 'editor';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type UserSubscription = 'free' | 'premium' | 'enterprise' | 'educational';
export type Language = 'english' | 'italian' | 'both';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  onboardingCompleted: boolean;
  difficulty: Difficulty;
  emailNotifications?: boolean;
  fontSize?: number;
  autoPlayAudio?: boolean;
  voiceSpeed?: number;
  showProgressMetrics?: boolean;
}

export interface DailyQuestionCounts {
  flashcards: number;
  multipleChoice: number;
  speaking: number;
  writing: number;
  listening: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  displayName?: string;
  role: UserRole;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  dailyQuestionCounts: DailyQuestionCounts;
  photoURL?: string;
  avatar?: string;
  profileImage?: string;
  phoneNumber?: string;
  address?: string;
  preferredLanguage?: Language;
  lastActive?: Date;
  lastLogin?: Date;
  status?: UserStatus;
  subscription?: UserSubscription;
  isPremiumUser?: boolean;
}

export interface UserProfile extends User {
  biography?: string;
  learningGoals?: string[];
  experience?: number;
  level?: number;
  achievements?: string[];
  streak?: number;
  totalXP?: number;
  totalQuizzes?: number;
  totalCorrect?: number;
  averageScore?: number;
  completedCourses?: string[];
  activeCourses?: string[];
  certificates?: string[];
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  italianLevel?: ItalianLevel;
}
