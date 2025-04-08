
import { Level } from '@/types/gamification';

// Define the levels and XP requirements
export const LEVELS: Level[] = [
  { level: 1, minXp: 0, maxXp: 100, title: 'Beginner', color: 'blue', badge: 'badge-1', benefits: ['Basic flashcards', 'Daily question'] },
  { level: 2, minXp: 100, maxXp: 250, title: 'Explorer', color: 'green', badge: 'badge-2', benefits: ['5 flashcard sets', '3 daily questions'] },
  { level: 3, minXp: 250, maxXp: 500, title: 'Learner', color: 'yellow', badge: 'badge-3', benefits: ['10 flashcard sets', 'Streak protection'] },
  { level: 4, minXp: 500, maxXp: 1000, title: 'Enthusiast', color: 'orange', badge: 'badge-4', benefits: ['Unlimited flashcards', 'Weekly challenges'] },
  { level: 5, minXp: 1000, maxXp: 2000, title: 'Scholar', color: 'red', badge: 'badge-5', benefits: ['AI feedback', 'Custom study plans'] },
  { level: 6, minXp: 2000, maxXp: 3500, title: 'Linguist', color: 'purple', badge: 'badge-6', benefits: ['Conversation practice', 'Writing analysis'] },
  { level: 7, minXp: 3500, maxXp: 5500, title: 'Maestro', color: 'indigo', badge: 'badge-7', benefits: ['CILS practice tests', 'Priority support'] },
  { level: 8, minXp: 5500, maxXp: 8000, title: 'Virtuoso', color: 'pink', badge: 'badge-8', benefits: ['Mock exams', 'Personalized feedback'] },
  { level: 9, minXp: 8000, maxXp: 12000, title: 'Expert', color: 'emerald', badge: 'badge-9', benefits: ['Expert tips', 'Community recognition'] },
  { level: 10, minXp: 12000, maxXp: Infinity, title: 'Master', color: 'amber', badge: 'badge-10', benefits: ['Master status', 'All features unlocked'] }
];

// Calculate user level based on XP
export function calculateUserLevel(xp: number): number {
  const level = LEVELS.findIndex(l => xp >= l.minXp && xp < l.maxXp);
  return level !== -1 ? level + 1 : LEVELS.length; // Default to max level if not found
}

// Get level information for a given level
export function getLevelInfo(level: number): Level {
  const levelIndex = Math.min(Math.max(level - 1, 0), LEVELS.length - 1);
  return LEVELS[levelIndex];
}

// Calculate level progress for XP progress bar
export function calculateLevelProgress(xp: number) {
  const level = calculateUserLevel(xp);
  const levelInfo = getLevelInfo(level);
  
  const currentLevelXP = levelInfo.minXp;
  const nextLevelXP = levelInfo.maxXp;
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpRequiredForNextLevel = nextLevelXP - currentLevelXP;
  
  const progress = Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100));
  
  return {
    level,
    currentLevelXP: xp,
    nextLevelXP,
    progress,
    levelTitle: levelInfo.title
  };
}

// Calculate XP reward for different activities
export function calculateXpReward(activity: string, difficulty: string = 'normal', isCorrect: boolean = true): number {
  // Base XP values by activity type
  const baseXP = {
    'flashcard': 2,
    'daily-question': 10,
    'listening': 15,
    'reading': 15,
    'writing': 20,
    'speaking': 20,
    'mock-test': 50,
    'streak-login': 5,
    'weekly-challenge': 30
  };
  
  // Difficulty multipliers
  const difficultyMultiplier = {
    'easy': 0.8,
    'normal': 1.0,
    'hard': 1.5,
    'expert': 2.0
  };
  
  // Get base XP for the activity (default to 1 if not found)
  const activityXP = baseXP[activity as keyof typeof baseXP] || 1;
  
  // Get difficulty multiplier (default to 1 if not found)
  const multiplier = difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] || 1;
  
  // Calculate final XP (correct answers get full XP, incorrect get 20%)
  return Math.round(activityXP * multiplier * (isCorrect ? 1 : 0.2));
}

// Check if a streak is maintained
export function isStreakMaintained(lastActivityDate: Date | null, currentDate: Date = new Date()): boolean {
  if (!lastActivityDate) return false;
  
  // Normalize dates to remove time component
  const normalizedLastDate = new Date(lastActivityDate);
  normalizedLastDate.setHours(0, 0, 0, 0);
  
  const normalizedCurrentDate = new Date(currentDate);
  normalizedCurrentDate.setHours(0, 0, 0, 0);
  
  // Calculate time difference in days
  const diffTime = normalizedCurrentDate.getTime() - normalizedLastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Streak is maintained if activity was yesterday or today
  return diffDays === 0 || diffDays === 1;
}
