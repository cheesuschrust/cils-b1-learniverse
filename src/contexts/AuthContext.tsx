
import React, { createContext, useContext, ReactNode } from "react";
import { User, UserPreferences, LogCategory, LogEntry, EmailSettings } from "./shared-types";
import { useAuthManager } from "@/hooks/useAuthManager";
import { LoginCredentials, RegisterData } from "@/services/AuthService";
import { UpdateProfileData } from "@/services/UserService";

// Export these types for use in other components
export type { User, UserPreferences, LogCategory, LogEntry, EmailSettings };

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  completePasswordReset: (token: string, newPassword: string) => Promise<boolean>;
  
  // User profile methods
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
  
  // Email verification
  verifyEmail: (token: string) => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  
  // Session management
  refreshSession: () => Promise<boolean>;
  
  // Email settings
  getEmailSettings: () => EmailSettings;
  updateEmailSettings: (settings: EmailSettings) => Promise<boolean>;
  
  // Admin functions
  getAllUsers: () => User[];
  deleteUser: (userId: string) => Promise<boolean>;
  disableUser: (userId: string) => Promise<boolean>;
  enableUser: (userId: string) => Promise<boolean>;
  makeAdmin: (userId: string) => Promise<boolean>;
  addAdmin: (userId: string) => Promise<boolean>;
  
  // User status
  updateUserStatus: (userId: string, status: string) => Promise<boolean>;
  updateUserSubscription: (userId: string, subscription: string) => Promise<boolean>;
  
  // System logs
  getSystemLogs: (
    category?: LogCategory, 
    level?: 'info' | 'warning' | 'error', 
    startDate?: Date, 
    endDate?: Date
  ) => LogEntry[];
  addSystemLog: (
    category: LogCategory, 
    action: string, 
    details?: string, 
    level?: 'info' | 'warning' | 'error'
  ) => void;
  updateSystemLog: (logId: string, updates: Partial<LogEntry>) => Promise<boolean>;
  
  // Registration checks
  checkEmailExists: (email: string) => Promise<boolean>;
  
  // Question limits
  incrementDailyQuestionCount: (type: string) => Promise<boolean>;
  
  // Additional methods
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username?: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthManager();
  
  // Create a complete context object with all required properties
  const authContextValue: AuthContextType = {
    ...auth,
    isAuthenticated: !!auth.user,
    
    // Add stub implementations for methods not provided by useAuthManager
    // These will be properly implemented as needed
    socialLogin: async () => false,
    resetPassword: async () => false,
    completePasswordReset: async () => false,
    verifyEmail: async () => false,
    refreshSession: async () => !!auth.user,
    updateUser: async () => false,
    updateUserPreferences: async () => false,
    sendVerificationEmail: async () => false,
    resendVerificationEmail: async () => false,
    getEmailSettings: () => ({ 
      provider: 'smtp',
      fromEmail: 'noreply@example.com',
      fromName: 'CILS B2 Cittadinanza',
      config: {
        enableSsl: true,
        host: "smtp.example.com",
        port: 587,
        username: "user@example.com",
        password: "password123"
      },
      templates: {
        verification: {
          subject: 'Verify your email',
          body: 'Please verify your email'
        },
        passwordReset: {
          subject: 'Reset your password',
          body: 'Reset your password'
        },
        welcome: {
          subject: 'Welcome',
          body: 'Welcome to our platform'
        }
      },
      dailyDigest: false,
      notifications: false,
      marketing: false,
      newFeatures: false 
    }),
    updateEmailSettings: async () => false,
    getAllUsers: () => [],
    deleteUser: async () => false,
    disableUser: async () => false,
    enableUser: async () => false,
    makeAdmin: async () => false,
    addAdmin: async () => false,
    updateUserStatus: async () => false,
    updateUserSubscription: async () => false,
    getSystemLogs: () => [],
    addSystemLog: () => {},
    updateSystemLog: async () => false,
    checkEmailExists: async () => false,
    incrementDailyQuestionCount: async () => true,
    signup: async () => false,
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
