
import { supabase } from '@/lib/supabase';

/**
 * Signs in the user with OAuth using the specified provider
 * @param provider The OAuth provider (e.g., 'google', 'github', 'facebook')
 * @returns A promise that resolves to true if successful, false otherwise
 */
export const signInWithOAuth = async (provider: string): Promise<boolean> => {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      console.error('OAuth sign in error:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('OAuth sign in error:', err);
    return false;
  }
};

// Re-export additional auth helpers as needed
export const isPremiumUser = (user: any): boolean => {
  return user?.subscription === 'premium';
};

export const hasReachedDailyLimit = (user: any, questionType: string): boolean => {
  const limits = {
    free: {
      flashcards: 20,
      multipleChoice: 15,
      listening: 10,
      writing: 5,
      speaking: 5
    },
    premium: {
      flashcards: 1000,
      multipleChoice: 1000,
      listening: 1000,
      writing: 1000,
      speaking: 1000
    }
  };
  
  const planType = isPremiumUser(user) ? 'premium' : 'free';
  const limit = limits[planType][questionType] || 0;
  const currentCount = user?.dailyQuestionCounts?.[questionType] || 0;
  
  return currentCount >= limit;
};

export const trackQuestionUsage = async (user: any, questionType: string): Promise<boolean> => {
  if (!supabase || !user?.id) return false;
  
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Check if entry exists for today
    const { data: existingData } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .eq('question_type', questionType)
      .single();
    
    if (existingData) {
      // Update existing entry
      await supabase
        .from('usage_tracking')
        .update({ 
          count: existingData.count + 1,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingData.id);
    } else {
      // Create new entry
      await supabase
        .from('usage_tracking')
        .insert({
          user_id: user.id,
          question_type: questionType,
          date: today,
          count: 1,
          last_updated: new Date().toISOString()
        });
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking question usage:', error);
    return false;
  }
};

export const updateUserSubscription = async (userId: string, subscriptionType: string): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    const { error } = await supabase
      .from('users')
      .update({ subscription: subscriptionType })
      .eq('id', userId);
      
    return !error;
  } catch (error) {
    console.error('Error updating subscription:', error);
    return false;
  }
};
