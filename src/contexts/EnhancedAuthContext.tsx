
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { 
  supabase, 
  signInWithEmail, 
  signUp, 
  signOut, 
  getCurrentUser
} from '@/integrations/supabase/client';
import { UnifiedUser } from '@/types/unified-user';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string;
  loading?: boolean;
  isPremium?: boolean;
  displayName?: string;
  updateProfile?: (data: any) => Promise<boolean>;
  updatePassword?: (password: string) => Promise<boolean>;
  resetPassword?: (email: string) => Promise<boolean>;
  verifyEmail?: (token: string) => Promise<boolean>;
  resendVerificationEmail?: (email: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register?: (email: string, password: string) => Promise<boolean>;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userRole: 'user',
  login: async () => false,
  loginWithGoogle: async () => {},
  signup: async () => false,
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

// Export the useAuth hook directly
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const EnhancedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('user');
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState<string>('');
  const [isPremium, setIsPremium] = useState<boolean>(false);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Set display name and premium status when user is available
        if (session?.user) {
          setDisplayName(session.user.email || 'User');
          setIsPremium(false); // Default value, will be updated from database
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const userData = await supabase.auth.getUser();
          setUser(userData.data.user);
          setDisplayName(userData.data.user?.email || 'User');
        } else {
          setUser(null);
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
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      // Set user data
      setUser(data.user);
      setDisplayName(data.user?.email || 'User');
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

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await signUp(email, password);
      
      if (error) {
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      // Set user data
      if (data.user) {
        setUser(data.user);
        setDisplayName(data.user.email || 'User');
        
        toast({
          title: 'Welcome!',
          description: 'Account created successfully.',
        });
        return true;
      }
      
      // If email confirmation is required
      toast({
        title: 'Verify your email',
        description: 'Please check your email for a verification link.',
      });
      return false;
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
      await signOut();
      setUser(null);
      setDisplayName('');
      setIsPremium(false);
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
        throw error;
      }
    } catch (error: any) {
      toast({
        title: 'Google login failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  // Stub methods for other auth operations
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        toast({
          title: 'Password reset failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for the password reset link',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Password reset failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast({
          title: 'Password update failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Password update failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateProfile = async (data: Partial<UnifiedUser>): Promise<boolean> => {
    try {
      // Basic data that can be updated through auth API
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          avatar: data.photoURL || data.avatar
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
      
      // Also update profile in database if we have more fields
      // Code would be added here to update user_profiles table
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
      
      // Update local state
      if (data.displayName) {
        setDisplayName(data.displayName);
      }
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Profile update failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    // In a real implementation, this would verify the email token
    return Promise.resolve(true);
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    // In a real implementation, this would resend the verification email
    return Promise.resolve(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        userRole,
        loading: isLoading,
        login,
        loginWithGoogle,
        signup,
        logout,
        resetPassword,
        updatePassword,
        updateProfile,
        verifyEmail,
        resendVerificationEmail,
        displayName,
        isPremium
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
