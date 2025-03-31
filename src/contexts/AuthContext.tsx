
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User, UserPreferences } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { DEFAULT_USER_PREFERENCES, normalizeUserPreferences } from '@/types/userPreferences';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => Promise<User | null>;
  // Added missing methods to fix errors
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  socialLogin: (provider: string) => Promise<void>;
  isLoading: boolean;
  getAllUsers: () => Promise<User[]>;
  createUser: (userData: Partial<User>) => Promise<User | null>;
  updateUser: (id: string, updates: Partial<User>) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  addSystemLog: (eventType: string, details: any) => Promise<void>;
  getSystemLogs: () => Promise<any[]>;
  updateSystemLog: (id: string, updates: any) => Promise<any>;
  getEmailSettings: () => Promise<any>;
  updateEmailSettings: (settings: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  loginWithGoogle: async () => {},
  logout: async () => {},
  signUp: async () => {},
  loading: true,
  error: null,
  isAuthenticated: false,
  updateProfile: async () => null,
  // Added missing methods to fix errors
  signup: async () => {},
  verifyEmail: async () => false,
  resendVerificationEmail: async () => false,
  resetPassword: async () => false,
  updatePassword: async () => false,
  socialLogin: async () => {},
  isLoading: true,
  getAllUsers: async () => [],
  createUser: async () => null,
  updateUser: async () => null,
  deleteUser: async () => false,
  addSystemLog: async () => {},
  getSystemLogs: async () => [],
  updateSystemLog: async () => ({}),
  getEmailSettings: async () => ({}),
  updateEmailSettings: async () => false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from('users')
            .select(`
              id, 
              email, 
              first_name, 
              last_name, 
              role, 
              is_verified, 
              created_at, 
              subscription, 
              preferred_language,
              user_preferences(*)
            `)
            .eq('id', session.user.id)
            .single();

          if (error) throw error;

          const userPreferences: UserPreferences = {
            theme: data.user_preferences?.length ? data.user_preferences[0]?.theme || 'system' : 'system',
            language: data.user_preferences?.length ? data.user_preferences[0]?.language || 'en' : 'en',
            notifications: data.user_preferences?.length ? data.user_preferences[0]?.notifications_enabled || true : true,
            emailNotifications: data.user_preferences?.length ? data.user_preferences[0]?.email_notifications || true : true,
            difficulty: data.user_preferences?.length ? data.user_preferences[0]?.difficulty || 'beginner' : 'beginner',
            onboardingCompleted: data.user_preferences?.length ? Boolean(data.user_preferences[0]?.onboardingCompleted) : false,
          };

          setUser({
            id: data.id,
            email: data.email,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            role: data.role || 'user',
            isVerified: data.is_verified || false,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(),
            subscription: data.subscription || 'free',
            preferredLanguage: data.preferred_language || 'english',
            preferences: userPreferences,
            dailyQuestionCounts: {
              flashcards: 0,
              multipleChoice: 0,
              speaking: 0,
              writing: 0,
              listening: 0,
            },
            // Add properties for compatibility with User interface
            isPremiumUser: data.subscription !== 'free',
            isPremium: data.subscription !== 'free',
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data, error } = await supabase
          .from('users')
          .select(`
            id, 
            email, 
            first_name, 
            last_name, 
            role, 
            is_verified, 
            created_at, 
            subscription, 
            preferred_language,
            user_preferences(*)
          `)
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        const userPreferences: UserPreferences = {
          theme: data.user_preferences?.length ? data.user_preferences[0]?.theme || 'system' : 'system',
          language: data.user_preferences?.length ? data.user_preferences[0]?.language || 'en' : 'en',
          notifications: data.user_preferences?.length ? data.user_preferences[0]?.notifications_enabled || true : true,
          emailNotifications: data.user_preferences?.length ? data.user_preferences[0]?.email_notifications || true : true,
          difficulty: data.user_preferences?.length ? data.user_preferences[0]?.difficulty || 'beginner' : 'beginner',
          onboardingCompleted: data.user_preferences?.length ? Boolean(data.user_preferences[0]?.onboardingCompleted) : false,
        };

        setUser({
          id: data.id,
          email: data.email,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          role: data.role || 'user',
          isVerified: data.is_verified || false,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(),
          subscription: data.subscription || 'free',
          preferredLanguage: data.preferred_language || 'english',
          preferences: userPreferences,
          dailyQuestionCounts: {
            flashcards: 0,
            multipleChoice: 0,
            speaking: 0,
            writing: 0,
            listening: 0,
          },
          // Add properties for compatibility with User interface
          isPremiumUser: data.subscription !== 'free',
          isPremium: data.subscription !== 'free',
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'An error occurred during Google login');
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.message || "Could not log in with Google",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: userError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            role: 'user',
            is_verified: false,
            created_at: new Date().toISOString(),
            subscription: 'free',
            preferred_language: 'english',
          },
        ]);

        if (userError) throw userError;

        const { error: prefsError } = await supabase.from('user_preferences').insert([
          {
            user_id: authData.user.id,
            theme: 'system',
            email_notifications: true,
            language: 'en',
            difficulty: 'beginner',
            notifications_enabled: true,
            animations_enabled: true,
            auto_play_audio: true,
            show_progress_metrics: true,
            ai_enabled: true,
            ai_model_size: 'medium',
            confidence_score_visible: true,
          },
        ]);

        if (prefsError) throw prefsError;

        toast({
          title: "Account created",
          description: "Please verify your email to complete registration",
        });
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not create your account",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Alias for signup to maintain compatibility
  const signup = signUp;

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      setError(error.message || 'An error occurred during logout');
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message || "Could not sign you out",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<User | null> => {
    try {
      if (!user) return null;
      
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          preferred_language: updates.preferredLanguage,
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      if (updates.preferences) {
        const { error: prefError } = await supabase
          .from('user_preferences')
          .update({
            theme: updates.preferences.theme,
            email_notifications: updates.preferences.emailNotifications,
            language: updates.preferences.language,
            difficulty: updates.preferences.difficulty,
            notifications_enabled: updates.preferences.notifications,
            onboarding_completed: updates.preferences.onboardingCompleted,
          })
          .eq('user_id', user.id);
          
        if (prefError) throw prefError;
      }
      
      // Update local user state
      const updatedUser = {
        ...user,
        ...updates,
      };
      
      setUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update your profile",
      });
      return null;
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      // Mock implementation - would connect to Supabase or backend
      console.log('Verifying email with token:', token);
      return true;
    } catch (error: any) {
      setError(error.message || 'An error occurred during email verification');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      // Mock implementation - would connect to Supabase or backend
      console.log('Resending verification email to:', email);
      return true;
    } catch (error: any) {
      setError(error.message || 'An error occurred when resending verification email');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return true;
    } catch (error: any) {
      setError(error.message || 'An error occurred when resetting password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    return resetPassword(newPassword);
  };

  const socialLogin = async (provider: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/app/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message || `An error occurred during ${provider} login`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Admin functions
  const getAllUsers = async (): Promise<User[]> => {
    if (user?.role !== 'admin') {
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data.map((u: any) => ({
        id: u.id,
        email: u.email,
        firstName: u.first_name,
        lastName: u.last_name,
        role: u.role,
        createdAt: new Date(u.created_at),
        updatedAt: new Date(),
        subscription: u.subscription,
        isVerified: u.is_verified,
        preferredLanguage: u.preferred_language,
        preferences: DEFAULT_USER_PREFERENCES,
        dailyQuestionCounts: {
          flashcards: 0,
          multipleChoice: 0,
          speaking: 0,
          writing: 0,
          listening: 0,
        }
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const createUser = async (userData: Partial<User>): Promise<User | null> => {
    if (user?.role !== 'admin') return null;
    
    try {
      // This is simplified - real implementation would create auth user and DB user
      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
    if (user?.role !== 'admin') return null;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          role: updates.role,
          is_verified: updates.isVerified,
          subscription: updates.subscription,
          preferred_language: updates.preferredLanguage,
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Fetch updated user
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(),
        subscription: data.subscription,
        isVerified: data.is_verified,
        preferredLanguage: data.preferred_language,
        preferences: DEFAULT_USER_PREFERENCES,
        dailyQuestionCounts: {
          flashcards: 0,
          multipleChoice: 0,
          speaking: 0,
          writing: 0,
          listening: 0,
        }
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    if (user?.role !== 'admin') return false;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  const addSystemLog = async (eventType: string, details: any): Promise<void> => {
    if (user?.role !== 'admin') return;
    
    try {
      const { error } = await supabase
        .from('security_audit_log')
        .insert([
          {
            user_id: user.id,
            event_type: eventType,
            event_details: details,
          }
        ]);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error adding system log:', error);
    }
  };

  const getSystemLogs = async (): Promise<any[]> => {
    if (user?.role !== 'admin') return [];
    
    try {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('occurred_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting system logs:', error);
      return [];
    }
  };

  const updateSystemLog = async (id: string, updates: any): Promise<any> => {
    if (user?.role !== 'admin') return null;
    
    try {
      const { error } = await supabase
        .from('security_audit_log')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      const { data, error: fetchError } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      return data;
    } catch (error) {
      console.error('Error updating system log:', error);
      return null;
    }
  };

  const getEmailSettings = async (): Promise<any> => {
    if (user?.role !== 'admin') return null;
    
    // This would normally fetch from a settings table or service
    return {
      templates: [
        { id: '1', name: 'welcome', subject: 'Welcome to the app', body: 'Welcome to our language learning app!' },
        { id: '2', name: 'reset_password', subject: 'Reset Your Password', body: 'Click the link to reset your password...' },
        { id: '3', name: 'verification', subject: 'Verify Your Email', body: 'Please verify your email address...' }
      ],
      settings: {
        sendFromEmail: 'noreply@learniverse.com',
        sendFromName: 'Learniverse',
        smtpSettings: {
          host: 'smtp.example.com',
          port: 587,
          secure: true
        }
      }
    };
  };

  const updateEmailSettings = async (settings: any): Promise<boolean> => {
    if (user?.role !== 'admin') return false;
    
    // This would normally update a settings table or service
    console.log('Updating email settings:', settings);
    return true;
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    logout,
    signUp,
    loading,
    error,
    isAuthenticated: !!user,
    updateProfile,
    // Alias and additional methods
    signup,
    verifyEmail,
    resendVerificationEmail,
    resetPassword,
    updatePassword,
    socialLogin,
    isLoading: loading,
    getAllUsers,
    createUser,
    updateUser, 
    deleteUser,
    addSystemLog,
    getSystemLogs,
    updateSystemLog,
    getEmailSettings,
    updateEmailSettings
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
