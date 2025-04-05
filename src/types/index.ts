
// Re-export all types from specific type files
export * from './interface-fixes';
export * from './component';
export * from './core-types';
export * from './notification';
export * from './ai';
export * from './achievement';
export * from './user';
export * from './flashcard-types';

// Ensure no conflicting exports from the above interfaces.
// Explicitly export common used types that might otherwise conflict
export { Flashcard } from './flashcard-types';
export { ReviewPerformance } from './core-types';
export { User } from './user';
export { AISettings } from './ai';

// Define interface props for components
export interface FlashcardComponentProps {
  card: any;
  onUpdate?: (card: any) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  onRating?: (rating: number) => void;
  onSkip?: () => void;
  flipped?: boolean;
  onFlip?: () => void;
  showPronunciation?: boolean;
  className?: string;
  showHints?: boolean;
  onKnown?: () => void;
  onUnknown?: () => void;
  iconOnly?: boolean;
}

export interface LevelBadgeProps {
  level: number;
  showInfo?: boolean;
  size?: string; // Optional size for better flexibility
}

export interface SpeakableWordProps {
  word: string;
  language?: string;
  className?: string;
  showTooltip?: boolean;
  tooltipContent?: string;
  onPlayComplete?: () => void;
  autoPlay?: boolean;
  size?: string; // Ensuring uniformity
  onClick?: () => void;
  iconOnly?: boolean;
}

// Define Content Type
export type ContentType = 
  | 'grammar' 
  | 'vocabulary' 
  | 'culture' 
  | 'listening' 
  | 'reading' 
  | 'writing' 
  | 'speaking'
  | 'multiple-choice'
  | 'flashcards';

// Define Italian Test Section
export type ItalianTestSection = 
  | 'grammar' 
  | 'vocabulary' 
  | 'culture' 
  | 'listening' 
  | 'reading' 
  | 'writing' 
  | 'speaking'
  | 'citizenship';
