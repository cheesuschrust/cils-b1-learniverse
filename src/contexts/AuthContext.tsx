
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

// Define User type
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin' | 'editor';
  subscription: 'free' | 'premium';
  last_login?: Date;
  created_at: Date;
  preferred_language?: string;
  dailyQuestionCounts: {
    flashcards: number;
    multipleChoice: number;
    listening: number;
    writing: number;
    speaking: number;
  };
}

// Define Auth Context shape
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  register: async () => ({ success: false }),
  signInWithOAuth: async () => ({ success: false }),
  refreshUser: async () => {},
});

// Auth Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to transform database user data to our User type
  const transformUserData = async (userData: any): Promise<User | null> => {
    if (!userData) return null;
    
    try {
      // Get daily question usage for today
      const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
      
      const { data: usageData, error: usageError } = await supabase
        .from('usage_tracking')
        .select('question_type, count')
        .eq('user_id', userData.id)
        .eq('date', today);
        
      if (usageError && usageError.code !== 'PGSQL_EMPTY_RESULT') {
        console.error('Error fetching usage data:', usageError);
      }
      
      // Transform usage data into daily question counts
      const dailyCounts = {
        flashcards: 0,
        multipleChoice: 0,
        listening: 0,
        writing: 0,
        speaking: 0
      };
      
      if (usageData) {
        usageData.forEach(item => {
          const type = item.question_type as keyof typeof dailyCounts;
          if (type in dailyCounts) {
            dailyCounts[type] = item.count;
          }
        });
      }
      
      // Return transformed user data
      return {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        role: userData.role || 'user',
        subscription: userData.subscription || 'free',
        last_login: userData.last_login ? new Date(userData.last_login) : undefined,
        created_at: new Date(userData.created_at),
        preferred_language: userData.preferred_language,
        dailyQuestionCounts: dailyCounts
      };
    } catch (error) {
      console.error('Error transforming user data:', error);
      return null;
    }
  };

  // Load user on initial render
  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            throw profileError;
          }
          
          // Transform and set user data
          const transformedUser = await transformUserData(profileData);
          setUser(transformedUser);
          
          // Update last login time
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', session.user.id);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error loading profile on sign in:', profileError);
            setUser(null);
            return;
          }
          
          // Transform and set user data
          const transformedUser = await transformUserData(profileData);
          setUser(transformedUser);
          
          // Update last login time
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        throw profileError;
      }
      
      // Transform and set user data
      const transformedUser = await transformUserData(profileData);
      setUser(transformedUser);
      
      // Update last login time
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to login. Please check your credentials and try again.' 
      };
    }
  };
  
  // Function to refresh user data
  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      const transformedUser = await transformUserData(data);
      setUser(transformedUser);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      toast({
        title: "Error",
        description: "Failed to refresh user data. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Register function
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error('Registration failed: No user returned');
      }
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: email.toLowerCase(),
          first_name: firstName,
          last_name: lastName,
          role: 'user',
          is_verified: false,
          subscription: 'free',
          created_at: new Date().toISOString(),
          status: 'active'
        });
        
      if (profileError) {
        // Clean up the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(data.user.id);
        throw profileError;
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  // OAuth signin function
  const signInWithOAuth = async (provider: 'google' | 'apple') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error);
      return { 
        success: false, 
        error: error.message || `Failed to sign in with ${provider}. Please try again.` 
      };
    }
  };

  // Provide the auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        signInWithOAuth,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
