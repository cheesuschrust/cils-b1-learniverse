
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import type { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  signUp: async () => ({ error: null }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          const userData = data.session.user;
          
          // Shape user data to match our User type
          setUser({
            id: userData.id,
            email: userData.email || '',
            firstName: '',
            lastName: '',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
            preferences: {
              theme: 'system',
              language: 'english',
              notifications: true,
              onboardingCompleted: false,
              difficulty: 'beginner'
            },
            dailyQuestionCounts: {
              flashcards: 0,
              multipleChoice: 0,
              speaking: 0,
              writing: 0,
              listening: 0
            }
          });
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: '',
            lastName: '',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
            preferences: {
              theme: 'system',
              language: 'english',
              notifications: true,
              onboardingCompleted: false,
              difficulty: 'beginner'
            },
            dailyQuestionCounts: {
              flashcards: 0,
              multipleChoice: 0,
              speaking: 0,
              writing: 0,
              listening: 0
            }
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
