
export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  explanation?: string;
  level: number;
  mastered: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  nextReview: Date;
  lastReviewed: Date | null;
  examples?: string[];
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  tags: string[];
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
  totalCards: number;
  masteredCards: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPublic: boolean;
  creator: string;
  isFavorite: boolean;
}

export interface FlashcardStats {
  total: number;
  mastered: number;
  dueToday: number;
  averageLevel: number;
}

export type ImportFormat = 'csv' | 'json' | 'anki';
export interface ImportOptions {
  format: ImportFormat;
  includeExamples?: boolean;
  overwriteExisting?: boolean;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}
