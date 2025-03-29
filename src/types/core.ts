

// Re-export all types and utilities from the specialized modules

// Type Guards and Utilities
export { isValidDate } from './voice';
export { normalizeFields } from './utils';

// Voice and Speech Types
export type {
  VoicePreference,
  TextToSpeechOptions,
  VoiceOptions,
  SpeechState
} from './voice';

// AI and System Types
export type { AIOptions } from './ai';

// User Management Types
export type {
  LegacyFields,
  UserSettings,
  UserPerformance,
  UserRole,
  User
} from './user-types';
export {
  normalizeUser,
  normalizeUserRecords,
  convertLegacyUser
} from './user-types';

// Flashcard System Types
export type {
  ReviewPerformance,
  ReviewHistory,
  FlashcardMetadata,
  Flashcard
} from './flashcard-types';
export {
  calculateReviewPerformance,
  normalizeFlashcard
} from './flashcard-types';

// Export as default object for backwards compatibility
export default {
  normalizeUser,
  normalizeUserRecords,
  normalizeFlashcard,
  convertLegacyUser,
  normalizeFields,
  calculateReviewPerformance,
  isValidDate
};
