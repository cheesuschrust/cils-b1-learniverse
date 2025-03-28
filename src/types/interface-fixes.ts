
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
  correctOption: string;
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
