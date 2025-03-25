
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
  profileImage?: string; // Added this property
  photoURL?: string; // Added this property
  avatar?: string; // Added for compatibility
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
  bio?: string; // Add the bio property
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

// Import required types from other files
import { License } from "@/types/license";
import { ChatSession, ChatbotTrainingExample } from "@/types/chatbot";
import { Notification } from "@/types/notification";
import { Flashcard, FlashcardSet } from "@/types/flashcard";
import { AdSettings, AdUnit } from "@/types/ad";

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
