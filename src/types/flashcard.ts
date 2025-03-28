
// Flashcard related types

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  level: number;
  nextReview: Date;
  tags: string[]; // Required in one implementation but optional in another
  createdAt: Date;
  updatedAt: Date;
  status?: 'new' | 'learning' | 'reviewing' | 'mastered';
  mastered?: boolean;
  lastReviewed?: Date;
  notes?: string;
  setId?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio';
  frontLanguage?: 'english' | 'italian';
  backLanguage?: 'english' | 'italian';
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  streak?: number;
  userId?: string;
  correctReviews?: number;
  totalReviews?: number;
  revisionHistory?: RevisionRecord[];
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

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  tags: string[];
  creator: string;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalCards: number;
  masteredCards: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface RevisionRecord {
  date: Date;
  rating: number; // 0-5 scale or similar
  timeTaken: number; // milliseconds
  level: number; // SRS level after this review
  nextReview: Date;
}

export interface FlashcardReviewSession {
  id: string;
  userId: string;
  cards: Flashcard[];
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  cardsReviewed: number;
  correctAnswers: number;
  sessionType: 'new' | 'review' | 'mixed';
}

export type FlashcardReviewRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface CardReview {
  cardId: string;
  rating: FlashcardReviewRating;
  timeTaken: number; // milliseconds
  date: Date;
  newLevel: number;
  sessionId?: string;
}
