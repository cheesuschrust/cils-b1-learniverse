import { createClient, Provider } from '@supabase/supabase-js';  

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

// ADD MISSING AUTHENTICATION FUNCTIONS THAT LOGIN.TSX NEEDS  

export const signInWithOAuth = async (provider: Provider, options: any = {}) => {  
  const client = getSupabaseClient();  
  return await client.auth.signInWithOAuth({  
    provider,  
    ...options  
  });  
};  

export const signInWithEmail = async (email: string, password: string) => {  
  const client = getSupabaseClient();  
  return await client.auth.signInWithPassword({  
    email,  
    password  
  });  
};  

export const signUp = async (email: string, password: string) => {  
  const client = getSupabaseClient();  
  return await client.auth.signUp({  
    email,  
    password  
  });  
};  

export const signOut = async () => {  
  const client = getSupabaseClient();  
  return await client.auth.signOut();  
};  

export const resetPassword = async (email: string) => {  
  const client = getSupabaseClient();  
  return await client.auth.resetPasswordForEmail(email, {  
    redirectTo: `${window.location.origin}/reset-password`  
  });  
};  

export const updatePassword = async (newPassword: string) => {  
  const client = getSupabaseClient();  
  return await client.auth.updateUser({  
    password: newPassword  
  });  
};  

export const getCurrentUser = async () => {  
  const client = getSupabaseClient();  
  const { data } = await client.auth.getUser();  
  return data.user;  
};  

export const getSession = async () => {  
  const client = getSupabaseClient();  
  const { data } = await client.auth.getSession();  
  return data.session;  
};  

// Simple helper functions  
export const isPremiumUser = (user: any): boolean => {  
  return !!user?.isPremiumUser;  
};  

export const hasReachedDailyLimit = (user: any): boolean => {  
  return !isPremiumUser(user);  
};  
