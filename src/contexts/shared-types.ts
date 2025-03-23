
import { VoicePreference } from "@/utils/textToSpeech";

export interface UserPreferences {
  darkMode: boolean;
  notifications: boolean;
  language: "english" | "italian" | "both";
  fontSize?: "small" | "medium" | "large";
  dailyGoal?: number;
  autoPlayAudio?: boolean;
  showTranslations?: boolean;
  emailNotifications?: boolean;
  theme?: "light" | "dark" | "system";
  bio?: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface EmailSettings {
  provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses' | 'gmail' | 'temporaryEmail';
  fromEmail: string;
  fromName: string;
  config: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    apiKey?: string;
    domain?: string;
    accessKey?: string;
    secretKey?: string;
    region?: string;
    enableSsl?: boolean;
  };
  templates: {
    verification: EmailTemplate;
    passwordReset: EmailTemplate;
    welcome: EmailTemplate;
  };
  temporaryInboxDuration?: number;
  dailyDigest?: boolean;
  notifications?: boolean;
  marketing?: boolean;
  newFeatures?: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  username?: string;
  role: "user" | "admin";
  status: "active" | "inactive" | "suspended";
  subscription: "free" | "premium" | "trial";
  createdAt: string;
  lastLogin?: string;
  lastLoginAt?: string;
  lastActive?: string;
  phoneNumber?: string;
  address?: string;
  preferences: UserPreferences;
  voicePreference?: VoicePreference;
  preferredLanguage?: "english" | "italian" | "both";
  dailyQuestionCounts?: {
    flashcards: number;
    multipleChoice: number;
    listening: number;
    writing: number;
    speaking: number;
    [key: string]: number;
  };
  isAdmin?: boolean;
  emailVerified?: boolean;
  isVerified?: boolean;
  avatarUrl?: string;
  metrics?: {
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
    [key: string]: number;
  };
}

export interface UserPreferencesContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: "english" | "italian" | "both";
  setLanguage: (language: "english" | "italian" | "both") => void;
  notifications: boolean;
  toggleNotifications: () => void;
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  voicePreference: VoicePreference;
  setVoicePreference: (preference: VoicePreference) => void;
  autoPlayAudio: boolean;
  toggleAutoPlayAudio: () => void;
  showTranslations: boolean;
  toggleShowTranslations: () => void;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  resetPreferences: () => void;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string, username?: string) => Promise<boolean>;
  updateProfile: (data: any) => Promise<User>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<boolean>;
}

// Added missing log-related types
export type LogCategory = 'user' | 'system' | 'auth' | 'content' | 'email' | 'ai';
export interface LogEntry {
  id: string;
  timestamp: string;
  category: LogCategory;
  action: string;
  details?: string;
  level: 'info' | 'warning' | 'error';
  userId?: string;
}

// Add missing MockDatabase interface
export interface MockDatabase {
  users: User[];
  logs: LogEntry[];
  emailSettings: EmailSettings;
  resetTokens: Map<string, string>;
  verificationTokens: Map<string, string>;
}
