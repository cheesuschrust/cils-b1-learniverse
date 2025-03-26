
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
  profileImage?: string;
  photoURL?: string;
  avatar?: string;
  metrics: {
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
  };
  name?: string;
  isAdmin?: boolean;
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
  bio?: string;
}

// Email settings
export type EmailProvider = 'smtp' | 'mailgun' | 'sendgrid' | 'ses' | 'gmail' | 'temporaryEmail';

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface EmailConfig {
  enableSsl?: boolean; 
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  apiKey?: string;
  domain?: string;
  region?: string;
  accessKey?: string;
  secretKey?: string;
}

export interface EmailSettings {
  provider: EmailProvider;
  fromEmail: string;
  fromName: string;
  config: EmailConfig;
  templates: {
    verification: EmailTemplate;
    passwordReset: EmailTemplate;
    welcome: EmailTemplate;
  };
  temporaryInboxDuration?: number;
}

// License types - defined here to avoid circular imports
export type LicenseType = 'university' | 'k12' | 'language-school' | 'corporate';
export type LicenseStatus = 'active' | 'expired' | 'pending' | 'suspended';
export type RenewalStatus = 'pending' | 'in-progress' | 'renewed' | 'expired' | 'not-started';

export interface License {
  id: string;
  name: string;
  type: LicenseType;
  plan: string;
  seats: number;
  usedSeats: number;
  startDate: string;
  endDate: string;
  status: LicenseStatus;
  contactName: string;
  contactEmail: string;
  domain: string;
  customization: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
  value: number;
  renewalStatus: RenewalStatus;
}

// Chat interfaces
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
  context?: string;
}

export interface ChatbotTrainingExample {
  id: string;
  query: string;
  response: string;
  category: string;
  createdAt: Date;
  createdBy: string;
}

// Import other types
import { Notification } from "@/types/notification";
import { Flashcard, FlashcardSet } from "@/types/flashcard";

// Ad types
export interface AdUnit {
  id: string;
  name: string;
  type: 'banner' | 'sidebar' | 'interstitial' | 'native';
  content: string;
  targetUrl: string;
  impression: number;
  clicks: number;
  active: boolean;
}

export interface AdSettings {
  enabled: boolean;
  placement: string[];
  frequency: number;
  userGroupTargeting: string[];
}

// Mock database
export interface MockDatabase {
  users: User[];
  logs: LogEntry[];
  emailSettings: EmailSettings;
  resetTokens: Map<string, { email: string; expires: Date }>;
  verificationTokens: Map<string, { email: string; expires: Date }>;
  licenses: License[];
  chatSessions: ChatSession[];
  chatbotTraining: ChatbotTrainingExample[];
  notifications: Notification[];
  flashcards: Flashcard[];
  flashcardSets: FlashcardSet[];
  adSettings: AdSettings;
  adUnits: AdUnit[];
}
