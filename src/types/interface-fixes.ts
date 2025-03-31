
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
  examples?: string[];
  explanation?: string;
  category?: string;
  status?: string;
  audioUrl?: string;
  imageUrl?: string;
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
  onUnknown?: () => void;
}  

export interface ReviewSchedule {  
  interval: number;  
  dueDate: Date;  
  difficulty: number;
  overdue: number;
  upcoming: number;
  totalDue: number;
  nextWeekCount: number;
  dueToday: number;
  dueThisWeek: number;
  dueNextWeek: number;
  dueByDate: Record<string, number>;
}  

export interface ReviewPerformance {  
  score: number;  
  time: number;  
  date: Date;  
  totalReviews?: number;  
  correctReviews?: number;  
  efficiency?: number;  
  streakDays?: number;  
  reviewsByCategory?: Record<string, number>;
  accuracy?: number;
  speed?: number;
  consistency?: number;
  retention?: number;
  overall?: number;
}  

export interface User {  
  id: string;  
  email: string;  
  firstName?: string;  
  lastName?: string;  
  isPremiumUser: boolean;
  role?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  lastActive?: Date;
  status?: string;
  subscription?: string;
  phoneNumber?: string;
  address?: string;
  preferredLanguage?: string;
  isAdmin?: boolean;
  isPremium?: boolean;
  hasCompletedOnboarding?: boolean;
  preferences?: any;
  metrics?: any;
  dailyQuestionCounts?: Record<string, number>;
  usageMetrics?: {
    usedQuestions: number;
    totalQuestions: number;
    completedLessons: number;
  };
}  

export interface AISettings {  
  model: string;  
  temperature: number;  
  maxTokens: number;  
  topP: number;  
  frequencyPenalty: number;  
  presencePenalty: number;  
  stop?: string[];
  showFeedback?: boolean;  
  defaultModelSize?: string;
  voiceRate?: number;
  voicePitch?: number;
  englishVoiceURI?: string;
  italianVoiceURI?: string;
  assistantName?: string;
  enabled?: boolean;
  features?: {
    contentGeneration: boolean;
    contentAnalysis: boolean;
    errorCorrection: boolean;
    personalization: boolean;
    pronunciationHelp: boolean;
    conversationalLearning: boolean;
    progressTracking: boolean;
    difficultyAdjustment: boolean;
    languageTranslation: boolean;
    flashcards?: boolean;
    questions?: boolean;
    listening?: boolean;
    speaking?: boolean;
    writing?: boolean;
    translation?: boolean;
    explanation?: boolean;
    correction?: boolean;
    simplified?: boolean;
  };
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
