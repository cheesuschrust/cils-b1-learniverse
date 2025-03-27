
export type UserRole = 'user' | 'admin' | 'moderator' | 'teacher';

export type UserPreferences = {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  language?: 'en' | 'it';
  frequency?: 'daily' | 'weekly' | 'monthly';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onboardingCompleted?: boolean;
  [key: string]: any;
};

export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  lastActive?: Date;
  avatar?: string;
  preferences?: UserPreferences;
  subscription?: 'free' | 'premium' | 'trial';
  status?: 'active' | 'inactive' | 'suspended';
  isVerified?: boolean;
  preferredLanguage?: 'english' | 'italian' | 'both';
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  address?: string;
  name?: string;
  isAdmin?: boolean;
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
}
