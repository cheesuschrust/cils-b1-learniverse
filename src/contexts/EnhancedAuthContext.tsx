
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/core-types';

interface AuthContextType {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: session.user.user_metadata?.first_name || '',
            lastName: session.user.user_metadata?.last_name || '',
            role: session.user.user_metadata?.role || 'user',
            createdAt: new Date(session.user.created_at),
            updatedAt: new Date(),
            subscription: session.user.user_metadata?.subscription || 'free',
            status: 'active',
            preferences: {
              theme: 'system',
              notifications: true,
              emailNotifications: true,
              language: 'english',
              difficulty: 'adaptive',
              onboardingCompleted: false
            },
            isPremiumUser: session.user.user_metadata?.subscription === 'premium'
          });
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          firstName: session.user.user_metadata?.first_name || '',
          lastName: session.user.user_metadata?.last_name || '',
          role: session.user.user_metadata?.role || 'user',
          createdAt: new Date(session.user.created_at),
          updatedAt: new Date(),
          subscription: session.user.user_metadata?.subscription || 'free',
          status: 'active',
          preferences: {
            theme: 'system',
            notifications: true,
            emailNotifications: true,
            language: 'english',
            difficulty: 'adaptive',
            onboardingCompleted: false
          },
          isPremiumUser: session.user.user_metadata?.subscription === 'premium'
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back to CILS Italian Citizenship Test Prep!",
      });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message);
      
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error.message);
      
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            subscription: 'free',
            role: 'user'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: "Welcome to CILS Italian Citizenship Test Prep!",
      });
      
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message);
      
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Already handled by onAuthStateChange
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message);
      
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('You must be logged in to update your profile');
      }
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          // Include other fields as needed
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUser(current => current ? { ...current, ...userData } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Update password error:', error);
      
      toast({
        title: "Password update failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isAuthenticated: !!user,
      error,
      login,
      loginWithGoogle,
      signup,
      logout,
      updateProfile,
      resetPassword,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
