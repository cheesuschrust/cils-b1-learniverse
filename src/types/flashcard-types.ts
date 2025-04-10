
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  examples?: string[];
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt?: Date;
  audioUrl?: string;
  imageUrl?: string;
  setId: string;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  language: string;
  isPublic: boolean;
  isFavorite: boolean;
  userId?: string;
  createdAt: Date;
  updatedAt?: Date;
  cardCount?: number;
  masteredCount?: number;
}

export interface FlashcardProgress {
  id: string;
  userId: string;
  flashcardId: string;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
  easeFactor: number;
  interval: number;
  dueDate: Date;
  lastReviewDate?: Date;
  streak: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ReviewResult {
  flashcardId: string;
  quality: 0 | 1 | 2 | 3 | 4 | 5; // 0=failed, 5=perfect
  timeToAnswer: number; // in milliseconds
  reviewedAt: Date;
}

// Calculate next review date and ease factor based on SM-2 algorithm
export function calculateReviewPerformance(
  progress: FlashcardProgress,
  quality: 0 | 1 | 2 | 3 | 4 | 5
): Partial<FlashcardProgress> {
  // SM-2 algorithm implementation
  let { easeFactor, interval, streak } = progress;
  let newStatus = progress.status;
  
  // Update ease factor - minimum is 1.3
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  
  // Calculate new interval based on quality
  let newInterval = interval;
  
  if (quality < 3) {
    // Failed, reset progress but don't go below 1 day
    newInterval = 1;
    streak = 0;
    newStatus = 'learning';
  } else {
    // Successful recall
    streak += 1;
    
    if (progress.status === 'new') {
      newInterval = 1;
      newStatus = 'learning';
    } else if (progress.status === 'learning') {
      newInterval = 3;
      newStatus = 'reviewing';
    } else {
      // Already in reviewing status, increase interval
      newInterval = Math.round(interval * newEaseFactor);
      
      // Cap at 180 days (6 months)
      if (newInterval > 180) {
        newInterval = 180;
        newStatus = 'mastered';
      }
    }
  }
  
  // Calculate next due date
  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + newInterval);
  
  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    dueDate: nextDueDate,
    status: newStatus,
    streak,
    lastReviewDate: new Date(),
    updatedAt: new Date()
  };
}
