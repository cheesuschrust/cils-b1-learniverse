
import { supabase } from '@/lib/supabase-client';
import { Database } from '@/types/supabase';

// Create a type-safe wrapper for Supabase table access
export type KnownTables = 'flashcard_sets' | 'flashcards' | 'user_flashcard_progress' | 'user_profiles' | 'user_stats' | 'usage_tracking';

// This adapter handles the type mismatch when trying to access tables not in the current type definitions
export const getTable = <T extends KnownTables | string>(tableName: T) => {
  // This is a safe cast since we're wrapping the actual Supabase call
  return supabase.from(tableName as any);
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
