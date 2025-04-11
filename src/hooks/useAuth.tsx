
import { useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';
import type { User } from '@/types/auth';

// Create a consistent interface for auth across the application
export function useAuth() {
  const contextAuth = useContext(AuthContext);
  
  // Map the context auth to a consistent interface
  const user: User | null = contextAuth.user ? {
    ...contextAuth.user,
    // Ensure both isPremium and isPremiumUser are available for compatibility
    isPremium: contextAuth.user.isPremium || contextAuth.user.isPremiumUser,
    isPremiumUser: contextAuth.user.isPremium || contextAuth.user.isPremiumUser,
  } : null;
  
  return {
    ...contextAuth,
    user,
    isAuthenticated: !!user,
    isPremiumUser: !!user?.isPremium || !!user?.isPremiumUser,
  };
}

export default useAuth;
