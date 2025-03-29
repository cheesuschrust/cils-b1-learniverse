
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
export type Flashcard = BaseFlashcard;
export type FlashcardSet = BaseFlashcardSet;
export type FlashcardStats = BaseFlashcardStats;

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

export interface ReviewPerformance {
  accuracy: number;
  speed: number;
  consistency: number;
  retention: number;
  overall: number;
}

export interface ReviewSchedule {
  dueByDate: Record<string, number>;
  dueToday: Flashcard[];
  overdue: Flashcard[];
  upcoming: Flashcard[];
  totalDue: number;
  nextWeekCount: number;
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

