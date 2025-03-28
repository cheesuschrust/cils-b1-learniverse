import { Flashcard } from './flashcard';

export interface FlashcardComponentProps {
  flashcard?: Flashcard;
  card?: Flashcard; // Legacy support
  onFlip?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onMark?: (status: 'correct' | 'incorrect' | 'hard') => void;
  onRating?: (rating: number) => void; // Legacy support
  onSkip?: () => void; // Legacy support
  flipped?: boolean; // Legacy support
  showControls?: boolean;
  showHints?: boolean;
  showPronunciation?: boolean; // Legacy support
  showActions?: boolean; // Legacy support
  onKnown?: () => void; // Legacy support
  onUnknown?: () => void; // Legacy support
  className?: string; // Legacy support
  autoFlip?: boolean;
  frontLabel?: string;
  backLabel?: string;
}

export interface LevelBadgeProps {
  level: number;
  showInfo?: boolean;
}

export interface HoverContentProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  explanation?: string;
}

export interface MultipleChoiceSet {
  id: string;
  title: string;
  description: string;
  questions: MultipleChoiceQuestion[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ImportFormat {
  format: 'csv' | 'json' | 'txt';
  hasHeaders?: boolean;
  delimiter?: string;
  columns?: {
    front?: string | number;
    back?: string | number;
    category?: string | number;
    tags?: string | number;
  };
}

export interface SupportTicketExtension {
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
}

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  label?: string;
  className?: string;
  indicator?: string; // CSS class for the indicator
}

export interface AnalyticsReportProps {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  includeActivity?: boolean;
  includeProgress?: boolean;
  includeStats?: boolean;
}

export interface ReviewSchedule {
  today: number;
  tomorrow: number;
  nextWeek: number;
  later: number;
  dueByDate: Record<string, number>;
}

export interface ReviewPerformance {
  accuracy: number;
  retention: number;
  speed: number;
  consistency: number;
  improvement: number;
  totalReviewed: number;
}
