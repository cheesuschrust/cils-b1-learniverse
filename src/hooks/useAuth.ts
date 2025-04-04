
import { useState, useEffect, useCallback } from 'react';
import { supabase, signInWithEmail, signUp, signOut, getCurrentUser } from '@/integrations/supabase/client';
import type { User } from '@/types/app-types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              // Set user when signed in or token refreshed
              getCurrentUser().then(user => {
                setAuthState({
                  user,
                  isLoading: false,
                  error: null
                });
              });
            } else if (event === 'SIGNED_OUT') {
              // Clear user when signed out
              setAuthState({
                user: null,
                isLoading: false,
                error: null
              });
            }
          }
        );

        // Then check for existing session
        const user = await getCurrentUser();
        setAuthState({
          user,
          isLoading: false,
          error: null
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          error: 'Failed to initialize authentication'
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { error } = await signInWithEmail(email, password);
      
      if (error) {
        throw error;
      }
      
      // Auth state will be updated by the listener
      return { success: true };
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed'
      }));
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { error } = await signUp(email, password);
      
      if (error) {
        throw error;
      }
      
      // Auth state will be updated by the listener
      return { success: true };
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed'
      }));
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await signOut();
      // Auth state will be updated by the listener
      return { success: true };
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Logout failed'
      }));
      return { success: false, error: error.message };
    }
  }, []);

  const isPremium = useCallback(() => {
    return authState.user?.isPremiumUser || false;
  }, [authState.user]);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    register,
    logout,
    isPremium
  };
}

export default useAuth;
