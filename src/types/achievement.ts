
export type AchievementType = 'streak' | 'completion' | 'mastery' | 'exploration' | 'special';

export interface Achievement {
  id: string;
  type: AchievementType;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  progress: number;
  unlocked: boolean;
  date?: Date;
  title?: string;
  points?: number;
  currentValue?: number;
  earnedAt?: Date;
  level?: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  reward: number;
  type: string;
  category: string;
  progress: number;
  currentProgress?: number;
  goal?: number;
  completed?: boolean;
  completedAt?: Date;
}

export interface UserGamification {
  userId: string;
  xp: number;
  level: number;
  streak: number;
  lastActivity: Date;
  achievements: Achievement[];
  weeklyChallenge?: WeeklyChallenge;
  streakDays?: number;
  lifetimeXp?: number;
  weeklyXp?: number;
  longestStreak?: number;
  totalCorrectAnswers?: number;
  totalCompletedReviews?: number;
}

export interface Level {
  level: number;
  minXp: number;
  maxXp: number;
  title: string;
  color: string;
  badge: string;
  benefits: string[];
}

export interface LevelProgressBarProps {
  level: number;
  currentXP: number;
  nextLevelXP: number;
}
