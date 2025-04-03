
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ProgressChart from '@/components/progress/ProgressChart';
import ProgressSummary from '@/components/progress/ProgressSummary';
import SkillBreakdown from '@/components/progress/SkillBreakdown';
import ProgressCard from '@/components/ui/ProgressCard';
import { BookOpen, Pen, Mic, Award, BookMarked, Download, FileText, Clock, Calendar } from 'lucide-react';
import { Headphones } from '@/components/icons';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

export interface ProgressData {
  date: string;
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  grammar?: number;
  vocabulary?: number;
  overall: number;
}

interface ExamSection {
  name: string;
  score: number;
  icon: React.ReactNode;
  description: string;
  timeAllowed: number; // minutes
  passingScore: number;
  items: number;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [progressData, setProgressData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<ProgressData[]>([]);
  
  const targetScore = 70; // CILS B1 typically requires 70% or higher to pass
  
  // CILS B1 exam structure
  const examSections: ExamSection[] = [
    {
      name: 'Listening Comprehension',
      score: chartData.length > 0 ? chartData[chartData.length - 1]?.listening || 0 : 0,
      icon: <Headphones className="h-4 w-4 text-primary" />,
      description: 'Understanding spoken Italian in everyday situations',
      timeAllowed: 30, // minutes
      passingScore: 70,
      items: 30
    },
    {
      name: 'Reading Comprehension',
      score: chartData.length > 0 ? chartData[chartData.length - 1]?.reading || 0 : 0,
      icon: <BookOpen className="h-4 w-4 text-primary" />,
      description: 'Understanding written Italian in everyday situations',
      timeAllowed: 50, // minutes
      passingScore: 70,
      items: 35
    },
    {
      name: 'Writing Production',
      score: chartData.length > 0 ? chartData[chartData.length - 1]?.writing || 0 : 0,
      icon: <Pen className="h-4 w-4 text-primary" />,
      description: 'Producing written Italian for everyday communication',
      timeAllowed: 60, // minutes
      passingScore: 70,
      items: 2
    },
    {
      name: 'Speaking Production',
      score: chartData.length > 0 ? chartData[chartData.length - 1]?.speaking || 0 : 0,
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
      
      setProgressData(progressData || []);
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
  const processProgressData = (data: any[]): ProgressData[] => {
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
            grammar: [],
            vocabulary: [],
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
      const grammar = calculateAverage(dayData.scores.grammar);
      const vocabulary = calculateAverage(dayData.scores.vocabulary);
      
      // Calculate overall score
      const allScores = [
        ...dayData.scores.listening,
        ...dayData.scores.reading,
        ...dayData.scores.writing,
        ...dayData.scores.speaking,
        ...dayData.scores.grammar,
        ...dayData.scores.vocabulary
      ];
      const overall = calculateAverage(allScores);
      
      return {
        date,
        listening,
        reading,
        writing,
        speaking,
        grammar,
        vocabulary,
        overall
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  const calculateAverage = (scores: number[]): number => {
    if (!scores || scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  // Calculate time spent by content type
  const calculateTotalTimeByType = (data: any[], type: string): number => {
    if (!data || data.length === 0) return 0;
    return data
      .filter(item => item.content_type?.toLowerCase().includes(type.toLowerCase()))
      .reduce((sum, item) => sum + (item.time_spent || 0), 0);
  };

  // Calculate total questions by content type
  const calculateTotalQuestionsByType = (data: any[], type: string): number => {
    if (!data || data.length === 0) return 0;
    return data
      .filter(item => item.content_type?.toLowerCase().includes(type.toLowerCase()))
      .length;
  };
  
  // Generate performance analysis text
  const getPerformanceAnalysis = (score: number, target: number, area: string): string => {
    if (score >= target + 15) {
      return `Your performance in ${area} is excellent. You're well above the required level for the CILS B1 exam.`;
    } else if (score >= target) {
      return `Your performance in ${area} meets the required standard for the CILS B1 exam, but more practice would help solidify your skills.`;
    } else if (score >= target - 10) {
      return `You're close to the required level for ${area}, but need more focused practice to ensure you pass this section of the CILS B1 exam.`;
    } else {
      return `This is an area that needs significant improvement. We recommend focused daily practice on ${area.toLowerCase()} skills.`;
    }
  };

  // Get skill breakdown data for the SkillBreakdown component
  const getSkillBreakdownData = () => {
    const latestData = chartData.length > 0 ? chartData[chartData.length - 1] : null;
    
    if (!latestData) return [];
    
    return [
      {
        name: 'Listening',
        score: latestData.listening,
        targetScore: targetScore,
        recentImprovement: getRecentImprovement('listening'),
        icon: <Headphones className="h-4 w-4" />,
        status: getStatus(latestData.listening),
        recommendations: [
          'Practice with Italian podcasts and audio lessons daily',
          'Focus on understanding different accents and speech speeds',
          'Take notes while listening to improve comprehension'
        ]
      },
      {
        name: 'Reading',
        score: latestData.reading,
        targetScore: targetScore,
        recentImprovement: getRecentImprovement('reading'),
        icon: <BookOpen className="h-4 w-4" />,
        status: getStatus(latestData.reading),
        recommendations: [
          'Read authentic Italian texts from newspapers and magazines',
          'Practice skimming and scanning techniques',
          'Focus on understanding context from keywords'
        ]
      },
      {
        name: 'Writing',
        score: latestData.writing,
        targetScore: targetScore,
        recentImprovement: getRecentImprovement('writing'),
        icon: <Pen className="h-4 w-4" />,
        status: getStatus(latestData.writing),
        recommendations: [
          'Practice writing short texts daily on common topics',
          'Focus on proper verb conjugation and grammar',
          'Study common formal letter structures'
        ]
      },
      {
        name: 'Speaking',
        score: latestData.speaking,
        targetScore: targetScore,
        recentImprovement: getRecentImprovement('speaking'),
        icon: <Mic className="h-4 w-4" />,
        status: getStatus(latestData.speaking),
        recommendations: [
          'Practice speaking for at least 10 minutes daily',
          'Record yourself speaking and analyze your pronunciation',
          'Focus on common B1 exam speaking topics'
        ]
      },
      {
        name: 'Grammar',
        score: latestData.grammar || 0,
        targetScore: targetScore,
        recentImprovement: getRecentImprovement('grammar'),
        icon: <FileText className="h-4 w-4" />,
        status: getStatus(latestData.grammar || 0),
        recommendations: [
          'Review verb tenses needed for B1 level',
          'Practice using connectors to join sentences',
          'Focus on agreement of articles and adjectives'
        ]
      },
      {
        name: 'Vocabulary',
        score: latestData.vocabulary || 0,
        targetScore: targetScore,
        recentImprovement: getRecentImprovement('vocabulary'),
        icon: <BookMarked className="h-4 w-4" />,
        status: getStatus(latestData.vocabulary || 0),
        recommendations: [
          'Learn 10 new words related to citizenship daily',
          'Use flashcards for spaced repetition practice',
          'Practice using new vocabulary in sentences'
        ]
      }
    ];
  };
  
  // Get status (passed, needs-improvement, critical) based on score
  const getStatus = (score: number): 'passed' | 'needs-improvement' | 'critical' => {
    if (score >= targetScore) return 'passed';
    if (score >= targetScore - 15) return 'needs-improvement';
    return 'critical';
  };
  
  // Calculate improvement over the last two data points
  const getRecentImprovement = (field: keyof ProgressData): number => {
    if (chartData.length < 2) return 0;
    
    const latestValue = chartData[chartData.length - 1][field] as number || 0;
    const previousValue = chartData[chartData.length - 2][field] as number || 0;
    
    return latestValue > previousValue ? latestValue - previousValue : 0;
  };
  
  // Export progress data as CSV
  const exportProgressData = () => {
    if (chartData.length === 0) {
      toast({
        title: "No data to export",
        description: "Complete some activities first to generate progress data.",
        variant: "destructive"
      });
      return;
    }
    
    // Create CSV content
    let csvContent = "Date,Listening,Reading,Writing,Speaking,Grammar,Vocabulary,Overall\n";
    
    chartData.forEach(item => {
      csvContent += `${item.date},${item.listening},${item.reading},${item.writing},${item.speaking},${item.grammar || 0},${item.vocabulary || 0},${item.overall}\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'CILS_Progress_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
            <p className="text-muted-foreground">
              Track your progress towards CILS B1 Citizenship exam readiness
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={exportProgressData}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
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
                      {progressData.slice(0, 3).map((session: any, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium capitalize">{session.content_type?.replace('_', ' ')}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
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
                    {chartData.length > 0 ? (
                      <ProgressChart data={chartData} />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No progress data available yet</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Complete practice activities to see your progress over time
                          </p>
                        </div>
                      </div>
                    )}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkillBreakdown skills={getSkillBreakdownData()} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Study Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {getSkillBreakdownData()
                      .filter(skill => skill.status !== 'passed')
                      .slice(0, 3)
                      .map((skill, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="bg-amber-100 p-1.5 rounded-full mt-0.5">
                            <Lightbulb className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium">{skill.name} Focus Needed</p>
                            <p className="text-sm text-muted-foreground">{skill.recommendations?.[0]}</p>
                          </div>
                        </div>
                      ))
                    }
                    
                    {getSkillBreakdownData().every(skill => skill.status === 'passed') && (
                      <div className="flex gap-3 items-start">
                        <div className="bg-green-100 p-1.5 rounded-full mt-0.5">
                          <Award className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Excellent Progress!</p>
                          <p className="text-sm text-muted-foreground">
                            You're doing great in all areas. Continue practicing to maintain your skills.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {chartData.length === 0 && (
                      <div className="flex gap-3 items-start">
                        <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Start Your Journey</p>
                          <p className="text-sm text-muted-foreground">
                            Complete your first practice exercises to get personalized recommendations.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    View Study Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Progress Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {examSections.map((section) => (
                    <div key={section.name} className="space-y-2">
                      <div className="flex items-center gap-2 border-b pb-2 mb-4">
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
                            <p className="text-muted-foreground">Time:</p>
                            <p className="font-medium">{section.timeAllowed} minutes</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Questions:</p>
                            <p className="font-medium">{section.items} {section.items === 1 ? 'item' : 'items'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pass Score:</p>
                            <p className="font-medium">{section.passingScore}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-primary" />
                    Assessment Structure
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Listening</h4>
                      <p className="text-sm text-muted-foreground">
                        The listening section includes multiple audio clips of diverse difficulty and complexity.
                        You'll listen to dialogues, announcements, and conversations, then answer multiple-choice
                        questions about the content.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Reading</h4>
                      <p className="text-sm text-muted-foreground">
                        The reading section tests your ability to understand written texts such as
                        newspaper articles, advertisements, instructions, and personal communications.
                        Questions include multiple-choice, true/false, and matching exercises.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Writing</h4>
                      <p className="text-sm text-muted-foreground">
                        The writing section typically includes two tasks: writing a personal message or letter
                        (about 80-100 words) and writing an expository text (about 120 words) on a familiar topic.
                        You'll be assessed on content, organization, vocabulary, and grammar.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Speaking</h4>
                      <p className="text-sm text-muted-foreground">
                        The speaking test is usually conducted with an examiner and includes a brief
                        presentation about yourself, a discussion based on an image or prompt, and a
                        simulated conversation scenario. You'll be evaluated on pronunciation, fluency,
                        accuracy, and communicative effectiveness.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium">Passing Requirements</h4>
                  <p className="text-sm mt-1">
                    To pass the CILS B1 Citizenship exam, you must achieve at least 70% in each of the
                    four sections (listening, reading, writing, and speaking). If you fail one section,
                    you can retake just that section within one year.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
