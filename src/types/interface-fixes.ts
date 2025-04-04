
export interface SpeakableWordProps {
  word: string;
  language?: string;
  className?: string;
  showTooltip?: boolean;
  tooltipContent?: string;
  onPlayComplete?: () => void;
  autoPlay?: boolean;
  size?: string;
  onClick?: () => void;
}

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
  reviewHistory?: any[];  
}  

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  category?: string;
  language: string;
  tags?: string[];
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface FlashcardComponentProps {  
  card: Flashcard;  
  onUpdate?: (card: Flashcard) => void;  
  onDelete?: (id: string) => void;  
  showActions?: boolean;  
}  

export interface ReviewSchedule {  
  interval: number;  
  dueDate: Date;  
  difficulty: number;  
}  

export interface ReviewPerformance {  
  score: number;  
  time: number;  
  date: Date;  
}  

export interface User {  
  id: string;  
  email: string;  
  firstName?: string;  
  lastName?: string;  
  isPremiumUser: boolean;  
}  

export interface AISettings {  
  model: string;  
  temperature: number;  
  maxTokens: number;  
  topP: number;  
  frequencyPenalty: number;  
  presencePenalty: number;  
  showFeedback?: boolean;  
}

export interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  newCards: number;
  averageConfidence: number;
}

export interface ImportFormat {
  type: 'csv' | 'json' | 'anki' | 'quizlet' | 'text';
  separator?: string;
  hasHeaders?: boolean;
  frontField?: string;
  backField?: string;
  italianField?: string;
  englishField?: string;
  tagsField?: string;
}

export function normalizeFlashcard(card: any): Flashcard {
  return {
    ...card,
    difficulty: typeof card.difficulty === 'number' ? card.difficulty : 1,
    lastReviewed: card.lastReviewed || null,
    nextReview: card.nextReview || null,
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
  };
}

export function calculateReviewPerformance(answers: any[]): ReviewPerformance {
  return {
    score: answers.filter(a => a.isCorrect).length / answers.length * 100,
    time: answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
    date: new Date(),
  };
}
