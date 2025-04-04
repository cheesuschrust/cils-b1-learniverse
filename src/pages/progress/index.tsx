
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, BarChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Download, FileText, BarChart3, BarChart2, Clock, BookOpen, Calendar, Target, Award, TrendingUp } from 'lucide-react';
import ProgressTracker from '@/components/progress/ProgressTracker';
import { exportProgressReport } from '@/services/progressService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { SkeletonCard } from '@/components/ui/skeleton';
import { getSkillName, mapScoreToLevel } from '@/lib/learning-utils';

// Custom study recommendation component
const StudyRecommendationCard = ({ title, description, priority }: { title: string, description: string, priority: 'high' | 'medium' | 'low' }) => {
  const priorityMap = {
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '🔴' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: '🟠' },
    low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '🟢' },
  };
  
  const style = priorityMap[priority];
  
  return (
    <Card className={`${style.bg} ${style.border} border`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-lg mt-0.5">{style.icon}</div>
          <div>
            <h4 className={`font-medium ${style.text}`}>{title}</h4>
            <p className="text-sm mt-1 text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// CILS B1 required levels component
const CILSRequirements = () => {
  const requirements = [
    { name: 'Listening', required: 70 },
    { name: 'Reading', required: 70 },
    { name: 'Writing', required: 70 },
    { name: 'Speaking', required: 70 },
    { name: 'Grammar', required: 65 },
    { name: 'Vocabulary', required: 65 },
  ];
  
  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">CILS B1 Requirements</h4>
      {requirements.map((req) => (
        <div key={req.name} className="flex items-center justify-between">
          <span className="text-sm">{req.name}</span>
          <span className="text-sm font-medium">Minimum: {req.required}%</span>
        </div>
      ))}
    </div>
  );
};

// Readiness assessment component
const ReadinessAssessment = ({ scores }: { scores: any[] }) => {
  // Calculate overall readiness percentage
  const totalScore = scores.reduce((sum, item) => sum + item.score, 0);
  const totalRequired = scores.reduce((sum, item) => sum + item.passing, 0);
  const overallPercentage = Math.round((totalScore / totalRequired) * 100);
  const isReady = overallPercentage >= 100;
  
  return (
    <div className={`p-4 rounded-lg border ${isReady ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
      <div className="flex items-center gap-3">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isReady ? 'bg-green-100' : 'bg-amber-100'}`}>
          <Target className={`h-6 w-6 ${isReady ? 'text-green-600' : 'text-amber-600'}`} />
        </div>
        <div>
          <h3 className="font-medium text-lg">
            {isReady ? 'Ready for CILS B1 Exam' : 'Working Toward CILS B1 Readiness'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="bg-gray-200 h-2 w-40 rounded-full">
              <div 
                className={`h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.min(100, overallPercentage)}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{overallPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [skillScores, setSkillScores] = useState<any[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [readinessScores, setReadinessScores] = useState<any[]>([]);
  
  // Fetch user's progress data from the database
  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch recent user progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('last_activity', { ascending: false })
          .limit(100);
          
        if (progressError) throw progressError;
        
        // Fetch user's skill scores
        const { data: userStatsData, error: statsError } = await supabase
          .from('user_stats')
          .select('reading_score, writing_score, listening_score, speaking_score')
          .eq('user_id', user.id)
          .single();
          
        if (statsError && statsError.code !== 'PGRST116') throw statsError;
        
        // Transform progress data for charts
        const transformedProgressData = progressData ? processProgressData(progressData) : [];
        setProgressData(transformedProgressData);
        
        // Generate time studying data
        setTimeData(generateTimeData(progressData || []));
        
        // Generate skill scores
        const skillData = [
          { name: 'Reading', score: userStatsData?.reading_score || 65, passing: 70 },
          { name: 'Writing', score: userStatsData?.writing_score || 60, passing: 70 },
          { name: 'Listening', score: userStatsData?.listening_score || 70, passing: 70 },
          { name: 'Speaking', score: userStatsData?.speaking_score || 65, passing: 70 },
          { name: 'Grammar', score: calculateSkillScore(progressData || [], 'grammar'), passing: 65 },
          { name: 'Vocabulary', score: calculateSkillScore(progressData || [], 'vocabulary'), passing: 65 }
        ];
        setSkillScores(skillData);
        
        // Generate readiness scores for CILS B1
        setReadinessScores([
          { name: 'Reading', score: userStatsData?.reading_score || 65, passing: 70 },
          { name: 'Writing', score: userStatsData?.writing_score || 60, passing: 70 },
          { name: 'Listening', score: userStatsData?.listening_score || 70, passing: 70 },
          { name: 'Speaking', score: userStatsData?.speaking_score || 65, passing: 70 }
        ]);
        
        // Generate personalized study recommendations
        setRecommendations(generateRecommendations(skillData, progressData || []));
        
      } catch (error) {
        console.error('Error loading progress data:', error);
        toast({
          title: 'Error Loading Data',
          description: 'There was a problem loading your progress data.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProgressData();
  }, [user, toast]);
  
  const handleExportReport = async () => {
    try {
      const report = await exportProgressReport();
      
      // Prepare data for export
      const exportData = {
        user: user?.email || 'User',
        generatedAt: new Date().toISOString(),
        skillScores,
        progressOverTime: progressData,
        studyTime: timeData,
        recommendations
      };
      
      // In a real app, this would create a downloadable file
      // For now, log to console and show success message
      console.log('Exporting report:', exportData);
      
      // Create a JSON file for download
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'progress-report.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      linkElement.remove();
      
      toast({
        title: 'Report Exported',
        description: 'Your progress report has been exported successfully.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your progress report.',
        variant: 'destructive',
      });
    }
  };

  // Helper function to process progress data
  const processProgressData = (data: any[]): any[] => {
    // Group by date and calculate average scores
    const groupedByDate = data.reduce((acc, item) => {
      const date = new Date(item.last_activity).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { scores: [], total: 0, count: 0 };
      }
      acc[date].scores.push(item.score || 0);
      acc[date].total += item.score || 0;
      acc[date].count += 1;
      return acc;
    }, {});
    
    // Transform to chart data format
    return Object.entries(groupedByDate).map(([date, data]: [string, any]) => ({
      date,
      score: data.total / data.count,
      count: data.count
    }));
  };
  
  // Helper function to calculate average score for a specific skill
  const calculateSkillScore = (data: any[], skill: string): number => {
    const relevantItems = data.filter(item => 
      item.content_type?.toLowerCase().includes(skill) || 
      item.category?.toLowerCase().includes(skill)
    );
    
    if (relevantItems.length === 0) return 60; // Default score if no data
    
    const totalScore = relevantItems.reduce((sum, item) => sum + (item.score || 0), 0);
    return Math.round(totalScore / relevantItems.length);
  };
  
  // Helper function to generate time study data
  const generateTimeData = (data: any[]): any[] => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    // Initialize with zeros for the past week
    const result = daysOfWeek.map((day, index) => {
      const d = new Date();
      d.setDate(today.getDate() - (today.getDay() - index + 7) % 7);
      return {
        day,
        date: d.toLocaleDateString(),
        minutes: 0
      };
    });
    
    // Fill in actual data
    data.forEach(item => {
      const date = new Date(item.last_activity);
      const dayIndex = date.getDay();
      const dayDiff = (today.getDay() - dayIndex + 7) % 7;
      
      // Only include data from the past week
      if (dayDiff < 7) {
        result[dayIndex].minutes += item.time_spent || 0;
      }
    });
    
    return result;
  };
  
  // Helper function to generate study recommendations
  const generateRecommendations = (skillScores: any[], progressData: any[]): any[] => {
    const recommendations = [];
    
    // Find the lowest scoring skills
    const sortedSkills = [...skillScores].sort((a, b) => a.score - b.score);
    
    if (sortedSkills[0].score < 65) {
      recommendations.push({
        area: sortedSkills[0].name,
        recommendation: `Focus on improving your ${sortedSkills[0].name.toLowerCase()} skills. Practice with targeted exercises daily.`,
        priority: 'high'
      });
    }
    
    if (sortedSkills[1].score < 70) {
      recommendations.push({
        area: sortedSkills[1].name,
        recommendation: `Work on strengthening your ${sortedSkills[1].name.toLowerCase()} abilities with regular practice.`,
        priority: 'medium'
      });
    }
    
    // Check for consistent practice patterns
    const recentDays = new Set(progressData.slice(0, 14).map(
      item => new Date(item.last_activity).toLocaleDateString()
    ));
    
    if (recentDays.size < 5) {
      recommendations.push({
        area: 'Consistency',
        recommendation: 'Establish a regular study routine. Aim to practice at least 5 days per week for optimal results.',
        priority: 'high'
      });
    }
    
    // Add a CILS-specific recommendation if close to exam readiness
    const avgScore = skillScores.reduce((sum, item) => sum + item.score, 0) / skillScores.length;
    if (avgScore > 60 && avgScore < 70) {
      recommendations.push({
        area: 'CILS Preparation',
        recommendation: 'You\'re getting close to CILS B1 readiness. Focus on practice tests and review exam strategies.',
        priority: 'medium'
      });
    }
    
    return recommendations;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <Button disabled>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        
        <SkeletonCard className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full border-8 border-primary flex items-center justify-center">
                <span className="text-2xl font-bold">78%</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total questions</p>
                <p className="text-2xl font-bold">367</p>
                <p className="text-xs text-muted-foreground">241 correct (66%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full border-8 border-secondary flex items-center justify-center">
                <span className="text-2xl font-bold">34</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total time</p>
                <p className="text-2xl font-bold">12:45</p>
                <p className="text-xs text-muted-foreground">Average 22 mins per session</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">CILS B1 Readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReadinessAssessment scores={readinessScores} />
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Confidence assessment</p>
              <div className="mt-1">
                <ConfidenceIndicator score={0.72} showLabel={true} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <ProgressTracker />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>
                  Your daily performance score over the selected time period
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#2563eb" 
                      name="Average Score" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Average score: {progressData.length > 0 ? 
                    Math.round(progressData.reduce((sum, item) => sum + item.score, 0) / progressData.length) : 0}%
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>
                  Number of activities completed per day
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#4f46e5" name="Activities Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Total activities: {progressData.reduce((sum, item) => sum + item.count, 0)}
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CILS B1 Readiness Assessment</CardTitle>
              <CardDescription>
                Your current skill levels compared to CILS B1 passing requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={readinessScores} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#2563eb" name="Your Score" />
                      <Bar dataKey="passing" fill="#d1d5db" name="Passing Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Skill Level Summary</h3>
                  <div className="space-y-5">
                    {skillScores.map(skill => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {mapScoreToLevel(skill.score)}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div 
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${skill.score}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>{skill.score}/100</span>
                          <span className={skill.score >= skill.passing ? "text-green-500" : "text-amber-500"}>
                            {skill.score >= skill.passing ? "Meeting requirements" : "Needs improvement"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <CILSRequirements />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Skills Distribution</CardTitle>
              <CardDescription>
                Visual representation of your skills across all areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillScores}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar 
                      name="Your Score" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                    <Radar 
                      name="Passing Score" 
                      dataKey="passing" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6} 
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Time Analysis</CardTitle>
              <CardDescription>
                Minutes spent studying per day over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="minutes" fill="#8884d8" stroke="#8884d8" name="Minutes" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Total study time this week: {timeData.reduce((total, day) => total + day.minutes, 0)} minutes
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Optimal Study Time</CardTitle>
              <CardDescription>
                Analysis of your performance based on time of day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { time: 'Morning', score: 82, count: 12 },
                      { time: 'Afternoon', score: 78, count: 15 },
                      { time: 'Evening', score: 85, count: 20 },
                      { time: 'Night', score: 70, count: 8 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#8884d8" name="Avg. Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Your Optimal Study Time</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on your performance data, you tend to perform best during the <span className="font-medium">evening</span>.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">Recommendations:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Schedule challenging tasks during your peak performance time</li>
                        <li>Use morning sessions for review and reinforcement</li>
                        <li>Consider setting up a dedicated evening study routine</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Session Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Morning (6AM-12PM)</span>
                        <span>12 sessions</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Afternoon (12PM-6PM)</span>
                        <span>15 sessions</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Evening (6PM-10PM)</span>
                        <span>20 sessions</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Night (10PM-6AM)</span>
                        <span>8 sessions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Recommendations</CardTitle>
              <CardDescription>
                Personalized suggestions to improve your Italian proficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <StudyRecommendationCard
                    key={index}
                    title={rec.area}
                    description={rec.recommendation}
                    priority={rec.priority}
                  />
                ))}
                
                {recommendations.length === 0 && (
                  <div className="text-center p-6 text-muted-foreground">
                    Complete more lessons to receive personalized recommendations.
                  </div>
                )}
              </div>
              
              <div className="mt-8 space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  CILS B1 Preparation Path
                </h3>
                
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                  <div className="space-y-8 relative">
                    <div className="ml-12">
                      <div className="absolute left-3 w-2 h-2 bg-primary rounded-full -translate-x-1"></div>
                      <h4 className="font-medium">Essential Grammar Review</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Master core grammar concepts required for B1 level communication.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Start Lessons
                      </Button>
                    </div>
                    
                    <div className="ml-12">
                      <div className="absolute left-3 w-2 h-2 bg-muted rounded-full -translate-x-1"></div>
                      <h4 className="font-medium">Practical Conversation Practice</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Build fluency with everyday conversation topics for the speaking test.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Start Practice
                      </Button>
                    </div>
                    
                    <div className="ml-12">
                      <div className="absolute left-3 w-2 h-2 bg-muted rounded-full -translate-x-1"></div>
                      <h4 className="font-medium">Reading Comprehension</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Develop strategies for understanding and analyzing Italian texts.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Start Reading
                      </Button>
                    </div>
                    
                    <div className="ml-12">
                      <div className="absolute left-3 w-2 h-2 bg-muted rounded-full -translate-x-1"></div>
                      <h4 className="font-medium">CILS B1 Practice Tests</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Take full practice tests with exam-style questions and timing.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Start Tests
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Predicted Performance</CardTitle>
              <CardDescription>
                Projected exam performance based on your current progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Jan', predicted: 60 },
                      { month: 'Feb', predicted: 65 },
                      { month: 'Mar', predicted: 68 },
                      { month: 'Apr', predicted: 72 },
                      { month: 'May', predicted: 75 },
                      { month: 'Jun', predicted: 78 },
                      { month: 'Jul', predicted: 80 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#2563eb" 
                        name="Predicted CILS Score" 
                      />
                      <ReferenceLine y={70} stroke="red" strokeDasharray="3 3">
                        <Label value="Passing Score" position="insideTopRight" />
                      </ReferenceLine>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">CILS B1 Readiness Prediction</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          At your current rate of progress, you're estimated to reach CILS B1 readiness in <span className="font-medium">3 months</span>.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm mb-1">Readiness timeline:</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="w-[60%] h-2 bg-amber-500 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Today</span>
                        <span>3 months</span>
                        <span>6 months</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium">Recommended Focus Areas</h4>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Writing skills (biggest gap)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm">Speaking fluency</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Listening comprehension</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressPage;
