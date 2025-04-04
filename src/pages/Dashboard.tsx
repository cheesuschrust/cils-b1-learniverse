
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock, BookOpen, MessageSquare, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard | ItalianMaster</title>
      </Helmet>

      <div className="container py-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold">Benvenuto!</h1>
          <p className="text-muted-foreground">
            Track your progress and continue your learning journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">Daily Practice</CardTitle>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-4">
                <p>Complete your daily practice to maintain your streak.</p>
                <Badge variant="secondary">5 day streak</Badge>
                <div className="pt-4">
                  <Button className="w-full" asChild>
                    <Link to="/italian-citizenship-test">Start Daily Quiz</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">Speaking Practice</CardTitle>
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-4">
                <p>Improve your pronunciation and fluency with speaking exercises.</p>
                <Badge variant="secondary">Intermediate level</Badge>
                <div className="pt-4">
                  <Button className="w-full" asChild>
                    <Link to="/speaking">Practice Speaking</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">Citizenship Test</CardTitle>
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-4">
                <p>Prepare for your Italian citizenship test with practice questions.</p>
                <Badge variant="secondary">31 modules</Badge>
                <div className="pt-4">
                  <Button className="w-full" asChild>
                    <Link to="/italian-citizenship-test">Practice Test</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Vocabulary</div>
                    <div className="text-sm text-muted-foreground">65%</div>
                  </div>
                  <div className="h-2 bg-secondary rounded">
                    <div className="h-full bg-primary rounded w-[65%]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Grammar</div>
                    <div className="text-sm text-muted-foreground">42%</div>
                  </div>
                  <div className="h-2 bg-secondary rounded">
                    <div className="h-full bg-primary rounded w-[42%]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Speaking</div>
                    <div className="text-sm text-muted-foreground">28%</div>
                  </div>
                  <div className="h-2 bg-secondary rounded">
                    <div className="h-full bg-primary rounded w-[28%]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Achievements</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">5 Day Streak</h3>
                  <p className="text-sm text-muted-foreground">
                    You've practiced for 5 days in a row!
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Grammar Master</h3>
                  <p className="text-sm text-muted-foreground">
                    Completed 10 grammar exercises
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">First Conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Completed your first speaking practice
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
