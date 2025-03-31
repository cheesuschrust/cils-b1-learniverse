
// Common interface definitions and fixes for type compatibility issues

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
  iconOnly?: boolean;
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
  overdue?: boolean;
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
  isPremiumUser?: boolean;  
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

export interface ImportFormat {
  type: 'csv' | 'json' | 'txt' | 'xlsx';
  delimiter?: string;
  hasHeader?: boolean;
  encoding?: string;
}

export interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  dueToday: number;
  accuracy: number;
  streak: number;
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

export interface SupportTicketExtension {
  attachments?: string[];
  priority: 'low' | 'medium' | 'high';
  department: string;
  assignedAgent?: string;
}

export interface SupportTicketProps {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
  assignedTo?: string;
}

export interface SupportTicketUserProps {
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'support';
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorCategory = 'ui' | 'data' | 'auth' | 'network' | 'unknown';

export interface ErrorMonitoringService {
  captureError: (error: Error, context?: any) => void;
  getErrorCount: () => number;
  clearErrors: () => void;
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
