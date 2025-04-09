
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, Award, BarChart, PenTool, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/EnhancedAuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Extract first name from email if user metadata is not available
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Student';

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Dashboard | CILS B1 Italian Prep</title>
      </Helmet>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
          <p className="text-muted-foreground">
            Continue your Italian language journey for the CILS B1 citizenship exam
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Vocabulary Practice
              </CardTitle>
              <CardDescription>
                Expand your Italian vocabulary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-2xl">54</p>
                  <p className="text-sm text-muted-foreground">cards mastered</p>
                </div>
                <Button asChild>
                  <Link to="/flashcards">Practice Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Headphones className="mr-2 h-5 w-5 text-primary" />
                Listening Comprehension
              </CardTitle>
              <CardDescription>
                Improve your listening skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-2xl">3</p>
                  <p className="text-sm text-muted-foreground">exercises completed</p>
                </div>
                <Button asChild>
                  <Link to="/practice/listening">Start Listening</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <PenTool className="mr-2 h-5 w-5 text-primary" />
                Writing Practice
              </CardTitle>
              <CardDescription>
                Develop your writing ability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-2xl">2</p>
                  <p className="text-sm text-muted-foreground">essays written</p>
                </div>
                <Button asChild>
                  <Link to="/practice/writing">Write Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Speaking Practice
              </CardTitle>
              <CardDescription>
                Practice your speaking skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-2xl">5</p>
                  <p className="text-sm text-muted-foreground">dialogues practiced</p>
                </div>
                <Button asChild>
                  <Link to="/practice/speaking">Start Speaking</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Your Progress
              </CardTitle>
              <CardDescription>
                Track your improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-2xl">68%</p>
                  <p className="text-sm text-muted-foreground">overall progress</p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/profile">View Progress</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" />
                Mock Exam
              </CardTitle>
              <CardDescription>
                Test your readiness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-2xl">1</p>
                  <p className="text-sm text-muted-foreground">exam completed</p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/mock-exam">Take Exam</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Study Plan for CILS B1 Exam</CardTitle>
            <CardDescription>
              Your personalized preparation plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-medium">1</div>
                  <div>
                    <p className="font-medium">Complete Vocabulary Basics</p>
                    <p className="text-sm text-muted-foreground">Master core Italian words for citizenship</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/flashcards">Continue</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-medium">2</div>
                  <div>
                    <p className="font-medium">Practice Listening Comprehension</p>
                    <p className="text-sm text-muted-foreground">Understand spoken Italian in various contexts</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/practice/listening">Start</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-medium">3</div>
                  <div>
                    <p className="font-medium">Work on Grammar Foundations</p>
                    <p className="text-sm text-muted-foreground">Master Italian sentence structure and verb tenses</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Unlocks in 2 days
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
