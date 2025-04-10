
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase-client';
import { getKnownTable } from '@/adapters/SupabaseAdapter';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
}

interface EnhancedAuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: any }>;
  refreshProfile: () => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  updateProfile: async () => ({ success: false, error: new Error('Not implemented') }),
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(EnhancedAuthContext);

export const EnhancedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await getKnownTable('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (auth.user?.id) {
        setIsLoading(true);
        const userProfile = await fetchUserProfile(auth.user.id);
        setProfile(userProfile);
        setIsLoading(false);
      } else {
        setProfile(null);
        setIsLoading(auth.isLoading);
      }
    };

    loadProfile();
  }, [auth.user, auth.isLoading]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!auth.user?.id) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      const { error } = await getKnownTable('user_profiles').upsert({
        id: auth.user.id,
        ...data,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        return { success: false, error };
      }

      await refreshProfile();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const refreshProfile = async () => {
    if (auth.user?.id) {
      const userProfile = await fetchUserProfile(auth.user.id);
      setProfile(userProfile);
    }
  };

  // Check if user is admin - simple implementation for now
  const isAdmin = auth.user?.email?.includes('admin') || false;

  return (
    <EnhancedAuthContext.Provider
      value={{
        user: auth.user,
        profile,
        isLoading: isLoading || auth.isLoading,
        isAdmin,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </EnhancedAuthContext.Provider>
  );
};
