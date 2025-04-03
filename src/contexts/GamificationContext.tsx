
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GamificationState, Achievement, LevelInfo, Challenge } from '@/types/gamification';
import { useToast } from '@/hooks/use-toast';

interface GamificationContextType {
  gamification: GamificationState;
  achievements: Achievement[];
  challenges: Challenge[];
  isLoading: boolean;
  addXP: (amount: number) => void;
  completeAchievement: (id: string) => void;
  incrementDailyStreak: () => void;
  resetDailyXP: () => void;
  updateProgress: (activityType: string, value: number) => void;
  calculateLevel: (xp: number) => { level: number; progress: number; levelXP: number; nextLevelXP: number };
}

// Mock levels data
const levels: LevelInfo[] = [
  { level: 1, minXP: 0, maxXP: 100 },
  { level: 2, minXP: 100, maxXP: 300 },
  { level: 3, minXP: 300, maxXP: 600 },
  { level: 4, minXP: 600, maxXP: 1000 },
  { level: 5, minXP: 1000, maxXP: 2000 },
  { level: 6, minXP: 2000, maxXP: 3500 },
  { level: 7, minXP: 3500, maxXP: 5000 },
  { level: 8, minXP: 5000, maxXP: 7500 },
  { level: 9, minXP: 7500, maxXP: 10000 },
  { level: 10, minXP: 10000, maxXP: 15000 },
];

// Mock achievements data
const mockAchievements: Achievement[] = [
  {
    id: 'achievement1',
    title: 'First Steps',
    description: 'Complete your first lesson',
    category: 'learning',
    points: 100,
    icon: 'trophy',
    createdAt: new Date('2024-01-01'),
    unlockedAt: new Date('2024-01-02'),
  },
  {
    id: 'achievement2',
    title: '7 Day Streak',
    description: 'Study for 7 consecutive days',
    category: 'streak',
    points: 150,
    icon: 'flame',
    createdAt: new Date('2024-01-01'),
    unlockedAt: null,
    progress: 5,
    threshold: 7,
  },
  {
    id: 'achievement3',
    title: 'Grammar Expert',
    description: 'Score 100% on three grammar quizzes',
    category: 'mastery',
    points: 200,
    icon: 'star',
    createdAt: new Date('2024-01-01'),
    unlockedAt: null,
    progress: 1,
    threshold: 3,
  },
  {
    id: 'achievement4',
    title: 'Vocabulary Builder',
    description: 'Learn 100 new words',
    category: 'learning',
    points: 250,
    icon: 'book',
    createdAt: new Date('2024-01-01'),
    unlockedAt: null,
    progress: 65,
    threshold: 100,
  },
];

// Mock initial state
const initialState: GamificationState = {
  xp: 1250,
  level: 5,
  levelProgress: 25,
  achievements: [],
  unlockedAchievements: [],
  currentStreak: 7,
  longestStreak: 12,
  lastActivity: new Date(),
  dailyGoalCompleted: true,
  dailyXP: 150,
  weeklyXP: 750,
  totalXP: 1250
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gamification, setGamification] = useState<GamificationState>(initialState);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Initialize gamification state
  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setGamification(initialState);
      setAchievements(mockAchievements);
      setIsLoading(false);
    }, 1000);
    
    // Check for streak reset
    checkAndResetStreak();
  }, []);
  
  // Calculate level based on XP
  const calculateLevel = (xp: number) => {
    let level = 0;
    let progress = 0;
    let levelXP = 0;
    let nextLevelXP = 0;
    
    for (let i = 0; i < levels.length; i++) {
      if (xp >= levels[i].minXP && xp < levels[i].maxXP) {
        level = levels[i].level;
        levelXP = levels[i].minXP;
        nextLevelXP = levels[i].maxXP;
        progress = ((xp - levelXP) / (nextLevelXP - levelXP)) * 100;
        break;
      }
    }
    
    // If XP is beyond the highest defined level
    if (level === 0 && xp >= levels[levels.length - 1].maxXP) {
      const lastLevel = levels[levels.length - 1];
      level = lastLevel.level + 1;
      levelXP = lastLevel.maxXP;
      nextLevelXP = levelXP * 1.5; // Estimate for the next level
      progress = 0;
    }
    
    return { level, progress, levelXP, nextLevelXP };
  };
  
  // Add XP to the user
  const addXP = (amount: number) => {
    const newXP = gamification.xp + amount;
    const { level, progress } = calculateLevel(newXP);
    const wasLevelUp = level > gamification.level;
    
    setGamification(prev => ({
      ...prev,
      xp: newXP,
      level,
      levelProgress: progress,
      dailyXP: prev.dailyXP + amount,
      weeklyXP: prev.weeklyXP + amount,
      totalXP: prev.totalXP + amount
    }));
    
    if (wasLevelUp) {
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached level ${level}.`,
        variant: "success",
      });
    }
    
    // Check for XP-related achievements
    checkForAchievements();
  };
  
  // Complete an achievement
  const completeAchievement = (id: string) => {
    const achievement = achievements.find(a => a.id === id);
    
    if (achievement && !achievement.unlockedAt) {
      // Update the achievement
      const updatedAchievements = achievements.map(a => 
        a.id === id ? { ...a, unlockedAt: new Date() } : a
      );
      
      setAchievements(updatedAchievements);
      
      // Add XP reward
      addXP(achievement.points);
      
      // Update gamification state
      setGamification(prev => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, achievement]
      }));
      
      toast({
        title: "Achievement Unlocked!",
        description: `${achievement.title}: ${achievement.description}`,
        variant: "success",
      });
    }
  };
  
  // Increment daily streak
  const incrementDailyStreak = () => {
    setGamification(prev => {
      const newStreak = prev.currentStreak + 1;
      const newLongestStreak = Math.max(newStreak, prev.longestStreak);
      
      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActivity: new Date(),
        dailyGoalCompleted: true
      };
    });
    
    // Check for streak-related achievements
    checkStreakAchievements();
  };
  
  // Reset daily XP
  const resetDailyXP = () => {
    setGamification(prev => ({
      ...prev,
      dailyXP: 0,
      dailyGoalCompleted: false
    }));
  };
  
  // Check for streak reset
  const checkAndResetStreak = () => {
    const lastActivity = new Date(gamification.lastActivity);
    const now = new Date();
    
    // Reset streak if more than 48 hours have passed since the last activity
    if ((now.getTime() - lastActivity.getTime()) > (48 * 60 * 60 * 1000)) {
      setGamification(prev => ({
        ...prev,
        currentStreak: 0,
        dailyGoalCompleted: false
      }));
      
      toast({
        title: "Streak Reset",
        description: "Your streak has been reset. Complete an activity today to start a new streak!",
        variant: "destructive",
      });
    }
  };
  
  // Update progress for specific activities
  const updateProgress = (activityType: string, value: number) => {
    // Update achievements related to this activity
    const updatedAchievements = achievements.map(achievement => {
      if (!achievement.unlockedAt && achievement.threshold && achievement.progress !== undefined) {
        if (activityType === 'vocabulary' && achievement.id === 'achievement4') {
          const newProgress = achievement.progress + value;
          
          if (newProgress >= achievement.threshold) {
            // Achievement completed
            completeAchievement(achievement.id);
            return { ...achievement, progress: achievement.threshold, unlockedAt: new Date() };
          }
          
          return { ...achievement, progress: newProgress };
        }
        
        if (activityType === 'grammar' && achievement.id === 'achievement3') {
          const newProgress = achievement.progress + value;
          
          if (newProgress >= achievement.threshold) {
            // Achievement completed
            completeAchievement(achievement.id);
            return { ...achievement, progress: achievement.threshold, unlockedAt: new Date() };
          }
          
          return { ...achievement, progress: newProgress };
        }
      }
      return achievement;
    });
    
    setAchievements(updatedAchievements);
  };
  
  // Check for achievements that might have been completed
  const checkForAchievements = () => {
    // Check XP-based achievements, etc.
  };
  
  // Check streak-related achievements
  const checkStreakAchievements = () => {
    const streak = gamification.currentStreak + 1;
    
    achievements.forEach(achievement => {
      if (achievement.category === 'streak' && !achievement.unlockedAt) {
        if (achievement.id === 'achievement2' && streak >= 7) {
          completeAchievement(achievement.id);
        }
      }
    });
  };
  
  return (
    <GamificationContext.Provider value={{
      gamification,
      achievements,
      challenges,
      isLoading,
      addXP,
      completeAchievement,
      incrementDailyStreak,
      resetDailyXP,
      updateProgress,
      calculateLevel
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  
  return context;
};
