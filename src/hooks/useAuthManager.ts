
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@/contexts/shared-types";
import { RegisterData } from "@/services/AuthService";
import { UpdateProfileData, UserService } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";

export const useAuthManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user details from our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*, user_preferences(*), user_metrics(*)')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            throw userError;
          }
          
          if (userData) {
            // Format the user data for our app context
            const formattedUser: User = {
              id: userData.id,
              firstName: userData.first_name || '',
              lastName: userData.last_name || '',
              name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
              email: userData.email,
              role: userData.role as 'user' | 'admin',
              isVerified: userData.is_verified,
              isAdmin: userData.role === 'admin',
              createdAt: new Date(userData.created_at),
              lastLogin: userData.last_login ? new Date(userData.last_login) : new Date(),
              lastActive: userData.last_active ? new Date(userData.last_active) : new Date(),
              status: userData.status as 'active' | 'inactive' | 'suspended',
              subscription: userData.subscription as 'free' | 'premium',
              preferredLanguage: userData.preferred_language as 'english' | 'italian' | 'both',
              
              // Initialize daily question counts
              dailyQuestionCounts: {
                flashcards: 0,
                multipleChoice: 0,
                listening: 0,
                writing: 0,
                speaking: 0,
              },
              
              // Add metrics
              metrics: userData.user_metrics ? {
                totalQuestions: userData.user_metrics.total_questions,
                correctAnswers: userData.user_metrics.correct_answers,
                streak: userData.user_metrics.streak,
              } : {
                totalQuestions: 0,
                correctAnswers: 0,
                streak: 0,
              },
              
              // Add preferences
              preferences: userData.user_preferences ? {
                theme: userData.user_preferences.theme as 'light' | 'dark' | 'system',
                emailNotifications: userData.user_preferences.email_notifications,
                language: userData.user_preferences.language as 'en' | 'it',
                difficulty: userData.user_preferences.difficulty as 'beginner' | 'intermediate' | 'advanced',
                fontSize: userData.user_preferences.font_size || undefined,
                notificationsEnabled: userData.user_preferences.notifications_enabled,
                animationsEnabled: userData.user_preferences.animations_enabled,
                voiceSpeed: userData.user_preferences.voice_speed || undefined,
                autoPlayAudio: userData.user_preferences.auto_play_audio,
                showProgressMetrics: userData.user_preferences.show_progress_metrics,
                aiEnabled: userData.user_preferences.ai_enabled,
                aiModelSize: userData.user_preferences.ai_model_size || undefined,
                aiProcessingOnDevice: userData.user_preferences.ai_processing_on_device,
                confidenceScoreVisible: userData.user_preferences.confidence_score_visible,
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
              .eq('user_id', userData.id)
              .eq('date', today);
            
            if (!usageError && usageData) {
              // Update question counts based on usage data
              usageData.forEach(usage => {
                const type = usage.question_type;
                if (type in formattedUser.dailyQuestionCounts) {
                  formattedUser.dailyQuestionCounts[type] = usage.count;
                }
              });
            }
            
            // Update last active time
            await supabase
              .from('users')
              .update({ 
                last_active: new Date().toISOString()
              })
              .eq('id', userData.id);
            
            setUser(formattedUser);
          }
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await checkAuth();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // Session will trigger the onAuthStateChange hook
      return !!data.session;
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      // First register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });
      
      if (authError) {
        throw authError;
      }
      
      const userId = authData.user?.id;
      
      if (!userId) {
        throw new Error("Registration failed - no user ID returned");
      }
      
      // Then add user to our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'user',
          subscription: 'free',
          is_verified: false,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          last_active: new Date().toISOString(),
          preferred_language: 'both',
          status: 'active'
        })
        .select()
        .single();
      
      if (userError) {
        // Rollback - delete the auth user since we couldn't create the user record
        await supabase.auth.admin.deleteUser(userId);
        throw userError;
      }
      
      // Add default user preferences
      const { error: prefError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          theme: 'system',
          email_notifications: true,
          language: 'en',
          difficulty: 'beginner',
          notifications_enabled: true,
          animations_enabled: true,
          auto_play_audio: true,
          show_progress_metrics: true,
          ai_enabled: true,
          ai_processing_on_device: false,
          confidence_score_visible: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (prefError) {
        console.error('Error creating user preferences:', prefError);
      }
      
      // Add default user metrics
      const { error: metricsError } = await supabase
        .from('user_metrics')
        .insert({
          user_id: userId,
          total_questions: 0,
          correct_answers: 0,
          streak: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (metricsError) {
        console.error('Error creating user metrics:', metricsError);
      }
      
      // Format the user object for our app context
      const formattedUser: User = {
        id: userId,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        role: 'user',
        isVerified: false,
        isAdmin: false,
        createdAt: new Date(),
        lastLogin: new Date(),
        lastActive: new Date(),
        status: 'active',
        subscription: 'free',
        preferredLanguage: 'both',
        dailyQuestionCounts: {
          flashcards: 0,
          multipleChoice: 0,
          listening: 0,
          writing: 0,
          speaking: 0,
        },
        metrics: {
          totalQuestions: 0,
          correctAnswers: 0,
          streak: 0,
        },
        preferences: {
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
      
      setUser(formattedUser);
      return formattedUser;
      
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    setIsLoading(true);
    try {
      const response = await UserService.updateProfile(user.id, data);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      const errorMessage = err.message || 'Profile update failed';
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);
  
  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    setIsLoading(true);
    try {
      await UserService.updatePassword(user.id, currentPassword, newPassword);
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Password update failed';
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);
  
  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email Sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
      });
    } catch (err) {
      console.error("Forgot password error:", err);
      // Don't show error to prevent email enumeration attacks
      toast({
        title: "Email Sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
  };
};
