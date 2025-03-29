
// Unified Flashcard type that works across the application
export type Flashcard = {
  id: string;
  front: string;           // Primary content field
  back: string;            // Primary content field
  italian?: string;        // Legacy/compatibility field
  english?: string;        // Legacy/compatibility field
  level: number;           // Required (not optional)
  difficulty: number;      // Use number type (not string)
  tags: string[];          // Make required
  mastered?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastReviewed?: Date | null;
  nextReview?: Date | null;
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
    tags: Array.isArray(card.tags) ? card.tags : [],
    mastered: !!card.mastered,
    nextReview: card.nextReview || card.dueDate || null,
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
  score?: number;
  time?: number;
  date?: Date;
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
  interval?: number;
  dueDate?: Date;
  difficulty?: number;
}

// Add FlashcardComponentProps for the FlashcardComponent
export interface FlashcardComponentProps {
  flashcard?: Flashcard;
  card?: any; // Legacy support
  onFlip?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onMark?: (status: 'correct' | 'incorrect' | 'hard') => void;
  onRating?: (rating: number) => void; // Legacy support
  onSkip?: () => void; // Legacy support
  flipped?: boolean; // Legacy support
  showControls?: boolean;
  showHints?: boolean;
  showPronunciation?: boolean; // Legacy support
  showActions?: boolean; // Legacy support
  onKnown?: () => void; // Legacy support
  onUnknown?: () => void; // Legacy support
  className?: string; // Legacy support
  autoFlip?: boolean;
  frontLabel?: string;
  backLabel?: string;
}

// Add ProgressProps for the progress component
export interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Add FlashcardSet type
export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  language: 'english' | 'italian';
  category: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  creator: string;
  isPublic: boolean;
  isFavorite: boolean;
  totalCards: number;
  masteredCards: number;
  tags: string[];
}

// Add FlashcardStats interface
export interface FlashcardStats {
  total: number;
  mastered: number;
  learning: number;
  toReview: number;
  avgMasteryTime: number;
  totalReviews: number;
  correctReviews: number;
}

// Add User interface for consistency
export interface User {
  id: string;
  email: string;
  firstName: string;  // Use camelCase consistently
  lastName: string;   // Use camelCase consistently
  isVerified?: boolean;
  displayName?: string;
  photoURL?: string;  
  role?: string;
  createdAt?: Date;
  lastActive?: Date;
  settings?: Record<string, any>;
  // Add other user properties as needed
}

// Add SupportTicketExtension interface
export interface SupportTicketExtension {
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  category: string;
}

// Add necessary prop types for the SupportTicketItem component
export interface SupportTicketProps {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: Date;
  userId: string;
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  onStatusChange?: (id: string, status: string) => void;
  onAssigneeChange?: (id: string, assignee: string) => void;
  onPriorityChange?: (id: string, priority: string) => void;
}

// Add AnalyticsReportProps
export interface AnalyticsReportProps {
  userId?: string;
  timeRange?: 'day' | 'week' | 'month' | 'year';
  categories?: string[];
  includeCharts?: boolean;
}
