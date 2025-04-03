
export type AchievementCategory = 'learning' | 'streak' | 'mastery' | 'social' | 'challenge' | 'special';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  points: number;
  icon?: string;
  createdAt: Date;
  unlockedAt?: Date | null;
  progress?: number;
  threshold?: number;
  secret?: boolean;
}

export interface LevelInfo {
  level: number;
  minXP: number;
  maxXP: number;
  unlocks?: string[];
}

export interface GamificationState {
  xp: number;
  level: number;
  levelProgress: number;
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
  lastActivity: Date | null;
  dailyGoalCompleted: boolean;
  dailyXP: number;
  weeklyXP: number;
  totalXP: number;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  type: 'unlock' | 'content' | 'feature' | 'badge';
  icon?: string;
  unlockedAt?: Date | null;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  progress?: number;
  tasks: ChallengeTask[];
}

export interface ChallengeTask {
  id: string;
  title: string;
  completed: boolean;
  type: 'lesson' | 'quiz' | 'practice' | 'streak' | 'custom';
  requiredValue?: number;
  currentValue?: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  streak: number;
  rank: number;
  isCurrentUser: boolean;
}

export interface WeeklyProgress {
  date: string;
  xp: number;
  minutesStudied: number;
  activitiesCompleted: number;
}

export interface DailyStreak {
  date: string;
  completed: boolean;
}
