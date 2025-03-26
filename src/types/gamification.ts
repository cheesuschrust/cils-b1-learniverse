
export type AchievementCategory = 
  | 'learning' 
  | 'streak' 
  | 'mastery' 
  | 'social' 
  | 'challenge' 
  | 'special';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  points: number;
  requiredValue: number;
  currentValue?: number;
  unlockedAt?: Date;
  thresholds?: number[];
  level?: number;
  maxLevel?: number;
}

export interface Level {
  level: number;
  minXp: number;
  maxXp: number;
  title?: string;
}

export interface UserGamification {
  xp: number;
  level: number;
  achievements: UserAchievement[];
  streakDays: number;
  longestStreak: number;
  lastActivityDate?: Date;
  weeklyXp: number;
  totalCorrectAnswers: number;
  totalCompletedReviews: number;
  weeklyChallenge?: WeeklyChallenge;
  lifetimeXp: number;
}

export interface UserAchievement {
  id: string;
  progress: number;
  earnedAt?: Date;
  level?: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentProgress: number;
  xpReward: number;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  displayName?: string;
  avatar?: string;
  xp: number;
  level: number;
  achievements: number;
  streakDays: number;
}
