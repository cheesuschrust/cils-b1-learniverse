
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, BarChart, BookOpen, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';

// Mock data for reading history
const readingHistoryData = [
  {
    id: 1,
    title: 'Tourist Information',
    date: '2025-04-05',
    score: 85,
    timeSpent: '8 minutes',
    difficulty: 'Beginner',
    progress: 'Completed'
  },
  {
    id: 2,
    title: 'Italian Cuisine',
    date: '2025-04-03',
    score: 90,
    timeSpent: '11 minutes',
    difficulty: 'Beginner',
    progress: 'Completed'
  },
  {
    id: 3,
    title: 'Daily Routines',
    date: '2025-03-29',
    score: 75,
    timeSpent: '14 minutes',
    difficulty: 'Beginner',
    progress: 'Completed'
  },
  {
    id: 4,
    title: 'Italian Newspaper Article',
    date: '2025-03-25',
    score: 0,
    timeSpent: '7 minutes',
    difficulty: 'Intermediate',
    progress: 'Abandoned'
  }
];

// Mock data for weekly progress stats
const weeklyProgressStats = [
  { week: 'Week 1', exercises: 2, avgScore: 75 },
  { week: 'Week 2', exercises: 3, avgScore: 80 },
  { week: 'Week 3', exercises: 1, avgScore: 85 },
  { week: 'Week 4', exercises: 2, avgScore: 83 }
];

const ReadingHistory = () => {
  const { isAuthenticated } = useAuth();
  
  // Calculate progress metrics
  const totalExercises = readingHistoryData.length;
  const completedExercises = readingHistoryData.filter(item => item.progress === 'Completed').length;
  const avgScore = Math.round(
    readingHistoryData
      .filter(item => item.progress === 'Completed')
      .reduce((sum, item) => sum + item.score, 0) / completedExercises
  );
  
  // Calculate trends
  const currentWeekAvg = weeklyProgressStats[weeklyProgressStats.length - 1].avgScore;
  const prevWeekAvg = weeklyProgressStats[weeklyProgressStats.length - 2].avgScore;
  const scoreTrend = currentWeekAvg - prevWeekAvg;
  
  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <Link to="/reading">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reading Exercises
        </Link>
      </Button>
      
      <h1 className="text-3xl font-bold mb-2">Reading History</h1>
      <p className="text-muted-foreground mb-6">Track your progress and review past reading exercises</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{totalExercises}</p>
                <p className="text-xs text-muted-foreground">
                  {completedExercises} completed ({Math.round((completedExercises/totalExercises) * 100)}%)
                </p>
              </div>
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{avgScore}%</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  {scoreTrend > 0 ? (
                    <>
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">{scoreTrend}%</span> from last week
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-red-500">{Math.abs(scoreTrend)}%</span> from last week
                    </>
                  )}
                </p>
              </div>
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{weeklyProgressStats[weeklyProgressStats.length - 1].exercises}</p>
                <p className="text-xs text-muted-foreground">
                  exercises this week
                </p>
              </div>
              <BarChart className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Exercise History</CardTitle>
          <CardDescription>Your recent reading activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {readingHistoryData.map((item, index) => (
              <div key={item.id} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.date).toLocaleDateString()}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {item.timeSpent}
                    </Badge>
                    <Badge className={
                      item.difficulty === 'Beginner' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : item.difficulty === 'Intermediate'
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    }>
                      {item.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  {item.progress === 'Completed' ? (
                    <div className="flex items-center text-green-600 mb-1">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{item.score}%</span>
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 mb-1">
                      {item.progress}
                    </Badge>
                  )}
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/reading/exercise/${item.id}`}>
                      Review
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {isAuthenticated && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to improve your reading skills?
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/reading">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Exercises
              </Link>
            </Button>
            <Button asChild>
              <Link to="/reading/practice">
                <BookOpen className="mr-2 h-4 w-4" />
                Practice Mode
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingHistory;
