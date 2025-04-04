
// Re-export all types and utilities from the specialized modules
// Export specific types from each module
export type {
  User,
  UserSettings,
  UserPerformance,
  UserRole,
  LegacyFields
} from './user-types';

export {
  normalizeUser,
  normalizeUserRecords,
  convertLegacyUser
} from './user-types';

export type {
  Flashcard,
  FlashcardMetadata,
  ReviewHistory,
  ReviewPerformance
} from './flashcard-types';

export {
  calculateReviewPerformance,
  normalizeFlashcard
} from './flashcard-types';

export type {
  VoicePreference,
  TextToSpeechOptions,
  VoiceOptions,
  SpeechState
} from './voice';

export {
  isValidDate
} from './voice';

export type {
  AIOptions,
  AIModel,
  AIStatus,
  AIFeedbackSettings,
  AIModelSize,
  AIProcessingOptions,
  QuestionGenerationParams
} from './ai';

export type {
  ContentProcessorProps,
  FeedbackData,
  AISettings,
  AISettingsProps,
  NotificationAction,
  NotificationType,
  NotificationPriority,
  Notification
} from './app-types';

export type {
  SpeakableWordProps,
  FlashcardComponentProps,
  ReviewSchedule,
  FlashcardSet,
  FlashcardStats,
  ImportFormat
} from './interface-fixes';

export type {
  Achievement,
  UserGamification,
  WeeklyProgress,
  WeeklyChallenge,
  ChallengeRequirement,
  Level,
  DailyGoal,
  Streak
} from './gamification';

export {
  normalizeFields
} from './utils';

export type {
  AIGeneratedQuestion,
  ItalianLevel,
  ItalianTestSection,
  ItalianQuestionGenerationParams,
  UseAIReturn
} from './core-types';

// Export default object for backwards compatibility
export default {
  normalizeUser,
  normalizeUserRecords,
  normalizeFlashcard,
  convertLegacyUser,
  normalizeFields,
  calculateReviewPerformance,
  isValidDate
};
