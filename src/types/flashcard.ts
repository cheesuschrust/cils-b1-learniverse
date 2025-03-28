
// Flashcard related types

export interface Flashcard {
  id: string;
  // Core properties that should always be present
  front: string;
  back: string;
  level: number;
  
  // Review-related properties
  nextReview?: Date;
  lastReviewed?: Date;
  dueDate?: Date;
  
  // Categorization
  tags: string[]; 
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  
  // Status tracking
  status?: 'new' | 'learning' | 'reviewing' | 'mastered';
  mastered?: boolean;
  streak?: number;
  correctReviews?: number;
  totalReviews?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  setId?: string;
  userId?: string;
  
  // Content enrichment
  notes?: string;
  explanation?: string;
  examples?: string[];
  mediaUrl?: string;
  mediaType?: 'image' | 'audio';
  
  // Language specific
  frontLanguage?: 'english' | 'italian';
  backLanguage?: 'english' | 'italian';
  
  // Legacy compatibility
  italian?: string;  // Maps to front if frontLanguage is 'italian'
  english?: string;  // Maps to back if backLanguage is 'english'
  
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
  averageResponseTime?: number;
  masteredCount?: number;
  learningCount?: number;
  newCount?: number;
  averageScore?: number;
  streak?: number;
  lastReviewDate?: Date;
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
  
  // Language specification
  language?: 'english' | 'italian';
  authorId?: string;
  
  // Add any additional fields needed for compatibility
  title?: string;
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
  
  // Additional properties for compatibility with FlashcardStudySession
  setId?: string;
  cardsStudied?: Flashcard[];
  cardsCorrect?: Flashcard[];
  cardsIncorrect?: Flashcard[];
  createdAt?: Date;
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

// Helper functions for data conversion
export const convertToFlashcard = (data: any): Flashcard => {
  const flashcard: Flashcard = {
    id: data.id,
    front: data.front || data.italian || '',
    back: data.back || data.english || '',
    level: data.level || 0,
    nextReview: data.nextReview || data.dueDate || new Date(),
    tags: data.tags || [],
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
  };

  // Copy all other properties that exist in the source
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'front' && key !== 'back' && key !== 'level' && 
        key !== 'nextReview' && key !== 'tags' && key !== 'createdAt' && key !== 'updatedAt') {
      (flashcard as any)[key] = value;
    }
  });

  // Ensure italian/english mapping
  if (data.italian && !flashcard.italian) flashcard.italian = data.italian;
  if (data.english && !flashcard.english) flashcard.english = data.english;
  
  return flashcard;
};

// Function to normalize flashcard data across the application
export const normalizeFlashcard = (card: any): Flashcard => {
  if (!card) return null as any;
  
  const flashcard: Flashcard = {
    id: card.id,
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    level: card.level || 0,
    tags: card.tags || [],
    nextReview: card.nextReview || card.dueDate || new Date(),
    createdAt: new Date(card.createdAt || Date.now()),
    updatedAt: new Date(card.updatedAt || Date.now()),
    mastered: card.mastered || false
  };

  // Handle legacy or alternative property names
  if (card.italian && !flashcard.italian) flashcard.italian = card.italian;
  if (card.english && !flashcard.english) flashcard.english = card.english;
  if (card.dueDate && !flashcard.dueDate) flashcard.dueDate = card.dueDate;
  if (card.lastReviewed) flashcard.lastReviewed = new Date(card.lastReviewed);
  
  return flashcard;
};

// Additional function to convert legacy flashcard objects to the new format
export function convertLegacyFlashcard(legacy: any): Flashcard {
  // Handle legacy flashcards that might only have italian/english properties
  const flashcard: Flashcard = {
    id: legacy.id,
    front: legacy.italian || legacy.front || '',
    back: legacy.english || legacy.back || '',
    level: legacy.level || 0,
    tags: legacy.tags || [],
    createdAt: legacy.createdAt ? new Date(legacy.createdAt) : new Date(),
    updatedAt: legacy.updatedAt ? new Date(legacy.updatedAt) : new Date(),
  };
  
  // Copy over all other properties
  Object.keys(legacy).forEach(key => {
    if (!['id', 'front', 'back'].includes(key)) {
      (flashcard as any)[key] = legacy[key];
    }
  });
  
  // Set legacy mappings for compatibility
  flashcard.italian = legacy.italian;
  flashcard.english = legacy.english;
  
  return flashcard;
}
