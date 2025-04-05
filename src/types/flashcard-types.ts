
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
}

export interface ReviewHistory {
  id: string;
  date: Date;
  score: number;
  timeSpent: number;
  responseTime: number;
  isCorrect: boolean;
  difficulty: number;
  interval: number;
  nextReview: Date;
}

export interface FlashcardMetadata {
  source?: string;
  createdBy?: string;
  level?: string;
  priority?: number;
  examples?: string[];
  relatedCardIds?: string[];
  pronunciation?: string;
  audioUrl?: string;
  imageUrl?: string;
  conjugations?: Record<string, string>;
  usage?: string[];
  alternateTranslations?: string[];
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
  reviewHistory?: ReviewHistory[];
  metadata?: FlashcardMetadata;
  mastered?: boolean;
  level?: number;
  explanation?: string;
}

export function normalizeFlashcard(card: any): Flashcard {
  return {
    id: card.id || uuidv4(),
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    italian: card.italian || card.front || '',
    english: card.english || card.back || '',
    difficulty: typeof card.difficulty === 'number' ? card.difficulty : 1,
    tags: Array.isArray(card.tags) ? card.tags : card.tags ? [card.tags] : [],
    lastReviewed: card.lastReviewed instanceof Date ? card.lastReviewed : 
                  card.lastReviewed ? new Date(card.lastReviewed) : null,
    nextReview: card.nextReview instanceof Date ? card.nextReview : 
                card.nextReview ? new Date(card.nextReview) : null,
    createdAt: card.createdAt instanceof Date ? card.createdAt : 
              new Date(card.createdAt || Date.now()),
    updatedAt: card.updatedAt instanceof Date ? card.updatedAt : 
              card.updatedAt ? new Date(card.updatedAt) : undefined,
    reviewHistory: Array.isArray(card.reviewHistory) ? card.reviewHistory : [],
    mastered: card.mastered || false,
    level: card.level || 0,
    explanation: card.explanation || '',
  };
}

export function calculateReviewPerformance(answers: any[]): ReviewPerformance {
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  
  return {
    score: answers.length > 0 ? (correctAnswers / answers.length) * 100 : 0,
    time: answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
    date: new Date(),
    totalReviews: answers.length,
    correctReviews: correctAnswers,
    efficiency: answers.length > 0 ? 
      correctAnswers / (answers.reduce((sum, a) => sum + (a.attempts || 1), 0)) * 100 : 0,
    accuracy: answers.length > 0 ? (correctAnswers / answers.length) * 100 : 0
  };
}
