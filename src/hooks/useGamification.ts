
import { useState, useCallback, useEffect } from 'react';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { Achievement, UserGamification, WeeklyChallenge } from '@/types/gamification';

interface UseGamificationReturn {
  gamification: UserGamification;
  achievements: Achievement[];
  addXP: (amount: number, source: string) => void;
  updateStreak: (hasActivity: boolean) => void;
  unlockAchievement: (achievementId: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const useGamification = (): UseGamificationReturn => {
  const {
    addXP: contextAddXP,
    updateStreak: contextUpdateStreak,
    unlockAchievement: contextUnlockAchievement,
    achievements: contextAchievements,
    getUserLevel,
    getCurrentXP
  } = useGamificationContext();
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [gamification, setGamification] = useState<UserGamification>({
    userId: '',
    xp: 0,
    level: 1,
    achievements: [],
    streak: 0,
    lastActivity: new Date(),
    weeklyXp: 0
  });
  
  useEffect(() => {
    // Update local state with values from context
    setGamification(prev => ({
      ...prev,
      xp: getCurrentXP(),
      level: getUserLevel(),
      achievements: contextAchievements
    }));
  }, [getCurrentXP, getUserLevel, contextAchievements]);
  
  const addXP = useCallback((amount: number, source: string) => {
    try {
      contextAddXP(amount, source);
      
      // Update local state too
      setGamification(prev => ({
        ...prev,
        xp: prev.xp + amount,
        weeklyXp: (prev.weeklyXp || 0) + amount
      }));
    } catch (err: any) {
      setError(err.message);
    }
  }, [contextAddXP]);
  
  const updateStreak = useCallback((hasActivity: boolean) => {
    try {
      contextUpdateStreak(hasActivity);
      
      if (hasActivity) {
        // Update local streak data
        const now = new Date();
        const lastActivityDate = gamification.lastActivityDate ? new Date(gamification.lastActivityDate) : null;
        
        // Check if this is a new day compared to last activity
        const isNewDay = !lastActivityDate || 
          (now.getDate() !== lastActivityDate.getDate() || 
           now.getMonth() !== lastActivityDate.getMonth() || 
           now.getFullYear() !== lastActivityDate.getFullYear());
        
        if (isNewDay) {
          // Check if the streak should continue
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          
          const isConsecutiveDay = lastActivityDate && 
            yesterday.getDate() === lastActivityDate.getDate() && 
            yesterday.getMonth() === lastActivityDate.getMonth() && 
            yesterday.getFullYear() === lastActivityDate.getFullYear();
          
          setGamification(prev => ({
            ...prev,
            streak: isConsecutiveDay ? prev.streak + 1 : 1,
            lastActivity: now,
            lastActivityDate: now,
            longestStreak: Math.max(prev.longestStreak || 0, isConsecutiveDay ? prev.streak + 1 : 1)
          }));
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, [contextUpdateStreak, gamification.lastActivityDate, gamification.streak]);
  
  const unlockAchievement = useCallback((achievementId: string) => {
    try {
      contextUnlockAchievement(achievementId);
      
      // Update local state if needed
      setGamification(prev => {
        const updatedAchievements = prev.achievements.map(a => 
          a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date() } : a
        );
        
        return {
          ...prev,
          achievements: updatedAchievements
        };
      });
    } catch (err: any) {
      setError(err.message);
    }
  }, [contextUnlockAchievement]);
  
  return {
    gamification,
    achievements: contextAchievements,
    addXP,
    updateStreak,
    unlockAchievement,
    isLoading,
    error
  };
};

export default useGamification;
