
import { LeaderboardEntry } from '@/types/gamification';

export const getLeaderboardData = async (): Promise<LeaderboardEntry[]> => {
  // This would typically fetch from your backend
  // For now, return mock data
  return [
    {
      userId: 'user1',
      username: 'Marco',
      avatarUrl: '/avatars/marco.jpg',
      xp: 3560,
      level: 12,
      streak: 21,
      rank: 1,
      isCurrentUser: false
    },
    {
      userId: 'user2',
      username: 'Sophia',
      avatarUrl: '/avatars/sophia.jpg',
      xp: 3280,
      level: 11,
      streak: 15,
      rank: 2,
      isCurrentUser: false
    },
    {
      userId: 'user3',
      username: 'CurrentUser',
      avatarUrl: '/avatars/current-user.jpg',
      xp: 2950,
      level: 10,
      streak: 7,
      rank: 3,
      isCurrentUser: true
    },
    {
      userId: 'user4',
      username: 'Alessandro',
      avatarUrl: '/avatars/alessandro.jpg',
      xp: 2780,
      level: 9,
      streak: 12,
      rank: 4,
      isCurrentUser: false
    },
    {
      userId: 'user5',
      username: 'Giulia',
      avatarUrl: '/avatars/giulia.jpg',
      xp: 2650,
      level: 9,
      streak: 8,
      rank: 5,
      isCurrentUser: false
    }
  ];
};
