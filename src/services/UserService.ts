
import { supabase } from "@/lib/supabase";
import { User, UserPreferences } from "@/contexts/shared-types";
import { VoicePreference } from "@/utils/textToSpeech";

export interface UserProfileResponse {
  user: User;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  preferredLanguage?: "english" | "italian" | "both";
  preferences?: Partial<UserPreferences>;
  voicePreference?: VoicePreference;
}

export class UserService {
  static async getUserProfile(userId: string): Promise<UserProfileResponse> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_preferences(*),
          user_metrics(*)
        `)
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Format user data for our app
      const user: User = {
        id: data.id,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        email: data.email,
        role: data.role as 'user' | 'admin',
        isVerified: data.is_verified,
        isAdmin: data.role === 'admin',
        createdAt: new Date(data.created_at),
        lastLogin: data.last_login ? new Date(data.last_login) : new Date(),
        lastActive: data.last_active ? new Date(data.last_active) : new Date(),
        status: data.status as 'active' | 'inactive' | 'suspended',
        subscription: data.subscription as 'free' | 'premium',
        preferredLanguage: data.preferred_language as 'english' | 'italian' | 'both',
        
        // Initialize daily question counts
        dailyQuestionCounts: {
          flashcards: 0,
          multipleChoice: 0,
          listening: 0,
          writing: 0,
          speaking: 0,
        },
        
        // Add metrics
        metrics: data.user_metrics ? {
          totalQuestions: data.user_metrics.total_questions,
          correctAnswers: data.user_metrics.correct_answers,
          streak: data.user_metrics.streak,
        } : {
          totalQuestions: 0,
          correctAnswers: 0,
          streak: 0,
        },
        
        // Add preferences
        preferences: data.user_preferences ? {
          theme: data.user_preferences.theme as 'light' | 'dark' | 'system',
          emailNotifications: data.user_preferences.email_notifications,
          language: data.user_preferences.language as 'en' | 'it',
          difficulty: data.user_preferences.difficulty as 'beginner' | 'intermediate' | 'advanced',
          fontSize: data.user_preferences.font_size || undefined,
          notificationsEnabled: data.user_preferences.notifications_enabled,
          animationsEnabled: data.user_preferences.animations_enabled,
          voiceSpeed: data.user_preferences.voice_speed || undefined,
          autoPlayAudio: data.user_preferences.auto_play_audio,
          showProgressMetrics: data.user_preferences.show_progress_metrics,
          aiEnabled: data.user_preferences.ai_enabled,
          aiModelSize: data.user_preferences.ai_model_size || undefined,
          aiProcessingOnDevice: data.user_preferences.ai_processing_on_device,
          confidenceScoreVisible: data.user_preferences.confidence_score_visible,
        } : {
          theme: 'system',
          emailNotifications: true,
          language: 'en',
          difficulty: 'beginner',
          notificationsEnabled: true,
          animationsEnabled: true,
          autoPlayAudio: true,
          showProgressMetrics: true,
          aiEnabled: true,
          aiProcessingOnDevice: false,
          confidenceScoreVisible: true,
        }
      };
      
      // Fetch daily question counts
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const { data: usageData, error: usageError } = await supabase
        .from('usage_tracking')
        .select('question_type, count')
        .eq('user_id', userId)
        .eq('date', today);
      
      if (!usageError && usageData) {
        // Update question counts based on usage data
        usageData.forEach(usage => {
          const type = usage.question_type;
          if (type in user.dailyQuestionCounts) {
            user.dailyQuestionCounts[type] = usage.count;
          }
        });
      }
      
      return { user };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
  
  static async updateProfile(userId: string, userData: UpdateProfileData): Promise<UserProfileResponse> {
    try {
      // Update user data
      if (userData.firstName || userData.lastName || userData.preferredLanguage) {
        const { error } = await supabase
          .from('users')
          .update({
            first_name: userData.firstName,
            last_name: userData.lastName,
            preferred_language: userData.preferredLanguage,
            last_active: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (error) throw error;
      }
      
      // If updating preferences
      if (userData.preferences) {
        const { error } = await supabase
          .from('user_preferences')
          .update({
            theme: userData.preferences.theme,
            email_notifications: userData.preferences.emailNotifications,
            language: userData.preferences.language,
            difficulty: userData.preferences.difficulty,
            font_size: userData.preferences.fontSize,
            notifications_enabled: userData.preferences.notificationsEnabled,
            animations_enabled: userData.preferences.animationsEnabled,
            voice_speed: userData.preferences.voiceSpeed,
            auto_play_audio: userData.preferences.autoPlayAudio,
            show_progress_metrics: userData.preferences.showProgressMetrics,
            ai_enabled: userData.preferences.aiEnabled,
            ai_model_size: userData.preferences.aiModelSize,
            ai_processing_on_device: userData.preferences.aiProcessingOnDevice,
            confidence_score_visible: userData.preferences.confidenceScoreVisible,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (error) throw error;
      }
      
      // Return updated user profile
      return await this.getUserProfile(userId);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
  
  static async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
  
  static async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserProfileResponse> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          theme: preferences.theme,
          email_notifications: preferences.emailNotifications,
          language: preferences.language,
          difficulty: preferences.difficulty,
          font_size: preferences.fontSize,
          notifications_enabled: preferences.notificationsEnabled,
          animations_enabled: preferences.animationsEnabled,
          voice_speed: preferences.voiceSpeed,
          auto_play_audio: preferences.autoPlayAudio,
          show_progress_metrics: preferences.showProgressMetrics,
          ai_enabled: preferences.aiEnabled,
          ai_model_size: preferences.aiModelSize,
          ai_processing_on_device: preferences.aiProcessingOnDevice,
          confidence_score_visible: preferences.confidenceScoreVisible,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Return updated user profile
      return await this.getUserProfile(userId);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
  
  static async getActivityLog(userId: string): Promise<any> {
    try {
      // This would fetch user activity from a dedicated table in a real implementation
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching user activity log:', error);
      throw error;
    }
  }
}
