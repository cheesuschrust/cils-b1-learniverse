
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/adapters/ToastAdapter';
import { supabase } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
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
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'error',
        });
        return { success: false, error: error.message };
      }
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'error',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'error',
        });
        return { success: false, error: error.message };
      }
      
      toast({
        title: 'Welcome!',
        description: 'Account created successfully.',
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Signup error',
        description: error.message || 'An unexpected error occurred',
        variant: 'error',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error: any) {
      toast({
        title: 'Logout error',
        description: error.message || 'An unexpected error occurred',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
