
export type UserRole = 'user' | 'admin' | 'moderator' | 'teacher' | 'editor';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onboardingCompleted: boolean;
}

export interface UserMetrics {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  lastActive?: Date;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  username?: string;
  photoURL?: string;
  role: UserRole;
  isVerified: boolean;
  isAdmin?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastLogin?: Date | string;
  lastActive?: Date | string;
  status: 'active' | 'inactive' | 'suspended';
  subscription: string;
  phoneNumber?: string;
  address?: string;
  preferences: UserPreferences;
  preferredLanguage?: string;
  language?: string;
  metrics?: UserMetrics;
  dailyQuestionCounts: {
    flashcards: number;
    multipleChoice: number;
    speaking: number;
    writing: number;
    listening: number;
  };
}
