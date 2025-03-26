
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import analyticsService from '@/services/AnalyticsService';
import { DateRange } from '@/types/analytics';
import { format, subDays } from 'date-fns';

// Available date range options
export type DateRangeOption = '7d' | '30d' | '90d' | 'all';

export const useAnalytics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('30d');
  
  // State for different analytics data
  const [activityData, setActivityData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [knowledgeGaps, setKnowledgeGaps] = useState<any[]>([]);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [streak, setStreak] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Convert selected range to actual date range
  const getDateRange = (option: DateRangeOption): DateRange => {
    const now = new Date();
    
    switch (option) {
      case '7d':
        return { from: subDays(now, 7), to: now };
      case '30d':
        return { from: subDays(now, 30), to: now };
      case '90d':
        return { from: subDays(now, 90), to: now };
      case 'all':
      default:
        return { from: new Date(2020, 0, 1), to: now }; // Arbitrary start date for "all time"
    }
  };

  // Load all analytics data
  const loadAnalyticsData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const dateRange = getDateRange(selectedRange);
      
      // Load data in parallel
      const [
        activityResponse,
        heatmapResponse,
        categoryResponse,
        gapsResponse,
        statsResponse,
        goalsResponse,
        streakResponse,
        recommendationsResponse
      ] = await Promise.all([
        analyticsService.getUserActivityData(user.id, dateRange),
        analyticsService.getActivityHeatmapData(user.id, dateRange),
        analyticsService.getPerformanceByCategory(user.id, dateRange),
        analyticsService.getKnowledgeGaps(user.id, dateRange),
        analyticsService.getSessionStatistics(user.id, dateRange),
        analyticsService.getUserGoals(user.id),
        analyticsService.getUserStreak(user.id),
        analyticsService.getStudyRecommendations(user.id)
      ]);
      
      setActivityData(activityResponse);
      setHeatmapData(heatmapResponse);
      setCategoryData(categoryResponse);
      setKnowledgeGaps(gapsResponse);
      setSessionStats(statsResponse);
      setGoals(goalsResponse);
      setStreak(streakResponse);
      setRecommendations(recommendationsResponse);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load analytics data'));
    } finally {
      setIsLoading(false);
    }
  };

  // Save a user goal
  const saveGoal = async (goalData: {
    id?: string;
    goalType: string;
    targetValue: number;
    startDate: string;
    endDate?: string;
    title: string;
    description?: string;
  }) => {
    if (!user) return null;
    
    try {
      const savedGoal = await analyticsService.saveUserGoal(user.id, goalData);
      
      // Update goals list with new/updated goal
      setGoals(prevGoals => {
        if (goalData.id) {
          // Update existing goal
          return prevGoals.map(goal => 
            goal.id === goalData.id ? savedGoal : goal
          );
        } else {
          // Add new goal
          return [...prevGoals, savedGoal];
        }
      });
      
      return savedGoal;
    } catch (err) {
      console.error('Error saving goal:', err);
      throw err;
    }
  };

  // Generate PDF report
  const generateReport = async () => {
    if (!user) return null;
    
    // We'll implement the PDF generation in a separate component
    return {
      userId: user.id,
      name: user.first_name ? `${user.first_name} ${user.last_name}` : user.email,
      dateRange: {
        label: selectedRange,
        from: format(getDateRange(selectedRange).from, 'MMM d, yyyy'),
        to: format(getDateRange(selectedRange).to, 'MMM d, yyyy')
      },
      activityData,
      categoryData,
      knowledgeGaps,
      sessionStats,
      goals,
      streak,
      recommendations
    };
  };

  // Load data when component mounts or date range changes
  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, selectedRange]);

  return {
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
    refreshData: loadAnalyticsData,
    saveGoal,
    generateReport
  };
};
