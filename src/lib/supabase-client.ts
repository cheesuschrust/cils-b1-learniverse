
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Browser-safe environment variable handling
// Note: In a real Next.js app, we would use server-side environment variables,
// but for this client-side app we'll use placeholder values that should be replaced
const supabaseUrl = 'https://placeholder-supabase-project.supabase.co';
const supabaseAnonKey = 'placeholder-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

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
