
import { isValidDate } from './voice';

/**
 * Review performance metrics
 */
export interface ReviewPerformance {
  accuracy: number;
  speed: number;
  consistency: number;
  retention: number;
  overall: number;
}

/**
 * Review session history record
 */
export interface ReviewHistory {
  date: Date;
  cardsReviewed: number;
  correctCount: number;
  incorrectCount: number;
  avgResponseTime: number;
}

/**
 * Flashcard additional metadata
 */
export interface FlashcardMetadata {
  source?: string;
  notes?: string;
  examples?: string[];
  pronunciation?: string;
  imageUrl?: string;
  audioUrl?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Flashcard model
 */
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  level: number;
  tags: string[];
  nextReview: Date;
  createdAt: Date;
  updatedAt: Date;
  mastered: boolean;
  italian?: string;
  english?: string;
  metadata?: FlashcardMetadata;
  lastReviewed?: Date;
  reviewHistory?: ReviewHistory[];
  reviewCount?: number;
}

/**
 * Calculate review performance based on correct and total counts
 */
export const calculateReviewPerformance = (correctCount: number, totalCount: number): number => {
  if (totalCount === 0) return 0;
  return (correctCount / totalCount) * 100;
};

/**
 * Normalize flashcard data
 */
export const normalizeFlashcard = (card: any): Flashcard => {
  if (!card) return null as any;
  
  return {
    id: card.id || '',
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    level: card.level || 0,
    tags: card.tags || [],
    nextReview: card.nextReview || card.dueDate || new Date(),
    createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : new Date(),
    mastered: card.mastered || false,
    italian: card.italian,
    english: card.english
  };
};
