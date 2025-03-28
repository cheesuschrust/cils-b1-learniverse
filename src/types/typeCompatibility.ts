
import { User } from '@/types/user';
import { normalizeUser, normalizeUserRecords, convertLegacyUser, normalizeFields } from '@/types/core';

/**
 * Legacy interface with snake_case field names for backward compatibility
 */
export interface LegacyUserFields {
  uid?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  display_name?: string;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
  last_active?: Date;
  preferred_language?: 'english' | 'italian' | 'both';
}

// Re-export the functions from core.ts
export { 
  normalizeUser,
  normalizeUserRecords,
  convertLegacyUser,
  normalizeFields
};

export default {
  normalizeUser,
  normalizeUserRecords,
  convertLegacyUser,
  normalizeFields
};
