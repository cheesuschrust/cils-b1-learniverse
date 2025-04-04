
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt?: Date | null;
  progress?: number;
  requiredValue?: number;
  isHidden?: boolean;
}

export interface UserGamification {
  userId: string;
  level: number;
  xp: number;
  streak: number;
  streakFreezeUsed: boolean;
  lastActivity: Date;
  achievements: Achievement[];
  badges: string[];
  nextLevelXp: number;
  currentLevelXp: number;
}

export interface WeeklyProgress {
  date: string;
  xp: number;
  minutesStudied: number;
  activitiesCompleted: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  startDate: Date;
  endDate: Date;
  requirements: ChallengeRequirement[];
  progress: number;
  isCompleted: boolean;
}

export interface ChallengeRequirement {
  type: 'activity_count' | 'xp_earned' | 'streak_days' | 'perfect_score' | 'minutes_studied';
  target: number;
  current: number;
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

export interface DailyGoal {
  target: number;
  current: number;
  type: 'xp' | 'minutes' | 'activities';
  completedDays: string[];
}

export interface Streak {
  current: number;
  longest: number;
  lastMaintained: Date;
  freezesAvailable: number;
}
