import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CategoryPerformance from '@/components/analytics/CategoryPerformance';
import KnowledgeGaps from '@/components/analytics/KnowledgeGaps';
import ProgressOverTime from '@/components/analytics/ProgressOverTime';
import SessionAnalysis from '@/components/analytics/SessionAnalysis';
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap';
import StudyRecommendations from '@/components/analytics/StudyRecommendations';
import GoalTracker from '@/components/analytics/GoalTracker';
import AnalyticsReport from '@/components/analytics/AnalyticsReport';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, ChevronDown, DownloadCloud, BarChart2, LineChart, PieChart, Target, Award, Eye, FileText } from 'lucide-react';
import { ReviewSchedule, ReviewPerformance } from '@/types/interface-fixes';
import { Helmet } from 'react-helmet-async';

const questionService = {
  getReviewStats: async (userId: string) => ({
    schedule: {
      dueToday: 10,
      dueThisWeek: 45,
      dueNextWeek: 32,
      dueByDate: {}
    },
    performance: {
      totalReviews: 250,
      correctReviews: 200,
      efficiency: 80,
      streakDays: 7,
      reviewsByCategory: {}
    }
  })
};

const ReviewProgress = ({ 
  reviewPerformance, 
  reviewSchedule 
}: { 
  reviewPerformance: ReviewPerformance, 
  reviewSchedule: ReviewSchedule 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Review Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full border-8 border-primary flex items-center justify-center">
            <span className="text-2xl font-bold">{reviewPerformance.efficiency}%</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due today</p>
            <p className="text-2xl font-bold">{reviewSchedule.dueToday}</p>
            <p className="text-xs text-muted-foreground">{reviewSchedule.dueThisWeek} this week</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Analytics = () => {
  const { user } = useAuth();
  const [reviewStats, setReviewStats] = useState<{
    schedule: ReviewSchedule;
    performance: ReviewPerformance;
  }>({
    schedule: {
      dueToday: 0,
      dueThisWeek: 0,
      dueNextWeek: 0,
      dueByDate: {}
    },
    performance: {
      totalReviews: 0,
      correctReviews: 0,
      efficiency: 0,
      streakDays: 0,
      reviewsByCategory: {}
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState({
    activityData: [],
    categoryData: [],
    knowledgeGaps: [],
    sessionStats: {},
    goals: [],
    streak: {},
    recommendations: [],
    dateRange: '30d'
  });
  
  useEffect(() => {
    if (user) {
      const loadReviewStats = async () => {
        try {
          const stats = await questionService.getReviewStats(user.id);
          setReviewStats(stats);
        } catch (error) {
          console.error('Error loading review stats:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadReviewStats();
    }
  }, [user]);
  
  const categoryData = [
    {
      category: "Vocabulary",
      total: 120,
      correct: 98,
      masteryPercentage: 82,
      attempts: 150,
      averageScore: 78,
      reviewEfficiency: 90
    },
    {
      category: "Grammar",
      total: 85,
      correct: 62,
      masteryPercentage: 73,
      attempts: 110,
      averageScore: 68,
      reviewEfficiency: 85
    },
    {
      category: "Conversation",
      total: 45,
      correct: 40,
      masteryPercentage: 89,
      attempts: 50,
      averageScore: 84,
      reviewEfficiency: 95
    },
    {
      category: "Reading",
      total: 65,
      correct: 50,
      masteryPercentage: 77,
      attempts: 80,
      averageScore: 72,
      reviewEfficiency: 80
    }
  ];
  
  const knowledgeGapsData = [
    {
      tag: "Verb Conjugation",
      count: 28,
      difficulty: ["intermediate", "advanced"],
      percentage: 65,
      reviewsDue: 8
    },
    {
      tag: "Prepositions",
      count: 22,
      difficulty: ["beginner", "intermediate"],
      percentage: 72,
      reviewsDue: 5
    },
    {
      tag: "Plural Nouns",
      count: 18,
      difficulty: ["beginner"],
      percentage: 80,
      reviewsDue: 3
    },
    {
      tag: "Past Tense",
      count: 15,
      difficulty: ["intermediate", "advanced"],
      percentage: 60,
      reviewsDue: 6
    },
    {
      tag: "Food Vocabulary",
      count: 12,
      difficulty: ["beginner"],
      percentage: 85,
      reviewsDue: 2
    }
  ];

  const generateReportData = () => {
    setReportData({
      activityData: [
        { date: '2023-01-01', total: 45, correct: 36, score: 80, timeSpent: 25 },
        { date: '2023-01-02', total: 38, correct: 32, score: 84, timeSpent: 22 },
        // Add more activity data as needed
      ],
      categoryData: categoryData,
      knowledgeGaps: knowledgeGapsData,
      sessionStats: {
        totalSessions: 24,
        averageSessionLength: 18,
        averageQuestionsPerSession: 35,
        completionRate: 92,
        timePerQuestion: 28,
        optimalTimeOfDay: 'Evening',
        averageScorePercentage: 80
      },
      goals: [
        { id: '1', title: 'Learn 100 new vocabulary words', progress: 75, target: 100 },
        { id: '2', title: 'Complete 50 grammar exercises', progress: 28, target: 50 },
      ],
      streak: {
        currentStreak: 16,
        longestStreak: 22,
      },
      recommendations: [
        { focus: 'Past Tense Verbs', reason: 'Your accuracy is 60% with this topic' },
        { focus: 'Pronunciation Practice', reason: 'You haven\'t practiced speaking recently' },
      ],
      dateRange: '30d'
    });
    setShowReport(true);
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>Learning Analytics | Italian Learning</title>
      </Helmet>

      {showReport ? (
        <AnalyticsReport 
          onClose={() => setShowReport(false)} 
          reportData={reportData} 
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Learning Analytics</h1>
            <Button onClick={generateReportData}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
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
            
            <ReviewProgress 
              reviewPerformance={reviewStats.performance}
              reviewSchedule={reviewStats.schedule}
            />
          </div>
          
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategoryPerformance data={categoryData} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Gaps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <KnowledgeGaps data={knowledgeGapsData} />
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Progress Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressOverTime data={[]} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmap data={[]} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Session Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <SessionAnalysis data={[]} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="goals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Goal Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoalTracker goals={[]} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Study Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <StudyRecommendations recommendations={[]} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Analytics;
