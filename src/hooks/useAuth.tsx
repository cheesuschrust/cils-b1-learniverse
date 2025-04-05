
import { useContext } from 'react';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';

// Create an internal context type that matches what's expected in the code
export interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword?: (email: string) => Promise<boolean>;
  updatePassword?: (password: string) => Promise<boolean>;
  verifyEmail?: (token: string) => Promise<boolean>;
  resendVerificationEmail?: (email: string) => Promise<boolean>;
  updateProfile?: (data: any) => Promise<boolean>;
  displayName?: string;
  isPremium?: boolean;
}

// We need to match the context from EnhancedAuthContext
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Re-export the provider for convenience
export { EnhancedAuthProvider as AuthProvider, AuthContext };
