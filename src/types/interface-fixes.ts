
import { ContentType } from './contentType';

// Enhanced Flashcard interface with spacing repetition properties
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  tags: string[];
  language: 'english' | 'italian' | 'both';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
  examples?: string[];
  imageUrl?: string;
  audioUrl?: string;
  created: Date | string;
  lastReviewed?: Date | string;
  nextReview?: Date | string;
  level: number;
  mastered: boolean;
  // Spaced repetition properties
  consecutiveCorrect?: number;
  difficultyFactor?: number;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  tags: string[];
  cards: Flashcard[];
  createdAt: Date | string;
  updatedAt: Date | string;
  totalCards: number;
  masteredCards: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  creator: string;
  isPublic: boolean;
  isFavorite: boolean;
}

export interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  dueTodayCount: number;
  lastStudySession?: Date | string;
  averageAccuracy: number;
  streakDays: number;
  totalReviews: number;
}

export interface FlashcardComponentProps {
  flashcard: Flashcard;
  onAnswer: (correct: boolean, confidence: number) => void;
  showPronunciation?: boolean;
  editable?: boolean;
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (id: string) => void;
}

export interface ImportFormat {
  name: string;
  description: string;
  value: string;
  example: string;
  separator: string;
}

export interface ConfidenceIndicatorProps {
  contentType: ContentType;
  size?: 'sm' | 'md' | 'lg';
}

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'outline';
  className?: string;
}

export interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
}

export interface SupportTicketExtension {
  id: string;
  ticketId: string;
  content: string;
  attachments?: string[];
  createdAt: Date | string;
  createdBy: string;
  isInternal: boolean;
}

// Notifications related interfaces
export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

export interface NotificationAction {
  label: string;
  action: string;
  variant?: 'default' | 'destructive' | 'outline';
  icon?: React.ReactNode;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'achievement';
  icon?: React.ReactNode;
  createdAt: Date | string;
  expiresAt?: Date | string;
  read: boolean;
  category?: string;
  priority?: 'low' | 'normal' | 'high';
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  timestamp: Date | string;
}

// Voice preferences
export interface VoicePreference {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  language: 'english' | 'italian' | 'auto';
}

// AI Settings
export interface AISettingsProps {
  defaultTab?: string;
  showAdvanced?: boolean;
  onSave?: (settings: any) => void;
}
