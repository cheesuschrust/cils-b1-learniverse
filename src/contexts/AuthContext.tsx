
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
            }
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
          }
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
