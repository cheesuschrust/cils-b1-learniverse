
// Import and re-export all types from specific type files
import { User, UserRole, UserPreferences, normalizeUser, normalizeUserRecords } from './unified-user';
import { 
  NotificationType, 
  NotificationPriority, 
  NotificationAction, 
  Notification,
  NotificationItemProps,
  NotificationCenterProps,
  GlobalNotificationCenterProps,
  NotificationsContextType 
} from './notification';
import { 
  Flashcard, 
  FlashcardSet, 
  ReviewPerformance, 
  ReviewSchedule,
  FlashcardStats,
  normalizeFlashcard,
  calculateReviewPerformance
} from './flashcard-unified';
import { 
  ContentType, 
  ContentFeatures,
  formatContentType,
  getContentTypeColor
} from './contentType';
import {
  AISettings,
  AISettingsProps
} from './ai-settings';
import {
  ItalianTestSection,
  ItalianLevel,
  AIQuestion,
  AIGeneratedQuestion,
  ItalianQuestionGenerationParams,
  QuestionGenerationParams,
  VoiceOptions,
  VoicePreference,
  AIUtilsContextType,
  UseAIReturn,
  AIProcessingOptions
} from './ai-types';
import {
  Achievement,
  WeeklyChallenge,
  UserGamification,
  Level,
  LevelProgressBarProps,
  LevelBadgeProps
} from './gamification';

// Export all types
export type {
  // User types
  User,
  UserRole,
  UserPreferences,
  
  // Notification types
  NotificationType,
  NotificationPriority,
  NotificationAction,
  Notification,
  NotificationItemProps,
  NotificationCenterProps,
  GlobalNotificationCenterProps,
  NotificationsContextType,
  
  // Flashcard types
  Flashcard,
  FlashcardSet,
  ReviewPerformance,
  ReviewSchedule,
  FlashcardStats,
  
  // Content types
  ContentType,
  ContentFeatures,
  
  // AI types
  AISettings,
  AISettingsProps,
  ItalianTestSection,
  ItalianLevel,
  AIQuestion,
  AIGeneratedQuestion,
  ItalianQuestionGenerationParams,
  QuestionGenerationParams,
  VoiceOptions,
  VoicePreference,
  AIUtilsContextType,
  UseAIReturn,
  AIProcessingOptions,
  
  // Gamification types
  Achievement,
  WeeklyChallenge,
  UserGamification,
  Level,
  LevelProgressBarProps,
  LevelBadgeProps
};

export {
  normalizeUser,
  normalizeUserRecords,
  normalizeFlashcard,
  calculateReviewPerformance,
  formatContentType,
  getContentTypeColor
};

// Define additional interface props for components
export interface SpeakableWordProps {
  word: string;
  language?: string;
  className?: string;
  showTooltip?: boolean;
  tooltipContent?: string;
  onPlayComplete?: () => void;
  autoPlay?: boolean;
  size?: string; // Optional size for better flexibility
  onClick?: () => void;
  iconOnly?: boolean;
}

export interface BadgeProps {
  text: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'citizenship';
  className?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'default' | 'lg';
}
