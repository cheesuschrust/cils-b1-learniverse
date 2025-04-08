
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { Flame, Star, Award, Trophy } from 'lucide-react';
import LevelProgressBar from '@/components/gamification/LevelProgressBar';
import XPPointsDisplay from '@/components/gamification/XPPointsDisplay';
import StreakCounter from '@/components/gamification/StreakCounter';
import GamificationDashboardSummary from '@/components/gamification/GamificationDashboardSummary';
import StreakCard from '@/components/gamification/StreakCard';
import WeeklyChallengeCard from '@/components/gamification/WeeklyChallengeCard';

const GamificationDashboard = () => {
  const { getCurrentXP, getUserLevel, achievements, weeklyChallenge } = useGamificationContext();
  
  const currentXP = getCurrentXP();
  const currentLevel = getUserLevel();
  
  // Filter unlocked achievements
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Learning Journey</h1>
        <XPPointsDisplay xp={currentXP} xpToday={75} showTodayXP />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LevelProgressBar />
            </CardContent>
          </Card>
          
          <StreakCard 
            currentStreak={7} 
            longestStreak={10} 
            lastActivity={new Date()} 
            progressToday={true} 
          />
        </div>
        
        <GamificationDashboardSummary className="md:col-span-2" />
        
        <WeeklyChallengeCard className="md:col-span-2" />
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              Achievement Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-3 text-center">
                <div className="text-3xl font-bold">
                  {unlockedAchievements.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Achievements
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-3 text-center">
                <div className="text-3xl font-bold">
                  {unlockedAchievements.reduce((total, a) => total + a.points, 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  XP Earned
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span>{Math.round((unlockedAchievements.length / achievements.length) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-indigo-500 h-2.5 rounded-full" 
                  style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamificationDashboard;
