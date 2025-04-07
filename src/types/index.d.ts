
// Type definitions for the CILS B1 Italian Learning Platform

// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  isPremiumUser?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
  photoURL?: string;
}

// Authentication Types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{success: boolean; error?: string}>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile?: (data: Partial<User>) => Promise<boolean>;
}

// Learning Content Types
export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  language: string;
  category?: string;
  tags?: string[];
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  dueCount?: number;
}

export interface Flashcard {
  id: string;
  setId: string;
  front: string;
  back: string;
  italian: string;
  english: string;
  difficulty: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface FlashcardProgress {
  id: string;
  flashcardId: string;
  userId: string;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
  easeFactor: number;
  intervalDays: number;
  reviewCount: number;
  nextReview: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyQuestion {
  id: string;
  questionText: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation?: string;
  category: string;
  difficulty: string;
  isPremium: boolean;
  questionDate: string;
}

export interface LearningContent {
  id: string;
  title: string;
  content: any;
  contentType: string;
  difficulty?: string;
  tags?: string[];
  categoryId?: string;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  contentId: string;
  completed: boolean;
  score?: number;
  progressPercentage: number;
  timeSpent: number;
  lastActivity: Date;
  answers?: any;
}

export interface UserStats {
  userId: string;
  questionsAnswered: number;
  correctAnswers: number;
  streakDays: number;
  lastActivityDate?: Date;
  readingScore?: number;
  writingScore?: number;
  listeningScore?: number;
  speakingScore?: number;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementName: string;
  achievementType: string;
  description: string;
  achievedAt: Date;
  metadata?: any;
}

// Features and UI Types
export interface FeatureLimits {
  flashcards: {
    free: number;
    premium: number;
  };
  dailyQuestions: {
    free: number;
    premium: number;
  };
  listeningExercises: {
    free: number;
    premium: number;
  };
  writingExercises: {
    free: number;
    premium: number;
  };
  speakingExercises: {
    free: number;
    premium: number;
  };
}

// Configuration for TypeScript modules
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

declare module '*.mp3' {
  const content: string;
  export default content;
}

declare module '*.wav' {
  const content: string;
  export default content;
}
