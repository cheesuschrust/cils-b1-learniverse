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

// Add missing Flashcard interface
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  examples?: string[];
  notes?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  lastReviewed?: Date;
  nextReviewDate?: Date;
  reviewCount?: number;
  mastered?: boolean;
}

// Add missing FlashcardSet interface
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

// Add missing FlashcardStats interface
export interface FlashcardStats {
  totalReviews: number;
  correctReviews: number;
  averageResponseTime: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
}

// Add missing FlashcardComponentProps interface
export interface FlashcardComponentProps {
  flashcard: Flashcard;
  onFlip?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onMark?: (status: 'correct' | 'incorrect' | 'hard') => void;
  showControls?: boolean;
  showHints?: boolean;
  autoFlip?: boolean;
  frontLabel?: string;
  backLabel?: string;
}

// Add missing ImportFormat enum
export enum ImportFormat {
  CSV = 'csv',
  JSON = 'json',
  ANKI = 'anki',
  QUIZLET = 'quizlet',
  MANUAL = 'manual'
}

// Add missing SupportTicketExtension interface
export interface SupportTicketExtension {
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
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
}
