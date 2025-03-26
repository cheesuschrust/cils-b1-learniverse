
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import gamificationService from '@/services/gamificationService';
import { Achievement, Level, UserGamification, WeeklyChallenge } from '@/types/gamification';

export const useGamification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [gamification, setGamification] = useState<UserGamification | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [levelDetails, setLevelDetails] = useState<Level | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyChallenge, setWeeklyChallenge] = useState<WeeklyChallenge | null>(null);

  // Load user gamification data
  const loadGamificationData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await gamificationService.getUserGamification(user.id);
      setGamification(data);
      
      if (data) {
        setLevelDetails(gamificationService.getLevelDetails(data.level));
        
        // Load achievements
        const userAchievements = await gamificationService.getUserAchievements(user.id);
        setAchievements(userAchievements);
        
        // Load weekly challenge
        const challenge = await gamificationService.getWeeklyChallenge(user.id);
        setWeeklyChallenge(challenge);
      }
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    loadGamificationData();
  }, [loadGamificationData]);

  // Award XP to the user
  const awardXp = useCallback(async (points: number, reason?: string) => {
    if (!user) return;
    
    try {
      const result = await gamificationService.awardXp(user.id, points, reason);
      
      // Show toast notification for XP gain
      toast({
        title: `+${points} XP`,
        description: reason || 'Points awarded',
        duration: 3000,
      });
      
      // Show level up notification if applicable
      if (result.leveledUp) {
        toast({
          title: `Level Up!`,
          description: `Congratulations! You've reached level ${result.newLevel}`,
          duration: 5000,
        });
      }
      
      // Refresh gamification data
      await loadGamificationData();
      
      return result;
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  }, [user, toast, loadGamificationData]);

  // Update achievement progress
  const updateAchievement = useCallback(async (achievementId: string, progress: number) => {
    if (!user) return;
    
    try {
      const result = await gamificationService.updateAchievementProgress(
        user.id, 
        achievementId, 
        progress
      );
      
      // Show toast notification if achievement unlocked
      if (result.achieved && result.achievement) {
        toast({
          title: 'Achievement Unlocked!',
          description: result.achievement.title,
          duration: 5000,
        });
      }
      
      // Refresh achievements
      const userAchievements = await gamificationService.getUserAchievements(user.id);
      setAchievements(userAchievements);
      
      return result;
    } catch (error) {
      console.error('Error updating achievement:', error);
    }
  }, [user, toast]);

  // Update user streak
  const updateStreak = useCallback(async () => {
    if (!user) return;
    
    try {
      const result = await gamificationService.updateStreak(user.id);
      
      // Show notification for streak increase
      if (result.increased) {
        toast({
          title: `${result.currentStreak} Day Streak!`,
          description: 'Keep up the good work!',
          duration: 3000,
        });
      }
      
      // Show milestone achievement
      if (result.milestoneReached) {
        toast({
          title: `Streak Milestone!`,
          description: `You've reached a ${result.milestone}-day streak!`,
          duration: 5000,
        });
      }
      
      // Refresh gamification data
      await loadGamificationData();
      
      return result;
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }, [user, toast, loadGamificationData]);

  // Update weekly challenge progress
  const updateChallengeProgress = useCallback(async (progress: number) => {
    if (!user) return;
    
    try {
      const result = await gamificationService.updateWeeklyChallengeProgress(
        user.id, 
        progress
      );
      
      // Show notification if challenge completed
      if (result.completed && result.challenge) {
        toast({
          title: 'Weekly Challenge Completed!',
          description: `You've earned ${result.challenge.xpReward} XP!`,
          duration: 5000,
        });
      }
      
      // Update weekly challenge state
      setWeeklyChallenge(result.challenge);
      
      return result;
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  }, [user, toast]);

  // Get all achievements (for the achievements page)
  const getAllAchievements = useCallback(() => {
    return gamificationService.getAllAchievements();
  }, []);

  return {
    gamification,
    achievements,
    levelDetails,
    weeklyChallenge,
    isLoading,
    awardXp,
    updateAchievement,
    updateStreak,
    updateChallengeProgress,
    getAllAchievements,
    refreshData: loadGamificationData
  };
};
