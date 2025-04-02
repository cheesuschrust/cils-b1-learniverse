
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, fetchUserProfile, isPremiumUser } from '@/lib/supabase-client';
import { useToast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_premium: boolean;
  premium_until: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<UserProfile>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await fetchUserProfile(userId);
      setProfile(profileData);
      
      // Check premium status
      const premium = await isPremiumUser(userId);
      setIsPremium(premium);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        setSession(newSession);
        
        if (newSession?.user) {
          setUser(newSession.user);
          // Use setTimeout to avoid potential recursive locks with Supabase client
          setTimeout(() => {
            fetchProfile(newSession.user.id);
            // Update last login time
            if (event === 'SIGNED_IN') {
              supabase
                .from('user_profiles')
                .update({ last_login_at: new Date().toISOString() })
                .eq('id', newSession.user.id)
                .then(({ error }) => {
                  if (error) console.error('Error updating last login:', error);
                });
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
          setIsPremium(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      
      if (existingSession?.user) {
        setUser(existingSession.user);
        fetchProfile(existingSession.user.id).finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
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
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
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
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
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
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Email verification error:', error);
      setError(error.message);
      
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification email.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      setError(error.message);
      
      toast({
        title: "Failed to send verification email",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
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

  const updateProfile = async (userData: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('You must be logged in to update your profile');
      }
      
      // Update user metadata in auth.users
      if (userData.first_name !== undefined || userData.last_name !== undefined) {
        const { error: authError } = await supabase.auth.updateUser({
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
          }
        });
        
        if (authError) throw authError;
      }
      
      // Update profile in user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(userData)
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Refresh profile data
      await fetchProfile(user.id);
      
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
        redirectTo: `${window.location.origin}/auth/reset-password`,
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
      profile,
      session,
      isLoading,
      isAuthenticated: !!user,
      isPremium,
      error,
      login,
      loginWithGoogle,
      signup,
      logout,
      updateProfile,
      resetPassword,
      updatePassword,
      verifyEmail,
      resendVerificationEmail,
      refreshProfile
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
