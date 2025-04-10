
import { supabase } from '@/lib/supabase-client';
import type { Database } from '@/types/supabase';

// Define a union type of known tables for type safety
export type KnownTables = 'flashcard_sets' | 'flashcards' | 'user_flashcard_progress' | 'user_profiles' | 'user_stats' | 'usage_tracking';

// Type guard to check if a string is a valid known table
export function isKnownTable(tableName: string): tableName is KnownTables {
  return ['flashcard_sets', 'flashcards', 'user_flashcard_progress', 'user_profiles', 'user_stats', 'usage_tracking'].includes(tableName);
}

// Type-safe wrapper for Supabase table access
export const getTable = <T extends KnownTables>(tableName: T) => {
  return supabase.from(tableName);
};

// For specific tables that we know the types of
export const getKnownTable = <T extends KnownTables>(tableName: T) => {
  return supabase.from(tableName);
};

// Specific helper functions for commonly used tables
export const getUserProgress = () => {
  return getKnownTable('user_flashcard_progress');
};

export const getUsageTracking = () => {
  return getKnownTable('usage_tracking');
};

// Add typed accessors for our known tables
export const getTables = {
  flashcardSets: () => supabase.from('flashcard_sets'),
  flashcards: () => supabase.from('flashcards'),
  userFlashcardProgress: () => supabase.from('user_flashcard_progress'),
  userProfiles: () => supabase.from('user_profiles'),
  userStats: () => supabase.from('user_stats'),
  usageTracking: () => supabase.from('usage_tracking')
};
