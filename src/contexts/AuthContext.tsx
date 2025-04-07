
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Types
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{success: boolean; error?: string}>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        // Simulate checking if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, you would call your API
      if (email === 'demo@example.com' && password === 'password123') {
        const userData: User = {
          id: '1',
          email: email,
          firstName: 'Demo',
          lastName: 'User',
          isVerified: true,
          role: 'user'
        };
        
        // Save to local storage
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Login successful",
          description: "Welcome to CILS B1 Cittadinanza!",
        });
        
        navigate('/dashboard');
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Google login
  const loginWithGoogle = async (): Promise<void> => {
    // This is a mock implementation
    setIsLoading(true);
    try {
      // Simulate Google login
      toast({
        title: "Google login",
        description: "This would redirect to Google in a real implementation",
      });
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string
  ): Promise<{success: boolean; error?: string}> => {
    setIsLoading(true);
    try {
      // This is a mock implementation
      if (email === 'taken@example.com') {
        return { success: false, error: 'Email already in use' };
      }
      
      const userData: User = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        isVerified: false,
        role: 'user'
      };
      
      // In a real app, you would call your API here
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Registration successful",
        description: "Welcome to CILS B1 Cittadinanza!",
      });
      
      navigate('/dashboard');
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Reset password
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This is a mock implementation
      toast({
        title: "Password reset email sent",
        description: `If an account exists for ${email}, we've sent instructions to reset your password`,
      });
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
