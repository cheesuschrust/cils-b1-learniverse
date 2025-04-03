
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { BarChart, LineChart, Calendar, TrendingUp, Download, ArrowUpRight, BookOpen, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import SkillBreakdown from "@/components/progress/SkillBreakdown";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Headphones } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

// Import correct types from types folder
import type { SkillScore } from "@/components/progress/SkillBreakdown";

export default function ProgressPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [skillData, setSkillData] = useState<SkillScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProgress = async () => {
      setIsLoading(true);
      try {
        // Get user stats from Supabase
        const { data: userStats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user?.id)
          .single();
        
        if (statsError) throw statsError;
        
        // Get recent progress data
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('content_type, score, created_at')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(100);
          
        if (progressError) throw progressError;
        
        // Process the data to create skill breakdown
        const skillData: SkillScore[] = [
          {
            name: 'Listening',
            score: userStats?.listening_score || 0,
            targetScore: 60,
            icon: <Headphones className="h-5 w-5 text-blue-500" />,
            status: (userStats?.listening_score || 0) >= 60 ? 'passed' : 
                   (userStats?.listening_score || 0) >= 40 ? 'needs-improvement' : 'critical',
            recommendations: ['Practice with Italian audio dialogues daily']
          },
          {
            name: 'Reading',
            score: userStats?.reading_score || 0,
            targetScore: 60,
            icon: <BookOpen className="h-5 w-5 text-green-500" />,
            status: (userStats?.reading_score || 0) >= 60 ? 'passed' : 
                   (userStats?.reading_score || 0) >= 40 ? 'needs-improvement' : 'critical',
            recommendations: ['Read Italian news articles regularly']
          },
          {
            name: 'Writing',
            score: userStats?.writing_score || 0,
            targetScore: 60,
            icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
            status: (userStats?.writing_score || 0) >= 60 ? 'passed' : 
                   (userStats?.writing_score || 0) >= 40 ? 'needs-improvement' : 'critical',
            recommendations: ['Practice writing short essays in Italian']
          },
          {
            name: 'Speaking',
            score: userStats?.speaking_score || 0,
            targetScore: 60,
            icon: <MessageSquare className="h-5 w-5 text-orange-500" />,
            status: (userStats?.speaking_score || 0) >= 60 ? 'passed' : 
                   (userStats?.speaking_score || 0) >= 40 ? 'needs-improvement' : 'critical',
            recommendations: ['Record yourself speaking Italian daily']
          },
          {
            name: 'Grammar',
            score: calculateScoreFromProgress(progressData, 'grammar'),
            targetScore: 60,
            recentImprovement: calculateImprovement(progressData, 'grammar'),
            icon: <MessageSquare className="h-5 w-5 text-indigo-500" />,
            status: calculateScoreFromProgress(progressData, 'grammar') >= 60 ? 'passed' : 
                   calculateScoreFromProgress(progressData, 'grammar') >= 40 ? 'needs-improvement' : 'critical',
            recommendations: ['Review Italian verb conjugations']
          },
          {
            name: 'Vocabulary',
            score: calculateScoreFromProgress(progressData, 'vocabulary'),
            targetScore: 60,
            recentImprovement: calculateImprovement(progressData, 'vocabulary'),
            icon: <BookOpen className="h-5 w-5 text-yellow-500" />,
            status: calculateScoreFromProgress(progressData, 'vocabulary') >= 60 ? 'passed' : 
                   calculateScoreFromProgress(progressData, 'vocabulary') >= 40 ? 'needs-improvement' : 'critical',
            recommendations: ['Use flashcards for citizenship vocabulary']
          },
          {
            name: 'Citizenship',
            score: calculateScoreFromProgress(progressData, 'citizenship'),
            targetScore: 60,
            recentImprovement: calculateImprovement(progressData, 'citizenship'),
            icon: <BookOpen className="h-5 w-5 text-red-500" />,
            status: calculateScoreFromProgress(progressData, 'citizenship') >= 60 ? 'passed' : 
                   calculateScoreFromProgress(progressData, 'citizenship') >= 40 ? 'needs-improvement' : 'critical',
            recommendations: ['Study Italian civic education materials']
          }
        ];
        
        setSkillData(skillData);
      } catch (error) {
        console.error('Error fetching user progress:', error);
        toast({
          title: "Failed to load progress data",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.id) {
      fetchUserProgress();
    }
  }, [user?.id, timeRange]);
  
  // Helper function to calculate scores from progress data
  const calculateScoreFromProgress = (progressData: any[], contentType: string): number => {
    const relevantEntries = progressData?.filter(entry => entry.content_type === contentType) || [];
    if (relevantEntries.length === 0) return 0;
    
    const totalScore = relevantEntries.reduce((sum, entry) => sum + (entry.score || 0), 0);
    return Math.round(totalScore / relevantEntries.length);
  };
  
  // Helper function to calculate improvement
  const calculateImprovement = (progressData: any[], contentType: string): number => {
    const relevantEntries = progressData?.filter(entry => entry.content_type === contentType) || [];
    if (relevantEntries.length < 2) return 0;
    
    // Sort by date (most recent first)
    relevantEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Compare most recent scores with older ones
    const recentScores = relevantEntries.slice(0, 3);
    const olderScores = relevantEntries.slice(3, 6);
    
    if (recentScores.length === 0 || olderScores.length === 0) return 0;
    
    const recentAvg = recentScores.reduce((sum, entry) => sum + (entry.score || 0), 0) / recentScores.length;
    const olderAvg = olderScores.reduce((sum, entry) => sum + (entry.score || 0), 0) / olderScores.length;
    
    return Math.round(recentAvg - olderAvg);
  };
  
  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (skillData.length === 0) return 0;
    
    const totalScore = skillData.reduce((sum, skill) => sum + skill.score, 0);
    return Math.round(totalScore / skillData.length);
  };
  
  const exportProgressReport = () => {
    const reportData = {
      user: user?.firstName + ' ' + user?.lastName,
      exportDate: new Date().toLocaleDateString(),
      skills: skillData,
      overallProgress: calculateOverallProgress()
    };
    
    const reportString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([reportString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cils-progress-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Progress report exported",
      description: "Your report has been downloaded successfully",
      variant: "default"
    });
  };

  return (
    <>
      <Helmet>
        <title>Learning Progress | CILS B1 Citizenship</title>
        <meta name="description" content="Track your Italian language learning progress" />
      </Helmet>
      
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Learning Progress</h1>
            <p className="text-muted-foreground mt-1">
              Track your Italian language learning journey
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={exportProgressReport}>
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-3 mb-6 w-full md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skill Breakdown</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-md font-medium">Overall Progress</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{calculateOverallProgress()}%</div>
                    <Progress className="h-2 mt-2" value={calculateOverallProgress()} />
                    <p className="text-xs text-muted-foreground mt-2">
                      Target for CILS B1 Citizenship: 60%
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-md font-medium">Daily Streak</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {user?.dailyQuestionCounts?.streak || 0} days
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Keep practicing daily to increase your streak
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-md font-medium">CILS Exam Readiness</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">
                        {skillData.filter(s => s.status === 'passed').length} / {skillData.length}
                      </div>
                      <Badge 
                        className={
                          skillData.filter(s => s.status === 'passed').length / skillData.length >= 0.8
                            ? 'bg-green-100 text-green-800'
                            : skillData.filter(s => s.status === 'passed').length / skillData.length >= 0.5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {skillData.filter(s => s.status === 'passed').length / skillData.length >= 0.8
                          ? 'Ready'
                          : skillData.filter(s => s.status === 'passed').length / skillData.length >= 0.5
                          ? 'Almost Ready'
                          : 'Not Ready'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Skills passed at target level
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Progress</CardTitle>
                    <CardDescription>
                      Your activity across different skill areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {/* This would ideally contain a chart, but for simplicity we'll show a placeholder */}
                    <div className="flex items-center justify-center h-full bg-muted/20 rounded-md">
                      <p className="text-muted-foreground">
                        Progress visualization will appear here based on your recent activities
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Activity</CardTitle>
                    <CardDescription>
                      Hours spent studying per week
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    {/* Placeholder for study activity chart */}
                    <div className="flex items-center justify-center h-full bg-muted/20 rounded-md">
                      <p className="text-muted-foreground">
                        Activity chart will appear here based on your study time
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Areas</CardTitle>
                    <CardDescription>
                      Your strongest skill areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px] overflow-auto">
                    <div className="space-y-4">
                      {skillData
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 3)
                        .map((skill, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {skill.icon}
                              <span>{skill.name}</span>
                            </div>
                            <div className="text-sm font-medium">{skill.score}%</div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="skills">
              <div className="grid gap-6 md:grid-cols-2">
                <SkillBreakdown skills={skillData} />
                
                <Card>
                  <CardHeader>
                    <CardTitle>CILS B1 Citizenship Requirements</CardTitle>
                    <CardDescription>
                      Exam areas and required proficiency levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        The CILS B1 Citizenship exam evaluates your ability to use Italian in everyday situations.
                        You need to demonstrate proficiency in all core language skills.
                      </p>
                      
                      <div className="space-y-3 mt-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Listening</span>
                            <span className="text-sm">60% required</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Reading</span>
                            <span className="text-sm">60% required</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Writing</span>
                            <span className="text-sm">60% required</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Speaking</span>
                            <span className="text-sm">60% required</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t">
                        <h4 className="font-medium mb-2">Exam Structure</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Badge variant="outline">Listening</Badge>
                            <span>Two audio recordings with multiple-choice questions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge variant="outline">Reading</Badge>
                            <span>Two texts with comprehension questions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge variant="outline">Writing</Badge>
                            <span>Short essay and form completion</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge variant="outline">Speaking</Badge>
                            <span>Interview and role-playing with examiner</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Progress Over Time</CardTitle>
                  <CardDescription>
                    Your performance by skill area over the last {timeRange}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {/* Placeholder for progress over time chart */}
                  <div className="flex items-center justify-center h-full bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">
                      Time-series chart will appear here showing your skill progression
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Recommendations</CardTitle>
                    <CardDescription>
                      Personalized suggestions to improve your skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skillData
                        .filter(skill => skill.status !== 'passed')
                        .map((skill, i) => (
                          <div key={i} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {skill.icon}
                                <h3 className="font-medium">{skill.name}</h3>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={getSkillStatusColor(skill.status)}
                              >
                                {skill.score}%
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {skill.recommendations && skill.recommendations[0]}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Target: {skill.targetScore}%
                              </span>
                              
                              <Button variant="link" size="sm" className="h-auto p-0">
                                <span className="text-xs">Practice Now</span>
                                <ArrowUpRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Study Plan</CardTitle>
                    <CardDescription>
                      Weekly activities to improve your Italian
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Monday & Wednesday</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">20 min</Badge>
                              <span className="text-sm">Grammar Practice</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">15 min</Badge>
                              <span className="text-sm">Vocabulary Flashcards</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Tuesday & Thursday</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">20 min</Badge>
                              <span className="text-sm">Listening Exercises</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">15 min</Badge>
                              <span className="text-sm">Reading Comprehension</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Friday</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">20 min</Badge>
                              <span className="text-sm">Speaking Practice</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">20 min</Badge>
                              <span className="text-sm">Writing Exercise</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Weekend</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">30 min</Badge>
                              <span className="text-sm">Practice Test</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">15 min</Badge>
                              <span className="text-sm">Review Weak Areas</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                  <CardDescription>
                    Recommended materials for CILS B1 Citizenship exam preparation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Grammar Resources</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Italian Verb Conjugations</li>
                        <li>• Basic Grammar Rules</li>
                        <li>• Practice Exercises</li>
                      </ul>
                      <Button className="w-full mt-3" variant="outline" size="sm">
                        Explore Resources
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Listening Materials</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Italian Dialogues</li>
                        <li>• Comprehension Exercises</li>
                        <li>• Audio Practice Tests</li>
                      </ul>
                      <Button className="w-full mt-3" variant="outline" size="sm">
                        Explore Resources
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Citizenship Content</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Italian Culture</li>
                        <li>• Civic Knowledge</li>
                        <li>• Practice Questions</li>
                      </ul>
                      <Button className="w-full mt-3" variant="outline" size="sm">
                        Explore Resources
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}

// Helper function to determine skill status color
const getSkillStatusColor = (status: string) => {
  switch (status) {
    case 'passed':
      return 'text-green-700 bg-green-50 border-green-200';
    case 'needs-improvement':
      return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'critical':
      return 'text-red-700 bg-red-50 border-red-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};
