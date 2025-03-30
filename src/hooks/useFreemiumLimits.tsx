
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useToast } from "@/components/ui/use-toast";

// Define limits for free users
const FREE_LIMITS = {
  dailyQuestions: {
    flashcards: 20,
    multipleChoice: 15,
    speaking: 5,
    writing: 3,
    listening: 10
  },
  practiceExams: 1,
  aiAssistance: false,
  downloadableMaterials: false,
  progressAnalytics: 'basic'
};

export function useFreemiumLimits() {
  const { user, isPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Check if user has reached their daily question limit
  const checkQuestionLimit = async (questionType: string): Promise<boolean> => {
    if (isPremium || !user) return true; // Premium users have no limits, or no user logged in yet
    
    setIsLoading(true);
    try {
      // Get today's date in YYYY-MM-DD format for the query
      const today = new Date().toISOString().split('T')[0];
      
      // Check current usage
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('count')
        .eq('user_id', user.id)
        .eq('question_type', questionType)
        .eq('date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is fine
        console.error('Error checking question limit:', error);
        return true; // Allow usage if there's an error checking
      }
      
      const currentCount = data?.count || 0;
      const limit = FREE_LIMITS.dailyQuestions[questionType as keyof typeof FREE_LIMITS.dailyQuestions] || 0;
      
      return currentCount < limit;
    } catch (err) {
      console.error('Error in checkQuestionLimit:', err);
      return true; // Allow usage if there's an error
    } finally {
      setIsLoading(false);
    }
  };
  
  // Increment the usage counter
  const trackQuestionUsage = async (questionType: string): Promise<void> => {
    if (isPremium || !user) return; // Don't track for premium users
    
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Check if a record exists for today
      const { data, error: fetchError } = await supabase
        .from('usage_tracking')
        .select('id, count')
        .eq('user_id', user.id)
        .eq('question_type', questionType)
        .eq('date', today)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching usage tracking:', fetchError);
        return;
      }
      
      if (data) {
        // Update existing record
        await supabase
          .from('usage_tracking')
          .update({ 
            count: data.count + 1,
            last_updated: new Date().toISOString()
          })
          .eq('id', data.id);
      } else {
        // Create new record
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
    } catch (err) {
      console.error('Error tracking question usage:', err);
    }
  };
  
  // Check if user can access premium-only features
  const canAccessPremiumFeature = (feature: 'aiAssistance' | 'downloadableMaterials' | 'practiceExams'): boolean => {
    if (!user) return false; // No user logged in
    
    if (isPremium) return true; // Premium users can access everything
    
    // Specific checks for free users based on feature
    if (feature === 'practiceExams') {
      // This would ideally check a database record for how many practice exams they've taken
      // For now we'll just return true as we assume they haven't reached their limit
      return true;
    }
    
    return FREE_LIMITS[feature] || false;
  };
  
  // Show upgrade prompt when user hits a limit
  const showUpgradePrompt = (feature: string) => {
    toast({
      title: "Free Account Limit Reached",
      description: `Upgrade to Premium to access unlimited ${feature} and many more features.`,
      variant: "default",
      action: (
        <a href="/pricing" className="px-3 py-2 bg-primary text-white rounded-md text-xs font-medium">
          Upgrade
        </a>
      ),
    });
  };
  
  // Attempt to use a feature, checking limits and tracking usage
  const useFeature = async (featureType: string): Promise<boolean> => {
    if (isPremium) return true; // Premium users always have access
    
    if (featureType.includes('question:')) {
      const questionType = featureType.split(':')[1];
      const canUse = await checkQuestionLimit(questionType);
      
      if (canUse) {
        await trackQuestionUsage(questionType);
        return true;
      } else {
        showUpgradePrompt(questionType + ' questions');
        return false;
      }
    }
    
    if (featureType === 'aiAssistance' || featureType === 'downloadableMaterials') {
      const canAccess = canAccessPremiumFeature(featureType);
      if (!canAccess) {
        showUpgradePrompt(featureType);
      }
      return canAccess;
    }
    
    return false; // Unknown feature type
  };

  return {
    isPremium,
    isLoading,
    FREE_LIMITS,
    checkQuestionLimit,
    canAccessPremiumFeature,
    useFeature,
    showUpgradePrompt
  };
}
