
// Common shared interfaces and types
import { User, UserRole, UserPreferences } from './user';
import { ChatMessage, ChatSession, ChatbotTrainingExample } from './chatbot';
import { DocumentMeta, ParsedDocument } from './document';
import { AIModel, AISettings, AIFeedbackSettings } from './ai';
import { Notification, NotificationType } from './notification';
import { DateRange } from './date';
import { Achievement, Level, UserGamification } from './gamification';
import { Flashcard, FlashcardSet } from './flashcard';
import { SupportTicket, SupportTicketStatus, SupportTicketMessage } from './support';
import { Question, QuestionSet, QuizAttempt } from './question';
import { AdUnit, AdSettings, AdNetwork } from './ad';
import { License, LicenseType, LicenseStatus } from './license';
import { ContentType, ContentFeatures } from './contentType';
import { AnalyticsFilters, UserMetrics, ContentMetrics, FinancialMetrics } from './analytics';

// Export all types for easy import
export {
  // User related
  User,
  UserRole,
  UserPreferences,
  
  // Content types
  DocumentMeta,
  ParsedDocument,
  ContentType,
  ContentFeatures,
  
  // Chat related
  ChatMessage,
  ChatSession,
  ChatbotTrainingExample,
  
  // AI related
  AIModel,
  AISettings,
  AIFeedbackSettings,
  
  // Notifications
  Notification,
  NotificationType,
  
  // Utility types
  DateRange,
  
  // Gamification
  Achievement,
  Level,
  UserGamification,
  
  // Learning content
  Flashcard,
  FlashcardSet,
  Question,
  QuestionSet,
  QuizAttempt,
  
  // Support
  SupportTicket,
  SupportTicketStatus,
  SupportTicketMessage,
  
  // Advertising
  AdUnit,
  AdSettings,
  AdNetwork,
  
  // Enterprise
  License,
  LicenseType,
  LicenseStatus,
  
  // Analytics
  AnalyticsFilters,
  UserMetrics,
  ContentMetrics,
  FinancialMetrics
};

// Generic utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResult<T> = Promise<T>;
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// API related types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, any>;
}

// Component Prop Types
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

export interface LoadingProps extends BaseComponentProps {
  isLoading: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export interface ErrorProps extends BaseComponentProps {
  error: Error | string | null;
  retry?: () => void;
}

// Form related types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    validate?: (value: any) => boolean | string;
  };
}

// Theme related types
export type ThemeMode = 'light' | 'dark' | 'system';

// Custom event types
export interface CustomEvents {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string; timestamp: Date };
  'content:viewed': { contentId: string; contentType: string; userId: string; timestamp: Date };
  'error:triggered': { message: string; code?: string; stack?: string; timestamp: Date };
}
