
import { Provider } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

export const signInWithOAuth = async (provider: Provider, options: any = {}) => {
  return await supabase.auth.signInWithOAuth({
    provider,
    ...options
  });
};

// Add more authentication helper functions as needed
export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
};

export const updatePassword = async (newPassword: string) => {
  return await supabase.auth.updateUser({
    password: newPassword
  });
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

// Adding these helper functions to fix missing exports
export const isPremiumUser = async (userId: string): Promise<boolean> => {
  // Check if user has premium subscription
  try {
    const { data, error } = await supabase
      .from('users')
      .select('subscription')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.subscription === 'premium';
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

export const hasReachedDailyLimit = async (userId: string, questionType: string): Promise<boolean> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('user_question_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('question_type', questionType)
      .gte('created_at', today.toISOString())
      .single();
    
    if (error) throw error;
    
    // Free users can ask 10 questions per day
    const dailyLimit = 10;
    return data ? data.count >= dailyLimit : false;
  } catch (error) {
    console.error('Error checking question limit:', error);
    return false;
  }
};

export const trackQuestionUsage = async (userId: string, questionType: string): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if there's an existing record for today
    const { data: existingData, error: queryError } = await supabase
      .from('user_question_usage')
      .select('id, count')
      .eq('user_id', userId)
      .eq('question_type', questionType)
      .gte('created_at', today.toISOString())
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') {
      throw queryError;
    }
    
    if (existingData) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_question_usage')
        .update({ count: existingData.count + 1 })
        .eq('id', existingData.id);
      
      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('user_question_usage')
        .insert({
          user_id: userId,
          question_type: questionType,
          count: 1,
          created_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error tracking question usage:', error);
  }
};

export const updateUserSubscription = async (userId: string, subscriptionType: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        subscription: subscriptionType,
        subscription_updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return false;
  }
};
