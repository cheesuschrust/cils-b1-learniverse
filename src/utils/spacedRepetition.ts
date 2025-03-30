import { Flashcard } from '@/types/interface-fixes';

interface ReviewResult {
  nextReviewDate: Date;
  difficultyFactor: number;
}

/**
 * Calculate the next review date for a flashcard based on spaced repetition algorithm
 * @param correct Whether the answer was correct
 * @param difficultyFactor Current difficulty factor (default 2.5)
 * @param consecutiveCorrect Number of consecutive correct answers
 * @param confidenceAdjustment Optional adjustment based on confidence (0-1)
 */
export function calculateNextReview(
  correct: boolean,
  difficultyFactor: number = 2.5,
  consecutiveCorrect: number = 0,
  confidenceAdjustment: number = 0
): ReviewResult {
  // Default values
  let newDifficultyFactor = difficultyFactor;
  let intervalDays = 1;
  
  if (correct) {
    // If correct, increase the interval based on the SM-2 algorithm
    if (consecutiveCorrect === 0) {
      intervalDays = 1; // First correct answer
    } else if (consecutiveCorrect === 1) {
      intervalDays = 3; // Second correct answer
    } else {
      // For three or more correct answers, use the SM-2 formula
      intervalDays = Math.round(consecutiveCorrect * difficultyFactor);
    }
    
    // Adjust based on confidence if provided
    if (confidenceAdjustment > 0) {
      intervalDays = Math.max(1, Math.round(intervalDays * (1 - confidenceAdjustment)));
    }
    
    // Adjust the difficulty factor (ease) based on performance
    newDifficultyFactor = Math.max(1.3, difficultyFactor + 0.1);
  } else {
    // If incorrect, reset the interval and decrease the difficulty factor
    intervalDays = 1;
    newDifficultyFactor = Math.max(1.3, difficultyFactor - 0.2);
  }
  
  // Calculate the next review date
  const now = new Date();
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(now.getDate() + intervalDays);
  
  return {
    nextReviewDate,
    difficultyFactor: newDifficultyFactor
  };
}

/**
 * Calculate the next review date based on card and performance
 * @param card Flashcard to calculate next review for
 * @param performance Performance data from the review
 * @returns Next review date
 */
export function calculateNextReviewDate(card: Flashcard, performance: { score: number, time?: number, date?: Date }): Date {
  const now = new Date();
  const daysToAdd = Math.max(1, Math.round(card.difficulty * performance.score));
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysToAdd);
  return nextDate;
}

/**
 * Determine if a card is due for review
 * @param card Flashcard to check
 * @returns true if the card is due for review, false otherwise
 */
export function isDueForReview(card: Flashcard | Date): boolean {
  if (!card) return false;
  
  const now = new Date();
  
  if (card instanceof Date) {
    return card <= now;
  }
  
  if (!card.nextReview) return true;
  
  const nextReview = new Date(card.nextReview);
  return nextReview <= now;
}

/**
 * Calculate days until the next review
 * @param card Flashcard to check
 * @returns Number of days until next review, or 0 if overdue
 */
export function daysUntilReview(card: Flashcard | Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  let nextReview: Date;
  
  if (card instanceof Date) {
    nextReview = new Date(card);
  } else {
    if (!card.nextReview) return 0;
    nextReview = new Date(card.nextReview);
  }
  
  nextReview.setHours(0, 0, 0, 0);
  
  const diffTime = nextReview.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Generate a review schedule for a set of flashcards
 * @param flashcards Array of flashcards
 * @returns Review schedule data
 */
export function generateReviewSchedule(flashcards: Flashcard[]): any {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const dueByDate: {[key: string]: number} = {};
  let dueToday = 0;
  let dueThisWeek = 0;
  let dueNextWeek = 0;
  let overdue = 0;
  
  // Calculate the end dates for this week and next week
  const endOfThisWeek = new Date(now);
  endOfThisWeek.setDate(now.getDate() + (6 - now.getDay()));
  
  const endOfNextWeek = new Date(endOfThisWeek);
  endOfNextWeek.setDate(endOfThisWeek.getDate() + 7);
  
  flashcards.forEach(card => {
    if (!card.nextReview) return;
    
    const reviewDate = new Date(card.nextReview);
    const dateKey = reviewDate.toISOString().split('T')[0];
    
    // Count by date
    dueByDate[dateKey] = (dueByDate[dateKey] || 0) + 1;
    
    // Count by time period
    if (reviewDate < now) {
      overdue += 1;
    } else if (reviewDate.toDateString() === now.toDateString()) {
      dueToday += 1;
    } else if (reviewDate <= endOfThisWeek) {
      dueThisWeek += 1;
    } else if (reviewDate <= endOfNextWeek) {
      dueNextWeek += 1;
    }
  });
  
  return {
    dueToday,
    dueThisWeek,
    dueNextWeek,
    dueByDate,
    overdue,
    upcoming: dueThisWeek + dueNextWeek,
    totalDue: overdue + dueToday,
    nextWeekCount: dueNextWeek
  };
}

/**
 * Calculate review performance metrics
 * @param response Review response data
 * @returns ReviewPerformance object
 */
export function calculateReviewPerformance(response: any): { 
  score: number,
  time: number, 
  date: Date,
  accuracy: number,
  speed: number, 
  consistency: number,
  retention: number,
  overall: number
} {
  const now = new Date();
  
  return {
    score: response.score || 0,
    time: response.time || 0,
    date: now,
    accuracy: response.accuracy || response.score || 0,
    speed: response.speed || 1,
    consistency: response.consistency || 0.5,
    retention: response.retention || 0.5,
    overall: response.overall || response.score || 0
  };
}

/**
 * Adjust difficulty based on performance
 * @param card Flashcard to adjust
 * @param performance Performance metrics
 * @returns Updated difficulty value
 */
export function adjustDifficulty(card: Flashcard, performance: { score: number }): number {
  // Base difficulty adjustment on score (0-1)
  if (performance.score >= 0.8) {
    // Good performance, make card slightly easier
    return Math.max(1, card.difficulty - 0.1);
  } else if (performance.score <= 0.3) {
    // Poor performance, make card harder
    return Math.min(5, card.difficulty + 0.2);
  }
  // Moderate performance, keep difficulty the same
  return card.difficulty;
}
