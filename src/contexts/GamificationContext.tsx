
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { calculateUserLevel, calculateXpReward, isStreakMaintained } from '@/lib/learning-utils';
import { Achievement, UserGamification } from '@/types/gamification';
import { useAuth } from '@/contexts/AuthContext';

interface GamificationContextType {
  achievements: Achievement[];
  addXP: (amount: number, source: string) => void;
  updateStreak: (hasActivity: boolean) => void;
  unlockAchievement: (achievementId: string) => void;
  getCurrentXP: () => number;
  getUserLevel: () => number;
  checkForAchievements: () => Promise<Achievement[]>;
  resetDailyXP: () => void;
  weeklyChallenge: any | null;
}

const GamificationContext = createContext<GamificationContextType>({
  achievements: [],
  addXP: () => {},
  updateStreak: () => {},
  unlockAchievement: () => {},
  getCurrentXP: () => 0,
  getUserLevel: () => 1,
  checkForAchievements: async () => [],
  resetDailyXP: () => {},
  weeklyChallenge: null
});

export const useGamificationContext = () => useContext(GamificationContext);

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userGamification, setUserGamification] = useState<UserGamification>({
    userId: '',
    xp: 0,
    level: 1,
    achievements: [],
    streak: 0,
    lastActivity: new Date()
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState<any>(null);

  // Initialize user gamification data
  useEffect(() => {
    if (user) {
      fetchUserGamificationData();
      fetchAchievements();
      fetchWeeklyChallenge();
    }
  }, [user]);

  // Check for date change to reset daily XP
  useEffect(() => {
    const now = new Date();
    const lastActivity = userGamification.lastActivity ? new Date(userGamification.lastActivity) : null;
    
    if (lastActivity && now.getDate() !== lastActivity.getDate()) {
      resetDailyXP();
    }
  }, [userGamification.lastActivity]);

  // Fetch user gamification data
  const fetchUserGamificationData = async () => {
    if (!user) return;
    
    try {
      // In a real app, this would fetch from your database
      // Simulating with mock data for now
      const mockGamification: UserGamification = {
        userId: user.id,
        xp: 450,
        level: calculateUserLevel(450),
        achievements: [],
        streak: 7,
        lastActivity: new Date(),
        weeklyXp: 120,
        totalCorrectAnswers: 78,
        totalCompletedReviews: 45
      };
      
      setUserGamification(mockGamification);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    }
  };

  // Fetch achievements
  const fetchAchievements = async () => {
    if (!user) return;
    
    try {
      // In a real app, this would fetch from your database
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          name: 'first_day',
          title: 'First Day',
          description: 'Complete your first day of learning',
          icon: 'star',
          type: 'milestone',
          category: 'learning',
          points: 10,
          threshold: 1,
          progress: 1,
          unlocked: true
        },
        {
          id: '2',
          name: 'vocab_master',
          title: 'Vocabulary Master',
          description: 'Learn 100 vocabulary words',
          icon: 'book',
          type: 'progress',
          category: 'learning',
          points: 50,
          threshold: 100,
          progress: 45,
          unlocked: false
        },
        {
          id: '3',
          name: 'streak_week',
          title: 'Week Streak',
          description: 'Maintain a 7-day learning streak',
          icon: 'flame',
          type: 'streak',
          category: 'streak',
          points: 25,
          threshold: 7,
          progress: 7,
          unlocked: true
        }
      ];
      
      setAchievements(mockAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  // Fetch weekly challenge
  const fetchWeeklyChallenge = async () => {
    if (!user) return;
    
    try {
      // In a real app, this would fetch from your database
      const mockChallenge = {
        id: 'wc-1',
        title: 'Vocabulary Champion',
        description: 'Complete 20 flashcard reviews this week',
        category: 'learning',
        type: 'flashcards',
        reward: 50,
        target: 20,
        progress: 12,
        startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        isCompleted: false,
        icon: 'star'
      };
      
      setWeeklyChallenge(mockChallenge);
    } catch (error) {
      console.error('Error fetching weekly challenge:', error);
    }
  };

  // Add XP to user
  const addXP = (amount: number, source: string) => {
    if (!user) return;
    
    const newTotalXP = userGamification.xp + amount;
    const newWeeklyXP = (userGamification.weeklyXp || 0) + amount;
    const oldLevel = userGamification.level;
    const newLevel = calculateUserLevel(newTotalXP);
    
    setUserGamification(prev => ({
      ...prev,
      xp: newTotalXP,
      weeklyXp: newWeeklyXP,
      level: newLevel,
      lastActivity: new Date()
    }));
    
    // Toast notification for XP gain
    toast({
      title: `+${amount} XP`,
      description: `You gained XP from ${source}!`,
    });
    
    // Check if user leveled up
    if (newLevel > oldLevel) {
      toast({
        title: 'Level Up!',
        description: `Congratulations! You are now level ${newLevel}!`,
        variant: 'default',
      });
    }
    
    // In a real app, you would update the database
    // updateUserXpInDatabase(user.id, newTotalXP, newLevel);
  };

  // Update user streak
  const updateStreak = (hasActivity: boolean) => {
    if (!user || !hasActivity) return;
    
    const lastActivityDate = userGamification.lastActivityDate ? new Date(userGamification.lastActivityDate) : null;
    const now = new Date();
    
    // Check if this is a new day
    const isNewDay = !lastActivityDate || 
      now.getDate() !== lastActivityDate.getDate() || 
      now.getMonth() !== lastActivityDate.getMonth() || 
      now.getFullYear() !== lastActivityDate.getFullYear();
    
    if (isNewDay) {
      const streakMaintained = isStreakMaintained(lastActivityDate, now);
      const newStreak = streakMaintained ? userGamification.streak + 1 : 1;
      const newLongestStreak = Math.max(userGamification.longestStreak || 0, newStreak);
      
      setUserGamification(prev => ({
        ...prev,
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastActivity: now,
        lastActivityDate: now
      }));
      
      // Celebrate streak milestones
      if (newStreak % 7 === 0) {
        toast({
          title: 'Streak Milestone!',
          description: `You've maintained a ${newStreak}-day streak. Keep it up!`,
          variant: 'default',
        });
      }
      
      // In a real app, you would update the database
      // updateUserStreakInDatabase(user.id, newStreak, now);
    }
  };

  // Unlock an achievement
  const unlockAchievement = (achievementId: string) => {
    if (!user) return;
    
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;
    
    // Update achievement
    const updatedAchievements = achievements.map(a => 
      a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date() } : a
    );
    
    setAchievements(updatedAchievements);
    
    // Add XP reward
    addXP(achievement.points, `Achievement: ${achievement.title}`);
    
    // Toast notification for achievement
    toast({
      title: 'Achievement Unlocked!',
      description: achievement.title,
      variant: 'default',
    });
    
    // In a real app, you would update the database
    // updateUserAchievementInDatabase(user.id, achievementId);
  };

  // Check for new achievements based on user stats
  const checkForAchievements = async (): Promise<Achievement[]> => {
    if (!user) return [];
    
    const unlockedAchievements: Achievement[] = [];
    
    // Check each achievement
    achievements.forEach(achievement => {
      if (achievement.unlocked) return;
      
      let shouldUnlock = false;
      
      switch (achievement.name) {
        case 'streak_week':
          shouldUnlock = userGamification.streak >= 7;
          break;
        case 'streak_month':
          shouldUnlock = userGamification.streak >= 30;
          break;
        case 'vocab_master':
          shouldUnlock = (userGamification.totalCorrectAnswers || 0) >= 100;
          break;
        case 'flashcard_expert':
          shouldUnlock = (userGamification.totalCompletedReviews || 0) >= 500;
          break;
        // Add more achievement checks as needed
      }
      
      if (shouldUnlock) {
        unlockAchievement(achievement.id);
        unlockedAchievements.push(achievement);
      }
    });
    
    return unlockedAchievements;
  };

  // Reset daily XP tracking
  const resetDailyXP = () => {
    if (!user) return;
    
    setUserGamification(prev => ({
      ...prev,
      dailyXp: 0
    }));
    
    // In a real app, you would update the database
    // resetUserDailyXpInDatabase(user.id);
  };

  // Get current XP
  const getCurrentXP = () => userGamification.xp;
  
  // Get user level
  const getUserLevel = () => userGamification.level;

  return (
    <GamificationContext.Provider 
      value={{
        achievements,
        addXP,
        updateStreak,
        unlockAchievement,
        getCurrentXP,
        getUserLevel,
        checkForAchievements,
        resetDailyXP,
        weeklyChallenge
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};
