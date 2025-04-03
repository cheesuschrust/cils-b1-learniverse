
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Book, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import LevelProgressBar from '@/components/gamification/LevelProgressBar';
import XPPointsDisplay from '@/components/gamification/XPPointsDisplay';
import ProgressTracker from '@/components/progress/ProgressTracker';
import Leaderboard from '@/components/gamification/Leaderboard';
import ChallengeSystem from '@/components/gamification/ChallengeSystem';
import DailyQuestion from '@/components/learning/DailyQuestion';

const Dashboard = () => {
  const userStats = {
    currentXP: 1250,
    levelXP: 1000,
    nextLevelXP: 2000,
    level: 5,
    streak: 7,
    completedActivities: 45
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Learning Dashboard</h1>
        <XPPointsDisplay xp={userStats.currentXP} xpToday={150} showTodayXP />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.level}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.streak} days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Book className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.completedActivities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B1 Reading</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <LevelProgressBar 
            currentXP={userStats.currentXP}
            levelXP={userStats.levelXP}
            nextLevelXP={userStats.nextLevelXP}
            level={userStats.level}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild>
                <Link to="/daily-questions">Daily Question</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/practice-test">Practice Test</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/speaking">Speaking Exercise</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/writing">Writing Task</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Leaderboard limit={5} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <DailyQuestion />
          <ChallengeSystem />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
