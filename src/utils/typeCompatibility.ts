
import { User } from '@/types/user';
import { Flashcard } from '@/types/flashcard';
import { normalizeUser, normalizeUserRecords, normalizeFlashcard, convertLegacyUser, normalizeFields } from '@/types/core';

// Re-export the functions from core.ts
export { 
  normalizeUser,
  normalizeUserRecords,
  normalizeFlashcard,
  convertLegacyUser,
  normalizeFields
};

export default {
  normalizeUser,
  normalizeUserRecords,
  normalizeFlashcard,
  convertLegacyUser,
  normalizeFields
};
