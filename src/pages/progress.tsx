
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, BookOpen, MessageSquare, Edit, Lightbulb, FileText, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import SkillBreakdown from '@/components/progress/SkillBreakdown';
import { Headphones as HeadphonesIcon } from '@/components/icons/Headphones';

// Rename to prevent duplicate identifier
const Headphones = HeadphonesIcon;

const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState<any>({
    skills: [],
    daily: [],
    overview: {
      questionsAnswered: 0,
      correctPercentage: 0,
      timeSpent: 0,
      completedActivities: 0
    },
    readiness: {
      overall: 0,
      citizenship: 0,
      language: 0
    }
  });

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user, timeRange]);

  const loadProgressData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch user stats from database
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (statsError) throw statsError;
      
      // Fetch user progress entries
      const { data: progressEntries, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (progressError) throw progressError;
      
      // Calculate skill scores
      const skillScores = {
        Reading: (userStats?.reading_score || 0) * 100,
        Writing: (userStats?.writing_score || 0) * 100,
        Speaking: (userStats?.speaking_score || 0) * 100,
        Listening: (userStats?.listening_score || 0) * 100,
        Grammar: 0,
        Vocabulary: 0,
        Citizenship: 0,
        Culture: 0
      };
      
      // Process progress entries to calculate scores for other skills
      if (progressEntries && progressEntries.length > 0) {
        const categoryCounts: Record<string, number> = {};
        const categoryScores: Record<string, number> = {};
        
        progressEntries.forEach(entry => {
          const contentType = entry.content_type;
          if (!contentType) return;
          
          if (!categoryCounts[contentType]) {
            categoryCounts[contentType] = 0;
            categoryScores[contentType] = 0;
          }
          
          categoryCounts[contentType]++;
          categoryScores[contentType] += entry.score || 0;
        });
        
        // Calculate average scores
        Object.keys(categoryCounts).forEach(category => {
          if (categoryCounts[category] > 0) {
            const average = categoryScores[category] / categoryCounts[category];
            
            if (category === 'grammar') skillScores.Grammar = average;
            if (category === 'vocabulary') skillScores.Vocabulary = average;
            if (category === 'citizenship') skillScores.Citizenship = average;
            if (category === 'culture') skillScores.Culture = average;
          }
        });
      }
      
      // Create daily activity data (last 30 days)
      const dailyData: any[] = [];
      const daysToShow = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
      
      for (let i = 0; i < daysToShow; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const entriesForDay = progressEntries?.filter(entry => {
          const entryDate = new Date(entry.created_at).toISOString().split('T')[0];
          return entryDate === dateString;
        });
        
        const correct = entriesForDay?.reduce((sum, entry) => sum + (entry.score || 0), 0) || 0;
        const total = entriesForDay?.length || 0;
        const score = total > 0 ? (correct / total) * 100 : 0;
        
        dailyData.unshift({
          date: dateString,
          score: Math.round(score),
          activities: total
        });
      }
      
      // Calculate overall readiness
      const skillsArray = Object.entries(skillScores).map(([name, score]) => ({
        name,
        score: Math.round(score),
        passingScore: 60,
        icon: getSkillIcon(name.toLowerCase()),
        lastImprovement: getLastImprovementDate(name.toLowerCase(), progressEntries),
        color: getSkillColor(name.toLowerCase())
      }));
      
      const overallReadiness = calculateOverallReadiness(skillsArray);
      const citizenshipReadiness = calculateCitizenshipReadiness(skillsArray);
      const languageReadiness = calculateLanguageReadiness(skillsArray);
      
      // Calculate overview stats
      const totalQuestions = userStats?.questions_answered || 0;
      const correctAnswers = userStats?.correct_answers || 0;
      const correctPercentage = totalQuestions > 0 
        ? (correctAnswers / totalQuestions) * 100 
        : 0;
      
      const totalTimeSpent = progressEntries?.reduce((sum, entry) => sum + (entry.time_spent || 0), 0) || 0;
      const completedActivities = progressEntries?.filter(entry => entry.completed).length || 0;
      
      setProgressData({
        skills: skillsArray,
        daily: dailyData,
        overview: {
          questionsAnswered: totalQuestions,
          correctPercentage,
          timeSpent: totalTimeSpent,
          completedActivities
        },
        readiness: {
          overall: overallReadiness,
          citizenship: citizenshipReadiness,
          language: languageReadiness
        }
      });
      
    } catch (error) {
      console.error('Error loading progress data:', error);
      toast({
        title: 'Failed to load progress data',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOverallReadiness = (skills: any[]) => {
    if (skills.length === 0) return 0;
    
    const sum = skills.reduce((total, skill) => total + skill.score, 0);
    return Math.round(sum / skills.length);
  };

  const calculateCitizenshipReadiness = (skills: any[]) => {
    const relevantSkills = skills.filter(skill => 
      ['Citizenship', 'Culture'].includes(skill.name));
    
    if (relevantSkills.length === 0) return 0;
    
    const sum = relevantSkills.reduce((total, skill) => total + skill.score, 0);
    return Math.round(sum / relevantSkills.length);
  };

  const calculateLanguageReadiness = (skills: any[]) => {
    const relevantSkills = skills.filter(skill => 
      ['Reading', 'Writing', 'Speaking', 'Listening', 'Grammar', 'Vocabulary'].includes(skill.name));
    
    if (relevantSkills.length === 0) return 0;
    
    const sum = relevantSkills.reduce((total, skill) => total + skill.score, 0);
    return Math.round(sum / relevantSkills.length);
  };

  const getSkillIcon = (skillName: string) => {
    switch (skillName) {
      case 'reading':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'writing':
        return <Edit className="h-4 w-4 text-purple-500" />;
      case 'speaking':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'listening':
        return <Headphones className="h-4 w-4 text-amber-500" />;
      case 'grammar':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'vocabulary':
        return <BookOpen className="h-4 w-4 text-indigo-500" />;
      case 'citizenship':
        return <Lightbulb className="h-4 w-4 text-emerald-500" />;
      case 'culture':
        return <Lightbulb className="h-4 w-4 text-cyan-500" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSkillColor = (skillName: string) => {
    switch (skillName) {
      case 'reading':
        return 'bg-blue-100 text-blue-500';
      case 'writing':
        return 'bg-purple-100 text-purple-500';
      case 'speaking':
        return 'bg-green-100 text-green-500';
      case 'listening':
        return 'bg-amber-100 text-amber-500';
      case 'grammar':
        return 'bg-red-100 text-red-500';
      case 'vocabulary':
        return 'bg-indigo-100 text-indigo-500';
      case 'citizenship':
        return 'bg-emerald-100 text-emerald-500';
      case 'culture':
        return 'bg-cyan-100 text-cyan-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getLastImprovementDate = (skillName: string, entries: any[]) => {
    if (!entries || entries.length === 0) return null;
    
    const relevantEntries = entries.filter(entry => entry.content_type === skillName && entry.score >= 70);
    if (relevantEntries.length === 0) return null;
    
    const mostRecent = new Date(relevantEntries[0].created_at);
    return mostRecent.toLocaleDateString();
  };

  const handleExportData = () => {
    // Create CSV data from progress information
    const csvContent = [
      'Date,Category,Score,Time Spent',
      ...(progressData.daily.map((day: any) => 
        `${day.date},Overall,${day.score},N/A`
      ))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'cils_progress_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Progress report exported',
      description: 'Your progress data has been downloaded as a CSV file',
      variant: 'default'
    });
  };
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="text-muted-foreground">Track your CILS exam preparation journey</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Readiness Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Readiness</CardTitle>
            <CardDescription>Your exam readiness score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">{progressData.readiness.overall}%</div>
              <Progress 
                value={progressData.readiness.overall} 
                max={100}
                className="w-full h-2"
                fill={progressData.readiness.overall >= 60 ? "bg-green-500" : "bg-amber-500"}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                {progressData.readiness.overall >= 80 
                  ? "Excellent! You're well-prepared."
                  : progressData.readiness.overall >= 60
                    ? "Good progress. Keep practicing!"
                    : "More practice needed to improve readiness."}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Language Proficiency</CardTitle>
            <CardDescription>Italian language readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">{progressData.readiness.language}%</div>
              <Progress 
                value={progressData.readiness.language} 
                max={100}
                className="w-full h-2"
                fill={progressData.readiness.language >= 60 ? "bg-green-500" : "bg-amber-500"}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                {progressData.readiness.language >= 80 
                  ? "Excellent language skills!"
                  : progressData.readiness.language >= 60
                    ? "Good language proficiency. Keep practicing!"
                    : "More language practice recommended."}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Citizenship Knowledge</CardTitle>
            <CardDescription>Citizenship test readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">{progressData.readiness.citizenship}%</div>
              <Progress 
                value={progressData.readiness.citizenship} 
                max={100}
                className="w-full h-2"
                fill={progressData.readiness.citizenship >= 60 ? "bg-green-500" : "bg-amber-500"}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                {progressData.readiness.citizenship >= 80 
                  ? "Excellent citizenship knowledge!"
                  : progressData.readiness.citizenship >= 60
                    ? "Good progress on citizenship content."
                    : "More citizenship study recommended."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="trends">Progress Trends</TabsTrigger>
          </TabsList>
          
          {activeTab === 'trends' && (
            <div className="space-x-2">
              <Button 
                variant={timeRange === 'week' ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setTimeRange('week')}
              >
                Week
              </Button>
              <Button 
                variant={timeRange === 'month' ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setTimeRange('month')}
              >
                Month
              </Button>
              <Button 
                variant={timeRange === 'quarter' ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setTimeRange('quarter')}
              >
                3 Months
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>Your learning activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Questions Answered</p>
                    <p className="text-2xl font-bold">{progressData.overview.questionsAnswered}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                    <p className="text-2xl font-bold">{progressData.overview.correctPercentage.toFixed(1)}%</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                    <p className="text-2xl font-bold">{Math.round(progressData.overview.timeSpent / 60)} mins</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Activities Completed</p>
                    <p className="text-2xl font-bold">{progressData.overview.completedActivities}</p>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h4 className="font-medium mb-2">Recent Activities</h4>
                  <div className="space-y-2">
                    {progressData.daily.slice(0, 5).map((day: any, index: number) => (
                      day.activities > 0 ? (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span>{new Date(day.date).toLocaleDateString()}</span>
                          <Badge variant="outline">
                            {day.activities} {day.activities === 1 ? 'activity' : 'activities'}
                          </Badge>
                        </div>
                      ) : null
                    )).filter(Boolean).slice(0, 3)}
                    {progressData.daily.slice(0, 5).filter((day: any) => day.activities > 0).length === 0 && (
                      <p className="text-sm text-muted-foreground">No recent activities found.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <SkillBreakdown 
              skills={progressData.skills}
              onSkillSelect={(skill) => {
                // Redirect to practice page for that skill
                console.log(`Practice ${skill}`);
              }}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {progressData.skills.map((skill: any) => (
              <Card key={skill.name} className="overflow-hidden">
                <CardHeader className={`${skill.color.replace('bg-', 'bg-opacity-20 ')} border-b`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={skill.color}>
                        {skill.icon}
                      </div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </div>
                    <Badge variant={skill.score >= 60 ? "outline" : "secondary"} className={skill.score >= 60 ? "text-green-600" : ""}>
                      {skill.score >= 60 ? "Passing" : "Needs work"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">{skill.score}%</span>
                    <span className="text-sm text-muted-foreground">Passing: {skill.passingScore}%</span>
                  </div>
                  
                  <Progress 
                    value={skill.score} 
                    max={100}
                    className="mb-6 h-2"
                    fill={skill.score >= skill.passingScore ? "bg-green-500" : "bg-amber-500"}
                  />
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">CILS B1 Requirements</h4>
                      <p className="text-sm text-muted-foreground">
                        {getSkillRequirements(skill.name)}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Personal Recommendation</h4>
                      <p className="text-sm text-muted-foreground">
                        {getPersonalRecommendation(skill.name, skill.score)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full" onClick={() => console.log(`Practice ${skill.name}`)}>
                      Practice {skill.name}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
              <CardDescription>
                {timeRange === 'week' ? 'Your progress over the past week' :
                 timeRange === 'month' ? 'Your progress over the past month' :
                 'Your progress over the past 3 months'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={progressData.daily}
                    margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                      interval={timeRange === 'week' ? 0 : timeRange === 'month' ? 2 : 7}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value: any) => [`${value}%`, 'Score']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Bar 
                      dataKey="score" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
                <CardDescription>Balance of your skills across areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={progressData.skills}
                        dataKey="score"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {progressData.skills.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={getColorForSkill(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}%`, 'Score']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Study Recommendations</CardTitle>
                <CardDescription>Personalized suggestions to improve</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {generateStudyRecommendations(progressData.skills).map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-md">
                      <div className={`p-2 rounded-full ${getSkillColor(rec.skill.toLowerCase())}`}>
                        {getSkillIcon(rec.skill.toLowerCase())}
                      </div>
                      <div>
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const getSkillRequirements = (skill: string) => {
  const requirements: Record<string, string> = {
    'Reading': 'Ability to understand simple texts on familiar topics. Reading comprehension score of 60% or higher required to pass.',
    'Writing': 'Ability to write simple connected text on familiar topics. Writing assessment score of 60% required.',
    'Speaking': 'Ability to communicate in simple and routine tasks requiring basic information exchange. Speaking assessment score of 60% required.',
    'Listening': 'Ability to understand phrases and expressions related to immediate relevance. Listening comprehension score of 60% required.',
    'Grammar': 'Competence in Italian grammar structures. Assessment score of 60% required.',
    'Vocabulary': 'Knowledge of common Italian vocabulary. Assessment score of 60% required.',
    'Citizenship': 'Understanding of Italian citizenship requirements and process. Assessment score of 70% required.',
    'Culture': 'Knowledge of Italian culture, customs and society. Assessment score of 60% required.'
  };
  
  return requirements[skill] || 'Information not available for this skill.';
};

const getPersonalRecommendation = (skill: string, score: number) => {
  if (score < 40) {
    return 'Focus intensively on this area. Start with fundamentals and practice daily.';
  } else if (score < 60) {
    return 'Needs significant improvement. Regular practice and structured learning recommended.';
  } else if (score < 80) {
    return 'Good progress, but continued practice needed. Focus on areas of weakness.';
  } else {
    return 'Excellent level achieved. Maintain with regular practice and advanced concepts.';
  }
};

const getColorForSkill = (skill: string) => {
  const colors: Record<string, string> = {
    'Reading': '#3b82f6',
    'Writing': '#8b5cf6',
    'Speaking': '#22c55e',
    'Listening': '#f59e0b',
    'Grammar': '#ef4444',
    'Vocabulary': '#6366f1',
    'Citizenship': '#10b981',
    'Culture': '#06b6d4'
  };
  
  return colors[skill] || '#64748b';
};

const generateStudyRecommendations = (skills: any[]) => {
  // Sort skills by score (ascending)
  const sortedSkills = [...skills].sort((a, b) => a.score - b.score);
  
  // Generate recommendations for the lowest 3 skills
  return sortedSkills.slice(0, 3).map(skill => {
    const recommendations: Record<string, { title: string; description: string; skill: string }> = {
      'Reading': {
        title: 'Improve Reading Comprehension',
        description: 'Practice with Italian news articles and short stories. Focus on understanding context clues.',
        skill: 'Reading'
      },
      'Writing': {
        title: 'Strengthen Writing Skills',
        description: 'Practice writing short paragraphs about daily activities. Focus on proper grammar and vocabulary.',
        skill: 'Writing'
      },
      'Speaking': {
        title: 'Enhance Speaking Fluency',
        description: 'Practice speaking with our conversation exercises. Focus on pronunciation and natural flow.',
        skill: 'Speaking'
      },
      'Listening': {
        title: 'Develop Listening Skills',
        description: 'Listen to Italian audio clips daily. Focus on identifying key phrases and meanings.',
        skill: 'Listening'
      },
      'Grammar': {
        title: 'Master Grammar Fundamentals',
        description: 'Review verb conjugations and sentence structures. Complete targeted grammar exercises.',
        skill: 'Grammar'
      },
      'Vocabulary': {
        title: 'Expand Your Vocabulary',
        description: 'Learn new words with our flashcard system. Focus on common citizenship terms.',
        skill: 'Vocabulary'
      },
      'Citizenship': {
        title: 'Strengthen Citizenship Knowledge',
        description: 'Review key citizenship concepts and requirements. Take practice citizenship tests.',
        skill: 'Citizenship'
      },
      'Culture': {
        title: 'Deepen Cultural Understanding',
        description: 'Learn about Italian customs, traditions, and social norms through our cultural modules.',
        skill: 'Culture'
      }
    };
    
    return recommendations[skill.name] || {
      title: `Improve ${skill.name} Skills`,
      description: 'Focus on targeted practice in this area to improve your overall score.',
      skill: skill.name
    };
  });
};

export default ProgressPage;
