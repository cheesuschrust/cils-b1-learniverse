
// Re-export all types from specific type files
export * from './interface-fixes';
export * from './component';
export * from './core-types';
export * from './notification';
export * from './ai';

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
}

export interface LevelBadgeProps {
  level: number;
  showInfo?: boolean;
}

export interface SpeakableWordProps {
  word: string;
  language?: string;
  className?: string;
  showTooltip?: boolean;
  tooltipContent?: string;
  onPlayComplete?: () => void;
  autoPlay?: boolean;
  size?: string;
  onClick?: () => void;
  iconOnly?: boolean;
}
