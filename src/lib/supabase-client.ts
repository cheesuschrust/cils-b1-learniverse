
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nxmbadblisjgqdmhwrmz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54bWJhZGJsaXNqZ3FkbWh3cm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDc5NjAsImV4cCI6MjA1ODkyMzk2MH0.JduQeJZkPiLUYb0Oy8wK4Ky4dUaZ9K_JoRZNKB2LoaM';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Profile-related functions
export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// User stats functions
export async function fetchUserStats(userId: string) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

// Daily questions functions
export async function fetchDailyQuestion(date?: string) {
  const questionDate = date || new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_questions')
    .select('*')
    .eq('question_date', questionDate)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
  return data;
}

// User achievements functions
export async function fetchUserAchievements(userId: string) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

// Subscription verification
export async function isPremiumUser(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('is_premium_user', { user_id: userId });
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}

// Flashcard functions
export async function fetchFlashcards(userId: string) {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function fetchFlashcardSets(userId: string) {
  const { data, error } = await supabase
    .from('flashcard_sets')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function fetchPublicFlashcardSets() {
  const { data, error } = await supabase
    .from('flashcard_sets')
    .select('*')
    .eq('is_public', true);
  
  if (error) throw error;
  return data;
}

export async function fetchFlashcardsInSet(setId: string) {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('set_id', setId);
  
  if (error) throw error;
  return data;
}

export async function createFlashcardSet(setData: any) {
  const { data, error } = await supabase
    .from('flashcard_sets')
    .insert([setData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateFlashcardSet(setId: string, updates: any) {
  const { data, error } = await supabase
    .from('flashcard_sets')
    .update(updates)
    .eq('id', setId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteFlashcardSet(setId: string) {
  const { error } = await supabase
    .from('flashcard_sets')
    .delete()
    .eq('id', setId);
  
  if (error) throw error;
  return true;
}

export async function createFlashcard(cardData: any) {
  const { data, error } = await supabase
    .from('flashcards')
    .insert([cardData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateFlashcard(cardId: string, updates: any) {
  const { data, error } = await supabase
    .from('flashcards')
    .update(updates)
    .eq('id', cardId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteFlashcard(cardId: string) {
  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', cardId);
  
  if (error) throw error;
  return true;
}

export async function updateFlashcardProgress(progressData: any) {
  // First check if progress exists
  const { data: existingProgress } = await supabase
    .from('user_flashcard_progress')
    .select('*')
    .eq('user_id', progressData.user_id)
    .eq('flashcard_id', progressData.flashcard_id)
    .maybeSingle();
  
  if (existingProgress) {
    // Update existing progress
    const { data, error } = await supabase
      .from('user_flashcard_progress')
      .update(progressData)
      .eq('id', existingProgress.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Insert new progress
    const { data, error } = await supabase
      .from('user_flashcard_progress')
      .insert([progressData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
