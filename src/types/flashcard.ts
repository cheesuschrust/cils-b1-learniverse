
export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  explanation?: string;
  examples?: string[];
  level: number;
  mastered: boolean;
  lastReviewed?: Date;
  nextReview?: Date;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  tags: string[];
  cards: string[]; // Array of flashcard IDs
  createdAt: Date;
  updatedAt: Date;
  totalCards: number;
  masteredCards: number;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  averageLevel: number;
  dueCards: number;
  reviewStreak: number;
  lastReview?: Date;
  total?: number; // Added for backwards compatibility
  mastered?: number; // Added for backwards compatibility
  dueToday?: number; // Added for backwards compatibility
  reviewHistory: {
    date: Date;
    correct: number;
    incorrect: number;
  }[];
}

export type ImportFormat = 'csv' | 'json' | 'anki' | 'quizlet' | 'txt';

export interface ImportOptions {
  format: ImportFormat;
  hasHeaders?: boolean;
  separator?: string;
  italianColumn?: number;
  englishColumn?: number;
  notesColumn?: number;
  tagColumn?: number;
}

export interface ImportResult {
  successful: number;
  failed: number;
  warnings: string[];
  importedCards: Flashcard[];
  imported?: Flashcard[]; // For backward compatibility
  errors?: string[]; // For backward compatibility
  setId?: string;
}
