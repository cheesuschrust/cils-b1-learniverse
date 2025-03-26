
import React, { createContext, useContext, ReactNode, useState } from "react";
import { User, UserPreferences, LogCategory, LogEntry, EmailSettings } from "./shared-types";
import { useAuthManager } from "@/hooks/useAuthManager";
import { LoginCredentials, RegisterData } from "@/services/AuthService";
import { UpdateProfileData } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";

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
  getAllUsers: () => Promise<User[]>;
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
  ) => Promise<LogEntry[]>;
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
  const { toast } = useToast();
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>([]);
  
  // Create a complete context object with all required properties
  const authContextValue: AuthContextType = {
    ...auth,
    isAuthenticated: !!auth.user,
    
    socialLogin: async (provider) => {
      try {
        toast({
          title: `Signing in with ${provider}`,
          description: "Redirecting to authentication provider...",
        });
        
        // This would be implemented with a real OAuth flow
        const email = `${provider}@example.com`;
        const password = 'social-login-password';
        return await auth.login(email, password);
      } catch (error) {
        console.error(`Social login error: ${error}`);
        toast({
          title: "Authentication Failed",
          description: "Could not authenticate with social provider.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    resetPassword: async (email) => {
      try {
        await auth.forgotPassword(email);
        toast({
          title: "Password Reset Requested",
          description: "If an account exists with this email, you will receive password reset instructions.",
        });
        return true;
      } catch (error) {
        console.error(`Password reset error: ${error}`);
        // Don't show specific errors to prevent email enumeration
        toast({
          title: "Password Reset Requested",
          description: "If an account exists with this email, you will receive password reset instructions.",
        });
        return false;
      }
    },
    
    completePasswordReset: async (token, newPassword) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "Password Reset Complete",
          description: "Your password has been successfully reset. You can now login with your new password.",
        });
        return true;
      } catch (error) {
        console.error(`Complete password reset error: ${error}`);
        toast({
          title: "Reset Failed",
          description: "Could not reset password. The link may be expired or invalid.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    verifyEmail: async (token) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified.",
        });
        return true;
      } catch (error) {
        console.error(`Email verification error: ${error}`);
        toast({
          title: "Verification Failed",
          description: "Could not verify email. The link may be expired or invalid.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    refreshSession: async () => {
      try {
        // This would refresh the session token in a real implementation
        return !!auth.user;
      } catch (error) {
        console.error("Session refresh error:", error);
        return false;
      }
    },
    
    updateUser: async (updates) => {
      if (!auth.user) return false;
      
      try {
        await auth.updateProfile(updates as UpdateProfileData);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        return true;
      } catch (error) {
        console.error("Error updating user:", error);
        toast({
          title: "Update Failed",
          description: "Could not update your profile. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    updateUserPreferences: async (preferences) => {
      if (!auth.user) return false;
      
      try {
        await auth.updateProfile({ preferences });
        toast({
          title: "Preferences Updated",
          description: "Your preferences have been successfully updated.",
        });
        return true;
      } catch (error) {
        console.error("Error updating preferences:", error);
        toast({
          title: "Update Failed",
          description: "Could not update your preferences. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    sendVerificationEmail: async (email) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "Verification Email Sent",
          description: "A verification email has been sent to your email address.",
        });
        return true;
      } catch (error) {
        console.error(`Send verification email error: ${error}`);
        toast({
          title: "Error Sending Email",
          description: "Could not send verification email. Please try again later.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    resendVerificationEmail: async (email) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "Verification Email Resent",
          description: "A new verification email has been sent to your email address.",
        });
        return true;
      } catch (error) {
        console.error(`Resend verification email error: ${error}`);
        toast({
          title: "Error Sending Email",
          description: "Could not resend verification email. Please try again later.",
          variant: "destructive"
        });
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
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "Email Settings Updated",
          description: "Your email settings have been successfully updated.",
        });
        return true;
      } catch (error) {
        console.error("Error updating email settings:", error);
        toast({
          title: "Update Failed",
          description: "Could not update email settings. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    getAllUsers: async () => {
      try {
        // This would call the actual API in a real implementation
        return [];
      } catch (error) {
        console.error("Error getting users:", error);
        toast({
          title: "Error Fetching Users",
          description: "Could not fetch users. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    },
    
    deleteUser: async (userId) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "User Deleted",
          description: "The user has been successfully deleted.",
        });
        return true;
      } catch (error) {
        console.error(`Error deleting user ${userId}:`, error);
        toast({
          title: "Delete Failed",
          description: "Could not delete user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    disableUser: async (userId) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "User Disabled",
          description: "The user has been successfully disabled.",
        });
        return true;
      } catch (error) {
        console.error(`Error disabling user ${userId}:`, error);
        toast({
          title: "Action Failed",
          description: "Could not disable user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    enableUser: async (userId) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "User Enabled",
          description: "The user has been successfully enabled.",
        });
        return true;
      } catch (error) {
        console.error(`Error enabling user ${userId}:`, error);
        toast({
          title: "Action Failed",
          description: "Could not enable user. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    makeAdmin: async (userId) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "Admin Role Added",
          description: "The user has been successfully made an admin.",
        });
        return true;
      } catch (error) {
        console.error(`Error making user ${userId} admin:`, error);
        toast({
          title: "Action Failed",
          description: "Could not update user role. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    addAdmin: async (userId) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "Admin Role Added",
          description: "The user has been successfully made an admin.",
        });
        return true;
      } catch (error) {
        console.error(`Error adding admin role to user ${userId}:`, error);
        toast({
          title: "Action Failed",
          description: "Could not update user role. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    updateUserStatus: async (userId, status) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "Status Updated",
          description: `User status updated to "${status}".`,
        });
        return true;
      } catch (error) {
        console.error(`Error updating status of user ${userId}:`, error);
        toast({
          title: "Update Failed",
          description: "Could not update user status. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    updateUserSubscription: async (userId, subscription) => {
      try {
        // This would call the actual API in a real implementation
        toast({
          title: "Subscription Updated",
          description: `User subscription updated to "${subscription}".`,
        });
        return true;
      } catch (error) {
        console.error(`Error updating subscription of user ${userId}:`, error);
        toast({
          title: "Update Failed",
          description: "Could not update user subscription. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    },
    
    getSystemLogs: async (category, level, startDate, endDate) => {
      try {
        // This would call the actual API in a real implementation
        return systemLogs.filter(log => {
          if (category && log.category !== category) return false;
          if (level && log.level !== level) return false;
          if (startDate && new Date(log.timestamp) < startDate) return false;
          if (endDate && new Date(log.timestamp) > endDate) return false;
          return true;
        });
      } catch (error) {
        console.error("Error getting system logs:", error);
        toast({
          title: "Error Fetching Logs",
          description: "Could not fetch system logs. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    },
    
    addSystemLog: (category, action, details, level = 'info') => {
      try {
        const newLog: LogEntry = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          category,
          action,
          details: details || '',
          level,
          timestamp: new Date(),
          userId: auth.user?.id || 'system'
        };
        
        setSystemLogs(prev => [...prev, newLog]);
      } catch (error) {
        console.error("Error adding system log:", error);
      }
    },
    
    updateSystemLog: async (logId, updates) => {
      try {
        setSystemLogs(prev => prev.map(log => 
          log.id === logId ? { ...log, ...updates } : log
        ));
        return true;
      } catch (error) {
        console.error(`Error updating log ${logId}:`, error);
        return false;
      }
    },
    
    checkEmailExists: async (email) => {
      try {
        // This would call the actual API in a real implementation
        await new Promise(resolve => setTimeout(resolve, 500));
        return false;
      } catch (error) {
        console.error(`Error checking if email ${email} exists:`, error);
        return false;
      }
    },
    
    incrementDailyQuestionCount: async (type) => {
      if (!auth.user) return false;
      
      try {
        // This would call the actual API in a real implementation
        // For now, just update in memory
        // In a real app, this would update the server
        toast({
          title: "Question Completed",
          description: `You've used 1 of your daily ${type} questions.`,
        });
        return true;
      } catch (error) {
        console.error(`Error incrementing question count for ${type}:`, error);
        return false;
      }
    },
    
    signup: async (firstName, lastName, email, password, username) => {
      try {
        await auth.register({
          firstName,
          lastName,
          email,
          password,
          ...(username ? { username } : {})
        });
        toast({
          title: "Account Created",
          description: "Your account has been successfully created.",
        });
        return true;
      } catch (error) {
        console.error("Signup error:", error);
        toast({
          title: "Registration Failed",
          description: "Could not create your account. Please try again.",
          variant: "destructive"
        });
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
