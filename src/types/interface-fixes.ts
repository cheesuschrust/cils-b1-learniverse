// This file fixes any interface compatibility issues between our own types
// and third-party library types

import { ProgressProps as RadixProgressProps } from '@radix-ui/react-progress';

// Extend the RadixProgressProps to include our custom properties
export interface ProgressProps extends RadixProgressProps {
  value: number;
  max?: number;
  indicator?: string;
  indicatorClassName?: string; // Added this property to fix error in GoalTracker
}

// Other interface compatibility fixes can be added here as needed

// Fix for Alert component props to include variant
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'warning' | 'success' | 'info' | 'secondary';
}

// Fix for ConfidenceIndicator component props
export interface ConfidenceIndicatorProps {
  score?: number;
  value?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
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
  total?: number; // Added total property
}

// Expanded FlashcardComponentProps interface to include all needed properties
export interface FlashcardComponentProps {
  flashcard: Flashcard;
  card?: Flashcard; // Legacy property
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

// Expanded ImportFormat enum with additional properties
export interface ImportFormat {
  type?: 'csv' | 'json' | 'anki' | 'quizlet' | 'manual' | 'excel';
  fieldMap?: Record<string, string>;
  hasHeader?: boolean;
  delimiter?: string;
  [key: string]: any;
}

// Add missing SupportTicketExtension interface
export interface SupportTicketExtension {
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
}

// Add missing NotificationsContextType interface
export interface NotificationsContextType {
  notifications: any[];
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
  markAllAsRead?: () => void; // Added missing property
  dismissNotification?: (id: string) => void; // Added missing property
  dismissAllNotifications?: () => void; // Added missing property
  getFileProcessingNotifications?: () => any[]; // Added missing property
}

// Add helper utilities for calculating review performance
export function calculateReviewPerformance(
  correctness: number,
  previousInterval: number = 1
): number {
  // Simple algorithm: if correctness is high, increase interval more
  const baseMultiplier = 1 + correctness;
  return Math.round(previousInterval * baseMultiplier);
}
