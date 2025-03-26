
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import gamificationService from '@/services/gamificationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';
import LevelBadge from './LevelBadge';
import StreakCounter from './StreakCounter';
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from '@/types/gamification';

interface LeaderboardProps {
  limit?: number;
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  limit = 10,
  className 
}) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await gamificationService.getLeaderboard(limit);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLeaderboard();
  }, [limit]);
  
  // Get medal color for top positions
  const getMedalColor = (position: number): string => {
    switch (position) {
      case 0: return 'text-yellow-500'; // Gold
      case 1: return 'text-gray-400'; // Silver
      case 2: return 'text-amber-700'; // Bronze
      default: return 'text-muted-foreground';
    }
  };
  
  // Check if the entry is the current user
  const isCurrentUser = (entry: LeaderboardEntry): boolean => {
    return user && entry.userId === user.id;
  };
  
  // Get initials for avatar fallback
  const getInitials = (entry: LeaderboardEntry): string => {
    if (entry.displayName) {
      const nameParts = entry.displayName.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return entry.displayName[0].toUpperCase();
    }
    return entry.username.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4 mt-1" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.userId} 
              className={cn(
                "flex items-center gap-3 p-2 rounded-md transition-colors",
                isCurrentUser(entry) ? "bg-muted" : "hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "font-bold text-lg w-8 text-center",
                getMedalColor(index)
              )}>
                {index + 1}
              </div>
              
              <Avatar className="h-10 w-10 border-2 border-background">
                {entry.avatar ? (
                  <AvatarImage src={entry.avatar} alt={entry.displayName || entry.username} />
                ) : null}
                <AvatarFallback>{getInitials(entry)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {entry.displayName || entry.username}
                  {isCurrentUser(entry) && (
                    <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <StreakCounter showLabel={false} />
                  <span className="text-muted-foreground">•</span>
                  <span>{entry.achievements} achievements</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <LevelBadge level={entry.level} />
                <div className="text-xs font-medium">{entry.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
