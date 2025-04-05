
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nxmbadblisjgqdmhwrmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54bWJhZGJsaXNqZ3FkbWh3cm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDc5NjAsImV4cCI6MjA1ODkyMzk2MH0.JduQeJZkPiLUYb0Oy8wK4Ky4dUaZ9K_JoRZNKB2LoaM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'cils-b1-auth-key',
  }
});

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  
  if (data?.user) {
    return {
      id: data.user.id,
      email: data.user.email || '',
      firstName: data.user.user_metadata?.firstName || '',
      lastName: data.user.user_metadata?.lastName || '',
      displayName: data.user.user_metadata?.displayName || '',
      isPremiumUser: data.user.user_metadata?.isPremiumUser || false,
    };
  }
  
  return null;
};
