
import { ReactNode } from 'react';

export interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  type: string;
  category: string;
  points: number;
  threshold: number;
  progress: number;
  unlocked: boolean;
  requiredValue?: number;
  unlockedAt?: Date;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  reward: number;  // XP reward amount
  target: number;  // Target value to complete
  progress: number;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  completedAt?: Date;
  icon?: string;
  goal?: number;
}

export interface UserGamification {
  userId: string;
  xp: number;
  level: number;
  achievements: Achievement[];
  streak: number;
  streakDays?: number;
  longestStreak?: number;
  lastActivity: Date;
  lastActivityDate?: Date;
  weeklyXp?: number;
  totalCorrectAnswers?: number;
  totalCompletedReviews?: number;
  weeklyChallenge?: WeeklyChallenge;
  lifetimeXp?: number;
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
  currentXP: number;
  requiredXP: number;
  level: number;
  showLevel?: boolean;
  className?: string;
  nextLevelXP?: number;
}

export interface LevelBadgeProps {
  level: number | string;
  size?: 'sm' | 'default' | 'lg';
  showInfo?: boolean;
  className?: string;
}
