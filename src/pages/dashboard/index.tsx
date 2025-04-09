
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Trophy, Calendar, Book, Target, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { user } = useAuth();
  
  const userStats = {
    currentXP: 1250,
    levelXP: 1000,
    nextLevelXP: 2000,
    level: 5,
    streak: 7,
    completedActivities: 45,
    progress: {
      reading: 65,
      writing: 42,
      listening: 78,
      speaking: 36
    }
  };

  const firstName = user?.email?.split('@')[0] || 'User';

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Benvenuto, {firstName}!</h1>
          <p className="text-muted-foreground">Your Italian language learning journey continues</p>
        </div>
        <div className="bg-primary/10 rounded-lg p-3 text-center">
          <div className="text-3xl font-bold text-primary">{userStats.currentXP}</div>
          <div className="text-xs text-muted-foreground">XP Points</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.level}</div>
            <Progress value={(userStats.currentXP - userStats.levelXP) / (userStats.nextLevelXP - userStats.levelXP) * 100} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {userStats.nextLevelXP - userStats.currentXP} XP to next level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.streak} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep it up! Practice daily to increase your streak.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Book className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.completedActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total activities completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B1 Reading</div>
            <p className="text-xs text-muted-foreground mt-1">
              Focus on improving your reading skills
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Modules</CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <BookOpen className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-lg mr-4" />
                  <div>
                    <h3 className="font-medium">B1 Reading Comprehension</h3>
                    <p className="text-sm text-muted-foreground">Exercise 4/10 - Newspaper Articles</p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/reading/exercise/4">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <BookOpen className="h-10 w-10 p-2 bg-green-100 text-green-600 rounded-lg mr-4" />
                  <div>
                    <h3 className="font-medium">Essential Vocabulary</h3>
                    <p className="text-sm text-muted-foreground">Flashcards - Daily Life</p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/flashcards/daily-life">
                    Review <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <BookOpen className="h-10 w-10 p-2 bg-amber-100 text-amber-600 rounded-lg mr-4" />
                  <div>
                    <h3 className="font-medium">Grammar Basics</h3>
                    <p className="text-sm text-muted-foreground">Present Tense Verbs</p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/grammar/present-tense">
                    Practice <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Module Progress</CardTitle>
              <CardDescription>Track your skills development</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Reading</span>
                  <span className="text-muted-foreground">{userStats.progress.reading}%</span>
                </div>
                <Progress value={userStats.progress.reading} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Writing</span>
                  <span className="text-muted-foreground">{userStats.progress.writing}%</span>
                </div>
                <Progress value={userStats.progress.writing} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Listening</span>
                  <span className="text-muted-foreground">{userStats.progress.listening}%</span>
                </div>
                <Progress value={userStats.progress.listening} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Speaking</span>
                  <span className="text-muted-foreground">{userStats.progress.speaking}%</span>
                </div>
                <Progress value={userStats.progress.speaking} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Challenge</CardTitle>
              <CardDescription>Complete for bonus XP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-medium">Translate this sentence:</h3>
                <p className="italic mt-2">"Vorrei prenotare un tavolo per due persone, per favore."</p>
                <Button className="w-full mt-4">Start Challenge</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Goals</CardTitle>
              <CardDescription>3/5 completed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">Complete 10 flashcards sessions</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">Practice verb conjugations for 15 minutes</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">Complete 2 reading exercises</p>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 border rounded-full mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">Practice listening with 3 audio clips</p>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 border rounded-full mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">Take a practice B1 mock test</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/flashcards">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Flashcards
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/practice-test">
                  <Target className="mr-2 h-4 w-4" />
                  Practice Test
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
