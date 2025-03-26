
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { Achievement } from '@/types/gamification';
import AchievementUnlocked from '@/components/gamification/AchievementUnlocked';
import LevelUpAnimation from '@/components/gamification/LevelUpAnimation';

interface GamificationContextValue {
  showAchievementUnlock: (achievement: Achievement) => void;
  showLevelUp: (level: number) => void;
}

const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ level: number, show: boolean } | null>(null);
  
  // Show achievement unlock notification
  const showAchievementUnlock = useCallback((achievement: Achievement) => {
    setUnlockedAchievement(achievement);
  }, []);
  
  // Hide achievement unlock notification
  const hideAchievementUnlock = useCallback(() => {
    setUnlockedAchievement(null);
  }, []);
  
  // Show level up animation
  const showLevelUp = useCallback((level: number) => {
    setLevelUpData({ level, show: true });
  }, []);
  
  // Hide level up animation
  const hideLevelUp = useCallback(() => {
    setLevelUpData(null);
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        showAchievementUnlock,
        showLevelUp
      }}
    >
      {children}
      
      {unlockedAchievement && (
        <AchievementUnlocked 
          achievement={unlockedAchievement} 
          onComplete={hideAchievementUnlock} 
        />
      )}
      
      {levelUpData && (
        <LevelUpAnimation 
          level={levelUpData.level} 
          isVisible={levelUpData.show} 
          onComplete={hideLevelUp} 
        />
      )}
    </GamificationContext.Provider>
  );
};

export const useGamificationContext = (): GamificationContextValue => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
};
