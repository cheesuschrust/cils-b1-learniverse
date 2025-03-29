
// This file provides additional interface definitions needed to fix build errors

import { User as BaseUser } from './user-types';
import { Flashcard as BaseFlashcard, FlashcardSet as BaseFlashcardSet, FlashcardStats as BaseFlashcardStats } from './flashcard';

export interface AnalyticsReportProps {
  onClose: () => void;
  reportData: {
    dateRange: string;
    activityData: Array<{
      date: string;
      total: number;
      correct: number;
      score: number;
      timeSpent: number;
      attempts: number;
    }>;
    categoryData: Array<{
      name: string;
      correct: number;
      incorrect: number;
      percentage: number;
    }>;
    knowledgeGaps: Array<{
      category: string;
      topic: string;
      correctRate: number;
      recommendedActions: string[];
    }>;
    streak?: {
      currentStreak: number;
      longestStreak: number;
      lastStudyDate: string;
    };
    recommendations: Array<{
      focus: string;
      reason: string;
      resources?: string[];
    }>;
    sessionStats?: {
      totalSessions: number;
      averageSessionLength: number;
      averageQuestionsPerSession: number;
      completionRate: number;
      timePerQuestion: number;
      optimalTimeOfDay: string;
    };
  };
}

// Define the core Flashcard type
export interface Flashcard {
  id: string;
  front: string;           // Primary content field
  back: string;            // Primary content field
  italian?: string;        // Legacy/compatibility field
  english?: string;        // Legacy/compatibility field
  level: number;           // Required (not optional)
  difficulty?: number;     // Use number type (not string)
  tags: string[];
  mastered?: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastReviewed?: Date | null;
  nextReview?: Date;
  reviewHistory?: any[];   // Add for spacedRepetition.ts
  metadata?: FlashcardMetadata;
  category?: string;
  explanation?: string;
  examples?: string[];
  imageUrl?: string;
  audioUrl?: string;
  status?: 'new' | 'learning' | 'reviewing' | 'mastered';
  streak?: number;
  correctReviews?: number;
  totalReviews?: number;
  dueDate?: Date;
}

export interface FlashcardSet {
  id: string;
  title: string;
  name?: string;
  description: string;
  language: 'english' | 'italian';
  category: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  creator: string;
  isPublic: boolean;
  isFavorite: boolean;
  totalCards: number;
  masteredCards: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
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

export interface ReviewSchedule {
  dueByDate: Record<string, number>;
  dueToday: Flashcard[];
  overdue: Flashcard[];
  upcoming: Flashcard[];
  totalDue: number;
  nextWeekCount: number;
  dueThisWeek?: number;
  dueNextWeek?: number;
}

export interface ReviewPerformance {
  accuracy: number;
  speed: number;
  consistency: number;
  retention: number;
  overall: number;
  efficiency?: number;
  totalReviews?: number;
  correctReviews?: number;
  streakDays?: number;
  reviewsByCategory?: Record<string, any>;
}

export interface FlashcardComponentProps {
  flashcard?: Flashcard;
  card?: Flashcard; // Legacy support
  onFlip?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onMark?: (status: 'correct' | 'incorrect' | 'hard') => void;
  onRating?: (rating: number) => void; // Legacy support
  onSkip?: () => void; // Legacy support
  flipped?: boolean; // Legacy support
  showControls?: boolean;
  showHints?: boolean;
  showPronunciation?: boolean; // Legacy support
  showActions?: boolean; // Legacy support
  onKnown?: () => void; // Legacy support
  onUnknown?: () => void; // Legacy support
  className?: string; // Legacy support
  autoFlip?: boolean;
  frontLabel?: string;
  backLabel?: string;
}

export interface ImportFormat {
  format: 'csv' | 'json' | 'txt';
  hasHeaders?: boolean;
  delimiter?: string;
  italianColumn?: string | number;
  englishColumn?: string | number;
  categoryColumn?: string | number;
  type?: 'csv' | 'json' | 'txt'; // For backwards compatibility
  fieldMap?: Record<string, string | number>; // For backwards compatibility
  hasHeader?: boolean; // For backwards compatibility
}

export interface SupportTicketExtension {
  attachments?: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'closed' | 'resolved';
  assignedTo?: string;
}

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'success';
  indicatorClassName?: string;
}

export interface FlashcardMetadata {
  source?: string;
  notes?: string;
  examples?: string[];
  pronunciation?: string;
  imageUrl?: string;
  audioUrl?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ReviewHistory {
  date: Date;
  cardsReviewed: number;
  correctCount: number;
  incorrectCount: number;
  avgResponseTime: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'moderator' | 'teacher' | 'editor';
  isVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
  lastActive?: Date;
  preferences?: Record<string, any>;
  performance?: Record<string, any>;
  status: string;
  subscription: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  preferredLanguage?: string;
  metrics?: {
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
  };
  updatedAt: Date;
}

// Export functions for spaced repetition logic
export function daysUntilReview(card: Flashcard): number {
  if (!card.nextReview) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const reviewDate = new Date(card.nextReview);
  reviewDate.setHours(0, 0, 0, 0);
  const diffTime = reviewDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isDueForReview(card: Flashcard): boolean {
  if (!card.nextReview) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const reviewDate = new Date(card.nextReview);
  reviewDate.setHours(0, 0, 0, 0);
  return reviewDate <= now;
}

export function generateReviewSchedule(cards: Flashcard[]): ReviewSchedule {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  
  const dueByDate: Record<string, number> = {};
  const dueToday: Flashcard[] = [];
  const overdue: Flashcard[] = [];
  const upcoming: Flashcard[] = [];
  let totalDue = 0;
  let nextWeekCount = 0;
  
  cards.forEach(card => {
    if (!card.nextReview) return;
    
    const reviewDate = new Date(card.nextReview);
    reviewDate.setHours(0, 0, 0, 0);
    const dateStr = reviewDate.toISOString().split('T')[0];
    
    if (!dueByDate[dateStr]) {
      dueByDate[dateStr] = 0;
    }
    dueByDate[dateStr]++;
    
    if (reviewDate < now) {
      overdue.push(card);
      totalDue++;
    } else if (reviewDate.getTime() === now.getTime()) {
      dueToday.push(card);
      totalDue++;
    } else if (reviewDate <= nextWeek) {
      upcoming.push(card);
      nextWeekCount++;
    }
  });
  
  return {
    dueByDate,
    dueToday,
    overdue,
    upcoming,
    totalDue,
    nextWeekCount,
    dueThisWeek: totalDue + nextWeekCount,
    dueNextWeek: nextWeekCount
  };
}

export function calculateReviewPerformance(reviews: any[], totalCards: number): number {
  if (!reviews || reviews.length === 0 || totalCards === 0) return 0;
  
  const correctCount = reviews.filter(review => review.isCorrect).length;
  return (correctCount / totalCards) * 100;
}

// Define calculation function for next review date
export function calculateNextReview(isCorrect: boolean, currentFactor: number, consecutiveCorrect: number): { nextReviewDate: Date; difficultyFactor: number } {
  // Base algorithm for spaced repetition
  let difficultyFactor = currentFactor;
  let daysToAdd = 1;
  
  if (isCorrect) {
    // Increase difficulty factor slightly for correct answers
    difficultyFactor = Math.min(2.5, difficultyFactor + 0.1);
    
    // Calculate days until next review based on consecutive correct answers
    if (consecutiveCorrect === 1) {
      daysToAdd = 1;
    } else if (consecutiveCorrect === 2) {
      daysToAdd = 3;
    } else {
      daysToAdd = Math.round(daysToAdd * difficultyFactor);
    }
  } else {
    // Decrease difficulty factor for incorrect answers
    difficultyFactor = Math.max(1.3, difficultyFactor - 0.2);
    daysToAdd = 1; // Reset to 1 day for incorrect answers
  }
  
  // Create next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
  
  return { nextReviewDate, difficultyFactor };
}

export type { Flashcard as BaseFlashcard, FlashcardSet as BaseFlashcardSet, FlashcardStats as BaseFlashcardStats };
