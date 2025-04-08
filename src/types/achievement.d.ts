
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
