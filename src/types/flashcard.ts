
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian?: string;
  english?: string;
  level?: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  nextReview: Date;
  createdAt: Date;
  updatedAt: Date;
  mastered: boolean;
  lastReviewed?: Date | null;
  examples?: string[];
  reviewHistory?: ReviewHistory[];
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  creator: string;
  category?: string;
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ReviewHistory {
  date: Date;
  performance: number;
  timeSpent: number;
}

export interface ReviewPerformance {
  score: number;
  time: number;
  date: Date;
}

export interface FlashcardMetadata {
  totalReviews: number;
  correctReviews: number;
  efficiency: number;
  streakDays: number;
  reviewsByCategory: Record<string, number>;
}

// Helper function to normalize flashcard structure
export function normalizeFlashcard(card: any): Flashcard {
  return {
    id: card.id || crypto.randomUUID(),
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    italian: card.italian || card.front || '',
    english: card.english || card.back || '',
    level: card.level || 0,
    difficulty: determineLevel(card.difficulty),
    tags: card.tags || [],
    nextReview: card.nextReview ? new Date(card.nextReview) : new Date(),
    createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : new Date(),
    mastered: card.mastered || false,
    lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
    examples: card.examples || [],
    reviewHistory: card.reviewHistory || []
  };
}

// Helper function to determine level from numeric difficulty
function determineLevel(difficulty: any): "beginner" | "intermediate" | "advanced" {
  if (typeof difficulty === 'string') {
    const normalized = difficulty.toLowerCase();
    if (normalized === 'beginner' || normalized === 'intermediate' || normalized === 'advanced') {
      return normalized as "beginner" | "intermediate" | "advanced";
    }
  }
  
  // Convert numeric difficulty to level
  if (typeof difficulty === 'number') {
    if (difficulty < 2) return 'beginner';
    if (difficulty < 4) return 'intermediate';
    return 'advanced';
  }
  
  // Default
  return 'intermediate';
}

// Helper function to calculate review performance
export function calculateReviewPerformance(answers: any[]): ReviewPerformance {
  if (!answers || answers.length === 0) {
    return {
      score: 0,
      time: 0,
      date: new Date()
    };
  }
  
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalCount = answers.length;
  const totalTime = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
  
  return {
    score: (correctCount / totalCount) * 100,
    time: totalTime,
    date: new Date()
  };
}
