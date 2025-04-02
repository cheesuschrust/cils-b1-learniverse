
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Headphones, PenTool, MessageCircle, Music, BookCheck, Calendar, History, LineChart } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.firstName}!</h1>
          <p className="text-muted-foreground">
            Continue your preparation for the CILS B1 Citizenship Italian Language Test.
          </p>
        </div>
        
        {/* Daily Question Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-xl">Question of the Day</CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Test your Italian skills with a new question every day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Today's question focuses on {user.dailyQuestionCounts.flashcards > 0 ? 'vocabulary' : 'grammar'}.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" asChild>
              <Link to="/learn/daily-question">
                <Calendar className="mr-2 h-4 w-4" />
                Go to Today's Question
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Learning Modules */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Learning Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  Flashcards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build your Italian vocabulary with interactive flashcards
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/learn/flashcards">Practice Flashcards</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Headphones className="mr-2 h-5 w-5 text-primary" />
                  Listening
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Improve your listening comprehension skills
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/learn/listening">Listening Exercises</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <BookCheck className="mr-2 h-5 w-5 text-primary" />
                  Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enhance your reading comprehension abilities
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/learn/reading">Reading Exercises</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <PenTool className="mr-2 h-5 w-5 text-primary" />
                  Writing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Develop your written Italian expression
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/learn/writing">Writing Exercises</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                  Speaking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Practice your Italian speaking and pronunciation
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/learn/speaking">Speaking Practice</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <LineChart className="mr-2 h-5 w-5 text-primary" />
                Your Learning Progress
              </CardTitle>
              <CardDescription>Track your improvement over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">Progress chart will be displayed here</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <History className="mr-2 h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium">Completed 5 flashcards</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium">Finished a listening exercise</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <p className="text-sm font-medium">Completed daily question</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link to="/profile/history">View All Activity</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
