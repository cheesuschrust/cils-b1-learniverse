
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase-client';
import { Achievement, Level, UserGamification } from '@/types/gamification';
import { useToast } from '@/hooks/use-toast';

interface GamificationContextType {
  xp: number;
  level: number;
  levelDetails: Level | null;
  streakDays: number;
  achievements: Achievement[];
  isLoading: boolean;
  awardXp: (amount: number, reason?: string) => Promise<void>;
  updateAchievementProgress: (achievementId: string, progress: number) => Promise<void>;
  updateStreak: (increment?: boolean) => Promise<void>;
  showAchievementUnlock: (achievement: Achievement) => void;
  showLevelUp: (oldLevel: number, newLevel: number) => void;
  refreshGamification: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Define levels with XP thresholds and titles
const LEVEL_DEFINITIONS: Level[] = [
  { level: 1, minXp: 0, maxXp: 99, title: "Beginner" },
  { level: 2, minXp: 100, maxXp: 299, title: "Novice" },
  { level: 3, minXp: 300, maxXp: 599, title: "Apprentice" },
  { level: 4, minXp: 600, maxXp: 999, title: "Intermediate" },
  { level: 5, minXp: 1000, maxXp: 1499, title: "Proficient" },
  { level: 6, minXp: 1500, maxXp: 2099, title: "Advanced" },
  { level: 7, minXp: 2100, maxXp: 2799, title: "Expert" },
  { level: 8, minXp: 2800, maxXp: 3599, title: "Master" },
  { level: 9, minXp: 3600, maxXp: 4499, title: "Grandmaster" },
  { level: 10, minXp: 4500, maxXp: Infinity, title: "Legendary" }
];

// Get level based on XP
const getLevelFromXp = (xp: number): Level => {
  const level = LEVEL_DEFINITIONS.find(level => xp >= level.minXp && xp <= level.maxXp);
  return level || LEVEL_DEFINITIONS[LEVEL_DEFINITIONS.length - 1];
};

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelDetails, setLevelDetails] = useState<Level | null>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's gamification data
  const fetchGamificationData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Fetch user stats (streak, etc.)
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('streak_days')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching user stats:', statsError);
      }

      if (userStats) {
        setStreakDays(userStats.streak_days || 0);
      }

      // Fetch user achievements
      const { data: userAchievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (achievementsError) {
        console.error('Error fetching achievements:', achievementsError);
      }

      if (userAchievements) {
        const formattedAchievements: Achievement[] = userAchievements.map(a => ({
          id: a.id,
          title: a.achievement_name,
          description: a.description,
          icon: a.metadata?.icon || 'award',
          category: a.achievement_type as any,
          points: a.metadata?.points || 0,
          requiredValue: a.metadata?.required_value || 1,
          currentValue: a.metadata?.current_value,
          unlockedAt: a.achieved_at ? new Date(a.achieved_at) : undefined,
        }));

        setAchievements(formattedAchievements);
      }

      // Calculate total XP from achievements
      const totalXp = userAchievements?.reduce((sum, a) => sum + (a.metadata?.points || 0), 0) || 0;
      setXp(totalXp);

      // Determine level based on XP
      const currentLevel = getLevelFromXp(totalXp);
      setLevel(currentLevel.level);
      setLevelDetails(currentLevel);

    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchGamificationData();
  }, [fetchGamificationData]);

  // Award XP to the user
  const awardXp = async (amount: number, reason?: string) => {
    if (!user) return;

    try {
      const oldLevel = level;
      const newXp = xp + amount;
      setXp(newXp);

      // Check if user leveled up
      const newLevelDetails = getLevelFromXp(newXp);
      setLevelDetails(newLevelDetails);

      if (newLevelDetails.level > oldLevel) {
        setLevel(newLevelDetails.level);
        // Show level up notification
        showLevelUp(oldLevel, newLevelDetails.level);
      }

      // Show XP gain notification
      toast({
        title: `+${amount} XP`,
        description: reason || 'Points awarded',
        duration: 2000,
      });

      // Store the XP in the achievements table as a special achievement
      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_name: 'XP Gain',
          achievement_type: 'xp',
          description: reason || 'Points earned',
          metadata: {
            points: amount,
            total_xp: newXp,
            level: newLevelDetails.level,
          },
          achieved_at: new Date().toISOString(),
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  // Update achievement progress
  const updateAchievementProgress = async (achievementId: string, progress: number) => {
    if (!user) return;

    try {
      // Check if achievement already exists
      const existingAchievement = achievements.find(a => a.id === achievementId);
      
      if (existingAchievement) {
        // Achievement already unlocked
        if (existingAchievement.unlockedAt) return;
        
        // Update progress
        const isComplete = progress >= existingAchievement.requiredValue;
        
        if (isComplete) {
          // Unlock achievement
          const { error } = await supabase
            .from('user_achievements')
            .update({
              achieved_at: new Date().toISOString(),
              metadata: {
                ...existingAchievement,
                current_value: progress,
              }
            })
            .eq('id', achievementId)
            .eq('user_id', user.id);

          if (error) throw error;
          
          // Update local state
          setAchievements(prev => prev.map(a => 
            a.id === achievementId 
              ? { ...a, unlockedAt: new Date(), currentValue: progress } 
              : a
          ));
          
          // Award XP for completing achievement
          await awardXp(existingAchievement.points, `Achievement: ${existingAchievement.title}`);
          
          // Show achievement unlock notification
          showAchievementUnlock(existingAchievement);
        } else {
          // Just update progress
          const { error } = await supabase
            .from('user_achievements')
            .update({
              metadata: {
                ...existingAchievement,
                current_value: progress,
              }
            })
            .eq('id', achievementId)
            .eq('user_id', user.id);

          if (error) throw error;
          
          // Update local state
          setAchievements(prev => prev.map(a => 
            a.id === achievementId 
              ? { ...a, currentValue: progress } 
              : a
          ));
        }
      } else {
        // Achievement doesn't exist yet, this shouldn't normally happen
        console.warn('Tried to update non-existent achievement:', achievementId);
      }
    } catch (error) {
      console.error('Error updating achievement:', error);
    }
  };

  // Update user streak
  const updateStreak = async (increment: boolean = true) => {
    if (!user) return;

    try {
      const newStreak = increment ? streakDays + 1 : 1;
      
      // Update streak in database
      const { error } = await supabase
        .from('user_stats')
        .update({ streak_days: newStreak })
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local state
      setStreakDays(newStreak);
      
      // Check for streak achievements
      if (newStreak === 7) {
        // Weekly streak achievement
        const weeklyStreakAchievement: Achievement = {
          id: 'weekly_streak',
          title: 'Weekly Warrior',
          description: 'Complete daily questions for 7 consecutive days',
          icon: 'flame',
          category: 'streak',
          points: 50,
          requiredValue: 7,
          currentValue: 7,
          unlockedAt: new Date()
        };
        
        await addAchievement(weeklyStreakAchievement);
        showAchievementUnlock(weeklyStreakAchievement);
      } else if (newStreak === 30) {
        // Monthly streak achievement
        const monthlyStreakAchievement: Achievement = {
          id: 'monthly_streak',
          title: 'Monthly Dedication',
          description: 'Complete daily questions for 30 consecutive days',
          icon: 'calendar',
          category: 'streak',
          points: 200,
          requiredValue: 30,
          currentValue: 30,
          unlockedAt: new Date()
        };
        
        await addAchievement(monthlyStreakAchievement);
        showAchievementUnlock(monthlyStreakAchievement);
      }
      
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  // Helper to add a new achievement
  const addAchievement = async (achievement: Achievement) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          id: achievement.id,
          user_id: user.id,
          achievement_name: achievement.title,
          achievement_type: achievement.category,
          description: achievement.description,
          metadata: {
            icon: achievement.icon,
            points: achievement.points,
            required_value: achievement.requiredValue,
            current_value: achievement.currentValue,
          },
          achieved_at: achievement.unlockedAt?.toISOString(),
        });

      if (error) throw error;
      
      // Update local state
      setAchievements(prev => [achievement, ...prev]);
      
      // Award XP
      await awardXp(achievement.points, `Achievement: ${achievement.title}`);
      
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  };

  // Show achievement unlock notification
  const showAchievementUnlock = (achievement: Achievement) => {
    toast({
      title: 'Achievement Unlocked!',
      description: achievement.title,
      duration: 5000,
    });
  };

  // Show level up notification
  const showLevelUp = (oldLevel: number, newLevel: number) => {
    toast({
      title: 'Level Up!',
      description: `You've reached level ${newLevel}!`,
      duration: 5000,
    });
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        level,
        levelDetails,
        streakDays,
        achievements,
        isLoading,
        awardXp,
        updateAchievementProgress,
        updateStreak,
        showAchievementUnlock,
        showLevelUp,
        refreshGamification: fetchGamificationData,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamificationContext = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
};
