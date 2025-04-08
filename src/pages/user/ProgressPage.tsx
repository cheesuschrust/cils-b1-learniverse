
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ProgressDashboard from '@/components/user/ProgressDashboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, BookOpen, Flame, Award, ArrowRight } from 'lucide-react';

const ProgressPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Your Progress | Italian Language Learning</title>
      </Helmet>
      
      <div className="container py-8">
        <ProgressDashboard />
        
        <div className="mt-8">
          <Tabs defaultValue="achievements">
            <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex">
              <TabsTrigger value="achievements" className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span className="hidden md:inline">Achievements</span>
              </TabsTrigger>
              <TabsTrigger value="streaks" className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                <span className="hidden md:inline">Streaks</span>
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span className="hidden md:inline">Recommendations</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="achievements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Milestones you've reached in your Italian learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AchievementCard
                      title="First Steps"
                      description="Completed your first exercise"
                      icon={<BookOpen className="h-5 w-5 text-blue-500" />}
                      achieved={true}
                    />
                    <AchievementCard
                      title="Week Warrior"
                      description="Maintained a 7-day streak"
                      icon={<Flame className="h-5 w-5 text-orange-500" />}
                      achieved={false}
                    />
                    <AchievementCard
                      title="Vocabulary Master"
                      description="Learned 100 new words"
                      icon={<Award className="h-5 w-5 text-amber-500" />}
                      achieved={false}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="streaks" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Streak History</CardTitle>
                  <CardDescription>Your daily learning activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center">
                    <p className="text-muted-foreground">Streak data visualization will be displayed here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>Based on your learning patterns and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <RecommendationCard
                      title="Practice Past Tense Verbs"
                      description="Your exercises show you could benefit from more practice with past tense conjugations."
                      category="Grammar"
                    />
                    <RecommendationCard
                      title="Try Some Listening Exercises"
                      description="You haven't done many listening activities recently. Keep your skills balanced!"
                      category="Listening"
                    />
                    <RecommendationCard
                      title="Review Food Vocabulary"
                      description="Strengthen your vocabulary around restaurant and food-related terms."
                      category="Vocabulary"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

const AchievementCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  achieved: boolean;
}> = ({ title, description, icon, achieved }) => {
  return (
    <div className={`p-4 rounded-lg border ${achieved ? 'bg-muted/50' : 'bg-muted/20 opacity-60'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${achieved ? 'bg-background' : 'bg-muted'}`}>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          {achieved ? (
            <span className="text-xs text-green-600 font-medium">Achieved</span>
          ) : (
            <span className="text-xs text-muted-foreground">Not yet achieved</span>
          )}
        </div>
      </div>
    </div>
  );
};

const RecommendationCard: React.FC<{
  title: string;
  description: string;
  category: string;
}> = ({ title, description, category }) => {
  return (
    <div className="p-4 rounded-lg border bg-card flex justify-between items-center">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <span className="text-xs bg-muted px-2 py-0.5 rounded">{category}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="outline" size="sm" className="flex-shrink-0">
        Start <ArrowRight className="ml-1 h-3 w-3" />
      </Button>
    </div>
  );
};

export default ProgressPage;
