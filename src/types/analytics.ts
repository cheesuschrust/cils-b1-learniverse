
// Type definitions for analytics dashboards

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  churnRate: number;
  retentionRate: number;
  averageSessionDuration: number;
  averageSessionsPerUser: number;
}

export interface ContentMetrics {
  totalContent: number;
  mostPopularContent: {
    id: string;
    title: string;
    views: number;
    completions: number;
  }[];
  leastPopularContent: {
    id: string;
    title: string;
    views: number;
    completions: number;
  }[];
  averageCompletionRate: number;
  contentByCategory: Record<string, number>;
}

export interface FinancialMetrics {
  mrr: number;
  arr: number;
  totalRevenue: number;
  revenueGrowth: number;
  averageRevenuePerUser: number;
  lifetimeValue: number;
  acquisitionCost: number;
}

export interface PerformanceMetrics {
  averageScore: number;
  averageCompletionTime: number;
  completionRateByDifficulty: Record<string, number>;
  mostFailedItems: {
    id: string;
    content: string;
    failRate: number;
  }[];
}

export interface AnalyticsPeriod {
  from: Date;
  to: Date;
}

export interface AnalyticsFilters {
  period: AnalyticsPeriod;
  userSegment?: string;
  contentType?: string;
  difficulty?: string;
  language?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}
