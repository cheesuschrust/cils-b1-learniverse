
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
    front: string;
    back: string;
    level?: number;
    tags?: string[];
    mastered?: boolean;
    italian?: string;
    english?: string;
  };
  onFlip?: () => void;
  onRate?: (rating: number) => void;
  showAnswer?: boolean;
  showRating?: boolean;
  className?: string;
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
