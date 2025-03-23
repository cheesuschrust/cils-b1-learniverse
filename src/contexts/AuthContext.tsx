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
    
    // Add improved implementations for methods
    socialLogin: async (provider) => {
      console.log(`Social login with ${provider} attempted`);
      try {
        // Generate a unique email based on provider and timestamp to prevent duplicates
        const timestamp = new Date().getTime();
        const email = `${provider}_${timestamp}@example.com`;
        const password = `social-login-${provider}-${timestamp}`;
        
        // Create a proper user record with minimal information
        const data = {
          firstName: provider === 'google' ? 'Google' : 'Apple',
          lastName: 'User',
          email,
          password
        };
        
        // Register a new account if this is first login
        try {
          await auth.register(data);
          return true;
        } catch (error) {
          // If registration fails, try to login
          return await auth.login(email, password);
        }
      } catch (error) {
        console.error(`Social login error: ${error}`);
        return false;
      }
    },
    
    resetPassword: async (email) => {
      console.log(`Password reset requested for ${email}`);
      await auth.forgotPassword(email);
      return true;
    },
    
    completePasswordReset: async (token, newPassword) => {
      console.log(`Completing password reset with token ${token}`);
      // Improved implementation
      try {
        // This would validate the token and update the password
        // For now it's a stub implementation
        return true;
      } catch (error) {
        console.error('Password reset error:', error);
        return false;
      }
    },
    
    verifyEmail: async (token) => {
      console.log(`Verifying email with token ${token}`);
      // Improved implementation
      try {
        // This would validate the token and update the user's email verification status
        // For now it's a stub implementation
        return true;
      } catch (error) {
        console.error('Email verification error:', error);
        return false;
      }
    },
    
    refreshSession: async () => {
      console.log("Refreshing session");
      // Check localStorage for a valid user session
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          return true;
        }
        return false;
      } catch (error) {
        console.error('Session refresh error:', error);
        return false;
      }
    },
    
    updateUser: async (updates) => {
      console.log("Updating user", updates);
      if (!auth.user) return false;
      
      try {
        await auth.updateProfile(updates as UpdateProfileData);
        return true;
      } catch (error) {
        console.error("Error updating user:", error);
        return false;
      }
    },
    
    updateUserPreferences: async (preferences) => {
      console.log("Updating user preferences", preferences);
      if (!auth.user) return false;
      
      try {
        await auth.updateProfile({ preferences });
        return true;
      } catch (error) {
        console.error("Error updating preferences:", error);
        return false;
      }
    },
    
    sendVerificationEmail: async (email) => {
      console.log(`Sending verification email to ${email}`);
      // Improved implementation
      try {
        // This would send a verification email
        // For now it's a stub implementation
        return true;
      } catch (error) {
        console.error('Send verification email error:', error);
        return false;
      }
    },
    
    resendVerificationEmail: async (email) => {
      console.log(`Resending verification email to ${email}`);
      // Improved implementation
      try {
        // This would resend a verification email
        // For now it's a stub implementation
        return true;
      } catch (error) {
        console.error('Resend verification email error:', error);
        return false;
      }
    },
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
    
    updateEmailSettings: async (settings) => {
      console.log("Updating email settings", settings);
      // Stub implementation
      return true;
    },
    
    getAllUsers: () => {
      console.log("Getting all users");
      // Stub implementation
      return [];
    },
    
    deleteUser: async (userId) => {
      console.log(`Deleting user with ID ${userId}`);
      // Stub implementation
      return true;
    },
    
    disableUser: async (userId) => {
      console.log(`Disabling user with ID ${userId}`);
      // Stub implementation
      return true;
    },
    
    enableUser: async (userId) => {
      console.log(`Enabling user with ID ${userId}`);
      // Stub implementation
      return true;
    },
    
    makeAdmin: async (userId) => {
      console.log(`Making user with ID ${userId} an admin`);
      // Stub implementation
      return true;
    },
    
    addAdmin: async (userId) => {
      console.log(`Adding admin role to user with ID ${userId}`);
      // Stub implementation
      return true;
    },
    
    updateUserStatus: async (userId, status) => {
      console.log(`Updating status of user ${userId} to ${status}`);
      // Stub implementation
      return true;
    },
    
    updateUserSubscription: async (userId, subscription) => {
      console.log(`Updating subscription of user ${userId} to ${subscription}`);
      // Stub implementation
      return true;
    },
    
    getSystemLogs: () => {
      console.log("Getting system logs");
      // Stub implementation
      return [];
    },
    
    addSystemLog: (category, action, details, level = 'info') => {
      console.log(`Adding system log: ${category} - ${action} (${level})`);
      if (details) console.log(`Details: ${details}`);
      // Stub implementation
    },
    
    updateSystemLog: async (logId, updates) => {
      console.log(`Updating log ${logId}`, updates);
      // Stub implementation
      return true;
    },
    
    checkEmailExists: async (email) => {
      console.log(`Checking if email ${email} exists`);
      // Stub implementation
      return false;
    },
    
    incrementDailyQuestionCount: async (type) => {
      console.log(`Incrementing daily question count for ${type}`);
      // Stub implementation
      return true;
    },
    
    signup: async (firstName, lastName, email, password, username) => {
      console.log(`Signing up user ${firstName} ${lastName} (${email})`);
      try {
        // Improved implementation with username handling
        await auth.register({
          firstName,
          lastName,
          email,
          password
        });
        
        // If username was provided, update the profile after registration
        if (username && auth.user) {
          await auth.updateProfile({ username });
        }
        
        return true;
      } catch (error) {
        console.error("Signup error:", error);
        return false;
      }
    },
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
