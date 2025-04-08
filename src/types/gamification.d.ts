
export type AchievementCategory = 'learning' | 'streak' | 'mastery' | 'social' | 'general';

export interface Achievement {
  id: string;
  name: string;
  nameItalian?: string;
  description: string;
  descriptionItalian?: string;
  category: AchievementCategory;
  points: number;
  progressRequired?: number;
  imageUrl?: string;
  dateUnlocked?: string;
  isHidden?: boolean;
}

export interface AchievementProgress {
  achievementId: string;
  userId: string;
  progress: number;
  isUnlocked: boolean;
  dateUnlocked?: string;
}

export interface GamificationLevel {
  level: number;
  name: string;
  nameItalian?: string;
  description: string;
  descriptionItalian?: string;
  xpRequired: number;
  rewards?: string[];
}

export interface UserGamificationProfile {
  userId: string;
  currentXp: number;
  currentLevel: number;
  achievements: AchievementProgress[];
  streak: {
    current: number;
    longest: number;
    lastActivity: string;
  };
}
