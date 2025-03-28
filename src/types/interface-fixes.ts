
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

// Add ImportFormat type
export type ImportFormat = 'csv' | 'anki' | 'quizlet' | 'excel' | 'json' | 'txt';

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

// Add ProgressProps interface
export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  // Additional props if needed
}
