
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import ProgressChart from '@/components/progress/ProgressChart';
import ProgressSummary from '@/components/progress/ProgressSummary';
import ProgressCard from '@/components/ui/ProgressCard';
import { Headphones, BookOpen, Pen, Mic, Award, BookMarked } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { ItalianTestSection, ItalianLevel } from '@/types/italian-types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

export default function ProgressPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [progressData, setProgressData] = useState<any>(null);
  
  const targetScore = 70; // CILS B1 typically requires 70% or higher to pass
  
  // Sample progress data format - this would be fetched from the database
  const [chartData, setChartData] = useState([
    {
      date: '2023-10-01',
      listening: 65,
      reading: 70,
      writing: 60,
      speaking: 55,
      overall: 62
    },
    {
      date: '2023-10-08',
      listening: 68,
      reading: 75,
      writing: 63,
      speaking: 60,
      overall: 66
    },
    {
      date: '2023-10-15',
      listening: 72,
      reading: 78,
      writing: 67,
      speaking: 64,
      overall: 70
    },
    {
      date: '2023-10-22',
      listening: 75,
      reading: 80,
      writing: 70,
      speaking: 68,
      overall: 73
    }
  ]);
  
  // CILS B1 exam structure
  const examSections = [
    {
      name: 'Listening Comprehension',
      score: chartData[chartData.length - 1]?.listening || 0,
      icon: <Headphones className="h-4 w-4 text-primary" />,
      description: 'Understanding spoken Italian in everyday situations',
      timeAllowed: 30, // minutes
      passingScore: 70,
      items: 30
    },
    {
      name: 'Reading Comprehension',
      score: chartData[chartData.length - 1]?.reading || 0,
      icon: <BookOpen className="h-4 w-4 text-primary" />,
      description: 'Understanding written Italian in everyday situations',
      timeAllowed: 50, // minutes
      passingScore: 70,
      items: 35
    },
    {
      name: 'Writing Production',
      score: chartData[chartData.length - 1]?.writing || 0,
      icon: <Pen className="h-4 w-4 text-primary" />,
      description: 'Producing written Italian for everyday communication',
      timeAllowed: 60, // minutes
      passingScore: 70,
      items: 2
    },
    {
      name: 'Speaking Production',
      score: chartData[chartData.length - 1]?.speaking || 0,
      icon: <Mic className="h-4 w-4 text-primary" />,
      description: 'Communicating orally in Italian in everyday situations',
      timeAllowed: 10, // minutes
      passingScore: 70,
      items: 3
    }
  ];
  
  // Function to fetch user progress data
  const fetchProgressData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Fetch user progress data from Supabase
      const { data: progressData, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process the data for our charts
      if (progressData && progressData.length > 0) {
        // Process the raw data into chart format
        const processedChartData = processProgressData(progressData);
        setChartData(processedChartData);
      }
      
      setProgressData(progressData);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      toast({
        title: "Error fetching progress data",
        description: "Could not load your progress data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Process raw progress data into chart format
  const processProgressData = (data: any[]): any[] => {
    // Group by date (day)
    const groupedByDate = data.reduce((acc: any, session: any) => {
      const date = new Date(session.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          sessions: [],
          scores: {
            listening: [],
            reading: [],
            writing: [],
            speaking: [],
          }
        };
      }
      
      // Add score to the appropriate category
      if (session.content_type && session.score !== null) {
        if (acc[date].scores[session.content_type]) {
          acc[date].scores[session.content_type].push(session.score);
        }
      }
      
      acc[date].sessions.push(session);
      return acc;
    }, {});
    
    // Calculate averages for each date and type
    return Object.keys(groupedByDate).map(date => {
      const dayData = groupedByDate[date];
      
      // Calculate average score for each content type
      const listening = calculateAverage(dayData.scores.listening);
      const reading = calculateAverage(dayData.scores.reading);
      const writing = calculateAverage(dayData.scores.writing);
      const speaking = calculateAverage(dayData.scores.speaking);
      
      // Calculate overall score
      const allScores = [
        ...dayData.scores.listening,
        ...dayData.scores.reading,
        ...dayData.scores.writing,
        ...dayData.scores.speaking
      ];
      const overall = calculateAverage(allScores);
      
      return {
        date,
        listening,
        reading,
        writing,
        speaking,
        overall
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  const calculateAverage = (scores: number[]): number => {
    if (!scores || scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };
  
  // Calculate current overall score
  const currentOverallScore = chartData.length > 0 
    ? chartData[chartData.length - 1].overall 
    : 0;
  
  useEffect(() => {
    fetchProgressData();
  }, [user]);
  
  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your progress towards CILS B1 Citizenship exam readiness
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Progress</TabsTrigger>
            <TabsTrigger value="exam-info">CILS B1 Requirements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-[250px] w-full" />
                    </div>
                  ) : (
                    <div className="h-[250px]">
                      <ProgressSummary 
                        overall={currentOverallScore} 
                        targetScore={targetScore}
                        sections={examSections}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-[60px] w-full" />
                      <Skeleton className="h-[60px] w-full" />
                      <Skeleton className="h-[60px] w-full" />
                    </div>
                  ) : progressData && progressData.length > 0 ? (
                    <div className="space-y-3">
                      {progressData.slice(0, 3).map((session: any) => (
                        <div key={session.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium capitalize">{session.content_type}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{session.score}%</p>
                            <p className="text-sm text-muted-foreground">
                              {session.time_spent} min
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No activity recorded yet.</p>
                      <p className="text-sm mt-1">Complete practice exercises to see your progress.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <ProgressChart data={chartData} />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {examSections.map((section) => (
                <ProgressCard
                  key={section.name}
                  title={section.name}
                  value={section.score}
                  maxValue={100}
                  icon={section.icon}
                  color={section.score >= targetScore ? "bg-green-500" : "bg-amber-500"}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Progress Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {examSections.map((section) => (
                    <div key={section.name} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {section.icon}
                        <h3 className="text-lg font-medium">{section.name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="py-2">
                            <CardTitle className="text-sm font-medium">Current Score</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="text-2xl font-bold">{section.score}%</div>
                            <p className="text-xs text-muted-foreground">
                              {section.score >= targetScore ? 'Passing' : 'Need Improvement'}
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="py-2">
                            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="text-2xl font-bold">
                              {loading ? 
                                <Skeleton className="h-7 w-16" /> : 
                                `${calculateTotalTimeByType(progressData, section.name.toLowerCase().split(' ')[0])} min`
                              }
                            </div>
                            <p className="text-xs text-muted-foreground">Total practice time</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="py-2">
                            <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="text-2xl font-bold">
                              {loading ? 
                                <Skeleton className="h-7 w-16" /> : 
                                calculateTotalQuestionsByType(progressData, section.name.toLowerCase().split(' ')[0])
                              }
                            </div>
                            <p className="text-xs text-muted-foreground">Total practice questions</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Performance Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          {getPerformanceAnalysis(section.score, targetScore, section.name)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="exam-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CILS B1 Citizenship Exam Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <BookMarked className="h-5 w-5 text-primary" />
                    Exam Overview
                  </h3>
                  <p className="mt-2">
                    The CILS (Certificazione di Italiano come Lingua Straniera) B1 Citizenship exam
                    is required for obtaining Italian citizenship. It tests your ability to communicate
                    effectively in everyday situations in Italian.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examSections.map((section) => (
                    <Card key={section.name} className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center gap-2">
                          {section.icon}
                          {section.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-0">
                        <p className="text-sm">{section.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="font-medium">Time</p>
                            <p className="text-muted-foreground">{section.timeAllowed} min</p>
                          </div>
                          <div>
                            <p className="font-medium">Items</p>
                            <p className="text-muted-foreground">{section.items}</p>
                          </div>
                          <div>
                            <p className="font-medium">Pass Score</p>
                            <p className="text-muted-foreground">{section.passingScore}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Certification Value
                  </h3>
                  <p className="mt-2">
                    The CILS B1 certificate attests that you can:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Understand the main points of clear standard input on familiar matters</li>
                    <li>Deal with most situations likely to arise while traveling in Italy</li>
                    <li>Produce simple connected text on familiar topics</li>
                    <li>Describe experiences, events, dreams, hopes and ambitions</li>
                    <li>Briefly give reasons and explanations for opinions and plans</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

// Helper functions
function calculateTotalTimeByType(progressData: any[], type: string): number {
  if (!progressData) return 0;
  
  return progressData
    .filter(session => session.content_type?.toLowerCase().includes(type.toLowerCase()))
    .reduce((sum, session) => sum + (session.time_spent || 0), 0);
}

function calculateTotalQuestionsByType(progressData: any[], type: string): number {
  if (!progressData) return 0;
  
  return progressData
    .filter(session => session.content_type?.toLowerCase().includes(type.toLowerCase()))
    .reduce((sum, session) => {
      const totalQuestions = session.answers?.total || 0;
      return sum + totalQuestions;
    }, 0);
}

function getPerformanceAnalysis(score: number, targetScore: number, sectionName: string): string {
  const section = sectionName.toLowerCase();
  
  if (score >= targetScore + 15) {
    return `Excellent progress in ${sectionName}! Your performance exceeds the requirements for the CILS B1 exam.`;
  } else if (score >= targetScore) {
    return `Good progress in ${sectionName}. You are meeting the minimum requirements for the CILS B1 exam, but continue practicing to improve your score.`;
  } else if (score >= targetScore - 10) {
    return `You're getting close to the passing threshold for ${sectionName}. Focus on targeted practice to improve in this area.`;
  } else {
    let advice = `Additional practice needed in ${sectionName}. `;
    
    if (section.includes('listening')) {
      advice += "Try listening to Italian audio content daily, such as podcasts or news broadcasts.";
    } else if (section.includes('reading')) {
      advice += "Practice reading Italian texts regularly, such as news articles or short stories.";
    } else if (section.includes('writing')) {
      advice += "Work on writing short essays or journal entries in Italian to improve your skills.";
    } else if (section.includes('speaking')) {
      advice += "Practice speaking Italian with native speakers or language exchange partners.";
    }
    
    return advice;
  }
}
