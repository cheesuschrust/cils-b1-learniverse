
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { UserPreferences } from '@/types/userPreferences';
import { useToast } from '@/components/ui/use-toast';

export function useUserPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(user?.preferences || null);

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Update in Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme: newPreferences.theme || preferences?.theme || 'system',
          email_notifications: newPreferences.emailNotifications ?? preferences?.emailNotifications ?? true,
          language: newPreferences.language || preferences?.language || 'en',
          difficulty: newPreferences.difficulty || preferences?.difficulty || 'beginner',
          notifications_enabled: newPreferences.notifications ?? preferences?.notifications ?? true,
          font_size: newPreferences.fontSize || preferences?.fontSize || 16,
          animations_enabled: newPreferences.animationsEnabled ?? preferences?.animationsEnabled ?? true,
          voice_speed: newPreferences.voiceSpeed || preferences?.voiceSpeed || 1,
          auto_play_audio: newPreferences.autoPlayAudio ?? preferences?.autoPlayAudio ?? true,
          show_progress_metrics: newPreferences.showProgressMetrics ?? preferences?.showProgressMetrics ?? true,
          ai_enabled: newPreferences.aiEnabled ?? preferences?.aiEnabled ?? true,
          ai_model_size: newPreferences.aiModelSize || preferences?.aiModelSize || 'medium',
          ai_processing_on_device: newPreferences.aiProcessingOnDevice ?? preferences?.aiProcessingOnDevice ?? false,
          confidence_score_visible: newPreferences.confidenceScoreVisible ?? preferences?.confidenceScoreVisible ?? true,
          onboarding_completed: newPreferences.onboardingCompleted ?? preferences?.onboardingCompleted ?? false,
        });

      if (error) throw error;

      // Update local state
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);

      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update preferences",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    preferences,
    updatePreferences,
    isLoading,
  };
}

export default useUserPreferences;
