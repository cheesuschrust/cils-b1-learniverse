
export type UserRole = 'user' | 'admin' | 'moderator' | 'teacher' | 'editor';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type UserSubscription = 'free' | 'premium' | 'enterprise' | 'educational';
export type Language = 'english' | 'italian' | 'both';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  difficulty: Difficulty;
  onboardingCompleted: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  lastActive?: Date;
  status: UserStatus;
  subscription: UserSubscription;
  phoneNumber?: string;
  address?: string;
  preferences: UserPreferences;
  preferredLanguage: string;
  language: string;
  isPremiumUser?: boolean;
  dailyQuestionCounts: {
    flashcards: number;
    multipleChoice: number;
    speaking: number;
    writing: number;
    listening: number;
  };
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
}
