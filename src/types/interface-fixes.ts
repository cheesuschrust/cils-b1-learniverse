
// This file provides additional interface definitions needed to fix build errors

import { User } from './user-types';
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

// Add missing interfaces needed throughout the application
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
}

export interface ReviewPerformance {
  accuracy: number;
  speed: number;
  consistency: number;
  retention: number;
  overall: number;
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

export type { Flashcard as BaseFlashcard, FlashcardSet as BaseFlashcardSet, FlashcardStats as BaseFlashcardStats };
