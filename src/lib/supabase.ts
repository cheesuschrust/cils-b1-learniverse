
import { Provider } from '@supabase/supabase-js';  
import { supabase } from './supabase-client';  

console.log('Using configured Supabase credentials.');

export { supabase };

export async function signInWithOAuth(provider: Provider, options: any = {}) {  
  return await supabase.auth.signInWithOAuth({  
    provider,  
    ...options  
  });  
}  

export async function signInWithEmail(email: string, password: string) {  
  // Attempt actual sign in with Supabase
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}  

export async function signUp(email: string, password: string) {
  // Attempt actual sign up with Supabase
  return await supabase.auth.signUp({
    email,
    password
  });
}

export async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export async function updatePassword(newPassword: string) {
  return await supabase.auth.updateUser({ 
    password: newPassword 
  });
}

export async function signOut() {  
  return await supabase.auth.signOut();  
}  

export async function getSession() {
  return await supabase.auth.getSession();
}

export function getCurrentUser() {  
  return supabase.auth.getUser().then(({ data }) => {
    if (data?.user) {
      return {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.first_name || '',
        lastName: data.user.user_metadata?.last_name || '',
        isPremiumUser: data.user.user_metadata?.is_premium_user || false
      };
    }
    return null;
  });
}  

export function isPremiumUser(user: any): boolean {  
  return !!user?.isPremiumUser;  
}  

export function hasReachedDailyLimit(user: any): boolean {  
  return !isPremiumUser(user);  
}

export async function trackQuestionUsage(userId: string, questionType: string): Promise<void> {
  console.log(`Tracking question usage for user ${userId}, type: ${questionType}`);
  // In a real implementation, this would update a usage_tracking table
}

export async function updateUserSubscription(userId: string, subscriptionType: string): Promise<boolean> {
  console.log(`Updating subscription for user ${userId} to ${subscriptionType}`);
  // In a real implementation, this would update the user's subscription
  return true;
}
