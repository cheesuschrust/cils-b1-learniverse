
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
  currentValue?: number;
  unlockedAt?: Date;
  earnedAt?: Date;
  date?: Date;
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
  currentProgress?: number;
  goal?: number;
  xpReward?: number;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  completed?: boolean;
  completedAt?: Date;
  icon?: string;
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
  dailyXp?: number;
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
  levelXP?: number;
}

export interface LevelBadgeProps {
  level: number | string;
  size?: 'sm' | 'default' | 'lg';
  showInfo?: boolean;
  className?: string;
}

export interface WeeklyProgress {
  date: string;
  xp: number;
  minutesStudied: number;
  activitiesCompleted: number;
}
