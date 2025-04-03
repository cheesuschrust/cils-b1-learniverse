
// Type definitions for the interface fixes

export interface ReviewSchedule {
  dueToday: number;
  dueThisWeek: number;
  dueNextWeek: number;
  dueByDate: Record<string, number>;
}

export interface ReviewPerformance {
  totalReviews: number;
  correctReviews: number;
  efficiency: number;
  streakDays: number;
  reviewsByCategory: Record<string, {
    total: number;
    correct: number;
    efficiency: number;
  }>;
}
