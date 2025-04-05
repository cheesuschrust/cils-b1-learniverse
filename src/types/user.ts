
export type UserRole = 'user' | 'admin' | 'teacher' | 'moderator' | 'editor';

export type ThemeOption = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeOption;
  language: string;
  notifications: boolean;
  onboardingCompleted: boolean;
  emailNotifications?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
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
  reminders?: boolean;
  themePreference?: string;
  aiAssistance?: boolean;
  showConfidence?: boolean;
  showPronunciation?: boolean;
  studyReminders?: boolean;
}

export interface DailyQuestionCounts {
  [key: string]: number;
  flashcards: number;
  multipleChoice: number;
  speaking: number;
  writing: number;
  listening: number;
}

export interface UserMetrics {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  [key: string]: any;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  preferences?: UserPreferences;
  dailyQuestionCounts?: DailyQuestionCounts;
  
  // Additional properties referenced in the codebase
  displayName?: string;
  photoURL?: string;
  avatar?: string;
  avatar_url?: string;
  profileImage?: string;
  name?: string;
  username?: string;
  phoneNumber?: string;
  address?: string;
  preferredLanguage?: 'english' | 'italian' | 'both';
  lastActive?: Date;
  lastLogin?: Date;
  status?: 'active' | 'inactive' | 'suspended';
  subscription?: 'free' | 'premium' | 'trial';
  metrics?: UserMetrics;
  isAdmin?: boolean;
  isPremium?: boolean;
  isPremiumUser?: boolean;
  display_name?: string;
  
  // Legacy support fields
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  created_at?: string;
}
