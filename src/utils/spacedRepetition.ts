/**
 * Simplified spaced repetition utilities
 */

import { Flashcard } from '@/types/core';
import { isFeatureEnabled } from '@/utils/featureFlags';
import { ErrorCategory, ErrorSeverity, errorMonitoring } from '@/utils/errorMonitoring';

// Calculate next review date based on difficulty and correctness
export const calculateNextReview = (
  correct: boolean,
  difficultyFactor: number = 2.5, 
  consecutiveCorrect: number = 0,
  confidenceAdjustment: number = 0
): { nextReviewDate: Date; difficultyFactor: number } => {
  try {
    // Adjust difficulty factor based on answer
    let newDifficultyFactor = difficultyFactor;
    
    if (correct) {
      // If answered correctly, increase the difficulty factor slightly
      newDifficultyFactor = Math.min(3.0, difficultyFactor + 0.1);
    } else {
      // If answered incorrectly, decrease the difficulty factor 
      newDifficultyFactor = Math.max(1.3, difficultyFactor - 0.2);
    }
    
    // Calculate days until next review
    let daysUntilNextReview: number;
    
    if (!correct) {
      // If answered incorrectly, review again soon
      daysUntilNextReview = 1;
    } else {
      // Calculate days based on consecutive correct answers and difficulty factor
      switch (consecutiveCorrect) {
        case 0: 
          daysUntilNextReview = 1; 
          break;
        case 1: 
          daysUntilNextReview = 3; 
          break;
        case 2: 
          daysUntilNextReview = 7; 
          break;
        case 3: 
          daysUntilNextReview = 14; 
          break;
        case 4: 
          daysUntilNextReview = 30; 
          break;
        default: 
          daysUntilNextReview = 60; 
          break;
      }
      
      // Apply difficulty factor
      daysUntilNextReview = Math.round(daysUntilNextReview * newDifficultyFactor);
      
      // Apply confidence adjustment (reduce interval if confidence is low)
      if (confidenceAdjustment > 0) {
        daysUntilNextReview = Math.max(1, Math.round(daysUntilNextReview * (1 - confidenceAdjustment)));
      }
    }
    
    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilNextReview);
    
    return {
      nextReviewDate,
      difficultyFactor: newDifficultyFactor
    };
  } catch (error) {
    errorMonitoring.captureError(
      error instanceof Error ? error : new Error('Error calculating next review'),
      ErrorSeverity.ERROR,
      ErrorCategory.UNKNOWN,
      { correct, difficultyFactor, consecutiveCorrect }
    );
    
    // Fallback to a simple default in case of error
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      nextReviewDate: tomorrow,
      difficultyFactor: 2.5
    };
  }
};

// Check if a card is due for review
export const isDueForReview = (date: Date): boolean => {
  const now = new Date();
  return date <= now;
};

// Calculate days until review
export const daysUntilReview = (date: Date): number => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Generate review schedule for a set of flashcards
export const generateReviewSchedule = (flashcards: Flashcard[] = []): any => {
  try {
    // Group cards by review date
    const dueByDate: Record<string, number> = {};
    const dueToday: Flashcard[] = [];
    const overdue: Flashcard[] = [];
    const upcoming: Flashcard[] = [];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
    
    flashcards.forEach(card => {
      if (!card.nextReview) return;
      
      const reviewDate = new Date(card.nextReview);
      const dateStr = reviewDate.toISOString().split('T')[0];
      
      // Count cards due on each date
      dueByDate[dateStr] = (dueByDate[dateStr] || 0) + 1;
      
      // Categorize cards
      if (dateStr === today) {
        dueToday.push(card);
      } else if (isDueForReview(reviewDate)) {
        overdue.push(card);
      } else {
        upcoming.push(card);
      }
    });
    
    // Sort upcoming by date
    upcoming.sort((a, b) => {
      const dateA = new Date(a.nextReview || 0);
      const dateB = new Date(b.nextReview || 0);
      return dateA.getTime() - dateB.getTime();
    });
    
    return {
      dueByDate,
      dueToday,
      overdue,
      upcoming,
      totalDue: dueToday.length + overdue.length,
      nextWeekCount: Object.entries(dueByDate)
        .filter(([date]) => {
          const dateObj = new Date(date);
          const diffDays = Math.ceil((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays > 0 && diffDays <= 7;
        })
        .reduce((sum, [_, count]) => sum + count, 0)
    };
  } catch (error) {
    errorMonitoring.captureError(
      error instanceof Error ? error : new Error('Error generating review schedule'),
      ErrorSeverity.ERROR,
      ErrorCategory.UNKNOWN,
      { flashcardsCount: flashcards.length }
    );
    
    // Return empty schedule in case of error
    return {
      dueByDate: {},
      dueToday: [],
      overdue: [],
      upcoming: [],
      totalDue: 0,
      nextWeekCount: 0
    };
  }
};

// Export calculateReviewPerformance function to fix import errors
export const calculateReviewPerformance = (correctCount: number, totalCount: number): number => {
  if (totalCount === 0) return 0;
  return (correctCount / totalCount) * 100;
};

export default {
  calculateNextReview,
  isDueForReview,
  daysUntilReview,
  generateReviewSchedule,
  calculateReviewPerformance
};
