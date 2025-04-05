
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/EnhancedAuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Re-export the provider for convenience
export { AuthContext };
export type { AuthContextType };
