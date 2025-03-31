
import { ReactNode } from 'react';

/**
 * Flashcard model for the application
 * This interface standardizes how flashcards are structured
 */
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian: string;
  english: string;
  explanation?: string;
  level: number;
  difficulty: number;
  mastered: boolean;
  tags: string[];
  examples?: string[];
  createdAt: Date;
  updatedAt: Date;
  nextReview: Date;
  lastReviewed: Date | null;
}

/**
 * Props for the FlashcardComponent
 */
export interface FlashcardComponentProps {
  card: Flashcard;
  onRating?: (rating: number) => void;
  onSkip?: () => void;
  flipped?: boolean;
  onFlip?: () => void;
  showPronunciation?: boolean;
  showActions?: boolean;
  className?: string;
  showHints?: boolean;
  onUnknown?: () => void;
}

/**
 * SpeakableWord props
 */
export interface SpeakableWordProps {
  word: string;
  language?: 'italian' | 'english';
  autoPlay?: boolean;
  iconSize?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onSpeak?: () => void;
  onSpeakComplete?: () => void;
}

/**
 * Review schedule data structure
 */
export interface ReviewSchedule {
  interval: number;
  dueDate: Date;
  difficulty: number;
  overdue: boolean;
  dueToday: number;
  dueThisWeek: number;
  dueNextWeek: number;
  dueByDate: Record<string, number>;
}

/**
 * Review performance data structure
 */
export interface ReviewPerformance {
  score: number;
  time: number;
  date: Date;
  totalReviews: number;
  correctReviews: number;
  efficiency: number;
  streakDays: number;
  reviewsByCategory: Record<string, number>;
}

/**
 * User model
 */
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profileImage?: string;
  createdAt: Date;
  lastLogin?: Date;
  role: 'user' | 'admin' | 'teacher';
  isActive: boolean;
  isEmailVerified: boolean;
  preferences?: any;
  subscription?: string;
}

/**
 * AI Settings
 */
export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  defaultModelSize: string;
  features: {
    contentGeneration: boolean;
    contentAnalysis: boolean;
    errorCorrection: boolean;
    personalization: boolean;
    pronunciationHelp: boolean;
    conversationalLearning: boolean;
    progressTracking: boolean;
    difficultyAdjustment: boolean;
    languageTranslation: boolean;
    flashcards: boolean;
    questions: boolean;
    listening: boolean;
    speaking: boolean;
    writing: boolean;
    translation: boolean;
    explanation: boolean;
    correction: boolean;
    simplified?: boolean;
  };
  italianVoiceURI?: string;
  englishVoiceURI?: string;
  voiceRate?: number;
  voicePitch?: number;
  assistantName?: string;
}

/**
 * Helper function to normalize flashcards with all required properties
 */
export function normalizeFlashcard(card: any): Flashcard {
  // Ensure all required properties exist
  return {
    id: card.id || '',
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    italian: card.italian || card.front || '',
    english: card.english || card.back || '',
    explanation: card.explanation || '',
    level: card.level || 1,
    difficulty: card.difficulty || 0,
    mastered: Boolean(card.mastered),
    tags: Array.isArray(card.tags) ? card.tags : [],
    examples: Array.isArray(card.examples) ? card.examples : [],
    createdAt: card.createdAt instanceof Date ? card.createdAt : new Date(),
    updatedAt: card.updatedAt instanceof Date ? card.updatedAt : new Date(),
    nextReview: card.nextReview instanceof Date ? card.nextReview : new Date(),
    lastReviewed: card.lastReviewed instanceof Date ? card.lastReviewed : null,
  };
}

/**
 * Calculate review performance metrics
 */
export function calculateReviewPerformance(
  totalCards: number, 
  correctCards: number,
  reviewTime: number
): ReviewPerformance {
  const efficiency = totalCards > 0 ? correctCards / totalCards : 0;
  const averageTime = totalCards > 0 ? reviewTime / totalCards : 0;
  
  return {
    score: efficiency * 100,
    time: averageTime,
    date: new Date(),
    totalReviews: totalCards,
    correctReviews: correctCards,
    efficiency: efficiency,
    streakDays: 1, // Default value
    reviewsByCategory: {} // Default empty record
  };
}
