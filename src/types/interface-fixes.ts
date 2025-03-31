
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
  level?: number;
  mastered?: boolean;
  status?: string;
  explanation?: string;
  examples?: string[];
  imageUrl?: string;
  audioUrl?: string;
  metadata?: FlashcardMetadata;
  category?: string;
}  

export interface FlashcardMetadata {
  source?: string;
  notes?: string;
  examples?: string[];
  pronunciation?: string;
  imageUrl?: string;
  audioUrl?: string;
  difficulty?: string;
}

export interface FlashcardComponentProps {  
  card: Flashcard;  
  onUpdate?: (card: Flashcard) => void;  
  onDelete?: (id: string) => void;  
  showActions?: boolean;
  onRating?: (rating: number) => void;
  onSkip?: () => void;
  flipped?: boolean;
  onFlip?: () => void;
  showPronunciation?: boolean;
  className?: string;
  showHints?: boolean;
  onKnown?: () => void;
  onUnknown?: () => void;
}  

export interface ReviewSchedule {  
  interval: number;  
  dueDate: Date;  
  difficulty: number;
  overdue?: boolean;
  dueToday?: number;
  dueThisWeek?: number;
  dueNextWeek?: number;
  dueByDate?: Record<string, number>;
}  

export interface ReviewPerformance {  
  score: number;  
  time: number;  
  date: Date;
  accuracy?: number;
  speed?: number;
  consistency?: number;
  retention?: number;
  overall?: number;
  totalReviews?: number;
  correctReviews?: number;
  efficiency?: number;
  streakDays?: number;
  reviewsByCategory?: Record<string, number>;
}  

export interface User {  
  id: string;  
  email: string;  
  firstName?: string;  
  lastName?: string;  
  isPremiumUser?: boolean;
  displayName?: string;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  lastActive?: Date;
  role?: string;
  status?: string;
  preferredLanguage?: string;
  hasCompletedOnboarding?: boolean;
}  

export interface AISettings {  
  model: string;  
  temperature: number;  
  maxTokens: number;  
  topP: number;  
  frequencyPenalty: number;  
  presencePenalty: number;  
  showFeedback?: boolean;
  defaultModelSize?: string;
  italianVoiceURI?: string;
  englishVoiceURI?: string;
  voiceRate?: number;
  voicePitch?: number;
  features?: Record<string, boolean>;
  assistantName?: string;
  enabled?: boolean;
}

export interface ImportFormat {
  type: 'csv' | 'json' | 'txt' | 'xlsx';
  delimiter?: string;
  hasHeader?: boolean;
  encoding?: string;
  format?: string;
  fieldMap?: Record<string, string>;
}

export interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  dueToday: number;
  accuracy: number;
  streak: number;
  total?: number;
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
  totalCards?: number;
  masteredCards?: number;
  difficulty?: string;
}

export interface EnhancedErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  errorMonitoringService?: any;
  additionalInfo?: Record<string, any>;
  severity?: string;
  category?: string;
  showDetails?: boolean;
  reportErrors?: boolean;
}

export interface AnalyticsReportProps {
  data: {
    userActivity: {
      totalSessions: number;
      averageSessionLength: number;
      averageQuestionsPerSession: number;
      averageScorePercentage: number;
      optimalTimeOfDay: string;
      completionRate: number;
      timePerQuestion: number;
    };
    progressBySection: Record<string, {
      attempts: number;
      correctAnswers: number;
      percentageCorrect: number;
      timeSpent: number;
    }>;
    weeklyProgress: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
      }[];
    };
  };
  period: 'week' | 'month' | 'year';
  onPeriodChange: (period: 'week' | 'month' | 'year') => void;
}

// Export common utility functions
export function normalizeFlashcard(card: any): Flashcard {
  if (!card) {
    return null as any;
  }
  
  return {
    id: card.id || '',
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    italian: card.italian || card.front || '',
    english: card.english || card.back || '',
    difficulty: typeof card.difficulty === 'number' ? card.difficulty : 1,
    tags: card.tags || [],
    lastReviewed: card.lastReviewed || null,
    nextReview: card.nextReview || null,
    createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : undefined,
    reviewHistory: card.reviewHistory || [],
    level: card.level || 0,
    mastered: card.mastered || false,
    explanation: card.explanation || '',
    examples: card.examples || [],
    imageUrl: card.imageUrl || card.metadata?.imageUrl || '',
    audioUrl: card.audioUrl || card.metadata?.audioUrl || ''
  };
}

export function calculateReviewPerformance(answers: any[]): ReviewPerformance {
  if (!answers || answers.length === 0) {
    return {
      score: 0,
      time: 0,
      date: new Date()
    };
  }
  
  return {
    score: answers.filter(a => a.isCorrect).length / answers.length * 100,
    time: answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
    date: new Date(),
  };
}
