
import { supabase } from "@/lib/supabase";
import { Achievement, Level, UserGamification, WeeklyChallenge, LeaderboardEntry } from "@/types/gamification";
import { useToast } from "@/hooks/use-toast";

// Define all achievements
const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_question",
    title: "First Steps",
    description: "Answer your first question",
    icon: "trophy",
    category: "learning",
    points: 10,
    requiredValue: 1,
  },
  {
    id: "streak_3",
    title: "Consistency Beginner",
    description: "Maintain a 3-day learning streak",
    icon: "flame",
    category: "streak",
    points: 30,
    requiredValue: 3,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "flame",
    category: "streak",
    points: 70,
    requiredValue: 7,
  },
  {
    id: "streak_30",
    title: "Monthly Devotion",
    description: "Maintain a 30-day learning streak",
    icon: "flame",
    category: "streak",
    points: 300,
    requiredValue: 30,
  },
  {
    id: "questions_10",
    title: "Curious Mind",
    description: "Answer 10 questions correctly",
    icon: "check-circle",
    category: "learning",
    points: 20,
    requiredValue: 10,
  },
  {
    id: "questions_50",
    title: "Knowledge Seeker",
    description: "Answer 50 questions correctly",
    icon: "check-circle",
    category: "learning",
    points: 100,
    requiredValue: 50,
  },
  {
    id: "questions_100",
    title: "Knowledge Master",
    description: "Answer 100 questions correctly",
    icon: "check-circle",
    category: "learning",
    points: 200,
    requiredValue: 100,
  },
  {
    id: "perfect_quiz",
    title: "Perfect Score",
    description: "Complete a quiz with 100% accuracy",
    icon: "badge",
    category: "mastery",
    points: 50,
    requiredValue: 1,
  },
  {
    id: "reviews_10",
    title: "Review Novice",
    description: "Complete 10 spaced repetition reviews",
    icon: "repeat",
    category: "learning",
    points: 30,
    requiredValue: 10,
  },
  {
    id: "reviews_50",
    title: "Review Expert",
    description: "Complete 50 spaced repetition reviews",
    icon: "repeat",
    category: "learning",
    points: 150,
    requiredValue: 50,
  },
  {
    id: "level_5",
    title: "Rising Star",
    description: "Reach level 5",
    icon: "star",
    category: "mastery",
    points: 50,
    requiredValue: 5,
  },
  {
    id: "level_10",
    title: "Learning Prodigy",
    description: "Reach level 10",
    icon: "star",
    category: "mastery",
    points: 100,
    requiredValue: 10,
  },
  {
    id: "level_20",
    title: "Learning Legend",
    description: "Reach level 20",
    icon: "star",
    category: "mastery",
    points: 200,
    requiredValue: 20,
  },
  {
    id: "weekly_challenge",
    title: "Challenge Accepted",
    description: "Complete a weekly challenge",
    icon: "award",
    category: "challenge",
    points: 100,
    requiredValue: 1,
  },
  {
    id: "multi_category",
    title: "Renaissance Learner",
    description: "Study in at least 3 different categories",
    icon: "circle-check",
    category: "learning",
    points: 40,
    requiredValue: 3,
  }
];

// Define XP level thresholds
const LEVELS: Level[] = Array.from({ length: 30 }, (_, i) => ({
  level: i + 1,
  minXp: Math.floor(100 * Math.pow(1.5, i)),
  maxXp: Math.floor(100 * Math.pow(1.5, i + 1)) - 1,
  title: getLevelTitle(i + 1)
}));

function getLevelTitle(level: number): string {
  if (level <= 5) return "Beginner";
  if (level <= 10) return "Novice";
  if (level <= 15) return "Intermediate";
  if (level <= 20) return "Advanced";
  if (level <= 25) return "Expert";
  return "Master";
}

class GamificationService {
  // Get user gamification data
  async getUserGamification(userId: string): Promise<UserGamification | null> {
    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGSQL_EMPTY_RESULT') {
          // Create new gamification record if it doesn't exist
          return this.initializeUserGamification(userId);
        }
        throw error;
      }
      
      // Transform data to match our interface
      return {
        xp: data.xp || 0,
        level: data.level || 1,
        achievements: data.achievements || [],
        streakDays: data.streak_days || 0,
        longestStreak: data.longest_streak || 0,
        lastActivityDate: data.last_activity_date ? new Date(data.last_activity_date) : undefined,
        weeklyXp: data.weekly_xp || 0,
        totalCorrectAnswers: data.total_correct_answers || 0,
        totalCompletedReviews: data.total_completed_reviews || 0,
        weeklyChallenge: data.weekly_challenge,
        lifetimeXp: data.lifetime_xp || 0
      };
    } catch (error) {
      console.error('Error fetching user gamification:', error);
      return null;
    }
  }

  // Initialize new user gamification data
  async initializeUserGamification(userId: string): Promise<UserGamification> {
    const initialData = {
      user_id: userId,
      xp: 0,
      level: 1,
      achievements: [],
      streak_days: 0,
      longest_streak: 0,
      last_activity_date: new Date().toISOString(),
      weekly_xp: 0,
      total_correct_answers: 0,
      total_completed_reviews: 0,
      lifetime_xp: 0
    };

    try {
      const { error } = await supabase
        .from('user_gamification')
        .insert(initialData);
      
      if (error) throw error;
      
      return {
        xp: 0,
        level: 1,
        achievements: [],
        streakDays: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        weeklyXp: 0,
        totalCorrectAnswers: 0,
        totalCompletedReviews: 0,
        lifetimeXp: 0
      };
    } catch (error) {
      console.error('Error initializing user gamification:', error);
      // Return default object even if DB insert fails
      return {
        xp: 0,
        level: 1,
        achievements: [],
        streakDays: 0,
        longestStreak: 0,
        weeklyXp: 0,
        totalCorrectAnswers: 0,
        totalCompletedReviews: 0,
        lifetimeXp: 0
      };
    }
  }

  // Award XP to a user
  async awardXp(userId: string, points: number, reason?: string): Promise<{ newXp: number, newLevel: number, leveledUp: boolean }> {
    try {
      // Get current user gamification data
      const userGamification = await this.getUserGamification(userId);
      if (!userGamification) throw new Error("Failed to get user gamification data");
      
      const oldLevel = userGamification.level;
      const newXp = userGamification.xp + points;
      const newLifetimeXp = userGamification.lifetimeXp + points;
      const newWeeklyXp = userGamification.weeklyXp + points;
      
      // Calculate new level
      const newLevel = this.calculateLevel(newXp);
      const leveledUp = newLevel > oldLevel;
      
      // Update user gamification record
      const { error } = await supabase
        .from('user_gamification')
        .update({
          xp: newXp,
          level: newLevel,
          weekly_xp: newWeeklyXp,
          lifetime_xp: newLifetimeXp,
          last_activity_date: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // If user leveled up, check for level-based achievements
      if (leveledUp) {
        this.checkAndAwardLevelAchievements(userId, newLevel);
      }
      
      return { newXp, newLevel, leveledUp };
    } catch (error) {
      console.error('Error awarding XP:', error);
      return { newXp: 0, newLevel: 0, leveledUp: false };
    }
  }

  // Calculate level based on XP
  calculateLevel(xp: number): number {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].minXp) {
        return LEVELS[i].level;
      }
    }
    return 1; // Default to level 1
  }

  // Get level details
  getLevelDetails(level: number): Level {
    return LEVELS.find(l => l.level === level) || LEVELS[0];
  }

  // Get all achievements
  getAllAchievements(): Achievement[] {
    return ACHIEVEMENTS;
  }

  // Get user achievements with progress
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const userGamification = await this.getUserGamification(userId);
      if (!userGamification) return [];
      
      const userAchievements = userGamification.achievements || [];
      
      // Merge user progress with achievement definitions
      return ACHIEVEMENTS.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.id === achievement.id);
        if (!userAchievement) {
          return { ...achievement, currentValue: 0 };
        }
        
        return {
          ...achievement,
          currentValue: userAchievement.progress,
          unlockedAt: userAchievement.earnedAt ? new Date(userAchievement.earnedAt) : undefined,
          level: userAchievement.level
        };
      });
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  // Check and update achievement progress
  async updateAchievementProgress(
    userId: string, 
    achievementId: string, 
    progress: number
  ): Promise<{ achieved: boolean, achievement: Achievement | null }> {
    try {
      const userGamification = await this.getUserGamification(userId);
      if (!userGamification) throw new Error("Failed to get user gamification data");
      
      const userAchievements = userGamification.achievements || [];
      const achievementDef = ACHIEVEMENTS.find(a => a.id === achievementId);
      
      if (!achievementDef) return { achieved: false, achievement: null };
      
      const existingAchievement = userAchievements.find(ua => ua.id === achievementId);
      const wasAlreadyAchieved = existingAchievement?.earnedAt != null;
      
      // Update or create the achievement progress
      let updatedAchievements;
      if (existingAchievement) {
        updatedAchievements = userAchievements.map(ua => {
          if (ua.id === achievementId) {
            const newProgress = Math.max(ua.progress, progress);
            const achieved = newProgress >= achievementDef.requiredValue && !ua.earnedAt;
            
            return {
              ...ua,
              progress: newProgress,
              earnedAt: achieved ? new Date().toISOString() : ua.earnedAt
            };
          }
          return ua;
        });
      } else {
        const achieved = progress >= achievementDef.requiredValue;
        updatedAchievements = [
          ...userAchievements,
          {
            id: achievementId,
            progress,
            earnedAt: achieved ? new Date().toISOString() : undefined
          }
        ];
      }
      
      // Update the database
      const { error } = await supabase
        .from('user_gamification')
        .update({
          achievements: updatedAchievements
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Check if the achievement was just earned
      const newAchievement = updatedAchievements.find(ua => ua.id === achievementId);
      const justAchieved = newAchievement?.earnedAt && !wasAlreadyAchieved;
      
      // Award XP if the achievement was just earned
      if (justAchieved && achievementDef.points) {
        await this.awardXp(userId, achievementDef.points, `Achievement: ${achievementDef.title}`);
      }
      
      return { 
        achieved: justAchieved, 
        achievement: justAchieved ? {
          ...achievementDef,
          currentValue: progress,
          unlockedAt: newAchievement?.earnedAt ? new Date(newAchievement.earnedAt) : undefined
        } : null 
      };
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      return { achieved: false, achievement: null };
    }
  }

  // Check and award level achievements
  async checkAndAwardLevelAchievements(userId: string, level: number): Promise<void> {
    try {
      const levelAchievements = ACHIEVEMENTS.filter(a => 
        a.category === 'mastery' && a.id.startsWith('level_')
      );
      
      for (const achievement of levelAchievements) {
        if (level >= achievement.requiredValue) {
          await this.updateAchievementProgress(userId, achievement.id, achievement.requiredValue);
        }
      }
    } catch (error) {
      console.error('Error checking level achievements:', error);
    }
  }

  // Update user streak
  async updateStreak(userId: string): Promise<{ 
    currentStreak: number, 
    increased: boolean,
    milestoneReached: boolean,
    milestone?: number 
  }> {
    try {
      const userGamification = await this.getUserGamification(userId);
      if (!userGamification) throw new Error("Failed to get user gamification data");
      
      const today = new Date();
      const lastActivity = userGamification.lastActivityDate;
      
      let newStreak = userGamification.streakDays;
      let increased = false;
      let milestoneReached = false;
      let milestone: number | undefined;
      
      // If there's no last activity or it was more than 2 days ago, reset streak
      if (!lastActivity || daysBetween(lastActivity, today) > 1) {
        newStreak = 1;
      } 
      // If last activity was yesterday, increase streak
      else if (daysBetween(lastActivity, today) === 1) {
        newStreak += 1;
        increased = true;
        
        // Check for streak milestones (3, 7, 30, etc.)
        const streakAchievements = ACHIEVEMENTS.filter(a => a.category === 'streak');
        for (const achievement of streakAchievements) {
          if (newStreak === achievement.requiredValue) {
            milestoneReached = true;
            milestone = achievement.requiredValue;
            await this.updateAchievementProgress(userId, achievement.id, newStreak);
          }
        }
      }
      // If already logged in today, do nothing to the streak
      
      const newLongestStreak = Math.max(userGamification.longestStreak, newStreak);
      
      // Update database
      const { error } = await supabase
        .from('user_gamification')
        .update({
          streak_days: newStreak,
          longest_streak: newLongestStreak,
          last_activity_date: today.toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // If streak increased, award XP
      if (increased) {
        // Bonus XP for milestone days
        const streakXp = milestone ? 20 * milestone : 10;
        await this.awardXp(userId, streakXp, `Daily streak: ${newStreak} days`);
      }
      
      return { currentStreak: newStreak, increased, milestoneReached, milestone };
    } catch (error) {
      console.error('Error updating streak:', error);
      return { currentStreak: 0, increased: false, milestoneReached: false };
    }
  }

  // Get current weekly challenge
  async getWeeklyChallenge(userId: string): Promise<WeeklyChallenge | null> {
    try {
      const { data, error } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('active', true)
        .single();
      
      if (error) {
        console.error('Error fetching weekly challenge:', error);
        return null;
      }
      
      // Get user progress for this challenge
      const userGamification = await this.getUserGamification(userId);
      if (!userGamification || !userGamification.weeklyChallenge) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          goal: data.goal,
          currentProgress: 0,
          xpReward: data.xp_reward,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          completed: false
        };
      }
      
      return {
        ...userGamification.weeklyChallenge,
        id: data.id,
        title: data.title,
        description: data.description,
        goal: data.goal,
        xpReward: data.xp_reward,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date)
      };
    } catch (error) {
      console.error('Error getting weekly challenge:', error);
      return null;
    }
  }

  // Update progress on weekly challenge
  async updateWeeklyChallengeProgress(
    userId: string, 
    progress: number
  ): Promise<{ completed: boolean, challenge: WeeklyChallenge | null }> {
    try {
      const challenge = await this.getWeeklyChallenge(userId);
      if (!challenge) return { completed: false, challenge: null };
      
      const userGamification = await this.getUserGamification(userId);
      if (!userGamification) throw new Error("Failed to get user gamification data");
      
      const newProgress = (challenge.currentProgress || 0) + progress;
      const wasCompleted = challenge.completed;
      const nowCompleted = newProgress >= challenge.goal && !wasCompleted;
      
      const updatedChallenge = {
        ...challenge,
        currentProgress: newProgress,
        completed: nowCompleted || wasCompleted,
        completedAt: nowCompleted ? new Date().toISOString() : challenge.completedAt
      };
      
      // Update database
      const { error } = await supabase
        .from('user_gamification')
        .update({
          weekly_challenge: updatedChallenge
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Award XP and achievement if just completed
      if (nowCompleted) {
        await this.awardXp(userId, challenge.xpReward, `Completed weekly challenge: ${challenge.title}`);
        await this.updateAchievementProgress(userId, 'weekly_challenge', 1);
      }
      
      return { completed: nowCompleted, challenge: updatedChallenge };
    } catch (error) {
      console.error('Error updating weekly challenge progress:', error);
      return { completed: false, challenge: null };
    }
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .select(`
          user_id,
          xp,
          level,
          streak_days,
          achievements,
          users (
            username,
            first_name,
            last_name,
            avatar
          )
        `)
        .order('xp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return (data || []).map(entry => ({
        userId: entry.user_id,
        username: entry.users?.username || 'Anonymous',
        displayName: entry.users?.first_name && entry.users?.last_name 
          ? `${entry.users.first_name} ${entry.users.last_name}`
          : undefined,
        avatar: entry.users?.avatar,
        xp: entry.xp,
        level: entry.level,
        achievements: (entry.achievements || []).filter((a: any) => a.earnedAt).length,
        streakDays: entry.streak_days
      }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }
}

// Helper functions
function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  // Remove time component for accurate day calculation
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
  return Math.round(Math.abs((d1.getTime() - d2.getTime()) / oneDay));
}

export default new GamificationService();
