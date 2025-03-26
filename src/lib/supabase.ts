
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Helper function to determine if a user is premium
export const isPremiumUser = (subscription?: string | null): boolean => {
  return subscription === 'premium';
};

// Helper function to check if user has reached daily question limit
export const hasReachedDailyLimit = async (
  userId: string,
  questionType: string
): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
  
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('count')
    .eq('user_id', userId)
    .eq('question_type', questionType)
    .eq('date', today)
    .single();
    
  if (error && error.code !== 'PGSQL_EMPTY_RESULT') {
    console.error('Error checking usage limit:', error);
    return false; // Default to not reached if there's an error
  }
  
  // If no record or count < 1, they haven't reached limit
  return data?.count ? data.count >= 1 : false;
};

// Function to track question usage
export const trackQuestionUsage = async (
  userId: string,
  questionType: string
): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
  
  // First check if there's an existing record for today
  const { data: existingData, error: existingError } = await supabase
    .from('usage_tracking')
    .select('id, count')
    .eq('user_id', userId)
    .eq('question_type', questionType)
    .eq('date', today)
    .single();
    
  if (existingError && existingError.code !== 'PGSQL_EMPTY_RESULT') {
    console.error('Error tracking question usage:', existingError);
    return false;
  }
  
  if (existingData) {
    // Update existing record
    const { error: updateError } = await supabase
      .from('usage_tracking')
      .update({ 
        count: existingData.count + 1,
        last_updated: new Date().toISOString()
      })
      .eq('id', existingData.id);
      
    if (updateError) {
      console.error('Error updating usage tracking:', updateError);
      return false;
    }
  } else {
    // Insert new record
    const { error: insertError } = await supabase
      .from('usage_tracking')
      .insert({
        user_id: userId,
        question_type: questionType,
        date: today,
        count: 1,
        last_updated: new Date().toISOString()
      });
      
    if (insertError) {
      console.error('Error inserting usage tracking:', insertError);
      return false;
    }
  }
  
  return true;
};
