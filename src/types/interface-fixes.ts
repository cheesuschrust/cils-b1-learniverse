
import { ReactNode } from 'react';
import { Notification } from '@/contexts/NotificationsContext';
import { ContentType } from '@/types/contentType';

// Progress component props
export interface ProgressProps extends React.ComponentPropsWithoutRef<"div"> {
  value: number;
  max?: number;
  indicator?: string;
}

// Alert component props
export interface AlertProps {
  variant?: "default" | "destructive" | "outline" | "warning" | "success" | "info" | "secondary";
}

// Notifications context type
export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  dismissAllNotifications: () => void;
  unreadCount: number;
  markAllAsRead: () => void;
  getFileProcessingNotifications: () => Notification[];
}

// Flashcard interfaces
export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  explanation?: string;
  level: number;
  mastered: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  nextReview: Date;
  lastReviewed: Date | null;
  examples?: string[];
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  tags: string[];
  creator: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  totalCards: number;
  masteredCards: number;
  isPublic: boolean;
  isFavorite: boolean;
}

export interface FlashcardStats {
  total: number;
  mastered: number;
  learning: number;
  toReview: number;
  avgMasteryTime: number;
}

export interface FlashcardComponentProps {
  card: Flashcard;
  onFlip?: () => void;
  onNext?: () => void;
  onMastered?: (id: string) => void;
  showControls?: boolean;
  showProgress?: boolean;
  autoFlip?: boolean;
  autoFlipDelay?: number;
  size?: 'sm' | 'md' | 'lg';
  flashcard?: Flashcard;
  onRating?: (card: Flashcard, rating: number) => void;
  onSkip?: () => void;
  flipped?: boolean;
  showPronunciation?: boolean;
  showActions?: boolean;
  onKnown?: () => void;
  onUnknown?: () => void;
  className?: string;
}

// AI Preferences interface
export interface AIPreference {
  enabled: boolean;
  modelSize: string;
  cacheResponses: boolean;
  voiceEnabled: boolean;
  defaultLanguage: 'english' | 'italian' | 'both';
  voiceRate: number;
  voicePitch: number;
  italianVoiceURI: string;
  englishVoiceURI: string;
  defaultModelSize: string;
  useWebGPU: boolean;
  anonymousAnalytics: boolean;
  processOnDevice?: boolean;
  cacheModels?: boolean;
  temperature?: number;
  contentFiltering?: boolean;
  dataCollection?: boolean;
  assistanceLevel?: string;
  processingSetting?: string;
  autoLoadModels?: boolean;
}

// Import format interface
export interface ImportFormat {
  type: 'csv' | 'json' | 'anki' | 'quizlet' | 'excel';
  fieldMap: {
    italian: string;
    english: string;
    tags?: string;
    level?: string;
    mastered?: string;
    examples?: string;
    explanation?: string;
  };
  delimiter?: string;
  hasHeader?: boolean;
}

// Support Ticket interfaces
export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicketExtension {
  assignedTo: string;
  priority: SupportTicketPriority;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  resolution?: string;
  attachments?: string[];
  relatedTickets?: string[];
}

export interface SupportTicketProps extends SupportTicketExtension {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// UseAI hook return type
export interface UseAIReturn {
  generateText: (prompt: string, options?: any) => Promise<string>;
  getConfidenceScore: (text: string, contentType: ContentType) => Promise<number>;
  translateText: (text: string, targetLang: 'english' | 'italian') => Promise<string>;
  checkGrammar: (text: string, lang: 'english' | 'italian') => Promise<{text: string, corrections: any[]}>;
  isLoading: boolean;
  error: Error | null;
  abort: () => void;
  generateFlashcards?: (topic: string, count: number, difficulty: string) => Promise<any[]>;
  isProcessing?: boolean;
  classifyText?: (text: string) => Promise<any>;
  isModelLoaded?: boolean;
  status?: string;
  loadModel?: (modelName: string) => Promise<boolean>;
  generateQuestions?: (content: string, count: number, type: string) => Promise<any[]>;
}

// ConfidenceIndicator props
export interface ConfidenceIndicatorProps {
  score?: number;
  value?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  contentType?: string;
}

// AIUtils context
export interface AIUtilsContextType {
  settings: AIPreference;
  updateSettings: (settings: Partial<AIPreference>) => void;
  speakText: (text: string, language: 'english' | 'italian') => Promise<void>;
  stopSpeaking: () => void;
  voices: SpeechSynthesisVoice[];
  isLoading: boolean;
  isModelLoaded: boolean;
  isProcessing: boolean;
  status: string;
  feedbackSettings: any;
  updateFeedbackSettings: (settings: any) => void;
  confidenceScores: Record<ContentType, number>;
  updateConfidenceScore: (contentType: ContentType, score: number) => void;
  resetSettings: () => void;
  trainingData: any[];
  addTrainingExample: (example: any) => void;
  loadModel: (modelName: string) => Promise<boolean>;
  
  // Extended properties for AIUtils context
  isAIEnabled?: boolean;
  toggleAI?: () => void;
  isSpeaking?: boolean;
  cancelSpeech?: () => void;
  processAudioStream?: (stream: MediaStream) => Promise<void>;
  stopAudioProcessing?: () => void;
  isTranscribing?: boolean;
  hasActiveMicrophone?: boolean;
  checkMicrophoneAccess?: () => Promise<boolean>;
  translateText?: (text: string, targetLang: string) => Promise<string>;
  isTranslating?: boolean;
}
