
import { Challenge } from '@/types/gamification';

export const getChallenges = async (): Promise<Challenge[]> => {
  // This would typically fetch from your backend
  // For now, return mock data
  const currentDate = new Date();
  const endDate = new Date();
  endDate.setDate(currentDate.getDate() + 6);

  return [
    {
      id: 'challenge1',
      title: 'Grammar Master',
      description: 'Complete grammar exercises to improve your Italian language skills',
      xpReward: 250,
      startDate: currentDate,
      endDate: endDate,
      completed: false,
      tasks: [
        {
          id: 'task1',
          title: 'Complete 5 verb conjugation exercises',
          completed: true,
          type: 'lesson',
          requiredValue: 5,
          currentValue: 5
        },
        {
          id: 'task2',
          title: 'Score 80% or higher on articles quiz',
          completed: false,
          type: 'quiz',
          requiredValue: 80,
          currentValue: 65
        },
        {
          id: 'task3',
          title: 'Practice conditional tense for 15 minutes',
          completed: true,
          type: 'practice',
          requiredValue: 15,
          currentValue: 15
        }
      ]
    },
    {
      id: 'challenge2',
      title: 'Listening Champion',
      description: 'Improve your Italian listening comprehension',
      xpReward: 300,
      startDate: currentDate,
      endDate: endDate,
      completed: false,
      tasks: [
        {
          id: 'task1',
          title: 'Complete 3 audio dialogues',
          completed: true,
          type: 'lesson',
          requiredValue: 3,
          currentValue: 3
        },
        {
          id: 'task2',
          title: 'Watch an Italian news clip with subtitles',
          completed: false,
          type: 'custom',
        },
        {
          id: 'task3',
          title: 'Complete a listening dictation exercise',
          completed: false,
          type: 'practice',
        }
      ]
    }
  ];
};

export const completeTask = async (challengeId: string, taskId: string) => {
  // This would typically update on your backend
  return {
    success: true,
    xpEarned: 50,
    challengeCompleted: false
  };
};

export const getWeeklyChallengeProgress = async () => {
  // This would typically fetch from your backend
  return {
    completedChallenges: 2,
    totalChallenges: 5,
    totalXPEarned: 550
  };
};
