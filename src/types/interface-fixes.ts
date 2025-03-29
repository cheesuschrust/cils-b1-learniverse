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
  first_name?: string;     // Legacy support  
  last_name?: string;      // Legacy support   
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
  type?: string; // Add for compatibility with existing code  
};  

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

// Fixed ReviewPerformance interface to match what spacedRepetition.ts expects  
export interface ReviewPerformance {  
  accuracy: number;  
  speed: number;  
  consistency: number;  
  retention: number;  
  overall: number;  
  score: number;  // Made required (not optional)  
  time: number;   // Made required (not optional)  
  date: Date;     // Made required (not optional)  
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

// Fixed FlashcardComponentProps to ensure card is Flashcard type  
export interface FlashcardComponentProps {  
  flashcard?: Flashcard;  
  card: Flashcard; // Changed from card?: any to card: Flashcard  
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
  onUpdate?: (card: Flashcard) => void;  
  onDelete?: (id: string) => void;  
}  

// Add ProgressProps for the progress component  
export interface ProgressProps {  
  value?: number;  
  max?: number;  
  className?: string;  
  style?: React.CSSProperties;  
  indicatorClassName?: string; // Added to fix progress component errors  
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
  name?: string; // Added for compatibility  
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

// Fixed User interface with required isPremiumUser field  
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
  first_name?: string; // Legacy support  
  last_name?: string;  // Legacy support  
  isPremiumUser: boolean; // Added required field  
}  

// Add SupportTicketExtension interface  
export interface SupportTicketExtension {  
  assignedTo: string;  
  priority: 'high' | 'medium' | 'low' | 'urgent';  
  status: 'open' | 'in-progress' | 'resolved';  
  category: string;  
}  

// Add necessary prop types for the SupportTicketItem component  
export interface SupportTicketProps extends SupportTicketExtension {  
  id: string;  
  title: string;  
  description: string;  
  createdAt: Date;  
  userId: string;  
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
  reportData?: any;  
  onClose?: () => void;  
}  

// Add AISettings interface  
export interface AISettings {  
  model: string;  
  temperature: number;  
  maxTokens: number;  
  topP: number;  
  frequencyPenalty: number;  
  presencePenalty: number;  
  showFeedback?: boolean;  
}  
