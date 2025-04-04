
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Award, Star, Flame, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateLevelProgress } from '@/lib/learning-utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  requiredValue?: number;
  progress?: number;
  unlockedAt?: Date;
}

interface GamificationContextType {
  addXP: (amount: number, source: string) => Promise<void>;
  updateStreak: (hasActivity: boolean) => Promise<void>;
  showAchievementUnlock: (achievement: Achievement) => void;
  showLevelUp: (newLevel: number, oldLevel: number) => void;
  getUserLevel: () => number;
  getCurrentXP: () => number;
  unlockAchievement: (achievementId: string) => Promise<void>;
  achievements: Achievement[];
  isLoadingAchievements: boolean;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentXP, setCurrentXP] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState<boolean>(true);
  const [showAchievementDialog, setShowAchievementDialog] = useState<boolean>(false);
  const [showLevelUpDialog, setShowLevelUpDialog] = useState<boolean>(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [levelUpDetails, setLevelUpDetails] = useState<{newLevel: number, oldLevel: number}>({newLevel: 0, oldLevel: 0});
  
  // Load user's XP and level on initial load
  useEffect(() => {
    const loadUserXPAndLevel = async () => {
      if (!user) return;
      
      try {
        // Fetch XP from database
        const { data: xpData, error: xpError } = await supabase
          .rpc('get_user_xp', { user_id: user.id });
          
        if (xpError) throw xpError;
        
        const xp = xpData || 0;
        setCurrentXP(xp);
        
        // Calculate level based on XP
        const { level } = calculateLevelProgress(xp);
        setUserLevel(level);
        
      } catch (error) {
        console.error('Error loading user XP and level:', error);
      }
    };
    
    loadUserXPAndLevel();
  }, [user]);
  
  // Load user achievements
  useEffect(() => {
    const loadAchievements = async () => {
      if (!user) return;
      
      setIsLoadingAchievements(true);
      
      try {
        // Fetch user achievements from database
        const { data: userAchievements, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);
          
        if (achievementsError) throw achievementsError;
        
        // Fetch available achievements
        // In a real app, this would come from a database table
        const availableAchievements: Achievement[] = [
          {
            id: 'first_lesson',
            title: 'First Steps',
            description: 'Complete your first lesson',
            icon: 'award',
            category: 'learning',
            points: 10
          },
          {
            id: 'perfect_score',
            title: 'Perfect Score',
            description: 'Get 100% on a quiz or exercise',
            icon: 'star',
            category: 'mastery',
            points: 20
          },
          {
            id: 'weekly_streak',
            title: 'Weekly Warrior',
            description: 'Complete daily questions for 7 consecutive days',
            icon: 'flame',
            category: 'streak',
            points: 50,
            requiredValue: 7
          },
          {
            id: 'monthly_streak',
            title: 'Monthly Dedication',
            description: 'Complete daily questions for 30 consecutive days',
            icon: 'calendar',
            category: 'streak',
            points: 200,
            requiredValue: 30
          },
          {
            id: 'vocabulary_master',
            title: 'Vocabulary Master',
            description: 'Learn 100 vocabulary words',
            icon: 'book',
            category: 'learning',
            points: 100,
            requiredValue: 100
          },
          {
            id: 'grammar_guru',
            title: 'Grammar Guru',
            description: 'Complete 20 grammar exercises',
            icon: 'check-circle',
            category: 'mastery',
            points: 75,
            requiredValue: 20
          },
          {
            id: 'social_butterfly',
            title: 'Social Butterfly',
            description: 'Participate in a community challenge',
            icon: 'users',
            category: 'social',
            points: 30
          },
          {
            id: 'citizenship_expert',
            title: 'Citizenship Expert',
            description: 'Complete all citizenship modules',
            icon: 'award',
            category: 'mastery',
            points: 150
          }
        ];
        
        // Mark which achievements are unlocked
        const mappedAchievements = availableAchievements.map(achievement => {
          const userAchievement = userAchievements?.find(
            ua => ua.achievement_name === achievement.title || ua.achievement_type === achievement.id
          );
          
          if (userAchievement) {
            return {
              ...achievement,
              unlockedAt: new Date(userAchievement.achieved_at)
            };
          }
          
          return achievement;
        });
        
        setAchievements(mappedAchievements);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setIsLoadingAchievements(false);
      }
    };
    
    loadAchievements();
  }, [user]);
  
  // Add XP to user
  const addXP = async (amount: number, source: string) => {
    if (!user || amount <= 0) return;
    
    try {
      // Calculate old and new levels
      const oldLevel = userLevel;
      
      // Add XP to database
      await supabase.rpc('add_user_xp', { 
        user_id: user.id, 
        xp_amount: amount, 
        activity_type: source 
      });
      
      // Update local XP state
      const newXP = currentXP + amount;
      setCurrentXP(newXP);
      
      // Calculate new level
      const { level: newLevel } = calculateLevelProgress(newXP);
      setUserLevel(newLevel);
      
      // Check if user leveled up
      if (newLevel > oldLevel) {
        showLevelUp(newLevel, oldLevel);
      }
      
      // Show toast for XP gain
      toast({
        title: `+${amount} XP`,
        description: `You earned XP from ${source}`,
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  };
  
  // Update user streak
  const updateStreak = async (hasActivity: boolean) => {
    if (!user || !hasActivity) return;
    
    try {
      // In a real app, this would update the streak in the database
      // For now, we'll just show a toast
      toast({
        title: 'Streak Maintained',
        description: 'You've maintained your daily streak!',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };
  
  // Unlock an achievement
  const unlockAchievement = async (achievementId: string) => {
    if (!user) return;
    
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlockedAt) return; // Already unlocked or doesn't exist
    
    try {
      // Save achievement to database
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_name: achievement.title,
          achievement_type: achievement.id,
          description: achievement.description
        });
        
      if (error) throw error;
      
      // Update local state
      setAchievements(achievements.map(a => 
        a.id === achievementId 
          ? { ...a, unlockedAt: new Date() } 
          : a
      ));
      
      // Show achievement unlocked dialog
      showAchievementUnlock(achievement);
      
      // Add XP for achievement
      addXP(achievement.points, 'Achievement Unlocked');
      
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };
  
  // Display achievement unlock dialog
  const showAchievementUnlock = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setShowAchievementDialog(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowAchievementDialog(false);
    }, 5000);
  };
  
  // Display level up dialog
  const showLevelUp = (newLevel: number, oldLevel: number) => {
    setLevelUpDetails({ newLevel, oldLevel });
    setShowLevelUpDialog(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowLevelUpDialog(false);
    }, 5000);
  };
  
  // Get user level
  const getUserLevel = () => userLevel;
  
  // Get current XP
  const getCurrentXP = () => currentXP;
  
  // Render achievement icon
  const renderAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="h-6 w-6 text-amber-500" />;
      case 'award': return <Award className="h-6 w-6 text-amber-500" />;
      case 'star': return <Star className="h-6 w-6 text-amber-500" />;
      case 'flame': return <Flame className="h-6 w-6 text-amber-500" />;
      case 'check-circle': return <CheckCircle className="h-6 w-6 text-amber-500" />;
      default: return <Award className="h-6 w-6 text-amber-500" />;
    }
  };
  
  return (
    <GamificationContext.Provider
      value={{
        addXP,
        updateStreak,
        showAchievementUnlock,
        showLevelUp,
        getUserLevel,
        getCurrentXP,
        unlockAchievement,
        achievements,
        isLoadingAchievements,
      }}
    >
      {children}
      
      {/* Achievement Unlocked Dialog */}
      <Dialog open={showAchievementDialog} onOpenChange={setShowAchievementDialog}>
        <DialogContent className="sm:max-w-md">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DialogHeader>
              <DialogTitle className="text-center">Achievement Unlocked!</DialogTitle>
              <DialogDescription className="text-center">
                You've earned a new achievement
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-6">
              <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                >
                  {currentAchievement && renderAchievementIcon(currentAchievement.icon)}
                </motion.div>
              </div>
              <h3 className="text-xl font-bold mb-1">{currentAchievement?.title}</h3>
              <p className="text-muted-foreground text-center mb-3">
                {currentAchievement?.description}
              </p>
              <div className="text-amber-500 font-bold text-lg">
                +{currentAchievement?.points} XP
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={() => setShowAchievementDialog(false)}>
                Continue
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
      
      {/* Level Up Dialog */}
      <Dialog open={showLevelUpDialog} onOpenChange={setShowLevelUpDialog}>
        <DialogContent className="sm:max-w-md">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DialogHeader>
              <DialogTitle className="text-center">Level Up!</DialogTitle>
              <DialogDescription className="text-center">
                You've reached a new level
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-6">
              <div className="relative mb-6">
                <motion.div 
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-5xl font-bold text-primary">
                    {levelUpDetails.newLevel}
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold text-muted"
                >
                  {levelUpDetails.oldLevel}
                </motion.div>
              </div>
              
              <h3 className="text-xl font-bold mb-4">Congratulations!</h3>
              <p className="text-muted-foreground text-center mb-3">
                You've leveled up to level {levelUpDetails.newLevel}!
              </p>
              <p className="text-muted-foreground text-center mb-5">
                Keep learning to unlock more achievements and reach higher levels.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={() => setShowLevelUpDialog(false)}>
                Continue
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </GamificationContext.Provider>
  );
};

export const useGamificationContext = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
};
