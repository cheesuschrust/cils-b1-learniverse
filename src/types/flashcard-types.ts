
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian?: string;
  english?: string;
  difficulty: number;
  tags: string[];
  lastReviewed: Date | null;
  nextReview: Date | null;
  createdAt: Date;
  updatedAt?: Date;
  reviewHistory?: ReviewHistory[];
}

export interface FlashcardMetadata {
  id: string;
  setId: string;
  userId: string;
  reviewCount: number;
  correctReviews: number;
  lastReviewResult: boolean;
  mastered: boolean;
  category?: string;
  difficulty: number;
}

export interface ReviewHistory {
  id: string;
  flashcardId: string;
  userId: string;
  reviewDate: Date;
  result: boolean;
  responseTime: number;
  confidence: number;
}

export interface ReviewPerformance {
  score: number;
  time: number;
  date: Date;
}

export function calculateReviewPerformance(answers: any[]): ReviewPerformance {
  if (!answers || !answers.length) {
    return { score: 0, time: 0, date: new Date() };
  }
  
  return {
    score: answers.filter(a => a.isCorrect).length / answers.length * 100,
    time: answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
    date: new Date(),
  };
}

export function normalizeFlashcard(card: any): Flashcard {
  if (!card) return null as any;
  
  return {
    ...card,
    difficulty: typeof card.difficulty === 'number' ? card.difficulty : 1,
    lastReviewed: card.lastReviewed || null,
    nextReview: card.nextReview || null,
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    tags: card.tags || [],
    createdAt: card.createdAt || new Date(),
  };
}
