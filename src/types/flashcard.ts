
export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  level: number;
  mastered: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  nextReview: Date;
  lastReviewed: Date | null;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  examples?: string[];
  notes?: string;
  dueDate?: Date;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  tags: string[];
  creator: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  totalCards: number;
  masteredCards: number;
  isPublic: boolean;
  isFavorite: boolean;
}

export interface FlashcardReviewStats {
  totalReviews: number;
  correctReviews: number;
  masteredCards: number;
  lastReviewDate: Date | null;
  averageLevel: number;
  streakDays: number;
}

export interface ImportFormat {
  format: 'csv' | 'json' | 'anki' | 'custom';
  hasHeaders?: boolean;
  delimiter?: string;
  enclosure?: string;
  mapping?: {
    italian: string | number;
    english: string | number;
    tags?: string | number;
    level?: string | number;
    mastered?: string | number;
    [key: string]: string | number | undefined;
  };
}

export interface ImportOptions {
  format: ImportFormat;
  targetSet?: string;
  createNewSet?: boolean;
  newSetName?: string;
  newSetDescription?: string;
  mergeDuplicates?: boolean;
  skipFirstRow?: boolean;
}

export interface ImportResult {
  success: boolean;
  cardsImported: number;
  cardsSkipped: number;
  errors: string[];
  newSetId?: string;
}
