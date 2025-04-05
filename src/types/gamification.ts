
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
  unlockedAt?: Date;
  requiredValue?: number;
  category?: string;
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
  lastActivityDate?: Date;
  currentStreak?: number;
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

export interface LevelBadgeProps {
  level: number;
  showInfo?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

export interface GamificationContextType {
  userGamification: UserGamification | null;
  levels: Level[];
  isLoading: boolean;
  awardXP: (amount: number, reason?: string) => Promise<void>;
  awardAchievement: (achievementId: string) => Promise<void>;
  getCurrentLevel: (xp: number) => Level;
  getNextLevel: (xp: number) => Level;
  refreshGamification: () => Promise<void>;
  getCurrentStreak?: () => number;
  lastActivity?: Date;
}

// Utility functions
export function createAchievement(
  id: string,
  type: AchievementType,
  name: string,
  description: string,
  icon: string,
  threshold: number,
  title?: string,
  points?: number
): Achievement {
  return {
    id,
    type,
    name,
    description,
    icon,
    threshold,
    progress: 0,
    unlocked: false,
    title,
    points
  };
}
