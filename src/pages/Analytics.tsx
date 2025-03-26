
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics, DateRangeOption } from '@/hooks/useAnalytics';
import { 
  TrendingUp, 
  Calendar, 
  BarChart as BarChartIcon, 
  Clock, 
  Award, 
  Download,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressCircle } from '@/components/analytics/ProgressCircle';
import ProgressOverTime from '@/components/analytics/ProgressOverTime';
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap';
import CategoryPerformance from '@/components/analytics/CategoryPerformance';
import KnowledgeGaps from '@/components/analytics/KnowledgeGaps';
import SessionAnalysis from '@/components/analytics/SessionAnalysis';
import GoalTracker from '@/components/analytics/GoalTracker';
import StudyRecommendations from '@/components/analytics/StudyRecommendations';
import AnalyticsReport from '@/components/analytics/AnalyticsReport';
import { useToast } from '@/components/ui/use-toast';

const AnalyticsPage: React.FC = () => {
  const { 
    isLoading, 
    error, 
    selectedRange, 
    setSelectedRange,
    activityData,
    heatmapData,
    categoryData,
    knowledgeGaps,
    sessionStats,
    goals,
    streak,
    recommendations,
    refreshData,
    generateReport
  } = useAnalytics();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showingReport, setShowingReport] = useState(false);
  const { toast } = useToast();

  const handleRangeChange = (range: DateRangeOption) => {
    setSelectedRange(range);
  };

  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Data refreshed",
      description: "Your analytics data has been updated.",
    });
  };

  const handleExportClick = async () => {
    try {
      setShowingReport(true);
    } catch (err) {
      toast({
        title: "Error generating report",
        description: "There was a problem creating your analytics report.",
        variant: "destructive"
      });
    }
  };
  
  // Calculate summary metrics
  const getTotalQuestionsAnswered = () => {
    return activityData.reduce((sum, day) => sum + day.total, 0);
  };
  
  const getAverageScore = () => {
    const daysWithActivity = activityData.filter(day => day.attempts > 0);
    if (daysWithActivity.length === 0) return 0;
    
    const totalScore = daysWithActivity.reduce((sum, day) => sum + day.score, 0);
    return Math.round(totalScore / daysWithActivity.length);
  };
  
  const getActiveDays = () => {
    return activityData.filter(day => day.attempts > 0).length;
  };

  if (showingReport) {
    return (
      <AnalyticsReport 
        onClose={() => setShowingReport(false)}
        reportData={{
          activityData,
          categoryData,
          knowledgeGaps,
          sessionStats,
          goals,
          streak,
          recommendations,
          dateRange: selectedRange
        }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Learning Analytics | Your Learning Progress</title>
      </Helmet>
      <div className="container py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Analytics</h1>
            <p className="text-muted-foreground">Track your progress and identify areas for improvement</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-md p-1">
              <Button 
                variant={selectedRange === '7d' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => handleRangeChange('7d')}
              >
                7 days
              </Button>
              <Button 
                variant={selectedRange === '30d' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => handleRangeChange('30d')}
              >
                30 days
              </Button>
              <Button 
                variant={selectedRange === '90d' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => handleRangeChange('90d')}
              >
                90 days
              </Button>
              <Button 
                variant={selectedRange === 'all' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => handleRangeChange('all')}
              >
                All time
              </Button>
            </div>
            <Button size="icon" variant="outline" onClick={handleRefresh}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" onClick={handleExportClick}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <h3 className="text-lg font-medium">Error loading analytics data</h3>
                <p className="text-muted-foreground mt-2">{error.message}</p>
                <Button variant="outline" className="mt-4" onClick={() => refreshData()}>
                  Try again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary metrics */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Questions Answered
                  </CardTitle>
                  <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getTotalQuestionsAnswered()}</div>
                  <p className="text-xs text-muted-foreground">
                    During the selected period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getAverageScore()}%</div>
                  <p className="text-xs text-muted-foreground">
                    Across all content types
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Streak
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {streak?.currentStreak || 0} days
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {streak?.longestStreak ? `Longest: ${streak.longestStreak} days` : 'Start a streak today!'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <ProgressOverTime data={activityData} />
                  <CategoryPerformance data={categoryData} />
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Activity Heatmap</CardTitle>
                      <CardDescription>
                        Your activity patterns by day and time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ActivityHeatmap data={heatmapData} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Study Recommendations</CardTitle>
                      <CardDescription>
                        Suggested focus areas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <StudyRecommendations recommendations={recommendations.slice(0, 3)} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="progress" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <ProgressOverTime data={activityData} />
                  <SessionAnalysis data={sessionStats} />
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Calendar</CardTitle>
                      <CardDescription>
                        Your learning activity over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ActivityHeatmap data={heatmapData} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Session Time Analysis</CardTitle>
                      <CardDescription>
                        Time spent and effective learning periods
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <ProgressCircle 
                            value={sessionStats?.averageSessionLength || 0} 
                            maxValue={60}
                            label="mins"
                            title="Avg. Session"
                            size={120}
                          />
                        </div>
                        <div className="text-center">
                          <ProgressCircle 
                            value={sessionStats?.timePerQuestion || 0} 
                            maxValue={120}
                            label="secs"
                            title="Per Question"
                            size={120}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <div>
                          <p className="text-sm font-medium">Optimal study time</p>
                          <p className="text-2xl font-bold">
                            {sessionStats?.optimalTimeOfDay || 'Not enough data'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Completion rate</p>
                          <p className="text-2xl font-bold">
                            {sessionStats?.completionRate || 0}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Knowledge Gaps</CardTitle>
                      <CardDescription>
                        Areas where you've struggled the most
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <KnowledgeGaps data={knowledgeGaps} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Mastery</CardTitle>
                      <CardDescription>
                        Your performance across categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CategoryPerformance data={categoryData} />
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Personalized Study Recommendations</CardTitle>
                    <CardDescription>
                      Based on your performance and learning patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StudyRecommendations recommendations={recommendations} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="goals" className="space-y-6">
                <GoalTracker goals={goals} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </>
  );
};

export default AnalyticsPage;
