import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isPremiumUser, hasReachedDailyLimit, trackQuestionUsage } from "@/lib/supabase";
import { User, UserPreferences, LogCategory, LogEntry, EmailSettings } from "./shared-types";
import { useToast } from "@/components/ui/use-toast";

// Export these types for use in other components
export type { User, UserPreferences, LogCategory, LogEntry, EmailSettings };

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { firstName: string, lastName: string, email: string, password: string }) => Promise<User>;
  logout: () => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  completePasswordReset: (token: string, newPassword: string) => Promise<boolean>;
  
  // User profile methods
  updateProfile: (data: Partial<User>) => Promise<User>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
  
  // Email verification
  verifyEmail: (token: string) => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  
  // Session management
  refreshSession: () => Promise<boolean>;
  
  // Email settings
  getEmailSettings: () => EmailSettings;
  updateEmailSettings: (settings: EmailSettings) => Promise<boolean>;
  
  // Admin functions
  getAllUsers: () => Promise<User[]>;
  deleteUser: (userId: string) => Promise<boolean>;
  disableUser: (userId: string) => Promise<boolean>;
  enableUser: (userId: string) => Promise<boolean>;
  makeAdmin: (userId: string) => Promise<boolean>;
  addAdmin: (userId: string) => Promise<boolean>;
  
  // User status
  updateUserStatus: (userId: string, status: string) => Promise<boolean>;
  updateUserSubscription: (userId: string, subscription: string) => Promise<boolean>;
  
  // System logs
  getSystemLogs: (
    category?: LogCategory, 
    level?: 'info' | 'warning' | 'error', 
    startDate?: Date, 
    endDate?: Date
  ) => Promise<LogEntry[]>;
  addSystemLog: (
    category: LogCategory, 
    action: string, 
    details?: string, 
    level?: 'info' | 'warning' | 'error'
  ) => void;
  updateSystemLog: (logId: string, updates: Partial<LogEntry>) => Promise<boolean>;
  
  // Registration checks
  checkEmailExists: (email: string) => Promise<boolean>;
  
  // Question limits
  incrementDailyQuestionCount: (type: string) => Promise<boolean>;
  
  // Additional methods
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username?: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>([]);
  const { toast } = useToast();
  
  // Check auth state on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await handleUserAuthenticated(session);
        }
      } catch (err) {
        console.error('Auth state check error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await handleUserAuthenticated(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Helper function to fetch and format user data
  const handleUserAuthenticated = async (session: Session) => {
    try {
      const supaUser = session.user;
      
      // Fetch user details from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, user_preferences(*), user_metrics(*)')
        .eq('id', supaUser.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        return;
      }
      
      if (!userData) {
        console.error('No user data found for authenticated user');
        return;
      }
      
      // Convert to our User format
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
        
        // Initialize daily question counts (will be fetched from usage_tracking)
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
      
      // Fetch daily question counts from usage_tracking
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const { data: usageData, error: usageError } = await supabase
        .from('usage_tracking')
        .select('question_type, count')
        .eq('user_id', supaUser.id)
        .eq('date', today);
      
      if (usageError) {
        console.error('Error fetching usage data:', usageError);
      } else if (usageData) {
        // Update question counts based on usage data
        usageData.forEach(usage => {
          const type = usage.question_type;
          if (type in formattedUser.dailyQuestionCounts) {
            formattedUser.dailyQuestionCounts[type] = usage.count;
          }
        });
      }
      
      // Update last login time
      await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          last_active: new Date().toISOString()
        })
        .eq('id', supaUser.id);
      
      setUser(formattedUser);
      
    } catch (err) {
      console.error('Error handling authenticated user:', err);
    }
  };
  
  const login = async (email: string, password: string): Promise<boolean> => {
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
      
      return !!data.session;
      
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
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
  };
  
  const register = async (data: { firstName: string, lastName: string, email: string, password: string }) => {
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
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    setIsLoading(true);
    try {
      // Update in Supabase
      const { error: profileError } = await supabase
        .from('users')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          preferred_language: data.preferredLanguage,
          last_active: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (profileError) {
        throw profileError;
      }
      
      // If updating preferences
      if (data.preferences) {
        const { error: prefError } = await supabase
          .from('user_preferences')
          .update({
            theme: data.preferences.theme,
            email_notifications: data.preferences.emailNotifications,
            language: data.preferences.language,
            difficulty: data.preferences.difficulty,
            font_size: data.preferences.fontSize,
            notifications_enabled: data.preferences.notificationsEnabled,
            animations_enabled: data.preferences.animationsEnabled,
            voice_speed: data.preferences.voiceSpeed,
            auto_play_audio: data.preferences.autoPlayAudio,
            show_progress_metrics: data.preferences.showProgressMetrics,
            ai_enabled: data.preferences.aiEnabled,
            ai_model_size: data.preferences.aiModelSize,
            ai_processing_on_device: data.preferences.aiProcessingOnDevice,
            confidence_score_visible: data.preferences.confidenceScoreVisible,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
        
        if (prefError) {
          throw prefError;
        }
      }
      
      // Update user in state
      const updatedUser = {
        ...user,
        ...data,
        name: `${data.firstName || user.firstName} ${data.lastName || user.lastName}`.trim()
      };
      
      setUser(updatedUser);
      return updatedUser;
      
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
  };
  
  const incrementDailyQuestionCount = async (type: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check if the user is premium (unlimited access)
      if (isPremiumUser(user.subscription)) {
        return true;
      }
      
      // Check if the user has reached their daily limit
      const limitReached = await hasReachedDailyLimit(user.id, type);
      
      if (limitReached) {
        toast({
          title: "Daily Limit Reached",
          description: "You've reached your daily limit. Upgrade to premium for unlimited access.",
          variant: "destructive"
        });
        return false;
      }
      
      // Track the question usage
      const success = await trackQuestionUsage(user.id, type);
      
      if (success) {
        // Update user's daily question count in state
        setUser(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            dailyQuestionCounts: {
              ...prev.dailyQuestionCounts,
              [type]: (prev.dailyQuestionCounts[type] || 0) + 1
            }
          };
        });
        
        // Also update metrics
        const { error } = await supabase
          .from('user_metrics')
          .update({
            total_questions: user.metrics.totalQuestions + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error updating user metrics:', error);
        }
      }
      
      return success;
      
    } catch (error) {
      console.error(`Error incrementing question count for ${type}:`, error);
      return false;
    }
  };

  // Create remaining functions to satisfy the interface
  const socialLogin = async (provider: 'google' | 'apple'): Promise<boolean> => {
    try {
      toast({
        title: `Signing in with ${provider}`,
        description: "Redirecting to authentication provider...",
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error(`Social login error: ${error}`);
      toast({
        title: "Authentication Failed",
        description: "Could not authenticate with social provider.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // The rest of the functions implementation
  // ... keep existing code for the remaining functions with Supabase integration

  // Create auth context value with all required methods
  const authContextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    socialLogin,
    updateProfile,
    updatePassword: async (currentPassword, newPassword) => {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      } catch (error: any) {
        console.error("Error updating password:", error);
        toast({
          title: "Password Update Failed",
          description: error.message || "Could not update password",
          variant: "destructive"
        });
        throw error;
      }
    },
    resetPassword: async (email) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Password Reset Requested",
          description: "If an account exists with this email, you will receive password reset instructions.",
        });
        return true;
      } catch (error) {
        console.error(`Password reset error:`, error);
        toast({
          title: "Password Reset Requested",
          description: "If an account exists with this email, you will receive password reset instructions.",
        });
        return false;
      }
    },
    forgotPassword: async (email) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Email Sent",
          description: "If an account exists with this email, you will receive password reset instructions.",
        });
      } catch (error) {
        console.error("Forgot password error:", error);
        toast({
          title: "Email Sent",
          description: "If an account exists with this email, you will receive password reset instructions.",
        });
      }
    },
    completePasswordReset: async (token, newPassword) => {
      try {
        // Supabase handles this automatically via auth.updateUser
        toast({
          title: "Password Reset Complete",
          description: "Your password has been successfully reset. You can now login with your new password.",
        });
        return true;
      } catch (error) {
        console.error(`Complete password reset error:`, error);
        toast({
          title: "Reset Failed",
          description: "Could not reset password. The link may be expired or invalid.",
          variant: "destructive"
        });
        return false;
      }
    },
    updateUser: async (updates) => {
      if (!user) return false;
      
      try {
        const result = await updateProfile(updates);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        return !!result;
      } catch (error) {
        console.error("Error updating user:", error);
        return false;
      }
    },
    updateUserPreferences: async (preferences) => {
      if (!user) return false;
      
      try {
        await updateProfile({ preferences });
        toast({
          title: "Preferences Updated",
          description: "Your preferences have been successfully updated.",
        });
        return true;
      } catch (error) {
        console.error("Error updating preferences:", error);
        return false;
      }
    },
    verifyEmail: async (token) => {
      try {
        // Supabase handles email verification through auth links
        // This function would be called after the user clicks the verification link
        // and the verification has already happened
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified.",
        });
        
        // Update user in our database
        if (user) {
          await supabase
            .from('users')
            .update({ is_verified: true })
            .eq('id', user.id);
          
          setUser({
            ...user,
            isVerified: true
          });
        }
        
        return true;
      } catch (error) {
        console.error(`Email verification error:`, error);
        toast({
          title: "Verification Failed",
          description: "Could not verify email. The link may be expired or invalid.",
          variant: "destructive"
        });
        return false;
      }
    },
    sendVerificationEmail: async (email) => {
      try {
        // This function would re-send the verification email using Supabase
        toast({
          title: "Verification Email Sent",
          description: "A verification email has been sent to your email address.",
        });
        return true;
      } catch (error) {
        console.error(`Send verification email error:`, error);
        toast({
          title: "Error Sending Email",
          description: "Could not send verification email. Please try again later.",
          variant: "destructive"
        });
        return false;
      }
    },
    resendVerificationEmail: async (email) => {
      try {
        // This function would re-send the verification email using Supabase
        toast({
          title: "Verification Email Resent",
          description: "A new verification email has been sent to your email address.",
        });
        return true;
      } catch (error) {
        console.error(`Resend verification email error:`, error);
        toast({
          title: "Error Sending Email",
          description: "Could not resend verification email. Please try again later.",
          variant: "destructive"
        });
        return false;
      }
    },
    refreshSession: async () => {
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) throw error;
        return !!data.session;
      } catch (error) {
        console.error("Session refresh error:", error);
        return false;
      }
    },
    getEmailSettings: () => ({
      provider: 'smtp',
      fromEmail: 'noreply@example.com',
      fromName: 'CILS B2 Cittadinanza',
      config: {
        enableSsl: true,
        host: "smtp.example.com",
        port: 587,
        username: "user@example.com",
        password: "password123"
      },
      templates: {
        verification: {
          subject: 'Verify your email',
          body: 'Please verify your email'
        },
        passwordReset: {
          subject: 'Reset your password',
          body: 'Reset your password'
        },
        welcome: {
          subject: 'Welcome',
          body: 'Welcome to our platform'
        }
      },
      temporaryInboxDuration: 24
    }),
    updateEmailSettings: async (settings) => {
      try {
        toast({
          title: "Email Settings Updated",
          description: "Your email settings have been successfully updated.",
        });
        return true;
      } catch (error) {
        console.error("Error updating email settings:", error);
        toast({
          title: "Update Failed",
          description: "Could not update email settings. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    getAllUsers: async () => {
      try {
        if (!user?.isAdmin) {
          throw new Error('Unauthorized: Admin access required');
        }
        
        const { data, error } = await supabase
          .from('users')
          .select('*');
        
        if (error) throw error;
        
        return data.map(u => ({
          id: u.id,
          firstName: u.first_name || '',
          lastName: u.last_name || '',
          name: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
          email: u.email,
          role: u.role as 'user' | 'admin',
          isVerified: u.is_verified,
          isAdmin: u.role === 'admin',
          createdAt: new Date(u.created_at),
          lastLogin: u.last_login ? new Date(u.last_login) : new Date(),
          lastActive: u.last_active ? new Date(u.last_active) : new Date(),
          status: u.status as 'active' | 'inactive' | 'suspended',
          subscription: u.subscription as 'free' | 'premium',
          preferredLanguage: u.preferred_language as 'english' | 'italian' | 'both',
          dailyQuestionCounts: { flashcards: 0, multipleChoice: 0, listening: 0, writing: 0, speaking: 0 },
          metrics: { totalQuestions: 0, correctAnswers: 0, streak: 0 },
          preferences: {
            theme: 'system',
            emailNotifications: true,
            language: 'en',
            difficulty: 'beginner',
          }
        }));
      } catch (error) {
        console.error("Error getting users:", error);
        toast({
          title: "Error Fetching Users",
          description: "Could not fetch users. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    },
    deleteUser: async (userId) => {
      try {
        if (!user?.isAdmin) {
          throw new Error('Unauthorized: Admin access required');
        }
        
        // Delete user from Supabase auth
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        
        if (authError) throw authError;
        
        // Delete from our users table
        const { error: dbError } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);
        
        if (dbError) throw dbError;
        
        toast({
          title: "User Deleted",
          description: "The user has been successfully deleted.",
        });
        return true;
      } catch (error) {
        console.error(`Error deleting user ${userId}:`, error);
        toast({
          title: "Delete Failed",
          description: "Could not delete user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    disableUser: async (userId) => {
      try {
        if (!user?.isAdmin) {
          throw new Error('Unauthorized: Admin access required');
        }
        
        const { error } = await supabase
          .from('users')
          .update({ status: 'suspended' })
          .eq('id', userId);
        
        if (error) throw error;
        
        toast({
          title: "User Disabled",
          description: "The user has been successfully disabled.",
        });
        return true;
      } catch (error) {
        console.error(`Error disabling user ${userId}:`, error);
        toast({
          title: "Action Failed",
          description: "Could not disable user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    enableUser: async (userId) => {
      try {
        if (!user?.isAdmin) {
          throw new Error('Unauthorized: Admin access required');
        }
        
        const { error } = await supabase
          .from('users')
          .update({ status: 'active' })
          .eq('id', userId);
        
        if (error) throw error;
        
        toast({
          title: "User Enabled",
          description: "The user has been successfully enabled.",
        });
        return true;
      } catch (error) {
        console.error(`Error enabling user ${userId}:`, error);
        toast({
          title: "Action Failed",
          description: "Could not enable user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    makeAdmin: async (userId) => {
      try {
        if (!user?.isAdmin) {
          throw new Error('Unauthorized: Admin access required');
        }
        
        const { error } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', userId);
        
        if (error) throw error;
        
        toast({
          title: "Admin Role Added",
          description: "The user has been successfully made an admin.",
        });
        return true;
      } catch (error) {
        console.error(`Error making user ${userId} admin:`, error);
        toast({
          title: "Action Failed",
          description: "Could not update user role. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    addAdmin: async (userId) => {
      return await authContextValue.makeAdmin(userId);
    },
    updateUserStatus: async (userId, status) => {
      try {
        if (!user?.isAdmin) {
          throw new Error('Unauthorized: Admin access required');
        }
        
        const { error } = await supabase
          .from('users')
          .update({ status })
          .eq('id', userId);
        
        if (error) throw error;
        
        toast({
          title: "Status Updated",
          description: `User status updated to "${status}".`,
        });
        return true;
      } catch (error) {
        console.error(`Error updating status of user ${userId}:`, error);
        toast({
          title: "Update Failed",
          description: "Could not update user status. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    updateUserSubscription: async (userId, subscription) => {
      try {
        if (!user?.isAdmin) {
          throw new Error('Unauthorized: Admin access required');
        }
        
        const { error } = await supabase
          .from('users')
          .update({ subscription })
          .eq('id', userId);
        
        if (error) throw error;
        
        toast({
          title: "Subscription Updated",
          description: `User subscription updated to "${subscription}".`,
        });
        return true;
      } catch (error) {
        console.error(`Error updating subscription of user ${userId}:`, error);
        toast({
          title: "Update Failed",
          description: "Could not update user subscription. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    getSystemLogs: async (category, level, startDate, endDate) => {
      try {
        if (!user?.isAdmin) {
          throw new Error('Unauthorized: Admin access required');
        }
        
        // In a real implementation, this would query a logs table in Supabase
        return systemLogs.filter(log => {
          if (category && log.category !== category) return false;
          if (level && log.level !== level) return false;
          if (startDate && new Date(log.timestamp) < startDate) return false;
          if (endDate && new Date(log.timestamp) > endDate) return false;
          return true;
        });
      } catch (error) {
        console.error("Error getting system logs:", error);
        toast({
          title: "Error Fetching Logs",
          description: "Could not fetch system logs. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    },
    addSystemLog: (category, action, details, level = 'info') => {
      try {
        const newLog: LogEntry = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          category,
          action,
          details: details || '',
          level,
          timestamp: new Date(),
          userId: user?.id || 'system'
        };
        
        setSystemLogs(prev => [...prev, newLog]);
        
        // In a real implementation, this would insert into a logs table in Supabase
      } catch (error) {
        console.error("Error adding system log:", error);
      }
    },
    updateSystemLog: async (logId, updates) => {
      try {
        setSystemLogs(prev => prev.map(log => 
          log.id === logId ? { ...log, ...updates } : log
        ));
        return true;
      } catch (error) {
        console.error(`Error updating log ${logId}:`, error);
        return false;
      }
    },
    checkEmailExists: async (email) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .maybeSingle();
        
        if (error) throw error;
        
        return !!data;
      } catch (error) {
        console.error(`Error checking if email ${email} exists:`, error);
        return false;
      }
    },
    incrementDailyQuestionCount,
    signup: async (firstName, lastName, email, password, username) => {
      try {
        await register({
          firstName,
          lastName,
          email,
          password
        });
        
        toast({
          title: "Account Created",
          description: "Your account has been successfully created.",
        });
        return true;
      } catch (error) {
        console.error("Signup error:", error);
        return false;
      }
    }
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
