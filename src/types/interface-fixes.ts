
// This file fixes any interface compatibility issues between our own types
// and third-party library types

import { ProgressProps as RadixProgressProps } from '@radix-ui/react-progress';

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
  score?: number;
  value?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  indicatorClassName?: string;
  contentType?: 'writing' | 'speaking' | 'listening' | 'multiple-choice' | 'flashcards';
}

// Fix Flashcard interface to support both old and new properties
export interface Flashcard {
  id: string;
  front?: string; // New property
  back?: string; // New property
  italian?: string; // Old property
  english?: string; // Old property
  examples?: string[];
  notes?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  lastReviewed?: Date;
  nextReviewDate?: Date;
  reviewCount?: number;
  mastered?: boolean;
  level?: number; // Added level property
  nextReview?: Date; // Added nextReview property
  createdAt?: Date; // Added createdAt property
  updatedAt?: Date; // Added updatedAt property
  explanation?: string; // Added explanation property
  dueDate?: Date; // Added for compatibility
}

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
  averageResponseTime: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
  mastered?: number; // Added for compatibility
  total?: number; // Added for compatibility
  learning?: number; // Added for compatibility
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

// Add missing NotificationsContextType interface
export interface NotificationsContextType {
  notifications: any[];
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  dismissAll?: () => void; // Alias for clearAll
  unreadCount: number;
  markAllAsRead?: () => void; // Added missing property
  dismissNotification?: (id: string) => void; // Added missing property
  dismissAllNotifications?: () => void; // Added missing property
  getFileProcessingNotifications?: () => any[]; // Added missing property
}

// Add missing NotificationItemProps
export interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  onAction?: (id: string, actionId: string) => void;
}

// Add missing AISettingsProps interface
export interface AISettingsProps {
  initialSettings?: any;
  onSettingsChange?: (settings: any) => void;
  onClose?: () => void;
}

// Add missing LevelBadgeProps
export interface LevelBadgeProps {
  level?: number;
  size?: string;
  showInfo?: boolean;
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

// Define UseAIReturn interface
export interface UseAIReturn {
  generateText: (prompt: string, options?: any) => Promise<string>;
  getConfidenceScore: (text: string, contentType: string) => Promise<number>;
  translateText?: (text: string, targetLang: 'english' | 'italian') => Promise<string>;
  checkGrammar?: (text: string, lang: 'english' | 'italian') => Promise<{text: string, corrections: any[]}>;
  isLoading?: boolean;
  error: Error | null;
  abort?: () => void;
  generateFlashcards?: (topic: string, count?: number, difficulty?: string) => Promise<any[]>;
  isProcessing?: boolean;
  classifyText?: (text: string) => Promise<any>;
  isModelLoaded?: boolean;
  status?: string;
  loadModel?: (modelName: string) => Promise<boolean>;
  generateQuestions?: (content: string, count?: number, type?: string) => Promise<any[]>;
}

// Define AIServiceInterface and AIServiceOptions
export interface AIServiceOptions {
  maxLength?: number;
  temperature?: number;
  model?: string;
  stream?: boolean;
}

export interface AIServiceInterface {
  generateText(prompt: string, options?: AIServiceOptions): Promise<string>;
  classifyText(text: string): Promise<Array<{ label: string; score: number }>>;
  generateImage?(prompt: string, size?: string): Promise<string>;
  getConfidenceScore(contentType: string): number;
  addTrainingExamples(contentType: string, examples: any[]): number;
  generateFlashcards(topic: string, count?: number, difficulty?: string): Promise<any[]>;
  generateQuestions(content: string, count?: number, type?: string): Promise<any[]>;
  abortRequest(requestId: string): void;
  abortAllRequests(): void;
}

// Toast interface to include duration property
export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number; // Added for compatibility
}

// Add missing ProtectedRouteProps interface
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Define AISetupWizardProps
export interface AISetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

// Export for Jest test utilities
export type ValueType = string | number;

export interface ChatSession {
  id: string;
  userId: string;
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

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
