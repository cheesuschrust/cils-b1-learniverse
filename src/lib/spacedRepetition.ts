
import { Flashcard, ReviewPerformance, ReviewSchedule } from './interface-fixes';  

export function calculateReviewPerformance(response: any): ReviewPerformance {  
  return {  
    score: typeof response.score === 'number' ? response.score : 0,  
    time: typeof response.time === 'number' ? response.time : 0,  
    date: new Date()  
  };  
}  

export function calculateNextReview(card: Flashcard, performance: ReviewPerformance): Date {  
  const now = new Date();  
  const daysToAdd = Math.max(1, Math.round((card.difficulty || 1) * (performance.score || 1)));  
  const nextDate = new Date(now);  
  nextDate.setDate(now.getDate() + daysToAdd);  
  return nextDate;  
}  

export function isDueForReview(card: Flashcard): boolean {  
  if (!card.nextReview) return true;  
  const nextReview = card.nextReview instanceof Date ? card.nextReview : new Date(card.nextReview);  
  return new Date() >= nextReview;  
}  

export function isPremiumUser(user: any): boolean {  
  return !!user?.isPremiumUser;  
}  

export function getReviewSchedule(card: Flashcard): ReviewSchedule {  
  const now = new Date();  
  const interval = card.difficulty > 0 ? Math.max(1, Math.round(card.difficulty)) : 1;  
  const dueDate = new Date(now);  
  dueDate.setDate(now.getDate() + interval);  
  
  return {  
    interval,  
    dueDate,  
    difficulty: card.difficulty  
  };  
}  
