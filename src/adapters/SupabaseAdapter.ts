
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

// Create a type-safe wrapper for Supabase table access
export type KnownTables = 'flashcard_sets' | 'flashcards' | 'user_flashcard_progress' | 'user_profiles' | 'user_stats' | 'usage_tracking';

// This adapter handles the type mismatch when trying to access tables not in the current type definitions
export const getTable = <T extends KnownTables | string>(tableName: T) => {
  return supabase.from(tableName);
};

// For specific tables that we know the types of
export const getKnownTable = <T extends KnownTables>(tableName: T) => {
  return supabase.from(tableName);
};

// Helper function for user progress table specifically
export const getUserProgress = () => {
  return getTable('user_progress');
};

// Helper function for usage tracking specifically
export const getUsageTracking = () => {
  return getTable('usage_tracking');
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
