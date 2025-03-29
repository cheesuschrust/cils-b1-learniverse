
export type UserRole = 'user' | 'admin' | 'teacher';

export type ThemeOption = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeOption;
  language: string;
  notifications: boolean;
  onboardingCompleted: boolean;
}

export interface DailyQuestionCounts {
  [key: string]: number;
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
  role: UserRole;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  dailyQuestionCounts: DailyQuestionCounts;
}
