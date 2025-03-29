import { Flashcard } from '@/types/flashcard';

// Constants for spaced repetition algorithm
const INITIAL_INTERVAL = 1; // 1 day
const EASY_BONUS = 1.3;
const HARD_PENALTY = 0.5;
const MINIMUM_INTERVAL = 1; // 1 day
const MAXIMUM_INTERVAL = 365; // 1 year
const INTERVAL_MODIFIER = 1.0; // Default modifier

/**
 * Calculate the next review date based on performance
 * @param card The flashcard being reviewed
 * @param performance 'again' | 'hard' | 'good' | 'easy'
 * @returns Date object for next review
 */
export function calculateNextReview(
  card: Flashcard,
  performance: 'again' | 'hard' | 'good' | 'easy'
): Date {
  // Get current level or default to 0
  const currentLevel = card.level || 0;
  
  // Calculate new interval based on performance
  let newInterval: number;
  let newLevel: number;
  
  switch (performance) {
    case 'again':
      // Reset to beginning
      newInterval = INITIAL_INTERVAL;
      newLevel = 0;
      break;
    case 'hard':
      // Increase interval but with penalty
      newInterval = Math.max(
        MINIMUM_INTERVAL,
        Math.round((currentLevel || INITIAL_INTERVAL) * HARD_PENALTY)
      );
      newLevel = Math.max(1, currentLevel);
      break;
    case 'good':
      // Standard progression
      if (currentLevel === 0) {
        newInterval = INITIAL_INTERVAL;
      } else if (currentLevel === 1) {
        newInterval = 3; // 3 days
      } else {
        newInterval = Math.round(currentLevel * INTERVAL_MODIFIER);
      }
      newLevel = currentLevel + 1;
      break;
    case 'easy':
      // Faster progression
      if (currentLevel === 0) {
        newInterval = 3; // Skip to 3 days
      } else {
        newInterval = Math.round(currentLevel * EASY_BONUS);
      }
      newLevel = currentLevel + 2;
      break;
    default:
      newInterval = INITIAL_INTERVAL;
      newLevel = currentLevel;
  }
  
  // Cap the interval at the maximum
  newInterval = Math.min(newInterval, MAXIMUM_INTERVAL);
  
  // Calculate the next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);
  
  return nextReview;
}

/**
 * Get cards due for review today
 * @param cards Array of flashcards
 * @returns Array of cards due today
 */
export function getDueCards(cards: Flashcard[]): Flashcard[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return cards.filter(card => {
    const dueDate = card.nextReview || card.dueDate;
    if (!dueDate) return false;
    
    const dueDateObj = new Date(dueDate);
    dueDateObj.setHours(0, 0, 0, 0);
    
    return dueDateObj <= today;
  });
}

/**
 * Calculate review performance based on correct and total counts
 */
export function calculateReviewPerformance(reviews: any[], totalCards: number): number {
  if (!reviews || reviews.length === 0 || totalCards === 0) return 0;
  
  const correctCount = reviews.filter(review => review.isCorrect).length;
  return (correctCount / totalCards) * 100;
}

/**
 * Calculate mastery level based on review history
 * @param card Flashcard to evaluate
 * @returns number between 0-100 representing mastery percentage
 */
export function calculateMasteryLevel(card: Flashcard): number {
  if (!card.reviewHistory || card.reviewHistory.length === 0) {
    return 0;
  }
  
  // Calculate based on level and correct reviews
  const level = card.level || 0;
  const maxLevel = 10; // Maximum level for full mastery
  
  // Basic calculation based on level
  let masteryFromLevel = Math.min(100, (level / maxLevel) * 100);
  
  // Adjust based on review history if available
  if (card.correctReviews !== undefined && card.totalReviews !== undefined && card.totalReviews > 0) {
    const accuracyRate = (card.correctReviews / card.totalReviews) * 100;
    
    // Weighted average: 70% level progress, 30% accuracy
    return (masteryFromLevel * 0.7) + (accuracyRate * 0.3);
  }
  
  return masteryFromLevel;
}

/**
 * Organize cards by their due dates
 * @param cards Array of flashcards
 * @returns Object with cards organized by due date
 */
export function organizeCardsByDueDate(cards: Flashcard[]): Record<string, Flashcard[]> {
  const organized: Record<string, Flashcard[]> = {};
  
  cards.forEach(card => {
    const dueDate = card.nextReview || card.dueDate;
    if (!dueDate) return;
    
    const dateStr = new Date(dueDate).toISOString().split('T')[0];
    
    if (!organized[dateStr]) {
      organized[dateStr] = [];
    }
    
    organized[dateStr].push(card);
  });
  
  return organized;
}

/**
 * Get statistics about the spaced repetition schedule
 * @param cards Array of flashcards
 * @returns Object with statistics
 */
export function getScheduleStats(cards: Flashcard[]): {
  dueToday: number;
  dueThisWeek: number;
  overdue: number;
  averageInterval: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  let dueToday = 0;
  let dueThisWeek = 0;
  let overdue = 0;
  let totalInterval = 0;
  let cardsWithInterval = 0;
  
  cards.forEach(card => {
    const dueDate = card.nextReview || card.dueDate;
    if (!dueDate) return;
    
    const dueDateObj = new Date(dueDate);
    dueDateObj.setHours(0, 0, 0, 0);
    
    if (dueDateObj < today) {
      overdue++;
    } else if (dueDateObj.getTime() === today.getTime()) {
      dueToday++;
    } else if (dueDateObj <= nextWeek) {
      dueThisWeek++;
    }
    
    if (card.level && card.level > 0) {
      totalInterval += card.level;
      cardsWithInterval++;
    }
  });
  
  const averageInterval = cardsWithInterval > 0 ? totalInterval / cardsWithInterval : 0;
  
  return {
    dueToday,
    dueThisWeek,
    overdue,
    averageInterval
  };
}

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

export function generateReviewSchedule(cards: Flashcard[]): any {
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

export default {
  calculateNextReview,
  getDueCards,
  calculateReviewPerformance,
  calculateMasteryLevel,
  organizeCardsByDueDate,
  getScheduleStats,
  daysUntilReview,
  isDueForReview,
  generateReviewSchedule
};
