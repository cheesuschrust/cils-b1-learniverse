
import { supabase } from '@/lib/supabase-client';
import { Database } from '@/types/supabase';

// Get table names from the Database type definition
export type KnownTables = 
  | 'flashcard_sets' 
  | 'flashcards' 
  | 'user_flashcard_progress' 
  | 'user_profiles' 
  | 'user_stats'
  | 'user_progress'
  | 'user_achievements'
  | 'daily_questions'
  | 'learning_content'
  | 'content_items'
  | 'questions'
  | 'content'
  | 'content_categories';

// This adapter handles type-safe access to tables
export const getTable = <T extends string>(tableName: T) => {
  // This is a safe cast since we're wrapping the actual Supabase call
  return supabase.from(tableName);
};

// For specific tables that we know the types of
export const getKnownTable = <T extends KnownTables>(tableName: T) => {
  return supabase.from(tableName);
};

// Helper for RPC calls with type safety
export const callRPC = <T extends string>(
  functionName: T,
  params?: Record<string, any>
) => {
  return supabase.rpc(functionName, params);
};

// Helper functions for common database operations
export const fetchUserProfile = async (userId: string) => {
  const { data, error } = await getKnownTable('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
};

export const fetchUserProgress = async (userId: string) => {
  const { data, error } = await getTable('user_progress')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data;
};

export const fetchUserStats = async (userId: string) => {
  const { data, error } = await getKnownTable('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) throw error;
  return data;
};

export const checkIsPremiumUser = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await callRPC('is_premium_user', { user_id: userId });
    if (error) throw error;
    return !!data;
  } catch (e) {
    console.error('Error checking premium status:', e);
    return false;
  }
};

export const addUserXP = async (
  userId: string, 
  xpAmount: number, 
  activityType: string
): Promise<boolean> => {
  try {
    const { data, error } = await callRPC('add_user_xp', { 
      user_id: userId, 
      xp_amount: xpAmount, 
      activity_type: activityType 
    });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Error adding XP:', e);
    return false;
  }
};

// User achievements helpers
export const fetchUserAchievements = async (userId: string) => {
  const { data, error } = await getTable('user_achievements')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data;
};

export const addUserAchievement = async (
  userId: string,
  achievementName: string,
  achievementType: string,
  description: string,
  metadata?: object
) => {
  const { data, error } = await getTable('user_achievements').insert({
    user_id: userId,
    achievement_name: achievementName,
    achievement_type: achievementType,
    description: description,
    metadata: metadata || null
  });

  if (error) throw error;
  return data;
};
