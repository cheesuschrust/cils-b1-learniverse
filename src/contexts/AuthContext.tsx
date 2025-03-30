
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase-client';
import { fetchUserProfile } from '@/lib/supabase-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  isAdmin: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    async function initAuth() {
      setLoading(true);
      try {
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session?.user) {
          const userData = await fetchUserProfile(sessionData.session.user.id);
          
          if (userData) {
            const userWithPreferences: User = {
              id: userData.id,
              email: userData.email,
              firstName: userData.first_name || '',
              lastName: userData.last_name || '',
              role: userData.role as any,
              isVerified: userData.is_verified,
              createdAt: new Date(userData.created_at),
              updatedAt: new Date(),
              preferences: {
                theme: userData.user_preferences?.theme || 'system',
                language: userData.user_preferences?.language || 'italian',
                notifications: userData.user_preferences?.notifications_enabled || true,
                emailNotifications: userData.user_preferences?.email_notifications || true,
                difficulty: userData.user_preferences?.difficulty as any || 'intermediate',
                onboardingCompleted: true,
              },
              status: userData.status as any || 'active',
              subscription: userData.subscription as any || 'free',
              preferredLanguage: userData.preferred_language,
              dailyQuestionCounts: {
                flashcards: 0,
                multipleChoice: 0,
                speaking: 0,
                writing: 0,
                listening: 0,
              }
            };
            
            setUser(userWithPreferences);
            setIsAdmin(userData.role === 'admin');
            setIsPremium(userData.subscription === 'premium' || userData.subscription === 'enterprise');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err : new Error('Authentication error'));
      } finally {
        setLoading(false);
      }
    }
    
    initAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const userData = await fetchUserProfile(session.user.id);
          
          if (userData) {
            const userWithPreferences: User = {
              id: userData.id,
              email: userData.email,
              firstName: userData.first_name || '',
              lastName: userData.last_name || '',
              role: userData.role as any,
              isVerified: userData.is_verified,
              createdAt: new Date(userData.created_at),
              updatedAt: new Date(),
              preferences: {
                theme: userData.user_preferences?.theme || 'system',
                language: userData.user_preferences?.language || 'italian',
                notifications: userData.user_preferences?.notifications_enabled || true,
                emailNotifications: userData.user_preferences?.email_notifications || true,
                difficulty: userData.user_preferences?.difficulty as any || 'intermediate',
                onboardingCompleted: true,
              },
              status: userData.status as any || 'active',
              subscription: userData.subscription as any || 'free',
              preferredLanguage: userData.preferred_language,
              dailyQuestionCounts: {
                flashcards: 0,
                multipleChoice: 0,
                speaking: 0,
                writing: 0,
                listening: 0,
              }
            };
            
            setUser(userWithPreferences);
            setIsAdmin(userData.role === 'admin');
            setIsPremium(userData.subscription === 'premium' || userData.subscription === 'enterprise');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setIsPremium(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Authentication functions
  async function login(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    }
  }
  
  async function loginWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Google login failed'));
      throw err;
    }
  }
  
  async function loginWithFacebook() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Facebook login failed'));
      throw err;
    }
  }

  async function signup(email: string, password: string, firstName: string, lastName: string) {
    try {
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create user profile record
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            role: 'user',
            is_verified: false,
            status: 'active',
            subscription: 'free',
            preferred_language: 'italian'
          });
          
        if (profileError) throw profileError;
        
        // Create user preferences
        const { error: prefsError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: data.user.id,
            theme: 'system',
            language: 'italian',
            difficulty: 'beginner',
            notifications_enabled: true,
            email_notifications: true
          });
          
        if (prefsError) throw prefsError;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Signup failed'));
      throw err;
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAdmin(false);
      setIsPremium(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'));
      throw err;
    }
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Password reset failed'));
      throw err;
    }
  }

  async function updateUser(data: Partial<User>) {
    if (!user) return;
    
    try {
      // Update user metadata if needed
      if (data.firstName || data.lastName || data.email) {
        const { error } = await supabase.auth.updateUser({
          email: data.email,
          data: {
            first_name: data.firstName,
            last_name: data.lastName
          }
        });
        
        if (error) throw error;
      }
      
      // Update profile data
      if (user.id) {
        const updates = {
          first_name: data.firstName !== undefined ? data.firstName : user.firstName,
          last_name: data.lastName !== undefined ? data.lastName : user.lastName,
          preferred_language: data.preferredLanguage || user.preferredLanguage
        };
        
        const { error } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      // Update preferences if needed
      if (data.preferences && user.id) {
        const prefUpdates = {
          theme: data.preferences.theme || user.preferences.theme,
          language: data.preferences.language || user.preferences.language,
          notifications_enabled: data.preferences.notifications !== undefined ? 
            data.preferences.notifications : user.preferences.notifications,
          email_notifications: data.preferences.emailNotifications !== undefined ? 
            data.preferences.emailNotifications : user.preferences.emailNotifications,
          difficulty: data.preferences.difficulty || user.preferences.difficulty
        };
        
        const { error } = await supabase
          .from('user_preferences')
          .update(prefUpdates)
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user'));
      throw err;
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    loginWithFacebook,
    signup,
    logout,
    resetPassword,
    updateUser,
    isAdmin,
    isPremium
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
