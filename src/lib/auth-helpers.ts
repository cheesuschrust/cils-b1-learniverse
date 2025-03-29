
import { Provider } from '@supabase/supabase-js';  
import { supabase } from './supabase';  
import { User } from './interface-fixes';  

export async function signInWithOAuth(provider: Provider, options: any = {}) {  
  return await supabase.auth.signInWithOAuth({  
    provider,  
    ...options  
  });  
}  

export async function signInWithEmail(email: string, password: string) {  
  return await supabase.auth.signInWithPassword({  
    email,  
    password  
  });  
}  

export async function signOut() {  
  return await supabase.auth.signOut();  
}  

export function getCurrentUser(): Promise<User | null> {  
  return supabase.auth.getUser().then(({ data }) => {  
    if (!data.user) return null;  
    return {  
      id: data.user.id,  
      email: data.user.email || '',  
      firstName: data.user.user_metadata?.first_name,  
      lastName: data.user.user_metadata?.last_name,  
      isPremiumUser: !!data.user.user_metadata?.is_premium  
    };  
  });  
}  

export function isPremiumUser(user: any): boolean {  
  return !!user?.isPremiumUser;  
}  

export function hasReachedDailyLimit(user: any): boolean {  
  return !isPremiumUser(user);  
}

export async function trackQuestionUsage(userId: string, questionType: string): Promise<void> {
  // This is a placeholder implementation
  console.log(`Tracking question usage for user ${userId}, type: ${questionType}`);
  // In a real implementation, this would update the database
}

export async function updateUserSubscription(userId: string, subscriptionType: string): Promise<boolean> {
  // This is a placeholder implementation
  console.log(`Updating subscription for user ${userId} to ${subscriptionType}`);
  // In a real implementation, this would update the database
  return true;
}
