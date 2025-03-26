
import { Question, QuizAttempt, ReviewSchedule, ReviewPerformance } from '@/types/question';

/**
 * Calculate the next review date based on user performance
 * @param correct Whether the user answered correctly
 * @param currentFactor Current difficulty factor (defaults to 2.5)
 * @param consecutiveCorrect Number of consecutive correct answers
 * @returns Next review date and updated difficulty factor
 */
export function calculateNextReview(
  correct: boolean,
  currentFactor: number = 2.5,
  consecutiveCorrect: number = 0
): { nextReviewDate: Date; difficultyFactor: number } {
  const now = new Date();
  let days: number;
  let difficultyFactor = currentFactor;
  
  if (!correct) {
    // Reset the interval if answer was incorrect
    days = 1;
    // Decrease difficulty factor but not below 1.3
    difficultyFactor = Math.max(1.3, currentFactor - 0.2);
  } else {
    // SM-2 algorithm for spacing
    if (consecutiveCorrect === 0) {
      days = 1;
    } else if (consecutiveCorrect === 1) {
      days = 3;
    } else {
      // Interval progression based on difficulty factor
      days = Math.round(consecutiveCorrect * currentFactor);
    }
    
    // Increase difficulty factor slightly for correct answers
    difficultyFactor = currentFactor + 0.1;
    
    // Cap difficulty factor at 2.5
    difficultyFactor = Math.min(2.5, difficultyFactor);
  }
  
  // Maximum interval cap at 60 days
  days = Math.min(days, 60);
  
  // Calculate next review date
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(now.getDate() + days);
  
  return { nextReviewDate, difficultyFactor };
}

/**
 * Check if a review is due
 * @param nextReviewDate The date when the next review is due
 * @returns True if review is due, false otherwise
 */
export function isDueForReview(nextReviewDate: Date): boolean {
  const now = new Date();
  return nextReviewDate <= now;
}

/**
 * Calculate days until next review
 * @param nextReviewDate The date when the next review is due
 * @returns Number of days until review is due, null if already due
 */
export function daysUntilReview(nextReviewDate: Date): number | null {
  const now = new Date();
  
  if (nextReviewDate <= now) {
    return null; // Review is already due
  }
  
  const diffTime = nextReviewDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Generate schedule of upcoming reviews
 * @param questions Array of questions with next review dates
 * @returns Schedule of reviews grouped by timeframe
 */
export function generateReviewSchedule(questions: Question[]): ReviewSchedule {
  const now = new Date();
  const oneWeekFromNow = new Date(now);
  oneWeekFromNow.setDate(now.getDate() + 7);
  const twoWeeksFromNow = new Date(now);
  twoWeeksFromNow.setDate(now.getDate() + 14);
  
  // Initialize review schedule
  const schedule: ReviewSchedule = {
    dueToday: 0,
    dueThisWeek: 0,
    dueNextWeek: 0,
    dueByDate: {}
  };
  
  // Filter out questions without review dates
  const reviewQuestions = questions.filter(q => q.nextReviewDate);
  
  // Process each question
  reviewQuestions.forEach(question => {
    if (!question.nextReviewDate) return;
    
    const reviewDate = new Date(question.nextReviewDate);
    const dateString = reviewDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Update counts by timeframe
    if (reviewDate <= now) {
      schedule.dueToday++;
    } else if (reviewDate <= oneWeekFromNow) {
      schedule.dueThisWeek++;
    } else if (reviewDate <= twoWeeksFromNow) {
      schedule.dueNextWeek++;
    }
    
    // Update counts by specific date
    if (!schedule.dueByDate[dateString]) {
      schedule.dueByDate[dateString] = 0;
    }
    schedule.dueByDate[dateString]++;
  });
  
  return schedule;
}

/**
 * Calculate review performance metrics
 * @param attempts Array of quiz attempts that were reviews
 * @returns Performance metrics for reviews
 */
export function calculateReviewPerformance(attempts: QuizAttempt[]): ReviewPerformance {
  if (!attempts || attempts.length === 0) {
    return {
      totalReviews: 0,
      correctReviews: 0,
      efficiency: 0,
      streakDays: 0,
      reviewsByCategory: {}
    };
  }
  
  // Initialize performance metrics
  const performance: ReviewPerformance = {
    totalReviews: 0,
    correctReviews: 0,
    efficiency: 0,
    streakDays: 0,
    reviewsByCategory: {}
  };
  
  // Track unique days with reviews
  const uniqueDays = new Set<string>();
  
  // Track categories
  const categoryCounts: Record<string, number> = {};
  
  // Process each attempt
  attempts.forEach(attempt => {
    // Skip non-review attempts
    if (!attempt.isReview) return;
    
    // Update total reviews
    performance.totalReviews += attempt.answers.length;
    
    // Update correct reviews
    const correctAnswers = attempt.answers.filter(a => a.isCorrect);
    performance.correctReviews += correctAnswers.length;
    
    // Track unique days
    if (attempt.completedAt) {
      const dayString = new Date(attempt.completedAt).toISOString().split('T')[0];
      uniqueDays.add(dayString);
    }
    
    // Track categories (assuming attempt has category info)
    const category = attempt.questionSetId; // Use as fallback
    if (!categoryCounts[category]) {
      categoryCounts[category] = 0;
    }
    categoryCounts[category] += attempt.answers.length;
  });
  
  // Calculate efficiency (% correct)
  performance.efficiency = performance.totalReviews > 0 
    ? Math.round((performance.correctReviews / performance.totalReviews) * 100) 
    : 0;
  
  // Set streak days (number of unique days with reviews)
  performance.streakDays = uniqueDays.size;
  
  // Set reviews by category
  performance.reviewsByCategory = categoryCounts;
  
  return performance;
}
