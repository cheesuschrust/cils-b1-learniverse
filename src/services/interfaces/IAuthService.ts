
import { User } from "@/types/user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface IAuthService {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  signup: (data: RegisterData) => Promise<AuthResponse>; // Alias for register
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  testConnection: () => Promise<{ success: boolean, message: string }>;
  updateProfile: (userId: string, data: Partial<User>) => Promise<AuthResponse>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<User>;
  incrementDailyQuestionCount: (questionType: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  socialLogin: (provider: string) => Promise<boolean>;
  getEmailSettings: () => Promise<any>;
  updateEmailSettings: (settings: any) => Promise<void>;
  getSystemLogs: () => Promise<any[]>;
  updateSystemLog: (id: string, data: any) => Promise<void>;
  addSystemLog: (action: string, details: string, level?: string) => void;
}
