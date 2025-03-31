
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Use the consistent Supabase URL and key from the integrations folder
const SUPABASE_URL = "https://nxmbadblisjgqdmhwrmz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54bWJhZGJsaXNqZ3FkbWh3cm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDc5NjAsImV4cCI6MjA1ODkyMzk2MH0.JduQeJZkPiLUYb0Oy8wK4Ky4dUaZ9K_JoRZNKB2LoaM";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper functions for commonly used Supabase operations
export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id, 
      email, 
      first_name, 
      last_name, 
      role, 
      is_verified, 
      created_at, 
      subscription, 
      preferred_language,
      user_preferences(*)
    `)
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function fetchUserProgress(userId: string, examId?: string) {
  const query = supabase
    .from('exam_progress')
    .select('*')
    .eq('user_id', userId);
    
  if (examId) {
    query.eq('exam_id', examId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function updateUserProgress(progressData: any) {
  const { data, error } = await supabase
    .from('exam_progress')
    .upsert(progressData)
    .select();
    
  if (error) throw error;
  return data;
}

export async function fetchExams() {
  const { data, error } = await supabase
    .from('exams')
    .select('*, exam_sections(*)');
    
  if (error) throw error;
  return data;
}

export async function fetchQuestions(sectionId: string, limit = 10) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('section_id', sectionId)
    .limit(limit);
    
  if (error) throw error;
  return data;
}
