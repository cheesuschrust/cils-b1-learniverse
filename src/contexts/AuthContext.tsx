
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase-client';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isPremiumUser?: boolean;
}

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isPremium: false,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  resetPassword: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Initialize auth from Supabase
    const initAuth = async () => {
      setLoading(true);
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // User is logged in
          const { id, email, user_metadata } = session.user;
          
          const user: User = {
            id,
            email: email || '',
            firstName: user_metadata?.first_name,
            lastName: user_metadata?.last_name,
            isPremiumUser: user_metadata?.is_premium_user
          };
          
          setUser(user);
          setIsPremium(!!user.isPremiumUser);
          
          // Check if admin (would normally be in a claim or role system)
          setIsAdmin(user_metadata?.is_admin || false);
          
          // Fetch user profile for additional details
          try {
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', id)
              .single();
              
            if (profileData) {
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          // No active session
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
          setIsPremium(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const { id, email, user_metadata } = session.user;
          
          const user: User = {
            id,
            email: email || '',
            firstName: user_metadata?.first_name,
            lastName: user_metadata?.last_name,
            isPremiumUser: user_metadata?.is_premium_user
          };
          
          setUser(user);
          setIsPremium(!!user.isPremiumUser);
          setIsAdmin(user_metadata?.is_admin || false);
        } else {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
          setIsPremium(false);
        }
        
        setLoading(false);
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };
  
  const signup = async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ) => {
    try {
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
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      };
    }
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      };
    }
  };
  
  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isPremium,
    login,
    signup,
    logout,
    resetPassword,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
