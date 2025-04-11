
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getCurrentUser, getUserSession } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, displayName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  loginWithGoogle: async () => {},
  error: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Setup auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          const userData: User = {
            id: newSession.user.id,
            email: newSession.user.email || '',
            firstName: newSession.user.user_metadata?.first_name,
            lastName: newSession.user.user_metadata?.last_name,
            displayName: newSession.user.user_metadata?.display_name,
            photoURL: newSession.user.user_metadata?.avatar_url,
            isPremium: newSession.user.user_metadata?.is_premium,
            subscription: newSession.user.user_metadata?.subscription_tier || 'free',
            isAdmin: newSession.user.user_metadata?.role === 'admin',
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data } = await getUserSession();
        setSession(data.session);
        if (data.session?.user) {
          const userData: User = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            firstName: data.session.user.user_metadata?.first_name,
            lastName: data.session.user.user_metadata?.last_name,
            displayName: data.session.user.user_metadata?.display_name,
            photoURL: data.session.user.user_metadata?.avatar_url,
            isPremium: data.session.user.user_metadata?.is_premium,
            subscription: data.session.user.user_metadata?.subscription_tier || 'free',
            isAdmin: data.session.user.user_metadata?.role === 'admin',
          };
          setUser(userData);
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        return false;
      }
      
      return !!data.session;
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });
      
      if (error) {
        setError(error.message);
        return false;
      }
      
      return !!data.user;
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
      console.error('Signup error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await supabase.auth.signOut();
    } catch (err: any) {
      setError(err.message || 'Logout failed. Please try again.');
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
      console.error('Google login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = !!(user?.isAdmin);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      isAdmin,
      isLoading,
      login,
      signup,
      logout,
      loginWithGoogle,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
