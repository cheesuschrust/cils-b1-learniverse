
import { isValidDate } from './voice';

/**
 * Performance metrics for flashcard reviews
 */
export interface ReviewPerformance {
  accuracy: number;
  timeTaken: number;
  timestamp: Date;
}

/**
 * History of flashcard reviews
 */
export interface ReviewHistory {
  reviewedAt: Date;
  performance: number;
  timeTaken: number;
  details: ReviewPerformance;
}

/**
 * Metadata for flashcards
 */
export interface FlashcardMetadata {
  created: Date;
  modified: Date;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  source?: string;
}

/**
 * Flashcard with complete information
 */
export interface Flashcard extends FlashcardMetadata {
  id?: string;
  front: string;
  back: string;
  nextReview: Date | null;
  level: number;
  language?: string;
  lastReviewed?: Date;
  reviewHistory: ReviewHistory[];
  streak: number;
  // Legacy support
  italian?: string;
  english?: string;
}

/**
 * Calculates review performance metrics
 */
export const calculateReviewPerformance = (performance: number, timeTaken: number): ReviewPerformance => ({
  accuracy: Math.max(0, Math.min(1, performance)),
  timeTaken: Math.max(0, timeTaken),
  timestamp: new Date()
});

/**
 * Normalizes flashcard data to ensure consistency
 */
export const normalizeFlashcard = (card: Record<string, any>): Flashcard => {
  const now = new Date();
  const parseDate = (date: any): Date | null => {
    if (isValidDate(date)) return date;
    if (!date) return null;
    try {
      const parsed = new Date(date);
      return isValidDate(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  const normalizeReviewHistory = (history: any[]): ReviewHistory[] => {
    if (!Array.isArray(history)) return [];
    return history.map(review => ({
      reviewedAt: parseDate(review.reviewedAt) || now,
      performance: typeof review.performance === 'number' ? Math.max(0, Math.min(1, review.performance)) : 0,
      timeTaken: typeof review.timeTaken === 'number' ? Math.max(0, review.timeTaken) : 0,
      details: {
        accuracy: typeof review.details?.accuracy === 'number' ? Math.max(0, Math.min(1, review.details.accuracy)) : 0,
        timeTaken: typeof review.details?.timeTaken === 'number' ? Math.max(0, review.details.timeTaken) : 0,
        timestamp: parseDate(review.details?.timestamp) || now
      }
    }));
  };

  return {
    id: card.id || undefined,
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    nextReview: parseDate(card.nextReview),
    level: typeof card.level === 'number' ? Math.max(0, card.level) : 0,
    language: card.language || undefined,
    lastReviewed: parseDate(card.lastReviewed),
    created: parseDate(card.created) || now,
    modified: parseDate(card.modified) || now,
    tags: Array.isArray(card.tags) ? card.tags : [],
    difficulty: ['easy', 'medium', 'hard'].includes(card.difficulty) ? card.difficulty : 'medium',
    category: card.category || undefined,
    source: card.source || undefined,
    reviewHistory: normalizeReviewHistory(card.reviewHistory),
    streak: typeof card.streak === 'number' ? Math.max(0, card.streak) : 0,

    // Legacy language fields
    ...(card.italian && { italian: card.italian }),
    ...(card.english && { english: card.english })
  };
};
