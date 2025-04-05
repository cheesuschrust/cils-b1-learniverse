
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian: string;
  english: string;
  explanation?: string;
  difficulty: string | number;
  level: number;
  mastered?: boolean;
  tags: string[];
  nextReview: Date;
  lastReviewed: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  dueDate?: Date;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  language: string;
  category: string;
  difficulty: string;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  cards: Flashcard[];
  totalCards?: number;
  creator?: string;
  masteredCards?: number;
  isFavorite?: boolean;
}

export interface ReviewPerformance {
  score: number;
  time: number;
  date: Date;
  speed?: number;
  efficiency?: number;
  streakDays?: number;
  correctReviews?: number;
  totalReviews?: number;
  reviewsByCategory?: Record<string, number>;
}

export interface ReviewSchedule {
  interval: number;
  dueDate: Date;
  difficulty: number;
  dueToday?: number;
  dueThisWeek?: number;
  dueNextWeek?: number;
  dueByDate?: Record<string, number>;
  upcoming?: Flashcard[];
}

export interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  mastered?: number;
  dueTodayCards: number;
  averageReviewTime: number;
  correctReviewPercentage: number;
  lastActivity: Date | null;
  mostDifficultTag: string | null;
}

export function normalizeFlashcard(data: any): Flashcard {
  return {
    id: data.id || '',
    front: data.front || data.italian || '',
    back: data.back || data.english || '',
    italian: data.italian || data.front || '',
    english: data.english || data.back || '',
    difficulty: data.difficulty || 'intermediate',
    level: data.level || 0,
    tags: data.tags || [],
    nextReview: data.nextReview ? new Date(data.nextReview) : new Date(),
    lastReviewed: data.lastReviewed ? new Date(data.lastReviewed) : null,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    mastered: data.mastered || false,
    explanation: data.explanation || ''
  };
}

export function calculateReviewPerformance(reviews: any[]): ReviewPerformance {
  if (!reviews || reviews.length === 0) {
    return {
      score: 0,
      time: 0,
      date: new Date()
    };
  }

  const totalScore = reviews.reduce((sum, review) => sum + (review.score || 0), 0);
  const totalTime = reviews.reduce((sum, review) => sum + (review.time || 0), 0);
  
  return {
    score: totalScore / reviews.length,
    time: totalTime / reviews.length,
    date: new Date()
  };
}
