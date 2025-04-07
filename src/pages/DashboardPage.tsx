
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, List, User, Settings, LogOut } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.firstName || 'User'}!</h1>
        <Button variant="ghost" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-italian-green" />
              Italian Language
            </CardTitle>
            <CardDescription>Practice your Italian language skills</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Build vocabulary and grammar skills required for the CILS B1 exam.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Start Learning</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="h-5 w-5 mr-2 text-italian-red" />
              Citizenship Test
            </CardTitle>
            <CardDescription>Prepare for your citizenship test</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Learn about Italian culture, history, and civic knowledge needed for citizenship.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Practice Tests</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-italian-blue" />
              My Progress
            </CardTitle>
            <CardDescription>Track your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View your progress, achievements, and areas for improvement.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">View Progress</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No recent activity found. Start learning to see your progress!</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
