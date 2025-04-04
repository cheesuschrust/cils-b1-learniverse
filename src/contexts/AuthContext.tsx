
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  session: Session | null;
  isAuthenticated: boolean;
  profile: any | null;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  signup: (email: string, password: string, userData?: any) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerificationEmail: (email: string) => Promise<any>;
  getAllUsers: () => Promise<any[]>;
  createUser: (userData: any) => Promise<any>;
  updateUser: (userId: string, userData: any) => Promise<any>;
  deleteUser: (userId: string) => Promise<any>;
  getSystemLogs: () => Promise<any[]>;
  updateSystemLog: (logId: string, data: any) => Promise<any>;
  addSystemLog: (data: any) => Promise<any>;
  getEmailSettings: () => Promise<any>;
  updateEmailSettings: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  session: null,
  isAuthenticated: false,
  profile: null,
  isPremium: false,
  login: async () => ({}),
  loginWithGoogle: async () => ({}),
  signup: async () => ({}),
  logout: async () => {},
  updateProfile: async () => ({}),
  updatePassword: async () => ({}),
  resetPassword: async () => ({}),
  verifyEmail: async () => ({}),
  resendVerificationEmail: async () => ({}),
  getAllUsers: async () => [],
  createUser: async () => ({}),
  updateUser: async () => ({}),
  deleteUser: async () => ({}),
  getSystemLogs: async () => [],
  updateSystemLog: async () => ({}),
  addSystemLog: async () => ({}),
  getEmailSettings: async () => ({}),
  updateEmailSettings: async () => ({})
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile whenever user changes
  useEffect(() => {
    async function getUserProfile() {
      if (!user) {
        setProfile(null);
        setIsPremium(false);
        return;
      }

      try {
        // Get profile from user_profiles table
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setIsPremium(data?.is_premium || false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    getUserProfile();
  }, [user]);

  // Authentication methods
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };
  
  const signup = async (email: string, password: string, userData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  const updateProfile = async (data: any) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      // Update user_profiles table
      const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update state
      setProfile((prev: any) => ({
        ...prev,
        ...data
      }));
      
      // Update isPremium if is_premium field was changed
      if (data.hasOwnProperty('is_premium')) {
        setIsPremium(data.is_premium);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };
  
  const verifyEmail = async (token: string) => {
    try {
      // This is a placeholder - email verification is handled automatically by Supabase
      // You may need to customize this based on how you've set up verification
      return { success: true };
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  };
  
  const resendVerificationEmail = async (email: string) => {
    try {
      // This is a placeholder - you would need to implement this based on your requirements
      return { success: true };
    } catch (error) {
      console.error('Error resending verification email:', error);
      throw error;
    }
  };

  // Admin methods
  const getAllUsers = async () => {
    try {
      // This requires admin access and would typically be restricted to admin users
      // You should call an RPC function that checks if the user is an admin first
      const { data: isAdmin } = await supabase.rpc('is_admin');
      
      if (!isAdmin) {
        throw new Error('Unauthorized access');
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*, users(*)');
        
      if (error) throw error;
      
      // Format user data
      return data.map((profile: any) => ({
        ...profile,
        email: profile.users?.email,
        role: 'user', // Default role
        // Add any other fields from the users table
      }));
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  };
  
  const createUser = async (userData: any) => {
    try {
      // This should be an admin-only function
      const { data: isAdmin } = await supabase.rpc('is_admin');
      
      if (!isAdmin) {
        throw new Error('Unauthorized access');
      }
      
      // Create a user with the Auth API (requires service role key, not available in browser)
      // You would typically use an Edge Function or server-side code for this
      
      // For now, simulate success
      return { success: true, id: 'new-user-id' };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };
  
  const updateUser = async (userId: string, userData: any) => {
    try {
      // This should be an admin-only function
      const { data: isAdmin } = await supabase.rpc('is_admin');
      
      if (!isAdmin) {
        throw new Error('Unauthorized access');
      }
      
      // Update user profile
      const { error } = await supabase
        .from('user_profiles')
        .update(userData)
        .eq('id', userId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };
  
  const deleteUser = async (userId: string) => {
    try {
      // This should be an admin-only function
      const { data: isAdmin } = await supabase.rpc('is_admin');
      
      if (!isAdmin) {
        throw new Error('Unauthorized access');
      }
      
      // Delete user (requires service role key, not available in browser)
      // You would typically use an Edge Function or server-side code for this
      
      // For now, simulate success
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };
  
  // System logs
  const getSystemLogs = async () => {
    try {
      // This should be an admin-only function
      const { data: isAdmin } = await supabase.rpc('is_admin');
      
      if (!isAdmin) {
        throw new Error('Unauthorized access');
      }
      
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('occurred_at', { ascending: false });
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  };
  
  const updateSystemLog = async (logId: string, data: any) => {
    try {
      // This should be an admin-only function
      const { data: isAdmin } = await supabase.rpc('is_admin');
      
      if (!isAdmin) {
        throw new Error('Unauthorized access');
      }
      
      const { error } = await supabase
        .from('security_audit_log')
        .update(data)
        .eq('id', logId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error updating system log:', error);
      throw error;
    }
  };
  
  const addSystemLog = async (data: any) => {
    try {
      const { error } = await supabase
        .from('security_audit_log')
        .insert([{
          ...data,
          user_id: user?.id,
          occurred_at: new Date()
        }]);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error adding system log:', error);
      throw error;
    }
  };
  
  // Email settings
  const getEmailSettings = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      return data || { notifications: true, marketing: false, reminders: true };
    } catch (error) {
      console.error('Error fetching email settings:', error);
      throw error;
    }
  };
  
  const updateEmailSettings = async (data: any) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('email_settings')
        .upsert({
          user_id: user.id,
          ...data,
          updated_at: new Date()
        });
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error updating email settings:', error);
      throw error;
    }
  };
  
  const value: AuthContextType = {
    user,
    isLoading,
    session,
    isAuthenticated: !!user,
    profile,
    isPremium,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateProfile,
    updatePassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getSystemLogs,
    updateSystemLog,
    addSystemLog,
    getEmailSettings,
    updateEmailSettings
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
