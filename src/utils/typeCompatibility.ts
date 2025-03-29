
import { User } from '@/types/user-types';
import { Flashcard } from '@/types/flashcard-types';
import { normalizeUser, normalizeUserRecords } from '@/types/user-types';
import { normalizeFlashcard } from '@/types/flashcard-types';
import { convertLegacyUser } from '@/types/user-types';
import { normalizeFields } from '@/types/utils';

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
