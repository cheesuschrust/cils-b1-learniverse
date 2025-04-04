
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchUserProgress } from '@/integrations/supabase/client';
import { Book, GraduationCap, Mic, BookOpen, Pen, Headphones, Star, Award, Clock, ArrowRight } from 'lucide-react';
import { calculateCILSB1Readiness } from '@/lib/utils';
import AuthGuard from '@/components/common/AuthGuard';

const mockUserLevel = {
  level: 'Intermediate (B1)',
  progress: 68,
  streak: 5,
  totalXp: 2840,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [readinessScore, setReadinessScore] = useState(0);

  // Simulated section scores for CILS B1 readiness
  const [sectionScores, setSectionScores] = useState({
    'reading': 75,
    'writing': 65,
    'listening': 70,
    'speaking': 60,
    'grammar': 80,
    'vocabulary': 85,
    'culture': 55,
    'citizenship': 50
  });

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchUserProgress(user.id)
        .then(data => {
          setUserProgress(data);
          
          // Calculate readiness score from section scores
          setReadinessScore(calculateCILSB1Readiness(sectionScores));
        })
        .catch(err => {
          console.error('Error fetching user progress:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  return (
    <AuthGuard>
      <Helmet>
        <title>Dashboard | ItalianMaster</title>
      </Helmet>
      <div className="container py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 md:items-end">
            <div>
              <h1 className="text-3xl font-bold">Ciao, {user?.firstName || 'Student'}!</h1>
              <p className="text-muted-foreground">Continue your Italian language journey</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link to="/flashcards">
                  <Book className="mr-2 h-4 w-4" />
                  Study Flashcards
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/progress">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  View Progress
                </Link>
              </Button>
            </div>
          </div>

          {/* CILS B1 Readiness Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" />
                CILS B1 Citizenship Exam Readiness
              </CardTitle>
              <CardDescription>
                Track your progress toward the Italian citizenship language requirement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Overall Readiness</span>
                    <span className="text-sm font-medium">{readinessScore}%</span>
                  </div>
                  <Progress value={readinessScore} />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(sectionScores).map(([section, score]) => (
                    <div key={section} className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground capitalize mb-1">{section}</div>
                      <div className="text-lg font-semibold">{score}%</div>
                      <Progress value={score} className="h-1.5 mt-1" />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/italian-citizenship-test">
                      Improve CILS readiness
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities Tabs */}
          <Tabs defaultValue="learn">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="learn">Learn</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="activities">Daily Activities</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
            </TabsList>
            
            <TabsContent value="learn" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-primary" />
                      Reading
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Improve your reading comprehension with Italian texts</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to="/reading">Start Reading</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Pen className="mr-2 h-4 w-4 text-primary" />
                      Writing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Practice written Italian with guided exercises</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to="/writing">Start Writing</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Mic className="mr-2 h-4 w-4 text-primary" />
                      Speaking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Improve your pronunciation and speaking skills</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to="/speaking">Start Speaking</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Headphones className="mr-2 h-4 w-4 text-primary" />
                      Listening
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Train your ear with Italian audio exercises</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to="/listening">Start Listening</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="practice" className="space-y-4">
              {/* Practice mode content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Flashcards</CardTitle>
                    <CardDescription>Practice your vocabulary with spaced repetition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-sm text-muted-foreground">cards due today</p>
                      </div>
                      <Badge variant="outline">B1 Level</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to="/flashcards">Study Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Daily Question</CardTitle>
                    <CardDescription>Test your knowledge with a daily challenge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">1</p>
                        <p className="text-sm text-muted-foreground">question available</p>
                      </div>
                      <Badge variant="secondary">New</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to="/daily-question">Answer</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="activities" className="space-y-4">
              {/* Activities content */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Current Streak</p>
                    <p className="text-2xl font-bold">{mockUserLevel.streak} days</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Clock className="mr-2 h-4 w-4" />
                  Activity History
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Reading Goal</CardTitle>
                      <Badge>5/15 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <Progress value={33} className="h-2" />
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link to="/reading">Continue Reading</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Speaking Goal</CardTitle>
                      <Badge>0/10 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <Progress value={0} className="h-2" />
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link to="/speaking">Start Speaking</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Vocabulary Goal</CardTitle>
                      <Badge>12/20 words</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <Progress value={60} className="h-2" />
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link to="/flashcards">Study Flashcards</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="recommended" className="space-y-4">
              {/* Recommended content based on level and progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for CILS B1 Preparation</CardTitle>
                  <CardDescription>Based on your recent progress and areas to improve</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
                            <Mic className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium">Speaking Practice: Citizenship Questions</p>
                            <p className="text-sm text-muted-foreground">Improve your speaking confidence for the citizenship interview</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">Priority</Badge>
                      </div>
                    </li>
                    <li className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                            <Pen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="font-medium">Writing Exercise: Formal Letters</p>
                            <p className="text-sm text-muted-foreground">Practice formal writing required for the B1 exam</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">Recommended</Badge>
                      </div>
                    </li>
                    <li className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                            <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">Italian Culture: Regional Differences</p>
                            <p className="text-sm text-muted-foreground">Expand your cultural knowledge for the citizenship test</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">Supplementary</Badge>
                      </div>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">
                    See All Recommendations <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
}
