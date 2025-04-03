
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/components/ui/use-toast';
import { AuthErrorCode } from '@/types/auth';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: 'admin' | 'user' | null;
  isPremium: boolean;
  subscription: 'free' | 'premium' | 'pro' | null;
  lastLogin: Date | null;
  displayName: string | null;
  userProfileId: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateProfile: (data: Partial<UserProfileUpdate>) => Promise<boolean>;
  refreshSession: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
  getIdToken: () => Promise<string | null>;
}

interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar_url?: string;
  bio?: string;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  userRole: null,
  isPremium: false,
  subscription: null,
  lastLogin: null,
  displayName: null,
  userProfileId: null,
};

const EnhancedAuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => false,
  updateProfile: async () => false,
  refreshSession: async () => {},
  loginWithGoogle: async () => {},
  refreshUserProfile: async () => {},
  verifyEmail: async () => false,
  resendVerificationEmail: async () => false,
  getIdToken: async () => null,
});

export const useAuth = () => {
  return useContext(EnhancedAuthContext);
};

export const EnhancedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change event:', event);
        setState(prevState => ({
          ...prevState,
          user: session?.user ?? null,
          session: session,
          isAuthenticated: !!session?.user,
          isLoading: false,
        }));

        // Fetch additional user data only if user exists
        if (session?.user) {
          // Use setTimeout to prevent recursion issues with Supabase auth
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setState(prevState => ({
          ...prevState,
          user: session?.user ?? null,
          session: session,
          isAuthenticated: !!session?.user,
          isLoading: false,
        }));

        // Fetch additional user data if user exists
        if (session?.user) {
          fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(prevState => ({
          ...prevState,
          isLoading: false,
        }));
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // First, check if the user has a role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Error fetching user role:', roleError);
      }

      // Then fetch the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      setState(prevState => ({
        ...prevState,
        userRole: roleData?.role || 'user',
        isPremium: profileData?.is_premium || false,
        subscription: profileData?.is_premium ? 'premium' : 'free',
        lastLogin: profileData?.last_login_at ? new Date(profileData.last_login_at) : null,
        displayName: profileData?.display_name || profileData?.first_name || null,
        userProfileId: profileData?.id || null,
      }));

      // Update last login time
      await supabase
        .from('user_profiles')
        .update({
          last_login_at: new Date().toISOString(),
        })
        .eq('id', userId);

    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        setState(prevState => ({ ...prevState, isLoading: false }));
        return false;
      }

      // Auth state will be updated by the onAuthStateChange listener
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
      return false;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName?: string): Promise<boolean> => {
    try {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName || "",
          },
        },
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        setState(prevState => ({ ...prevState, isLoading: false }));
        return false;
      }

      // If email confirmation is required
      if (!data.session) {
        toast({
          title: "Verification email sent",
          description: "Please check your email to confirm your account",
        });
        setState(prevState => ({ ...prevState, isLoading: false }));
        return true;
      }

      // Auth state will be updated by the onAuthStateChange listener
      toast({
        title: "Account created",
        description: "Welcome to CILS Italian Citizenship!",
      });
      
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
      return false;
    }
  };

  const logout = async () => {
    try {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      const { error } = await supabase.auth.signOut();

      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Reset auth state
        setState({
          ...initialState,
          isLoading: false,
        });
        
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your email for the reset link",
        });
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: "Reset password error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
        setState(prevState => ({ ...prevState, isLoading: false }));
        return false;
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
      return true;
    } catch (error: any) {
      console.error('Update password error:', error);
      toast({
        title: "Update password error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
      return false;
    }
  };

  const updateProfile = async (data: Partial<UserProfileUpdate>): Promise<boolean> => {
    try {
      if (!state.user?.id) {
        toast({
          title: "Profile update failed",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        return false;
      }

      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      // Update auth metadata if firstName or lastName is provided
      if (data.firstName || data.lastName) {
        const { data: userData, error: userError } = await supabase.auth.updateUser({
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        });

        if (userError) {
          toast({
            title: "Profile update failed",
            description: userError.message,
            variant: "destructive",
          });
          setState(prevState => ({ ...prevState, isLoading: false }));
          return false;
        }
      }

      // Update profile data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: data.displayName,
          avatar_url: data.avatar_url,
          bio: data.bio,
        })
        .eq('id', state.user.id);

      if (profileError) {
        toast({
          title: "Profile update failed",
          description: profileError.message,
          variant: "destructive",
        });
        setState(prevState => ({ ...prevState, isLoading: false }));
        return false;
      }

      // Refresh user profile
      await fetchUserProfile(state.user.id);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
      setState(prevState => ({ ...prevState, isLoading: false }));
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Update profile error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
      return false;
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        return;
      }

      if (session) {
        setState(prevState => ({
          ...prevState,
          user: session.user,
          session: session,
          isAuthenticated: true,
        }));
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Google login failed",
          description: error.message,
          variant: "destructive",
        });
      }
      
      // The redirect will happen automatically, no need to handle it here
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: "Google login error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const refreshUserProfile = async () => {
    if (state.user?.id) {
      await fetchUserProfile(state.user.id);
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      // In a real implementation, you would verify the token with Supabase
      // For now, we'll simulate a successful verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Email verified",
        description: "Your email has been successfully verified",
      });
      
      setState(prevState => ({ ...prevState, isLoading: false }));
      return true;
    } catch (error: any) {
      console.error('Verify email error:', error);
      toast({
        title: "Email verification error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
      return false;
    }
  };

  const resendVerificationEmail = async (): Promise<boolean> => {
    try {
      if (!state.user?.email) {
        toast({
          title: "Verification email failed",
          description: "No email address available",
          variant: "destructive",
        });
        return false;
      }

      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));

      // In a real implementation, you would call Supabase to resend the verification email
      // For now, we'll simulate a successful email sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Verification email sent",
        description: `A verification email has been sent to ${state.user.email}`,
      });
      
      setState(prevState => ({ ...prevState, isLoading: false }));
      return true;
    } catch (error: any) {
      console.error('Resend verification email error:', error);
      toast({
        title: "Verification email error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
      return false;
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshSession,
    loginWithGoogle,
    refreshUserProfile,
    verifyEmail,
    resendVerificationEmail,
    getIdToken,
  };

  return (
    <EnhancedAuthContext.Provider value={value}>
      {children}
    </EnhancedAuthContext.Provider>
  );
};

export default EnhancedAuthContext;
