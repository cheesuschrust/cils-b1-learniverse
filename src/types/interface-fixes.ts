
// Extend LevelBadgeProps
export interface LevelBadgeProps {
  level?: number;
  showInfo?: boolean;
  size?: 'sm' | 'md' | 'lg' | string;
}

// Add the FlashcardComponentProps
export interface FlashcardComponentProps {
  flashcard: {
    id: string;
    front?: string;
    back?: string;
    level?: number;
    tags?: string[];
    mastered?: boolean;
    italian?: string;
    english?: string;
  };
  card?: any; // Legacy support
  onFlip?: () => void;
  onRating?: (rating: number) => void;
  onRate?: (rating: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onMark?: (status: 'correct' | 'incorrect' | 'hard') => void;
  onKnown?: () => void; // Legacy support
  onUnknown?: () => void; // Legacy support
  onSkip?: () => void;
  showAnswer?: boolean;
  showRating?: boolean;
  showControls?: boolean;
  showHints?: boolean;
  showPronunciation?: boolean;
  showActions?: boolean;
  className?: string;
  flipped?: boolean;
  autoFlip?: boolean;
  frontLabel?: string;
  backLabel?: string;
}

// Update ImportFormat type to be an interface with extended properties
export interface ImportFormat {
  type?: 'csv' | 'anki' | 'quizlet' | 'excel' | 'json' | 'txt';
  fieldMap?: Record<string, string>;
  hasHeader?: boolean;
  delimiter?: string;
}

// Add SupportTicketExtension interface
export interface SupportTicketExtension {
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  department?: string;
  notes?: string[];
  attachments?: string[];
  history?: {
    timestamp: Date;
    action: string;
    user: string;
    details?: string;
  }[];
}

// Update ProgressProps interface to include indicatorClassName
export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicator?: string;
  indicatorClassName?: string;
}

// Add Flashcard interface
export interface Flashcard {
  id: string;
  // Support both naming conventions
  front?: string;
  back?: string;
  italian?: string;
  english?: string;
  level: number;
  tags: string[];
  mastered?: boolean;
  explanation?: string;
  examples?: string[];
  nextReview?: Date;
  lastReviewed?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Add FlashcardSet interface
export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  tags: string[];
  creator: string;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalCards: number;
  masteredCards: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Add FlashcardStats interface
export interface FlashcardStats {
  total: number;
  mastered: number;
  learning: number;
  toReview: number;
  avgMasteryTime?: number;
  totalReviews?: number;
  correctReviews?: number;
  averageResponseTime?: number;
  masteredCount?: number;
  learningCount?: number;
  newCount?: number;
  averageScore?: number;
  streak?: number;
  lastReviewDate?: Date;
}
