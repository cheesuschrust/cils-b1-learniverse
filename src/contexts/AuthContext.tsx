
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would call an API
      // For now, we'll simulate a successful login with mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const mockUser: User = {
        id: 'user-123',
        email,
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: 'free',
        status: 'active',
        isPremiumUser: false,
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
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: 'Login successful',
        description: 'Welcome back to CILS B1 Cittadinanza Question of the Day!',
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please check your credentials and try again.');
      
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would call an API
      // For now, we'll simulate a successful signup with mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: 'free',
        status: 'active',
        isPremiumUser: false,
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
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: 'Account created',
        description: 'Welcome to CILS B1 Cittadinanza Question of the Day!',
      });
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to sign up. Please try again later.');
      
      toast({
        title: 'Registration failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Clear user from state and localStorage
      setUser(null);
      localStorage.removeItem('user');
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to log out. Please try again.');
      
      toast({
        title: 'Logout failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('No user is logged in');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = { ...user, ...userData, updatedAt: new Date() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      
      toast({
        title: 'Profile update failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  // Update password function
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully changed.',
      });
      
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      
      toast({
        title: 'Password update failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for instructions to reset your password.',
      });
      
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      
      toast({
        title: 'Password reset failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  // Verify email function
  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Email verified',
        description: 'Your email has been successfully verified.',
      });
      
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      
      toast({
        title: 'Email verification failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  // Resend verification email function
  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link.',
      });
      
      return true;
    } catch (error) {
      console.error('Resend verification email error:', error);
      
      toast({
        title: 'Failed to send verification email',
        description: 'Please try again later.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  // Login with Google function
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const mockUser: User = {
        id: 'google-user-' + Math.random().toString(36).substr(2, 9),
        email: 'google-user@example.com',
        firstName: 'Google',
        lastName: 'User',
        displayName: 'Google User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: 'free',
        status: 'active',
        isPremiumUser: false,
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
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: 'Login successful',
        description: 'Welcome to CILS B1 Cittadinanza Question of the Day!',
      });
      
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      
      toast({
        title: 'Google login failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
      
      return false;
    }
  };

  // Create the context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    loginWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
