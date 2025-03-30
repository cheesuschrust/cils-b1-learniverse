
/**
 * User preferences type definitions
 * These types define the structure for user customization settings
 */

export type ThemeOption = 'light' | 'dark' | 'system';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type LanguagePreference = 'english' | 'italian' | 'both' | 'en' | 'it';
export type VoiceSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;
export type AIModelSize = 'small' | 'medium' | 'large';

export interface UserPreferences {
  // Required properties
  theme: ThemeOption;
  language: string;
  notifications: boolean;
  onboardingCompleted: boolean;
  
  // Optional properties with defaults
  emailNotifications?: boolean;
  difficulty?: DifficultyLevel;
  fontSize?: number;
  notificationsEnabled?: boolean;
  animationsEnabled?: boolean;
  preferredLanguage?: LanguagePreference;
  voiceSpeed?: number;
  autoPlayAudio?: boolean;
  showProgressMetrics?: boolean;
  aiEnabled?: boolean;
  aiModelSize?: string;
  aiProcessingOnDevice?: boolean;
  confidenceScoreVisible?: boolean;
  bio?: string;
}

/**
 * Default user preferences
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: true,
  onboardingCompleted: false,
  emailNotifications: true,
  difficulty: 'beginner',
  fontSize: 16,
  notificationsEnabled: true,
  animationsEnabled: true,
  preferredLanguage: 'both',
  voiceSpeed: 1,
  autoPlayAudio: true,
  showProgressMetrics: true,
  aiEnabled: true,
  aiModelSize: 'medium',
  aiProcessingOnDevice: false,
  confidenceScoreVisible: true,
  bio: ''
};

/**
 * Convert legacy or partial preferences to the standard format
 */
export function normalizeUserPreferences(
  preferences: Partial<UserPreferences> = {}
): UserPreferences {
  return {
    ...DEFAULT_USER_PREFERENCES,
    ...preferences,
    // Ensure required properties are present
    theme: preferences.theme || DEFAULT_USER_PREFERENCES.theme,
    language: preferences.language || DEFAULT_USER_PREFERENCES.language,
    notifications: 'notifications' in preferences ? preferences.notifications! : DEFAULT_USER_PREFERENCES.notifications,
    onboardingCompleted: 'onboardingCompleted' in preferences ? preferences.onboardingCompleted! : DEFAULT_USER_PREFERENCES.onboardingCompleted
  };
}
