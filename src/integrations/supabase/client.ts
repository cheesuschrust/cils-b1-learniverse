
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://nxmbadblisjgqdmhwrmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54bWJhZGJsaXNqZ3FkbWh3cm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDc5NjAsImV4cCI6MjA1ODkyMzk2MH0.JduQeJZkPiLUYb0Oy8wK4Ky4dUaZ9K_JoRZNKB2LoaM';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({
    email,
    password
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    return {
      id: data.user.id,
      email: data.user.email || '',
      firstName: data.user.user_metadata?.first_name || '',
      lastName: data.user.user_metadata?.last_name || '',
      isPremiumUser: data.user.user_metadata?.is_premium_user || false
    };
  }
  return null;
}

// User profiles
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

// Flashcards related functions
export async function fetchFlashcards(userId: string) {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
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

// User progress tracking
export async function trackProgress(progressData: any) {
  const { data, error } = await supabase
    .from('user_progress')
    .insert([progressData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function fetchUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

// Check premium status
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
