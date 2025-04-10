
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, BarChart3, User } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <>
      <Helmet>
        <title>Dashboard | CILS B1 Italian Prep</title>
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!</h1>
          <p className="text-muted-foreground">Continue your Italian language learning journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Daily Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">7 days</p>
              <p className="text-sm text-muted-foreground">Keep practicing daily!</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Vocabulary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">248 words</p>
              <p className="text-sm text-muted-foreground">Words learned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Proficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">B1</p>
              <p className="text-sm text-muted-foreground">Current level</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <User className="mr-2 h-5 w-5 text-primary" />
                Citizenship
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">64%</p>
              <p className="text-sm text-muted-foreground">Exam readiness</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Italian Grammar: Present Tense</h3>
                  <div className="bg-gray-100 h-2 rounded-full mb-2">
                    <div className="bg-primary h-2 rounded-full w-[70%]"></div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress: 70%</span>
                    <span>15 min remaining</span>
                  </div>
                  <Button className="mt-4" asChild>
                    <Link to="/app/practice">Continue Learning</Link>
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Citizenship Vocabulary</h3>
                  <div className="bg-gray-100 h-2 rounded-full mb-2">
                    <div className="bg-primary h-2 rounded-full w-[45%]"></div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress: 45%</span>
                    <span>20 min remaining</span>
                  </div>
                  <Button className="mt-4" asChild>
                    <Link to="/app/flashcards">Continue Flashcards</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Practice</CardTitle>
              <CardDescription>Keep your skills sharp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" asChild>
                  <Link to="/app/flashcards">Flashcards</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/app/practice">Listening Practice</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/app/practice">Multiple Choice</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/app/practice">Speaking Practice</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
