
import { User } from './user';
import { UserPreferences } from './user';

export interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: 'en' | 'it';
  accessibility?: {
    highContrast?: boolean;
    fontSize?: 'small' | 'medium' | 'large';
    reducedMotion?: boolean;
  };
  studyPreferences?: {
    dailyGoal?: number;
    reviewInterval?: number;
    pronunciation?: boolean;
    autoPlay?: boolean;
  };
  displayOptions?: Record<string, any>;
}

export type ExtendedUser = User & {
  settings?: UserSettings;
  preferences?: UserPreferences;
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
  isAdmin?: boolean;
  displayName?: string;
  photoURL?: string;
};

export const isExtendedUser = (user: any): user is ExtendedUser => {
  return user && 'id' in user && 'email' in user;
};

export const toExtendedUser = (user: User): ExtendedUser => {
  return {
    ...user,
    settings: {},
    preferences: {
      theme: 'system',
      emailNotifications: true,
      language: 'en',
      difficulty: 'beginner',
    },
    metrics: {
      totalQuestions: 0,
      correctAnswers: 0,
      streak: 0,
    },
    dailyQuestionCounts: {
      flashcards: 0,
      multipleChoice: 0,
      listening: 0,
      writing: 0,
      speaking: 0,
    },
    isAdmin: user.role === 'admin',
    displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
  };
};
