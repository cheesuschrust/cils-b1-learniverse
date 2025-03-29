
// Re-export all types and utilities from the specialized modules

// Type Guards and Utilities
export { isValidDate } from './voice';
export { normalizeFields } from './utils';

// Voice and Speech Types
export {
  VoicePreference,
  TextToSpeechOptions,
  VoiceOptions,
  SpeechState
} from './voice';

// AI and System Types
export { AIOptions } from './ai';

// User Management Types
export {
  LegacyFields,
  UserSettings,
  UserPerformance,
  UserRole,
  User,
  normalizeUser,
  normalizeUserRecords,
  convertLegacyUser
} from './user-types';

// Flashcard System Types
export {
  ReviewPerformance,
  ReviewHistory,
  FlashcardMetadata,
  Flashcard,
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

// Re-export from other modules for backwards compatibility
import { normalizeUser, normalizeUserRecords, convertLegacyUser } from './user-types';
import { normalizeFlashcard, calculateReviewPerformance } from './flashcard-types';
import { isValidDate } from './voice';
import { normalizeFields } from './utils';
