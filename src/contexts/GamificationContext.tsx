
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getTable, callRPC } from '@/adapters/SupabaseAdapter';

interface GamificationContextType {
  xp: number;
  level: number;
  badges: Badge[];
  addXp: (amount: number, activityType: string) => Promise<void>;
  hasAchievement: (achievementName: string) => boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  earnedAt: Date;
}

const GamificationContext = createContext<GamificationContextType>({
  xp: 0,
  level: 1,
  badges: [],
  addXp: async () => {},
  hasAchievement: () => false,
});

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState<Badge[]>([]);

  // Calculate level based on XP
  useEffect(() => {
    // Simple level calculation: level = sqrt(xp / 100) + 1
    const calculatedLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
    setLevel(calculatedLevel);
  }, [xp]);

  // Load user's XP and badges
  useEffect(() => {
    if (!user) {
      setXp(0);
      setBadges([]);
      return;
    }

    const loadGamificationData = async () => {
      try {
        // Load user's XP
        const { data: userData } = await getTable('user_stats')
          .select('xp')
          .eq('user_id', user.id)
          .single();

        if (userData) {
          setXp(userData.xp || 0);
        }

        // Load user's achievements/badges
        const { data: achievements } = await getTable('user_achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('achieved_at', { ascending: false });

        if (achievements) {
          const badgeData = achievements.map(achievement => ({
            id: achievement.id,
            name: achievement.achievement_name,
            description: achievement.description,
            imageUrl: achievement.metadata?.image_url,
            earnedAt: new Date(achievement.achieved_at),
          }));
          setBadges(badgeData);
        }
      } catch (error) {
        console.error('Error loading gamification data:', error);
      }
    };

    loadGamificationData();
  }, [user]);

  // Function to add XP to the user
  const addXp = async (amount: number, activityType: string) => {
    if (!user) return;

    try {
      // Call the RPC function to add XP
      await callRPC('add_user_xp', { 
        user_id: user.id, 
        xp_amount: amount, 
        activity_type: activityType 
      });

      // Update local state
      setXp(prevXp => prevXp + amount);
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  };

  // Function to check if user has a specific achievement
  const hasAchievement = (achievementName: string): boolean => {
    return badges.some(badge => badge.name === achievementName);
  };

  return (
    <GamificationContext.Provider 
      value={{ 
        xp, 
        level, 
        badges, 
        addXp,
        hasAchievement
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export default GamificationContext;
