
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
  try {
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
  } catch (error) {
    console.error('Error in hasReachedDailyLimit:', error);
    return false; // Default to not reached if there's an exception
  }
};

// Function to track question usage
export const trackQuestionUsage = async (
  userId: string,
  questionType: string
): Promise<boolean> => {
  try {
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
  } catch (error) {
    console.error('Error in trackQuestionUsage:', error);
    return false;
  }
};

// Function to get OAuth providers
export const getOAuthProviders = () => {
  return {
    google: {
      name: 'Google',
      icon: 'google',
    },
    apple: {
      name: 'Apple',
      icon: 'apple',
    }
  };
};

// Function to sign in with OAuth provider
export const signInWithOAuth = async (provider: 'google' | 'apple') => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error signing in with ${provider}:`, error);
    throw error;
  }
};

// Function to get user subscription status
export const getUserSubscription = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('subscription')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error getting user subscription:', error);
      return 'free';
    }
    
    return data?.subscription || 'free';
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return 'free';
  }
};

// Function to update user subscription
export const updateUserSubscription = async (userId: string, subscription: 'free' | 'premium'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        subscription,
        last_active: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating user subscription:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserSubscription:', error);
    return false;
  }
};

// Function to get all users with pagination
export const getUsers = async (
  page: number = 1, 
  pageSize: number = 10, 
  searchQuery: string = '',
  statusFilter: string = 'all',
  roleFilter: string = 'all'
): Promise<{ users: any[], total: number }> => {
  try {
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (searchQuery) {
      query = query.or(
        `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`
      );
    }
    
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    
    if (roleFilter !== 'all') {
      query = query.eq('role', roleFilter);
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) {
      throw error;
    }
    
    return {
      users: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0 };
  }
};

// Function to get user by ID
export const getUserById = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

// Function to check if email already exists
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();
      
    if (error && error.code !== 'PGSQL_EMPTY_RESULT') {
      console.error('Error checking if email exists:', error);
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkEmailExists:', error);
    return false;
  }
};
