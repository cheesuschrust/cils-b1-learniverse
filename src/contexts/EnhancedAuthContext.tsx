
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  loginWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
        return { success: false, error: error.message };
      }
      
      toast({
        title: 'Login successful',
        description: 'Welcome back to CILS B1 Prep!',
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setIsLoading(true);
      
      // Include first/last name in the metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (error) {
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
        return { success: false, error: error.message };
      }
      
      toast({
        title: 'Account created',
        description: 'Check your email for the confirmation link',
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Signup error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error: any) {
      toast({
        title: 'Logout error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast({
          title: 'Google login failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Google login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
