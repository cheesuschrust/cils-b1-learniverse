
// This file fixes interface inconsistencies throughout the codebase

export interface Flashcard {
  id: string;
  front?: string;
  back?: string;
  italian?: string;
  english?: string;
  explanation?: string;
  level: number;
  tags: string[];
  mastered?: boolean;
  lastReviewed?: Date;
  nextReview: Date;
  createdAt: Date;
  updatedAt: Date;
  examples?: string[];
  reviewHistory?: Array<{ date: Date, rating: number }>;
  setId?: string;
  difficultyFactor?: number;
  consecutiveCorrect?: number;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  language: string;
  category?: string;
  cards: Flashcard[];
  totalCards: number;
  masteredCards: number;
  creator: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardStats {
  total: number;
  mastered: number;
  learning: number;
  toReview: number;
  avgMasteryTime: number;
  totalReviews: number;
  correctReviews: number;
}

export interface FlashcardComponentProps {
  card: Flashcard;
  onRating?: (rating: number) => void;
  onSkip?: () => void;
  flipped?: boolean;
  onFlip?: () => void;
  showPronunciation?: boolean;
  showActions?: boolean;
  className?: string;
  showHints?: boolean;
  onKnown?: () => void;
  onUnknown?: () => void;
  onUpdate?: (card: Flashcard) => void;
  onDelete?: (id: string) => void;
}

export interface ReviewSchedule {
  dueToday: number;
  dueTomorrow: number;
  dueThisWeek: number;
  dueByDate: Record<string, number>;
  overdue: number;
}
