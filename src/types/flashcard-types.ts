
import { v4 as uuidv4 } from 'uuid';

export interface ReviewPerformance {
  score: number;
  time: number;
  date: Date;
  totalReviews?: number;
  correctReviews?: number;
  efficiency?: number;
  streakDays?: number;
  reviewsByCategory?: Record<string, number>;
  accuracy?: number;
  speed?: number;
  consistency?: number;
  retention?: number;
  overall?: number;
}

export interface ReviewHistory {
  date: Date;
  performance: number;
  timeSpent: number;
}

export interface FlashcardMetadata {
  source?: string;
  contextSentence?: string;
  notes?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  importance?: 'low' | 'medium' | 'high';
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian?: string;
  english?: string;
  difficulty: number;
  tags: string[];
  lastReviewed: Date | null;
  nextReview: Date | null;
  createdAt: Date;
  updatedAt?: Date;
  reviewHistory?: any[];
  level?: number;
  mastered?: boolean;
  examples?: string[];
  explanation?: string;
  category?: string;
  imageUrl?: string;
  audioUrl?: string;
  dueDate?: Date;
}

export interface ReviewSchedule {
  interval: number;
  dueDate: Date;
  difficulty: number;
  dueToday?: number;
  dueThisWeek?: number;
  dueNextWeek?: number;
  dueByDate?: Record<string, number>;
  overdue?: number;
  upcoming?: number;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  language: string;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  user_id?: string;
  category?: string;
  tags?: string[];
  cards?: Flashcard[];
  totalCards?: number;
  masteredCards?: number;
  difficulty?: string;
  creator?: string;
}

export interface ImportFormat {
  type: 'text' | 'json' | 'csv' | 'anki' | 'quizlet';
  front?: string;
  back?: string;
  options?: any;
  hasHeaders?: boolean;
  delimiter?: string;
  hasHeader?: boolean;
  fieldMap?: Record<string, string>;
}

export interface FlashcardStats {
  cardsDue: number;
  newCards: number;
  masteredCards: number;
  totalReviews: number;
  averageScore: number;
  dailyStreak: number;
  total?: number;
  mastered?: number;
  learning?: number;
  toReview?: number;
  avgMasteryTime?: number;
  correctReviews?: number;
}

// Utility function to normalize a flashcard object
export function normalizeFlashcard(card: any): Flashcard {
  if (!card) return null as any;
  
  const now = new Date();
  return {
    id: card.id || uuidv4(),
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    italian: card.italian || card.front || '',
    english: card.english || card.back || '',
    difficulty: typeof card.difficulty === 'number' ? card.difficulty : 1,
    tags: Array.isArray(card.tags) ? card.tags : [],
    lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
    nextReview: card.nextReview ? new Date(card.nextReview) : null,
    createdAt: card.createdAt ? new Date(card.createdAt) : now,
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : undefined,
    reviewHistory: card.reviewHistory || [],
    level: card.level !== undefined ? card.level : 0,
    mastered: !!card.mastered,
    examples: card.examples || [],
    explanation: card.explanation || ''
  };
}

// Utility function to calculate review performance
export function calculateReviewPerformance(answers: any[]): ReviewPerformance {
  return {
    score: answers.filter(a => a.isCorrect).length / answers.length * 100,
    time: answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
    date: new Date(),
  };
}
