
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
  mastered?: boolean;
  level?: number;
  explanation?: string;
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
  cards?: Flashcard[];
  totalCards?: number;
  masteredCards?: number;
  difficulty?: string;
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
  dueToday?: number;
  dueThisWeek?: number;
  dueNextWeek?: number;
  dueByDate?: Record<string, number>;
  overdue?: number;
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
}  

export interface User {  
  id: string;  
  email: string;  
  firstName?: string;  
  lastName?: string;  
  isPremiumUser?: boolean;
  displayName?: string;
  photoURL?: string;
  username?: string;
  address?: string;
  phoneNumber?: string;
  preferredLanguage?: string;
  subscription?: string;
  status?: string;
  lastActive?: Date;
  createdAt?: Date;
  metrics?: {
    totalQuestions: number;
    correctAnswers: number;
    streak: number;
  };
  dailyQuestionCounts?: Record<string, number>;
  avatar?: string;
}  

export interface ImportFormat {
  type: 'csv' | 'json' | 'text' | 'anki' | 'quizlet';
  separator?: string;
  hasHeaders?: boolean;
  delimiter?: string;
  hasHeader?: boolean;
  encoding?: string;
  fieldMap?: {
    italian?: string;
    english?: string;
    tags?: string;
    level?: string;
    mastered?: string;
    examples?: string;
    explanation?: string;
    [key: string]: string | undefined;
  };
}

export interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  newCards: number;
  averageConfidence: number;
  total?: number;
}

export interface UserPreferences {
  theme: string;
  notifications: boolean;
  emailNotifications: boolean;
  language: string;
  difficulty: string;
  onboardingCompleted: boolean;
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

export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function normalizeFields(obj: any): any {
  if (!obj) return obj;
  
  const result: any = {};
  
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      // Skip undefined values
      return;
    }
    
    // Check if the value is a date string
    if (typeof obj[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj[key])) {
      result[key] = new Date(obj[key]);
    } else if (Array.isArray(obj[key])) {
      result[key] = obj[key].map((item: any) => 
        typeof item === 'object' ? normalizeFields(item) : item
      );
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = normalizeFields(obj[key]);
    } else {
      result[key] = obj[key];
    }
  });
  
  return result;
}

export type NotificationType = 
  | 'achievement' 
  | 'streak' 
  | 'flashcard' 
  | 'review' 
  | 'system' 
  | 'feature' 
  | 'promotion'
  | 'update'
  | 'reminder';

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  actions?: NotificationAction[];
  icon?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  link?: string;
  metadata?: Record<string, any>;
}

export interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
  color: string;
}
