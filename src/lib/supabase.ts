
import { Provider } from '@supabase/supabase-js';  
import { createClient } from '@supabase/supabase-js';  

// Browser-safe environment variable handling  
const supabaseUrl = 'https://mock.supabase.co';  
const supabaseKey = 'mock-key-for-development';  

console.log('Using placeholder Supabase credentials. Authentication features will be simulated but not functional.');

// Create supabase client  
export const supabase = createClient(supabaseUrl, supabaseKey);  

export async function signInWithOAuth(provider: Provider, options: any = {}) {  
  return await supabase.auth.signInWithOAuth({  
    provider,  
    ...options  
  });  
}  

export async function signInWithEmail(email: string, password: string) {  
  // Mock successful response for development
  return {
    data: { 
      user: { 
        id: 'mock-user-id', 
        email, 
        user_metadata: { 
          first_name: 'Demo', 
          last_name: 'User' 
        } 
      },
      session: { access_token: 'mock-token' }
    },
    error: null
  };
}  

export async function signUp(email: string, password: string) {
  // Mock successful response for development
  return {
    data: { 
      user: { 
        id: 'new-mock-user-id', 
        email,
        user_metadata: {} 
      } 
    },
    error: null
  };
}

export async function resetPassword(email: string) {
  // Mock for development
  console.log(`Password reset requested for ${email}`);
  return { error: null };
}

export async function updatePassword(newPassword: string) {
  // Mock for development
  console.log('Password updated');
  return { error: null };
}

export async function signOut() {  
  return await supabase.auth.signOut();  
}  

export async function getSession() {
  // Mock successful session for development
  return { 
    data: { 
      session: { 
        user: { 
          id: 'mock-user-id', 
          email: 'user@example.com' 
        } 
      } 
    },
    error: null
  };
}

export function getCurrentUser() {  
  // Mock user data for development
  return Promise.resolve({
    id: 'mock-user-id',
    email: 'user@example.com',
    firstName: 'Demo',
    lastName: 'User',
    isPremiumUser: true
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
}

export async function updateUserSubscription(userId: string, subscriptionType: string): Promise<boolean> {
  console.log(`Updating subscription for user ${userId} to ${subscriptionType}`);
  return true;
}
