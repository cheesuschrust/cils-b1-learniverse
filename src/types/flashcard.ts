
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
}
