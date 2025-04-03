
// Type definitions for the interface fixes

export interface ReviewSchedule {
  dueToday: number;
  dueThisWeek: number;
  dueNextWeek: number;
  dueByDate: Record<string, number>;
  interval?: number;
}

export interface ReviewPerformance {
  totalReviews: number;
  correctReviews: number;
  efficiency: number;
  streakDays: number;
  reviewsByCategory: Record<string, {
    total: number;
    correct: number;
    efficiency: number;
  }>;
  score?: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian: string;
  english: string;
  level: number;
  mastered: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  nextReview: Date;
  lastReviewed: Date | null;
  difficulty: string;
  explanation?: string;
  setId?: string;
  dueDate?: Date;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  tags: string[];
  creator: string;
  difficulty?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  totalCards?: number;
  masteredCards?: number;
  isPublic: boolean;
  isFavorite: boolean;
  language?: string;
}

export interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  dueToday: number;
  averageAccuracy: number;
}

export interface SpeakableWordProps {
  word: string;
  translation?: string;
  showIPA?: boolean;
  autoPlay?: boolean;
  onPronounce?: (correct: boolean, score: number) => void;
}

export interface FlashcardComponentProps {
  flashcard: Flashcard;
  onMark: (correct: boolean) => void;
  showAnswer: boolean;
  toggleShowAnswer: () => void;
  isRevealed?: boolean;
  isLastCard?: boolean;
}

export interface SupportTicketExtension {
  id?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
}

export interface ImportFormat {
  name: string;
  description: string;
  delimiter: string;
  hasHeader: boolean;
  frontField: string;
  backField: string;
  example: string;
}

export interface AnalyticsReportProps {
  user: any;
  period: string;
  data: {
    sessionCount: number;
    totalTimeSpent: number;
    correctAnswers: number;
    totalQuestions: number;
    improvement: number;
    strengths: string[];
    weaknesses: string[];
    recommendedTopics: string[];
  };
}
