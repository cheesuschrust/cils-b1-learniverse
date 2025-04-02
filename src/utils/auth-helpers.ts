
// This file is now deprecated, use the AuthContext instead
import { Provider } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';

// Reexport auth functions for backward compatibility
// These will be removed in a future update

export async function signInWithOAuth(provider: Provider, options: any = {}) {
  console.warn(
    'Warning: This function is deprecated. Use the AuthContext\'s loginWithGoogle method instead.'
  );
  return await supabase.auth.signInWithOAuth({
    provider,
    ...options
  });
}

export async function signInWithEmail(email: string, password: string) {
  console.warn(
    'Warning: This function is deprecated. Use the AuthContext\'s login method instead.'
  );
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signUp(email: string, password: string) {
  console.warn(
    'Warning: This function is deprecated. Use the AuthContext\'s signup method instead.'
  );
  return await supabase.auth.signUp({
    email,
    password
  });
}

export async function signOut() {
  console.warn(
    'Warning: This function is deprecated. Use the AuthContext\'s logout method instead.'
  );
  return await supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  console.warn(
    'Warning: This function is deprecated. Use the AuthContext\'s resetPassword method instead.'
  );
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export async function updatePassword(newPassword: string) {
  console.warn(
    'Warning: This function is deprecated. Use the AuthContext\'s updatePassword method instead.'
  );
  return await supabase.auth.updateUser({ 
    password: newPassword 
  });
}

export async function getSession() {
  console.warn(
    'Warning: This function is deprecated. Use the AuthContext\'s session property instead.'
  );
  return await supabase.auth.getSession();
}

export async function getCurrentUser() {
  console.warn(
    'Warning: This function is deprecated. Use the AuthContext\'s user property instead.'
  );
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export const isPremiumUser = async (userId: string): Promise<boolean> => {
  console.warn(
    'Warning: This function is deprecated. Use the AuthContext\'s isPremium property instead.'
  );
  try {
    const { data, error } = await supabase.rpc('is_premium_user', { user_id: userId });
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

export const hasReachedDailyLimit = async (userId: string, questionType: string): Promise<boolean> => {
  console.warn(
    'Warning: This function is deprecated. Use the quota tracking utilities instead.'
  );
  // Default to false for now - will be implemented in a future update
  return false;
};

export const trackQuestionUsage = async (userId: string, questionType: string): Promise<void> => {
  console.warn(
    'Warning: This function is deprecated. Use the quota tracking utilities instead.'
  );
  // Implementation will be added in a future update
};

export const updateUserSubscription = async (userId: string, subscriptionType: string): Promise<boolean> => {
  console.warn(
    'Warning: This function is deprecated. Use the subscription management utilities instead.'
  );
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        is_premium: subscriptionType === 'premium',
        premium_until: subscriptionType === 'premium' 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          : null
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return false;
  }
};
