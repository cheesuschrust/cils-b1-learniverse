
// Re-export all types and utilities from the specialized modules

// Import needed utilities and types first
import { isValidDate } from './voice';
import { normalizeFields } from './utils';
import { 
  normalizeUser, 
  normalizeUserRecords,
  convertLegacyUser,
  User,
  UserSettings,
  UserPerformance,
  UserRole,
  LegacyFields
} from './user-types';
import {
  calculateReviewPerformance,
  normalizeFlashcard,
  ReviewPerformance,
  ReviewHistory,
  FlashcardMetadata,
  Flashcard
} from './flashcard-types';
import { AIOptions } from './ai';
import {
  VoicePreference,
  TextToSpeechOptions,
  VoiceOptions,
  SpeechState
} from './voice';

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
