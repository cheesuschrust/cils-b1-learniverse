
import { ThemeOption } from "./type-definitions";

export interface UserPreferences {
  theme: ThemeOption;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onboardingCompleted: boolean;
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

export type LanguagePreference = 'english' | 'italian' | 'both';

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: true,
  emailNotifications: true,
  difficulty: 'beginner',
  onboardingCompleted: false,
  fontSize: 16,
  notificationsEnabled: true,
  animationsEnabled: true,
  preferredLanguage: 'english',
  voiceSpeed: 1.0,
  autoPlayAudio: true,
  showProgressMetrics: true,
  aiEnabled: true,
  aiModelSize: 'medium',
  aiProcessingOnDevice: false,
  confidenceScoreVisible: true,
};

export function normalizeUserPreferences(preferences: Partial<UserPreferences> | null): UserPreferences {
  if (!preferences) {
    return DEFAULT_USER_PREFERENCES;
  }

  return {
    ...DEFAULT_USER_PREFERENCES,
    ...preferences
  };
}
