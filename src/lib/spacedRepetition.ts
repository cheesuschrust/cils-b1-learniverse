// Fix import path to correctly point to the types  
import { Flashcard, ReviewPerformance, ReviewSchedule, User } from '../types/interface-fixes';  

// Fixed to match the ReviewPerformance interface in interface-fixes.ts  
export function calculateReviewPerformance(response: any): ReviewPerformance {  
  return {  
    score: typeof response.score === 'number' ? response.score : 0,  
    time: typeof response.time === 'number' ? response.time : 0,  
    date: new Date(),  
    // Add required fields from the interface  
    accuracy: typeof response.accuracy === 'number' ? response.accuracy : 0,  
    speed: typeof response.speed === 'number' ? response.speed : 0,  
    consistency: typeof response.consistency === 'number' ? response.consistency : 0,  
    retention: typeof response.retention === 'number' ? response.retention : 0,  
    overall: typeof response.overall === 'number' ? response.overall : 0  
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

export function isPremiumUser(user: User): boolean {  
  return !!user?.isPremiumUser;  
}  

// Add missing function  
export function hasReachedDailyLimit(user: User): boolean {  
  return !isPremiumUser(user);  
}  

export function getReviewSchedule(card: Flashcard): ReviewSchedule {  
  const now = new Date();  
  const interval = card.difficulty > 0 ? Math.max(1, Math.round(card.difficulty)) : 1;  
  const dueDate = new Date(now);  
  dueDate.setDate(now.getDate() + interval);  
  
  return {  
    interval,  
    dueDate,  
    difficulty: card.difficulty,  
    // Add remaining fields required by the interface  
    overdue: 0,  
    dueToday: 0,  
    upcoming: 0,  
    dueThisWeek: 0,  
    dueNextWeek: 0,  
    totalDue: 0,   
    nextWeekCount: 0,  
    dueByDate: {}  
  };  
}  

// Additional export functions for completeness  
export function getOverdueCards(cards: Flashcard[]): Flashcard[] {  
  return cards.filter(card => isDueForReview(card));  
}  

export function getDueCards(cards: Flashcard[], days: number = 0): Flashcard[] {  
  const now = new Date();  
  const targetDate = new Date(now);  
  targetDate.setDate(now.getDate() + days);  
  
  return cards.filter(card => {  
    if (!card.nextReview) return true;  
    const nextReview = new Date(card.nextReview);  
    return nextReview <= targetDate;  
  });  
}  

export function calculateDueCardsByDate(cards: Flashcard[]): Record<string, number> {  
  const dueByDate: Record<string, number> = {};  
  
  cards.forEach(card => {  
    if (!card.nextReview) return;  
    
    const nextReview = new Date(card.nextReview);  
    const dateKey = nextReview.toISOString().split('T')[0];  
    
    if (!dueByDate[dateKey]) {  
      dueByDate[dateKey] = 0;  
    }  
    
    dueByDate[dateKey]++;  
  });  
  
  return dueByDate;  
}  
