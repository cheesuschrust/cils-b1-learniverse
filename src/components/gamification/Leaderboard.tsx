
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from '@/types/gamification';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboardData } from '@/services/leaderboardService';

interface LeaderboardProps {
  className?: string;
  limit?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  className, 
  limit = 10 
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboardData
  });
  
  const leaderboardEntries = data?.slice(0, limit) || [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-700" />;
      default:
        return <span className="text-sm font-medium">{rank}</span>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboardEntries.map((entry) => (
              <div 
                key={entry.userId} 
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  entry.isCurrentUser && "bg-muted"
                )}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.avatarUrl} />
                  <AvatarFallback>{entry.username.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {entry.username} 
                    {entry.isCurrentUser && (
                      <span className="text-xs font-normal text-muted-foreground ml-1">(You)</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Level {entry.level} • {entry.streak} day streak
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">{entry.xp.toLocaleString()} XP</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
