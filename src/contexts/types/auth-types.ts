
import { User, UserPreferences, LogCategory, LogEntry, EmailSettings } from "../shared-types";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username?: string
  ) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  completePasswordReset: (token: string, newPassword: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
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
  socialLogin: (provider: 'google' | 'apple') => Promise<boolean>;
  getEmailSettings: () => EmailSettings;
  updateEmailSettings: (settings: EmailSettings) => Promise<boolean>;
  getAllUsers: () => User[];
  deleteUser: (userId: string) => Promise<boolean>;
  disableUser: (userId: string) => Promise<boolean>;
  enableUser: (userId: string) => Promise<boolean>;
  makeAdmin: (userId: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  incrementDailyQuestionCount: (type: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  updateUserStatus: (userId: string, status: string) => Promise<boolean>;
  updateUserSubscription: (userId: string, subscription: string) => Promise<boolean>;
  addAdmin: (userId: string) => Promise<boolean>;
  updateSystemLog: (logId: string, updates: Partial<LogEntry>) => Promise<boolean>;
}
