
// This file provides additional interface definitions needed to fix build errors

import { User } from './user-types';

export interface AnalyticsReportProps {
  onClose: () => void;
  reportData: {
    dateRange: string;
    activityData: Array<{
      date: string;
      total: number;
      correct: number;
      score: number;
      timeSpent: number;
      attempts: number;
    }>;
    categoryData: Array<{
      name: string;
      correct: number;
      incorrect: number;
      percentage: number;
    }>;
    knowledgeGaps: Array<{
      category: string;
      topic: string;
      correctRate: number;
      recommendedActions: string[];
    }>;
    streak?: {
      currentStreak: number;
      longestStreak: number;
      lastStudyDate: string;
    };
    recommendations: Array<{
      focus: string;
      reason: string;
      resources?: string[];
    }>;
    sessionStats?: {
      totalSessions: number;
      averageSessionLength: number;
      averageQuestionsPerSession: number;
      completionRate: number;
      timePerQuestion: number;
      optimalTimeOfDay: string;
    };
  };
}
