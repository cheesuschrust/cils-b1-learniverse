
import { VoicePreference } from "@/utils/textToSpeech";

export interface UserPreferences {
  darkMode: boolean;
  notifications: boolean;
  language: "english" | "italian" | "both";
  fontSize?: "small" | "medium" | "large";
  dailyGoal?: number;
  autoPlayAudio?: boolean;
  showTranslations?: boolean;
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
  phoneNumber?: string;
  address?: string;
  preferences: UserPreferences;
  voicePreference?: VoicePreference;
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
