
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Achievement, GamificationState, LevelInfo, RewardItem, Challenge } from '@/types/gamification';
import { useAuth } from './AuthContext';

// Level thresholds
const LEVEL_THRESHOLDS: LevelInfo[] = [
  { level: 1, minXP: 0, maxXP: 100 },
  { level: 2, minXP: 100, maxXP: 300 },
  { level: 3, minXP: 300, maxXP: 600 },
  { level: 4, minXP: 600, maxXP: 1000 },
  { level: 5, minXP: 1000, maxXP: 1500 },
  { level: 6, minXP: 1500, maxXP: 2100 },
  { level: 7, minXP: 2100, maxXP: 2800 },
  { level: 8, minXP: 2800, maxXP: 3600 },
  { level: 9, minXP: 3600, maxXP: 4500 },
  { level: 10, minXP: 4500, maxXP: 5500 },
  // Add more levels as needed
];

// Create a set of sample achievements
const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    title: "First Step",
    description: "Complete your first lesson",
    category: "learning",
    points: 50,
    createdAt: new Date(),
    progress: 0,
    threshold: 1
  },
  {
    id: "streak-7",
    title: "Weekly Warrior",
    description: "Maintain a 7-day streak",
    category: "streak",
    points: 100,
    createdAt: new Date(),
    progress: 0,
    threshold: 7
  },
  {
    id: "quiz-master",
    title: "Quiz Master",
    description: "Score 100% on 5 quizzes",
    category: "mastery",
    points: 150,
    createdAt: new Date(),
    progress: 0,
    threshold: 5
  },
  {
    id: "vocabulary-builder",
    title: "Vocabulary Builder",
    description: "Learn 100 new Italian words",
    category: "learning",
    points: 200,
    createdAt: new Date(),
    progress: 0,
    threshold: 100
  },
  {
    id: "streak-30",
    title: "Monthly Maestro",
    description: "Maintain a 30-day streak",
    category: "streak",
    points: 300,
    createdAt: new Date(),
    progress: 0,
    threshold: 30
  }
];

interface GamificationContextType {
  state: GamificationState;
  addXP: (amount: number, reason?: string) => void;
  updateStreak: (completed: boolean) => void;
  getCurrentLevel: () => LevelInfo;
  getNextLevel: () => LevelInfo | null;
  checkAchievements: () => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  unlockAchievement: (achievementId: string) => Achievement | null;
  getUnlockedRewards: () => RewardItem[];
  getChallenges: () => Challenge[];
  getActiveChallenge: () => Challenge | null;
  completeChallenge: (challengeId: string) => void;
  resetDailyProgress: () => void;
  showAchievementUnlock: (achievement: Achievement) => void;
  showLevelUp: (oldLevel: number, newLevel: number) => void;
  currentStreak: number;
  lastActivity: Date | null;
}

const GamificationContext = createContext<GamificationContextType>({
  state: {
    xp: 0,
    level: 1,
    levelProgress: 0,
    achievements: [],
    unlockedAchievements: [],
    currentStreak: 0,
    longestStreak: 0,
    lastActivity: null,
    dailyGoalCompleted: false,
    dailyXP: 0,
    weeklyXP: 0,
    totalXP: 0
  },
  addXP: () => {},
  updateStreak: () => {},
  getCurrentLevel: () => LEVEL_THRESHOLDS[0],
  getNextLevel: () => null,
  checkAchievements: () => {},
  updateAchievementProgress: () => {},
  unlockAchievement: () => null,
  getUnlockedRewards: () => [],
  getChallenges: () => [],
  getActiveChallenge: () => null,
  completeChallenge: () => {},
  resetDailyProgress: () => {},
  showAchievementUnlock: () => {},
  showLevelUp: () => {},
  currentStreak: 0,
  lastActivity: null
});

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<GamificationState>({
    xp: 0,
    level: 1,
    levelProgress: 0,
    achievements: [...SAMPLE_ACHIEVEMENTS],
    unlockedAchievements: [],
    currentStreak: 0,
    longestStreak: 0,
    lastActivity: null,
    dailyGoalCompleted: false,
    dailyXP: 0,
    weeklyXP: 0,
    totalXP: 0
  });

  // Load gamification state from localStorage or API
  useEffect(() => {
    if (user) {
      const loadGamificationState = async () => {
        try {
          // In a real implementation, fetch from an API
          const savedState = localStorage.getItem(`gamification_${user.id}`);
          
          if (savedState) {
            const parsed = JSON.parse(savedState);
            
            // Convert string dates back to Date objects
            if (parsed.lastActivity) {
              parsed.lastActivity = new Date(parsed.lastActivity);
            }
            
            if (parsed.achievements) {
              parsed.achievements = parsed.achievements.map((achievement: any) => ({
                ...achievement,
                createdAt: new Date(achievement.createdAt),
                unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : null
              }));
            }
            
            if (parsed.unlockedAchievements) {
              parsed.unlockedAchievements = parsed.unlockedAchievements.map((achievement: any) => ({
                ...achievement,
                createdAt: new Date(achievement.createdAt),
                unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : null
              }));
            }
            
            setState(parsed);
          } else {
            // Initialize with sample achievements
            setState(prevState => ({
              ...prevState,
              achievements: [...SAMPLE_ACHIEVEMENTS]
            }));
          }
        } catch (error) {
          console.error('Error loading gamification state:', error);
        }
      };
      
      loadGamificationState();
    }
  }, [user]);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (user && state.xp > 0) {
      localStorage.setItem(`gamification_${user.id}`, JSON.stringify(state));
    }
  }, [state, user]);

  // Check if the streak needs to be reset
  useEffect(() => {
    if (state.lastActivity) {
      const now = new Date();
      const lastActivity = new Date(state.lastActivity);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Reset streak if last activity was more than 2 days ago
      if (lastActivity < yesterday && lastActivity.getDate() !== yesterday.getDate()) {
        setState(prevState => ({
          ...prevState,
          currentStreak: 0,
          dailyGoalCompleted: false
        }));
      } else if (now.getDate() !== lastActivity.getDate()) {
        // Reset daily goal if it's a new day
        setState(prevState => ({
          ...prevState,
          dailyGoalCompleted: false,
          dailyXP: 0
        }));
      }
    }
  }, [state.lastActivity]);

  // Get the current level based on XP
  const getCurrentLevel = (): LevelInfo => {
    const level = LEVEL_THRESHOLDS.find(
      (lvl, index) => 
        state.xp >= lvl.minXP && 
        (index === LEVEL_THRESHOLDS.length - 1 || state.xp < LEVEL_THRESHOLDS[index + 1].minXP)
    );
    
    return level || LEVEL_THRESHOLDS[0];
  };

  // Get the next level
  const getNextLevel = (): LevelInfo | null => {
    const currentLevelIndex = LEVEL_THRESHOLDS.findIndex(lvl => 
      state.xp >= lvl.minXP && state.xp < lvl.maxXP
    );
    
    if (currentLevelIndex < LEVEL_THRESHOLDS.length - 1) {
      return LEVEL_THRESHOLDS[currentLevelIndex + 1];
    }
    
    return null;
  };

  // Add XP and check for level up
  const addXP = (amount: number, reason?: string) => {
    if (amount <= 0) return;
    
    const currentLevel = getCurrentLevel();
    const newXP = state.xp + amount;
    const newLevel = LEVEL_THRESHOLDS.find(
      (lvl, index) => 
        newXP >= lvl.minXP && 
        (index === LEVEL_THRESHOLDS.length - 1 || newXP < LEVEL_THRESHOLDS[index + 1].minXP)
    );
    
    if (newLevel && newLevel.level > currentLevel.level) {
      // Level up occurred!
      showLevelUp(currentLevel.level, newLevel.level);
    }
    
    setState(prevState => {
      const updatedDailyXP = prevState.dailyXP + amount;
      const updatedWeeklyXP = prevState.weeklyXP + amount;
      const now = new Date();
      
      return {
        ...prevState,
        xp: newXP,
        level: newLevel ? newLevel.level : prevState.level,
        levelProgress: newLevel 
          ? Math.round(((newXP - newLevel.minXP) / (newLevel.maxXP - newLevel.minXP)) * 100)
          : prevState.levelProgress,
        lastActivity: now,
        dailyXP: updatedDailyXP,
        weeklyXP: updatedWeeklyXP,
        totalXP: prevState.totalXP + amount
      };
    });
    
    // Check if any achievements should be unlocked
    checkAchievements();
  };

  // Update streak when user completes daily goal
  const updateStreak = (completed: boolean) => {
    if (!completed) return;
    
    setState(prevState => {
      const now = new Date();
      const lastActivity = prevState.lastActivity ? new Date(prevState.lastActivity) : null;
      let newStreak = prevState.currentStreak;
      
      // If it's the first activity or a new day
      if (!lastActivity || (lastActivity && now.getDate() !== lastActivity.getDate())) {
        newStreak += 1;
        
        // Check for streak milestone achievements
        if (newStreak === 7 || newStreak === 30 || newStreak === 100 || newStreak === 365) {
          // Show streak notification
          // This would be handled by a notification system
        }
      }
      
      return {
        ...prevState,
        currentStreak: newStreak,
        longestStreak: Math.max(prevState.longestStreak, newStreak),
        lastActivity: now,
        dailyGoalCompleted: true
      };
    });
  };

  // Check all achievements to see if any should be unlocked
  const checkAchievements = () => {
    const achievementsToCheck = state.achievements.filter(
      achievement => !state.unlockedAchievements.some(unlocked => unlocked.id === achievement.id)
    );
    
    achievementsToCheck.forEach(achievement => {
      switch (achievement.id) {
        case 'streak-7':
          if (state.currentStreak >= 7) {
            unlockAchievement(achievement.id);
          }
          break;
        case 'streak-30':
          if (state.currentStreak >= 30) {
            unlockAchievement(achievement.id);
          }
          break;
        // Add other achievement checks based on their IDs
        default:
          break;
      }
    });
  };

  // Update progress on a specific achievement
  const updateAchievementProgress = (achievementId: string, progress: number) => {
    setState(prevState => {
      const updatedAchievements = prevState.achievements.map(achievement => {
        if (achievement.id === achievementId) {
          const updatedProgress = Math.min(progress, achievement.threshold || 100);
          
          // Check if achievement should be unlocked
          if (updatedProgress >= (achievement.threshold || 100)) {
            unlockAchievement(achievementId);
          }
          
          return {
            ...achievement,
            progress: updatedProgress
          };
        }
        return achievement;
      });
      
      return {
        ...prevState,
        achievements: updatedAchievements
      };
    });
  };

  // Unlock an achievement by ID
  const unlockAchievement = (achievementId: string): Achievement | null => {
    const achievement = state.achievements.find(a => a.id === achievementId);
    
    if (!achievement) return null;
    
    // Check if already unlocked
    if (state.unlockedAchievements.some(a => a.id === achievementId)) {
      return null;
    }
    
    const unlockedAchievement = {
      ...achievement,
      unlockedAt: new Date()
    };
    
    setState(prevState => ({
      ...prevState,
      unlockedAchievements: [...prevState.unlockedAchievements, unlockedAchievement],
      xp: prevState.xp + achievement.points
    }));
    
    // Show achievement unlock notification
    showAchievementUnlock(unlockedAchievement);
    
    return unlockedAchievement;
  };

  // Get all unlocked rewards
  const getUnlockedRewards = (): RewardItem[] => {
    // In a real app, this would return actual reward items
    return [];
  };

  // Get all challenges
  const getChallenges = (): Challenge[] => {
    // In a real app, this would return actual challenges
    return [];
  };

  // Get the active challenge
  const getActiveChallenge = (): Challenge | null => {
    // In a real app, this would return the currently active challenge
    return null;
  };

  // Complete a challenge
  const completeChallenge = (challengeId: string) => {
    // In a real app, this would mark a challenge as completed
  };

  // Reset daily progress (called at midnight)
  const resetDailyProgress = () => {
    setState(prevState => ({
      ...prevState,
      dailyGoalCompleted: false,
      dailyXP: 0
    }));
  };

  // Show achievement unlock notification
  const showAchievementUnlock = (achievement: Achievement) => {
    // In a real implementation, this would trigger a notification
    console.log(`Achievement unlocked: ${achievement.title}`);
  };

  // Show level up notification
  const showLevelUp = (oldLevel: number, newLevel: number) => {
    // In a real implementation, this would trigger a notification
    console.log(`Level up: ${oldLevel} → ${newLevel}`);
  };

  return (
    <GamificationContext.Provider value={{
      state,
      addXP,
      updateStreak,
      getCurrentLevel,
      getNextLevel,
      checkAchievements,
      updateAchievementProgress,
      unlockAchievement,
      getUnlockedRewards,
      getChallenges,
      getActiveChallenge,
      completeChallenge,
      resetDailyProgress,
      showAchievementUnlock,
      showLevelUp,
      currentStreak: state.currentStreak,
      lastActivity: state.lastActivity
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamificationContext = () => useContext(GamificationContext);
