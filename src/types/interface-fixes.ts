
// This file fixes any interface compatibility issues between our own types
// and third-party library types

import { ProgressProps as RadixProgressProps } from '@radix-ui/react-progress';
import { User } from './user';

// Export for Jest test utilities
export type ValueType = string | number;

// Extend the RadixProgressProps to include our custom properties
export interface ProgressProps extends RadixProgressProps {
  value: number;
  max?: number;
  indicator?: string;
  indicatorClassName?: string; // Added this property to fix error in GoalTracker
  yAxisWidth?: number; // Added for LineChartProps
}

// Alert component props to include variant
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'warning' | 'success' | 'info' | 'secondary';
}

// ConfidenceIndicator component props
export interface ConfidenceIndicatorProps {
  score: number; // Required property based on errors
  value?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  indicatorClassName?: string;
  contentType?: 'flashcards' | 'listening' | 'writing' | 'speaking' | 'multiple-choice' | 'unknown';
}

// Fix Flashcard interface to support both old and new properties
export interface Flashcard {
  id: string;
  front?: string; // New property
  back?: string; // New property
  italian: string; // Required per error message
  english: string; // Required per error message
  examples?: string[];
  notes?: string;
  tags: string[]; // Required based on errors
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  lastReviewed?: Date;
  nextReviewDate?: Date;
  reviewCount?: number;
  mastered: boolean; // Changed to required based on errors
  level: number; // Changed to required based on errors
  nextReview?: Date; // Added nextReview property
  createdAt: Date; // Changed to required based on errors
  updatedAt: Date; // Changed to required based on errors
  explanation?: string; // Added explanation property
  dueDate?: Date; // Added for compatibility
  audioUrl?: string;
  imageUrl?: string;
}

// Define all the types that require compatibility fixes

// Fix FlashcardSet interface
export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  creator: string;
  isPublic: boolean;
  isFavorite: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  totalCards: number;
  masteredCards: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Fix FlashcardStats interface
export interface FlashcardStats {
  totalReviews: number;
  correctReviews: number;
  averageResponseTime?: number;
  masteredCount?: number;
  learningCount?: number;
  newCount?: number;
  mastered?: number; // Added for compatibility
  total?: number; // Added for compatibility
  learning?: number; // Added for compatibility
  toReview?: number; // Added for compatibility with useFlashcards
  avgMasteryTime?: number; // Added based on error in useFlashcards
  averageScore?: number;
  streak?: number;
  lastReviewDate?: Date;
}

// Expanded FlashcardComponentProps interface to include all needed properties
export interface FlashcardComponentProps {
  flashcard: Flashcard;
  card?: Flashcard; // Legacy property for tests
  onFlip?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onMark?: (status: 'correct' | 'incorrect' | 'hard') => void;
  onRating?: (rating: number) => void; // Added for backward compatibility
  onSkip?: () => void; // Added for backward compatibility
  onKnown?: () => void; // Added for backward compatibility
  onUnknown?: () => void; // Added for backward compatibility
  showControls?: boolean;
  showHints?: boolean;
  showPronunciation?: boolean; // Added for backward compatibility
  showActions?: boolean; // Added for backward compatibility
  autoFlip?: boolean;
  frontLabel?: string;
  backLabel?: string;
  flipped?: boolean; // Added for backward compatibility
  className?: string; // Added for backward compatibility
}

// Expanded ImportFormat interface with additional properties
export interface ImportFormat {
  type?: 'csv' | 'json' | 'anki' | 'quizlet' | 'manual' | 'excel';
  fieldMap?: Record<string, string>;
  hasHeader?: boolean;
  delimiter?: string;
  format?: string; // Added for compatibility
  [key: string]: any;
}

// Add missing SupportTicketExtension interface
export interface SupportTicketExtension {
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  status?: 'open' | 'in-progress' | 'resolved' | 'closed' | 'pending';
}

// Define LineChartProps
export interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter: (value: number) => string;
  yAxisWidth?: number;
  className?: string;
}

// Helper for calculating review performance
export function calculateReviewPerformance(
  correctness: number,
  previousInterval: number = 1
): number {
  // Simple algorithm: if correctness is high, increase interval more
  const baseMultiplier = 1 + correctness;
  return Math.round(previousInterval * baseMultiplier);
}

// Define AISettings interface
export interface AISettings {
  enabled: boolean;
  useOfflineModel: boolean;
  modelSize: 'small' | 'medium' | 'large';
  voiceEnabled: boolean;
  speakingRate: number;
  aiEnabled?: boolean;
  confidenceThreshold?: number;
  anonymousAnalytics?: boolean;
  defaultLanguage?: 'english' | 'italian' | 'both';
  [key: string]: any;
}

// Define AISettingsProps
export interface AISettingsProps {
  initialSettings?: AISettings;
  onSettingsChange?: (settings: AISettings) => void;
  onClose?: () => void; // Added for compatibility
}

// Update AIPreferences to match what's used in the code
export interface AIPreferences {
  enabled: boolean;
  modelSize: 'small' | 'medium' | 'large';
  cacheResponses: boolean;
  voiceEnabled: boolean;
  defaultLanguage: 'english' | 'italian' | 'both';
  voiceRate: number;
  voicePitch: number;
  italianVoiceURI?: string;
  englishVoiceURI?: string;
  defaultModelSize: 'small' | 'medium' | 'large';
  useWebGPU: boolean;
  anonymousAnalytics: boolean;
}

// Define LevelBadgeProps
export interface LevelBadgeProps {
  level?: number;
  showInfo?: boolean;
  size?: 'sm' | 'md' | 'lg' | string;
}

// Define AISetupWizardProps
export interface AISetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

// Define ChatSession
export interface ChatSession {
  id: string;
  userId?: string;
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
  messages: any[];
  startedAt?: Date;
  lastActivityAt?: Date;
  resolved?: boolean;
  escalatedToHuman?: boolean;
  context?: string | Record<string, any>;
}

// Define Toast interface with duration
export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number; // Added for compatibility with hooks
}

// Add missing ProtectedRouteProps
export interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
  requireAdmin?: boolean; // Added for compatibility
}

// Update interfaces for AuthContextType
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  updateProfile: (data: any) => Promise<any>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  socialLogin: (provider: string) => Promise<boolean>;
  addSystemLog: (action: string, details: string, level?: string) => void;
  incrementDailyQuestionCount: (questionType: string) => Promise<boolean>;
  getEmailSettings: () => Promise<any>;
  updateEmailSettings: (settings: any) => Promise<void>;
  getSystemLogs: () => Promise<any[]>;
  updateSystemLog: (id: string, data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

// Clearly define notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: Date | string;
  timestamp?: Date | string;
  read: boolean;
  actions?: NotificationAction[];
  url?: string;
  metadata?: Record<string, any>;
  userId?: string;
  priority?: 'low' | 'normal' | 'high';
  icon?: string;
  link?: string;
  expiresAt?: Date | string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'review' | 'default' | 'file-processing' | 'system';

export interface NotificationAction {
  id: string;
  label: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  onAction?: (id: string, actionId: string) => void;
}

// Fix AIModel type to include all variations
export type AIStatus = 'idle' | 'loading' | 'ready' | 'error';
export type AIModel = 'gpt-4o-mini' | 'gpt-4o' | 'mistral-small' | 'claude-instant' | 'small' | 'medium' | 'large';

// Add Question interface
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  points: number;
  type?: 'multiple-choice' | 'true-false' | 'fill-in-blank';
  imageUrl?: string;
  audioUrl?: string;
}

// Add QuestionSet interface
export interface QuestionSet {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
  published: boolean;
  author: string;
  instructions?: string;
}

// MultipleChoiceQuestion interface for backward compatibility
export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: string;
  correctAnswer?: string; // Added for compatibility
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'Beginner' | 'Intermediate' | 'Advanced';
  category?: string;
  tags?: string[];
  text?: string; // Added for compatibility
  createdAt?: Date; // Added for compatibility
  updatedAt?: Date; // Added for compatibility 
  points?: number; // Added for compatibility
}

// Define AI-related type (for useAISimplified.ts)
export interface UseAIReturn {
  isLoading: boolean;
  error: Error | null;
  result: string | null;
  generateText: (prompt: string) => Promise<string>;
  abort: () => void;
  status?: AIStatus;
  isModelLoaded?: boolean;
  loadModel?: () => Promise<void>;
  generateQuestions?: (content: string, contentType: string, count: number, difficulty: string) => Promise<any[]>;
  isProcessing?: boolean;
  generateFlashcards?: (content: string, count: number, difficulty: string) => Promise<any[]>;
  classifyText?: (text: string) => Promise<any[]>;
  getConfidenceScore?: (contentType: string) => number;
}

// Define License type that's used in multiple places
export interface License {
  id: string;
  name: string;
  type: "university" | "k12" | "language-school" | "corporate" | string;
  plan: string;
  seats: number;
  usedSeats: number;
  startDate: string;
  endDate: string;
  status: "active" | "suspended" | "pending" | "expired" | "trial" | string;
  contactName: string;
  contactEmail: string;
  customization: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
    domain?: string;
  };
  value: number;
  renewalStatus: string;
  domain?: string; // Added for compatibility
}

// Define AdUnit and related types
export interface AdSettings {
  enabled: boolean;
  defaultNetwork?: string;
  frequencyCap?: number;
  showToPremiumUsers?: boolean;
  blockList?: string[];
  enableAds?: boolean; // For backward compatibility
  refreshInterval?: number;
  placement?: string[]; // For compatibility
  frequency?: number;  // For compatibility
  userGroupTargeting?: string[]; // For compatibility
  networks?: string[]; // For compatibility with existing code
}

export interface AdUnit {
  id: string;
  name: string;
  type: "banner" | "sidebar" | "interstitial" | "native";
  network: string;
  placement: string;
  active: boolean;
  impressions: number;
  clicks: number;
  revenue: number;
  lastUpdated: Date;
  content: string;
  targetUrl: string;
  impression?: number;
}

// Adding missing components for import errors
export type ContentType = 'flashcards' | 'multiple-choice' | 'listening' | 'writing' | 'speaking' | 'pdf' | string;

// Email Settings interface
export interface EmailSettings {
  provider: string;
  fromEmail: string;
  fromName: string;
  templates: Record<string, any>;
  config?: any;
  temporaryInboxDuration?: any;
}

// QuestionService interfaces
export interface QuestionService {
  getQuestions: (filter?: any) => Promise<Question[]>;
  getQuestionSets?: (filter?: any) => Promise<QuestionSet[]>;
  getQuestionAttempts?: (userId: string) => Promise<any[]>;
  getQuizAttempts?: (userId: string) => Promise<any[]>;
  createQuestion: (question: Partial<Question>) => Promise<Question>;
  createQuestionSet?: (questionSet: Partial<QuestionSet>) => Promise<QuestionSet>;
  updateQuestion: (id: string, question: Partial<Question>) => Promise<Question>;
  updateQuestionSet?: (id: string, questionSet: Partial<QuestionSet>) => Promise<QuestionSet>;
  deleteQuestion: (id: string) => Promise<boolean>;
  deleteQuestionSet?: (id: string) => Promise<boolean>;
  saveQuizAttempt?: (attempt: any) => Promise<any>;
}

// For Email Settings data handling
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

// Weekly Challenge interface
export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  xpReward: number;
  startDate: Date;
  endDate: Date;
  currentProgress: number;
  completed: boolean;
  completedAt: Date;
}
