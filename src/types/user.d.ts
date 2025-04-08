
export type UserRole = 'admin' | 'student' | 'teacher' | 'moderator' | 'editor';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type UserSubscription = 'free' | 'premium' | 'enterprise' | 'educational';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  subscription: UserSubscription;
  createdAt?: string;
  lastActive?: string;
  preferences?: {
    language?: string;
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
    accessibility?: {
      highContrast?: boolean;
      reduceMotion?: boolean;
      fontSize?: 'small' | 'medium' | 'large';
    };
  };
  level?: {
    current: number;
    experience: number;
    nextLevel: number;
  };
  progress?: {
    lessonsCompleted: number;
    vocabularyLearned: number;
    streakDays: number;
    lastActivity: string;
  };
  metadata?: Record<string, any>;
}

export interface UserStats {
  totalLessonsCompleted: number;
  totalExercisesCompleted: number;
  averageScore: number;
  timeSpent: number;
  learningStreak: number;
  lastActive: string;
}

export interface UserProgress {
  userId: string;
  course: string;
  lessonsCompleted: number;
  currentLesson: number;
  exercises: {
    completed: number;
    total: number;
  };
  accuracy: number;
  startDate: string;
  lastActivity: string;
}
