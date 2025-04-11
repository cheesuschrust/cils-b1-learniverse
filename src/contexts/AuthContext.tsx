
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { normalizeToastVariant } from '@/adapters/ToastAdapter';

// Define User type
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false, error: 'Not implemented' }),
  signup: async () => ({ success: false, error: 'Not implemented' }),
  logout: async () => { /* No-op */ },
});

// Mock authentication for demo purposes
// In a real app, this would connect to a backend API
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Define login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock login - in a real app this would call an API
      if (email && password) {
        // Simple validation for demo
        const isAdmin = email.includes('admin');
        
        const user: User = {
          id: '123456',
          email,
          firstName: 'Test',
          lastName: 'User',
          isAdmin
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
          variant: 'success'
        });
        
        return { success: true };
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: normalizeToastVariant('destructive')
        });
        
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: normalizeToastVariant('destructive')
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Define signup function
  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    
    try {
      // Mock signup - in a real app this would call an API
      if (email && password) {
        const user: User = {
          id: '123456',
          email,
          firstName: firstName || 'New',
          lastName: lastName || 'User',
          isAdmin: false
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        toast({
          title: 'Registration successful',
          description: 'Your account has been created!',
          variant: 'success'
        });
        
        return { success: true };
      } else {
        toast({
          title: 'Registration failed',
          description: 'Please provide a valid email and password',
          variant: normalizeToastVariant('destructive')
        });
        
        return { success: false, error: 'Invalid input' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: normalizeToastVariant('destructive')
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Define logout function
  const logout = async () => {
    try {
      // Clear user data
      localStorage.removeItem('user');
      setUser(null);
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
        variant: 'default'
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout error',
        description: 'An error occurred during logout',
        variant: normalizeToastVariant('destructive')
      });
    }
  };

  // Create value object
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  };

  // Provide context to children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
