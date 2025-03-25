
export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  mastered: boolean;
  level: number;
  tags: string[];
  nextReview: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastReviewed: Date | null;
  explanation?: string; // Optional explanation field
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  creator: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isFavorite: boolean;
  totalCards?: number;
  masteredCards?: number;
  tags?: string[];
}

export interface FlashcardStats {
  total: number;
  mastered: number;
  dueToday: number;
  dueSoon: number;
  averageLevel: number;
}

export interface ImportOptions {
  importSource: 'csv' | 'json' | 'anki' | 'quizlet' | 'manual';
  delimiter?: string;
  hasHeaders?: boolean;
  italianColumn?: number;
  englishColumn?: number;
  tagsColumn?: number;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: number;
  errorMessages: string[];
  cards: Flashcard[];
}

export type ImportFormat = 'csv' | 'json' | 'anki' | 'quizlet' | 'manual';
