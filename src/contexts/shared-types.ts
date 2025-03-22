
// Define log category
export type LogCategory = 'content' | 'email' | 'system' | 'user' | 'auth' | 'ai';

// Define log entry interface
export interface LogEntry {
  id: string;
  timestamp: Date;
  category: LogCategory;
  action: string;
  userId?: string;
  details?: string;
  level: 'info' | 'warning' | 'error';
}

// Define user roles
export type UserRole = 'user' | 'admin';

// User interface with all required properties
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  lastLogin: Date;
  lastActive: Date;
  preferences: UserPreferences;
  subscription: 'free' | 'premium';
  status: 'active' | 'inactive' | 'suspended';
  preferredLanguage: 'english' | 'italian' | 'both';
  dailyQuestionCounts: {
    flashcards: number;
    multipleChoice: number;
    listening: number;
    writing: number;
    speaking: number;
    [key: string]: number;
  };
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  metrics: {
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  language: 'en' | 'it';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  fontSize?: number;
  notificationsEnabled?: boolean;
  animationsEnabled?: boolean;
  preferredLanguage?: string;
  voiceSpeed?: number;
  autoPlayAudio?: boolean;
  showProgressMetrics?: boolean;
  aiEnabled?: boolean;
  aiModelSize?: string;
  aiProcessingOnDevice?: boolean;
  confidenceScoreVisible?: boolean;
}

// Email settings
export type EmailProvider = 'smtp' | 'mailgun' | 'sendgrid' | 'ses' | 'temporaryEmail';

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface EmailSettings {
  provider: EmailProvider;
  fromEmail: string;
  fromName: string;
  config: {
    enableSsl: boolean;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    apiKey?: string;
    domain?: string;
    region?: string;
  };
  templates: {
    verification: EmailTemplate;
    passwordReset: EmailTemplate;
    welcome: EmailTemplate;
  };
  temporaryInboxDuration: number;
}

// Mock database
export interface MockDatabase {
  users: User[];
  logs: LogEntry[];
  emailSettings: EmailSettings;
  resetTokens: Map<string, { email: string; expires: Date }>;
  verificationTokens: Map<string, { email: string; expires: Date }>;
}
