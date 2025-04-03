
import { WeeklyProgress } from '@/types/gamification';

export const getProgressData = async (): Promise<WeeklyProgress[]> => {
  // This would typically fetch from your backend
  const mockData = [
    {
      date: '2024-03-28',
      xp: 150,
      minutesStudied: 45,
      activitiesCompleted: 12
    },
    {
      date: '2024-03-29',
      xp: 200,
      minutesStudied: 60,
      activitiesCompleted: 15
    },
    {
      date: '2024-03-30',
      xp: 180,
      minutesStudied: 55,
      activitiesCompleted: 14
    }
  ];

  return mockData;
};

export const exportProgressReport = async () => {
  // Implementation for exporting progress data
  const progressData = await getProgressData();
  const report = {
    generatedAt: new Date().toISOString(),
    data: progressData,
    summary: {
      totalXP: progressData.reduce((sum, day) => sum + day.xp, 0),
      totalMinutes: progressData.reduce((sum, day) => sum + day.minutesStudied, 0),
      totalActivities: progressData.reduce((sum, day) => sum + day.activitiesCompleted, 0)
    }
  };
  
  return report;
};
