
import { createClient } from '@supabase/supabase-js';

// Safely get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if values are available and show a warning if not
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create the Supabase client only if we have the required values
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Export a function to safely get the Supabase client
export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }
  return supabase;
};
