import { createClient, Provider } from '@supabase/supabase-js';  

// Safely get environment variables with fallbacks - use dummy values for development  
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';  
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key-for-development-only';  

// Check if we're using real values and log accordingly  
const usingPlaceholders = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;  
if (usingPlaceholders) {  
  console.info('Using placeholder Supabase credentials. Authentication features will be simulated but not functional.');  
}   

// Create the Supabase client - always create something so the app doesn't crash  
export const supabase = createClient(supabaseUrl, supabaseAnonKey);  

// Export a function to safely get the Supabase client  
export const getSupabaseClient = () => {  
  // Instead of throwing errors, log warnings and return the client  
  if (usingPlaceholders) {  
    console.warn('Using non-functional Supabase client. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for authentication to work.');  
  }  
  return supabase;  
};  

// ADD MISSING AUTHENTICATION FUNCTIONS THAT LOGIN.TSX NEEDS  
// These will gracefully degrade when using placeholder credentials  

export const signInWithOAuth = async (provider: Provider, options: any = {}) => {  
  const client = getSupabaseClient();  
  if (usingPlaceholders) {  
    console.log(`OAuth sign-in with ${provider} would be triggered here`);  
    return { data: null, error: null };  
  }  
  return await client.auth.signInWithOAuth({  
    provider,  
    ...options  
  });  
};  

export const signInWithEmail = async (email: string, password: string) => {  
  const client = getSupabaseClient();  
  if (usingPlaceholders) {  
    console.log(`Sign-in attempted for email: ${email}`);  
    return { data: { user: { email, id: 'mock-user-id' }, session: {} }, error: null };  
  }  
  return await client.auth.signInWithPassword({  
    email,  
    password  
  });  
};  

export const signUp = async (email: string, password: string) => {  
  const client = getSupabaseClient();  
  if (usingPlaceholders) {  
    console.log(`Sign-up attempted for email: ${email}`);  
    return { data: { user: { email }, session: {} }, error: null };  
  }  
  return await client.auth.signUp({  
    email,  
    password  
  });  
};  

export const signOut = async () => {  
  const client = getSupabaseClient();  
  if (usingPlaceholders) {  
    console.log('Sign-out attempted');  
    return { error: null };  
  }  
  return await client.auth.signOut();  
};  

export const resetPassword = async (email: string) => {  
  const client = getSupabaseClient();  
  if (usingPlaceholders) {  
    console.log(`Password reset attempted for email: ${email}`);  
    return { data: {}, error: null };  
  }  
  return await client.auth.resetPasswordForEmail(email, {  
    redirectTo: `${window.location.origin}/reset-password`  
  });  
};  

export const updatePassword = async (newPassword: string) => {  
  const client = getSupabaseClient();  
  if (usingPlaceholders) {  
    console.log('Password update attempted');  
    return { data: {}, error: null };  
  }  
  return await client.auth.updateUser({  
    password: newPassword  
  });  
};  

export const getCurrentUser = async () => {  
  const client = getSupabaseClient();  
  if (usingPlaceholders) {  
    console.log('Getting current user (mock)');  
    return { id: 'mock-user-id', email: 'user@example.com', isPremiumUser: true };  
  }  
  const { data } = await client.auth.getUser();  
  return data.user;  
};  

export const getSession = async () => {  
  const client = getSupabaseClient();  
  if (usingPlaceholders) {  
    console.log('Getting session (mock)');  
    return { user: { id: 'mock-user-id', email: 'user@example.com' } };  
  }  
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
