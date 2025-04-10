
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  iconName: string;
  requirementValue: number;
  unlockedAt?: Date;
  userId: string;
  xpReward: number;
}

export type AchievementType = 
  | 'streak'
  | 'cards_mastered'
  | 'practice_completed'
  | 'time_spent'
  | 'perfect_score'
  | 'consecutive_days'
  | 'grammar_mastery'
  | 'vocabulary_mastery'
  | 'lesson_completion'
  | 'citizenship';

export interface UserLevel {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  totalXpRequired: number;
  title: string;
  benefits: string[];
}

export interface XpActivity {
  id: string;
  userId: string;
  amount: number;
  type: XpActivityType;
  description: string;
  timestamp: Date;
  sourceId?: string;
}

export type XpActivityType = 
  | 'card_review'
  | 'practice_completed'
  | 'streak_bonus'
  | 'achievement_unlocked'
  | 'perfect_score'
  | 'first_login'
  | 'profile_completed'
  | 'share_content'
  | 'feedback_provided'
  | 'grammar_mastery';

export interface Streak {
  userId: string;
  currentCount: number;
  longestCount: number;
  lastActivityDate: Date;
  milestones: StreakMilestone[];
}

export interface StreakMilestone {
  count: number;
  reachedAt: Date;
  bonusXp: number;
}

export interface UserStats {
  userId: string;
  xpTotal: number;
  xpToday: number;
  xpThisWeek: number;
  streakCurrent: number;
  streakLongest: number;
  cardsStudied: number;
  cardsMastered: number;
  practiceCompleted: number;
  minutesStudied: number;
  averageAccuracy: number;
  updatedAt: Date;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'all-time';
  entries: LeaderboardEntry[];
  updatedAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  position: number;
  change?: number; // change in position since last update
}

// Calculate level from XP using a gradually increasing XP requirement
export function calculateLevelFromXp(xp: number): UserLevel {
  // Base XP required for level 1
  const baseXp = 100;
  // Growth factor for XP requirements
  const growthFactor = 1.5;
  
  let level = 0;
  let totalXpRequired = 0;
  let xpForCurrentLevel = baseXp;
  
  while (totalXpRequired + xpForCurrentLevel <= xp) {
    level += 1;
    totalXpRequired += xpForCurrentLevel;
    // Increase XP requirement for next level
    xpForCurrentLevel = Math.round(xpForCurrentLevel * growthFactor);
  }
  
  // If no levels earned yet, display as level 1 with 0/100 XP
  if (level === 0) {
    level = 1;
    xpForCurrentLevel = baseXp;
    totalXpRequired = 0;
  }
  
  // Calculate XP progress towards next level
  const currentXp = xp - totalXpRequired;
  const xpToNextLevel = xpForCurrentLevel;
  
  // Generate level title
  const levelTitles = [
    'Beginner', 'Novice', 'Apprentice', 'Scholar', 'Adept',
    'Expert', 'Master', 'Grandmaster', 'Sage', 'Luminary'
  ];
  
  const titleIndex = Math.min(Math.floor((level - 1) / 5), levelTitles.length - 1);
  const title = `${levelTitles[titleIndex]} ${((level - 1) % 5) + 1}`;
  
  // Define benefits for this level
  const benefits = [
    'Access to basic features',
    level >= 5 ? 'Unlock daily challenges' : '',
    level >= 10 ? 'Unlock advanced topics' : '',
    level >= 15 ? 'Unlock custom practice sets' : '',
    level >= 20 ? 'Unlock offline mode' : '',
  ].filter(Boolean);
  
  return {
    level,
    currentXp,
    xpToNextLevel,
    totalXpRequired: totalXpRequired + xpForCurrentLevel,
    title,
    benefits
  };
}
