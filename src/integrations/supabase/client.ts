
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

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

// Authentication helper functions
export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, metadata = {}) {
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: { data: metadata }
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  return await supabase.auth.getUser();
}

export async function getUserSession() {
  return await supabase.auth.getSession();
}

export default supabase;
