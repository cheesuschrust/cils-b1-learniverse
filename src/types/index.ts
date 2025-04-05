
// Import and re-export all types from specific type files
import { User, UserRole, UserPreferences, normalizeUser, normalizeUserRecords } from './unified-user';
import { 
  NotificationType, 
  NotificationPriority, 
  NotificationAction, 
  Notification 
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
  ContentFeatures 
} from './contentType';
import {
  AISettings
} from './ai-settings';
import {
  ItalianTestSection,
  ItalianLevel,
  AIQuestion,
  AIGeneratedQuestion,
  ItalianQuestionGenerationParams,
  QuestionGenerationParams,
  VoiceOptions,
  VoicePreference
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
export {
  // User types
  User,
  UserRole,
  UserPreferences,
  normalizeUser,
  normalizeUserRecords,
  
  // Notification types
  NotificationType,
  NotificationPriority,
  NotificationAction,
  Notification,
  
  // Flashcard types
  Flashcard,
  FlashcardSet,
  ReviewPerformance,
  ReviewSchedule,
  FlashcardStats,
  normalizeFlashcard,
  calculateReviewPerformance,
  
  // Content types
  ContentType,
  ContentFeatures,
  
  // AI types
  AISettings,
  ItalianTestSection,
  ItalianLevel,
  AIQuestion,
  AIGeneratedQuestion,
  ItalianQuestionGenerationParams,
  QuestionGenerationParams,
  VoiceOptions,
  VoicePreference,
  
  // Gamification types
  Achievement,
  WeeklyChallenge,
  UserGamification,
  Level,
  LevelProgressBarProps,
  LevelBadgeProps
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

export interface AISettingsProps {
  settings: AISettings;
  onSettingsChange: (settings: Partial<AISettings>) => void;
}
