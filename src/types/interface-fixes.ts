
// This file adds missing interfaces and fixes type errors

// Add missing AIPreference properties
export interface AIPreference {
  defaultModelSize: 'small' | 'medium' | 'large';
  useWebGPU: boolean;
  voiceRate: number;
  voicePitch: number;
  italianVoiceURI: string;
  englishVoiceURI: string;
  defaultLanguage: 'english' | 'italian';
  processOnDevice?: boolean;
  dataCollection?: boolean;
  assistanceLevel?: number;
  autoLoadModels?: boolean;
  cacheModels?: boolean;
  processingSetting?: 'fast' | 'balanced' | 'high-quality';
  optimizationLevel?: number;
  anonymousAnalytics?: boolean;
  contentFiltering?: boolean;
  // Added missing properties from the error message
  enabled?: boolean;
  modelSize?: 'small' | 'medium' | 'large';
  temperature?: number;
  maxTokens?: number;
  voiceEnabled?: boolean;
  responseFormat?: 'markdown' | 'text' | 'json';
  cacheResponses?: boolean;
}

// Extend the ConfidenceIndicatorProps interface
export interface ConfidenceIndicatorProps {
  value?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  score?: number; // Added for compatibility with existing code
  contentType?: string; // Added for compatibility with existing code
  showPercentage?: boolean; // Added from user's input
  indicatorClassName?: string; // Added for backward compatibility
}

// Fix for the Progress component
export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicator?: string;
}

// Add the missing NotificationItemProps properties
export interface NotificationItemPropsExtension {
  onRead: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}

// Add missing SupportTicket properties
export interface SupportTicketExtension {
  assignedTo?: string;
}

// Add missing License properties
export interface LicenseExtension {
  domain: string;
}

// Add missing Toast variant types 
export type ToastVariants = 'default' | 'destructive' | 'success' | 'warning' | 'info';

// Add missing Flashcard Set properties
export interface FlashcardSetExtension {
  tags: string[];
  totalCards?: number;
  masteredCards?: number;
  isPublic: boolean;
  creator: string;
  isFavorite: boolean;
  dueDate?: Date;
}

// Add missing Alert component properties
export interface AlertProps {
  variant?: 'default' | 'destructive' | 'outline' | 'warning' | 'success' | 'info';
}

// Add missing notification type and properties based on error messages
export type NotificationType = 'default' | 'info' | 'success' | 'warning' | 'error' | 'file-processing' | 'system' | 'achievement';

export interface NotificationExtension {
  priority?: 'low' | 'normal' | 'high';
  icon?: string;
  link?: string;
  expiresAt?: Date | string;
}

// Add missing useAI hook return type
export interface UseAIReturn {
  status?: 'idle' | 'loading' | 'ready' | 'error';
  error?: string | null;
  isProcessing?: boolean;
  confidence?: number;
  lastProcessedAt?: Date | null;
  isCacheEnabled?: boolean;
  isModelLoaded?: boolean;
  isEnabled?: boolean;
  toggleAI?: () => boolean;
  loadModel?: (modelType: string) => Promise<boolean>;
  initialize?: (config: any) => Promise<boolean>;
  generateText?: (prompt: string, options?: any) => Promise<string>;
  classifyText?: (text: string) => Promise<any[]>;
  generateQuestions?: (content: string, contentType: string, count?: number, difficulty?: string) => Promise<any[]>;
  processText?: (text: string, processingType: string) => Promise<any>;
  processImage?: (imageUrl: string, prompt: string) => Promise<any>;
  recognizeSpeech?: (audioBlob: Blob, language?: 'it' | 'en') => Promise<string>;
  evaluateSpeech?: (spokenText: string, referenceText: string, language?: 'it' | 'en') => Promise<any>;
  generateSpeechExercises?: (level: string, count?: number, language?: 'it' | 'en') => Promise<any[]>;
  generateFlashcards?: (content: string, count?: number, difficulty?: string) => Promise<any[]>;
  getContentTypeConfidence?: (contentType: string) => number;
  prepareModel?: () => Promise<boolean>;
}

// Add missing User properties from error messages
export interface UserExtension {
  name?: string;
  isAdmin?: boolean;
}

// Add missing ImportResult properties
export interface ImportResultExtension {
  imported?: number;
  failed?: number;
  importedCards?: any[];
}

// Add types for renewal status and license status
export type RenewalStatus = 'pending' | 'in-progress' | 'renewed' | 'expired' | 'not-started';
export type LicenseStatus = 'active' | 'expired' | 'pending' | 'suspended';

// Add missing FlashcardStats interface
export interface FlashcardStats {
  totalReviews: number;
  correctReviews: number;
  averageScore: number;
  streak: number;
  lastReviewDate?: Date;
  total?: number;
}

// Add missing FlashcardComponent props
export interface FlashcardComponentProps {
  flashcard: Flashcard;
  onRating: (id: string, rating: number) => void;
  onSkip: (id: string) => void;
  flipped: boolean;
  onFlip: () => void;
  showPronunciation?: boolean;
  showActions?: boolean;
  onKnown?: (id: string) => void;
  onUnknown?: (id: string) => void;
  className?: string;
}

// Add additional NotificationsContextType properties
export interface NotificationsContextTypeExtension {
  dismissAllNotifications: () => void;
}

// Define Content Type
export type ContentType = 'audio' | 'csv' | 'json' | 'txt' | 'flashcards' | 'listening' | 'writing' | 'speaking' | 'multiple-choice' | 'unknown' | 'pdf';

// Fix AIUtilsContextType by adding missing properties
export interface AIUtilsContextTypeExtension {
  translateText?: (text: string, targetLanguage: string) => Promise<string>;
  isTranslating?: boolean;
  hasActiveMicrophone?: boolean;
  checkMicrophoneAccess?: () => Promise<boolean>;
}

// Add Flashcard interface
export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  level: number;
  mastered: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  nextReview: Date;
  lastReviewed: Date | null;
  explanation?: string;
}

// Add import format type
export type ImportFormat = 'csv' | 'json' | 'anki' | 'quizlet';

// Add missing notification item props
export interface NotificationItemProps {
  notification: any;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}

// Add missing License interface
export interface License {
  id: string;
  name: string;
  type: "university" | "k12" | "language-school" | "corporate";
  plan: string;
  seats: number;
  usedSeats: number;
  startDate: string;
  endDate: string;
  status: LicenseStatus;
  contactName: string;
  contactEmail: string;
  customization: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
    domain: string;
  };
  value: number;
  renewalStatus: RenewalStatus;
  domain: string;
}

// Add missing AI contexts type extensions
export interface NotificationsContextType {
  notifications: any[];
  addNotification: (notification: any) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  dismissAllNotifications: () => void;
}

// Add missing FlashcardSet interface
export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  tags: string[];
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
  totalCards: number;
  masteredCards: number;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  isPublic: boolean;
  creator: string;
  isFavorite: boolean;
  dueDate?: Date;
}
