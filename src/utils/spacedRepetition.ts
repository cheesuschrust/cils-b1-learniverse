
/**
 * Utility functions for implementing spaced repetition
 */

/**
 * Calculate the next review date based on performance
 * @param isCorrect Whether the answer was correct
 * @param currentFactor Current difficulty factor (1.0-2.5)
 * @param reviewCount Number of times this item has been reviewed
 * @returns Object containing next review date and updated difficulty factor
 */
export function calculateNextReview(
  isCorrect: boolean,
  currentFactor: number = 2.5,
  reviewCount: number = 0
): { nextReviewDate: Date; difficultyFactor: number } {
  // Initialize or adjust difficulty factor
  let difficultyFactor = currentFactor;
  
  if (isCorrect) {
    // Increase factor if correct (max 2.5)
    difficultyFactor = Math.min(difficultyFactor + 0.1, 2.5);
  } else {
    // Decrease factor if incorrect (min 1.0)
    difficultyFactor = Math.max(difficultyFactor - 0.2, 1.0);
    // Reset review count when incorrect
    reviewCount = 0;
  }
  
  // Calculate interval in days
  let intervalDays = 1;
  
  if (isCorrect) {
    // Simple spaced repetition algorithm
    // 1, 3, 7, 14, etc. depending on review count and difficulty factor
    switch (reviewCount) {
      case 0:
        intervalDays = 1;
        break;
      case 1:
        intervalDays = 3;
        break;
      case 2:
        intervalDays = 7;
        break;
      case 3:
        intervalDays = 14;
        break;
      default:
        // For further reviews, scale by difficulty factor
        intervalDays = Math.round(14 * (reviewCount - 2) * difficultyFactor);
        break;
    }
  }
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
  
  return { nextReviewDate, difficultyFactor };
}

/**
 * Check if a question is due for review
 * @param nextReviewDate The scheduled next review date
 * @returns Boolean indicating if review is due
 */
export function isDueForReview(nextReviewDate?: Date): boolean {
  if (!nextReviewDate) return false;
  
  const now = new Date();
  return nextReviewDate <= now;
}

/**
 * Calculate the number of days until the next review
 * @param nextReviewDate The scheduled next review date
 * @returns Number of days until review or null if no date
 */
export function daysUntilReview(nextReviewDate?: Date): number | null {
  if (!nextReviewDate) return null;
  
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to beginning of day for accurate day calculation
  
  const reviewDate = new Date(nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);
  
  const diffTime = reviewDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Get all questions due for review
 * @param questions Array of questions to check
 * @returns Array of questions due for review
 */
export function getDueReviews(questions: Question[]): Question[] {
  return questions.filter(question => isDueForReview(question.nextReviewDate));
}

/**
 * Check if all reviews are completed for today
 * @param questions Array of all questions
 * @returns Boolean indicating if all reviews are complete
 */
export function areAllReviewsComplete(questions: Question[]): boolean {
  return getDueReviews(questions).length === 0;
}

/**
 * Generate review schedule statistics
 * @param questions Array of questions to analyze
 * @returns ReviewSchedule object with due counts
 */
export function generateReviewSchedule(questions: Question[]): ReviewSchedule {
  const now = new Date();
  const oneWeekLater = new Date(now);
  oneWeekLater.setDate(now.getDate() + 7);
  const twoWeeksLater = new Date(now);
  twoWeeksLater.setDate(now.getDate() + 14);
  
  const dueByDate: Record<string, number> = {};
  let dueToday = 0;
  let dueThisWeek = 0;
  let dueNextWeek = 0;
  
  questions.forEach(question => {
    if (!question.nextReviewDate) return;
    
    const reviewDate = new Date(question.nextReviewDate);
    const dateStr = reviewDate.toISOString().split('T')[0];
    
    // Increment count for this date
    if (!dueByDate[dateStr]) {
      dueByDate[dateStr] = 0;
    }
    dueByDate[dateStr]++;
    
    // Update period counts
    if (isDueForReview(question.nextReviewDate)) {
      dueToday++;
    } else if (reviewDate < oneWeekLater) {
      dueThisWeek++;
    } else if (reviewDate < twoWeeksLater) {
      dueNextWeek++;
    }
  });
  
  return {
    dueToday,
    dueThisWeek,
    dueNextWeek,
    dueByDate
  };
}

/**
 * Calculate review performance metrics
 * @param attempts Array of quiz attempts to analyze
 * @returns ReviewPerformance object with metrics
 */
export function calculateReviewPerformance(attempts: QuizAttempt[]): ReviewPerformance {
  // Filter to only include review attempts
  const reviewAttempts = attempts.filter(attempt => attempt.isReview);
  
  // Count by category
  const reviewsByCategory: Record<string, number> = {};
  
  // Calculate metrics
  let totalReviews = 0;
  let correctReviews = 0;
  
  reviewAttempts.forEach(attempt => {
    attempt.answers.forEach(answer => {
      totalReviews++;
      if (answer.isCorrect) {
        correctReviews++;
      }
    });
  });
  
  // Calculate efficiency
  const efficiency = totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0;
  
  // Calculate streak days (simplified)
  const streakDays = calculateStreakDays(reviewAttempts);
  
  return {
    totalReviews,
    correctReviews,
    efficiency,
    streakDays,
    reviewsByCategory
  };
}

/**
 * Calculate streak days for reviews
 * @param attempts Array of quiz attempts
 * @returns Number of consecutive days with reviews
 */
function calculateStreakDays(attempts: QuizAttempt[]): number {
  if (attempts.length === 0) return 0;
  
  // Sort attempts by date
  const sortedAttempts = [...attempts].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
  
  // Get unique dates
  const uniqueDates = new Set<string>();
  sortedAttempts.forEach(attempt => {
    const dateStr = new Date(attempt.startedAt).toISOString().split('T')[0];
    uniqueDates.add(dateStr);
  });
  
  // Convert to array and sort
  const dates = Array.from(uniqueDates).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Count consecutive days
  let streak = 1;
  const today = new Date().toISOString().split('T')[0];
  
  // If no review today, streak is 0
  if (dates[0] !== today) return 0;
  
  for (let i = 0; i < dates.length - 1; i++) {
    const current = new Date(dates[i]);
    const prev = new Date(dates[i + 1]);
    
    const diffDays = Math.round(
      (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export type { Question, QuizAttempt, ReviewSchedule, ReviewPerformance } from "@/types/question";
