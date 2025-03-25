
export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  mastered: boolean;
  level: number;
  dueDate: Date;
  lastReviewed?: Date;
  createdAt: Date;
  explanation?: string;
  category?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  language: 'english' | 'italian';
  category: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
}

export interface FlashcardStudySession {
  id: string;
  setId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: Flashcard[];
  cardsCorrect: Flashcard[];
  cardsIncorrect: Flashcard[];
  createdAt: Date;
}

export interface ImportOptions {
  format: 'csv' | 'json' | 'txt';
  hasHeaders?: boolean;
  italianColumn?: string | number;
  englishColumn?: string | number;
  categoryColumn?: string | number;
  delimiter?: string;
}

export interface ImportResult {
  imported: Flashcard[];
  failed: { line: string; reason: string }[];
  totalProcessed: number;
}

export interface FlashcardProgress {
  cardsLearned: number;
  cardsMastered: number;
  streak: number;
  lastStudyDate: Date | null;
  averageAccuracy: number;
  totalReviews: number;
}
