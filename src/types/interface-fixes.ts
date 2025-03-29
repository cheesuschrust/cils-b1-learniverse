
// Unified Flashcard type that works across the application
export type Flashcard = {
  id: string;
  front: string;           // Primary content field
  back: string;            // Primary content field
  italian?: string;        // Legacy/compatibility field
  english?: string;        // Legacy/compatibility field
  level: number;           // Required (not optional)
  difficulty?: number;     // Use number type (not string)
  tags: string[];          // Make required
  mastered?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastReviewed?: Date | null;
  nextReview?: Date;
  examples?: string[];
  explanation?: string;
  reviewHistory?: any[];   // For spacedRepetition.ts
  category?: string;
  status?: string;
  audioUrl?: string;
  imageUrl?: string;
};

export interface ImportFormat {
  format: 'csv' | 'json' | 'txt';
  fieldMap: {
    italian: string;
    english: string;
    tags: string;
    level: string;
    mastered: string;
    examples: string;
    explanation: string;
  };
  delimiter?: string;
  hasHeaders: boolean;
}

// Utility function to normalize flashcard data across the application
export function normalizeFlashcard(card: any): Flashcard {
  if (!card) return null as any;
  
  // Always ensure front/back are populated from either direct fields or italian/english
  const front = card.front || card.italian || '';
  const back = card.back || card.english || '';
  
  return {
    id: card.id || '',
    front: front,
    back: back,
    italian: card.italian || front,
    english: card.english || back,
    level: typeof card.level === 'number' ? card.level : 0,
    difficulty: typeof card.difficulty === 'number' ? card.difficulty : 0,
    tags: card.tags || [],
    mastered: !!card.mastered,
    nextReview: card.nextReview || card.dueDate || new Date(),
    createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : new Date(),
    lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
    examples: Array.isArray(card.examples) ? card.examples : [],
    explanation: card.explanation || '',
    category: card.category || '',
    reviewHistory: card.reviewHistory || []
  };
}

// Helper function to calculate review performance
export const calculateReviewPerformance = (correctCount: number, totalCount: number): number => {
  if (totalCount === 0) return 0;
  return (correctCount / totalCount) * 100;
};

// Add any other types or interfaces needed
export interface ReviewPerformance {
  accuracy: number;
  speed: number;
  consistency: number;
  retention: number;
  overall: number;
}

export interface ReviewSchedule {
  overdue: number;
  dueToday: number;
  upcoming: number;
  dueThisWeek: number;
  dueNextWeek: number;
  totalDue: number;
  nextWeekCount: number;
  dueByDate: Record<string, number>;
}
