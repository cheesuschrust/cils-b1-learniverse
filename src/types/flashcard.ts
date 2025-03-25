
export type ImportFormat = 'csv' | 'json' | 'txt' | 'anki';

export interface ImportOptions {
  format: ImportFormat;
  separator?: string;
  hasHeader?: boolean;
  italianColumn?: number;
  englishColumn?: number;
  setName?: string;
}

export interface ImportResult {
  success: number;
  failed: number;
  total: number;
  errors: string[];
  importedCards: Flashcard[];
  imported: number; // Added for compatibility
}

export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  explanation?: string;
  example?: string;
  level: number;
  mastered: boolean;
  dueDate: Date;
  setId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastReviewed?: Date;
  nextReviewDate?: Date;
  tags?: string[];
  audio?: string;
  image?: string;
  notes?: string;
}

export interface FlashcardSet {
  id: string;
  name: string;
  title?: string; // Added for compatibility
  description?: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  isPublic: boolean;
  cardCount: number;
  masteredCount: number;
  language: string;
  category: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface FlashcardStudySession {
  id: string;
  userId: string;
  setId: string;
  cards: {
    cardId: string;
    isCorrect: boolean;
    responseTime: number;
  }[];
  startedAt: Date;
  startTime?: Date; // Added for compatibility
  endTime?: Date; // Added for compatibility
  completedAt?: Date;
  score: number;
  timeSpent: number;
  cardsStudied?: number; // Added for compatibility
}
