
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  signup: async () => false,
  loginWithGoogle: async () => {},
  updateProfile: async () => false,
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
      (event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          const userData: User = {
            id: newSession.user.id,
            email: newSession.user.email ?? '',
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
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        if (data.session?.user) {
          const userData: User = {
            id: data.session.user.id,
            email: data.session.user.email ?? '',
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

  const login = async (email: string, password: string): Promise<boolean> => {
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
        return false;
      }
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      if (error) {
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      toast({
        title: 'Welcome!',
        description: 'Account created successfully.',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Signup error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
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
          redirectTo: `${window.location.origin}/auth/callback`
        }
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

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: data.displayName,
        }
      });
      
      if (error) {
        toast({
          title: 'Profile update failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Profile update error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
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
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
