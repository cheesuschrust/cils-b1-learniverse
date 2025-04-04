
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal, Trophy, ArrowRight, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface LeaderboardUser {
  id: string;
  display_name: string;
  avatar_url: string;
  xp: number;
  rank: number;
  streak_days: number;
  is_current_user: boolean;
}

interface LeaderboardProps {
  limit?: number;
  period?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  limit = 10,
  period = 'weekly',
  className = ''
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>(period);
  
  // Get the leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // In a production app, this would fetch from the database
        // For now, we'll generate mock data
        const mockUsers: LeaderboardUser[] = [
          {
            id: '1',
            display_name: 'Marco S.',
            avatar_url: '',
            xp: 1458,
            rank: 1,
            streak_days: 45,
            is_current_user: false
          },
          {
            id: '2',
            display_name: 'Isabella R.',
            avatar_url: '',
            xp: 1302,
            rank: 2,
            streak_days: 32,
            is_current_user: false
          },
          {
            id: '3',
            display_name: 'Alessandro P.',
            avatar_url: '',
            xp: 1186,
            rank: 3,
            streak_days: 28,
            is_current_user: false
          },
          {
            id: '4',
            display_name: 'Guilia N.',
            avatar_url: '',
            xp: 1050,
            rank: 4,
            streak_days: 21,
            is_current_user: false
          },
          {
            id: '5',
            display_name: 'Francesco T.',
            avatar_url: '',
            xp: 943,
            rank: 5,
            streak_days: 15,
            is_current_user: user.id === '5'
          },
          {
            id: '6',
            display_name: 'Sofia M.',
            avatar_url: '',
            xp: 879,
            rank: 6,
            streak_days: 19,
            is_current_user: false
          },
          {
            id: '7',
            display_name: 'Lorenzo C.',
            avatar_url: '',
            xp: 765,
            rank: 7,
            streak_days: 12,
            is_current_user: false
          },
          {
            id: '8',
            display_name: 'Valentina B.',
            avatar_url: '',
            xp: 690,
            rank: 8,
            streak_days: 10,
            is_current_user: false
          },
          {
            id: user.id,
            display_name: user.display_name || 'You',
            avatar_url: user.avatar_url || '',
            xp: 520,
            rank: 12,
            streak_days: 7,
            is_current_user: true
          }
        ];
        
        // Make sure the current user is included
        let hasCurrentUser = mockUsers.some(u => u.is_current_user);
        
        if (!hasCurrentUser) {
          // Add current user at a random position
          mockUsers.push({
            id: user.id,
            display_name: user.display_name || 'You',
            avatar_url: user.avatar_url || '',
            xp: Math.floor(Math.random() * 500) + 500,
            rank: mockUsers.length + 1,
            streak_days: Math.floor(Math.random() * 10) + 1,
            is_current_user: true
          });
        }
        
        setUsers(mockUsers.slice(0, limit));
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        toast({
          title: 'Error',
          description: 'Failed to load leaderboard data.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [user, toast, limit, activePeriod]);
  
  // Get medal color based on rank
  const getMedalColor = (rank: number): string => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-700';
      default: return 'text-gray-500';
    }
  };
  
  // Display initials if no avatar
  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top learners this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>
              {activePeriod === 'daily' && 'Top learners today'}
              {activePeriod === 'weekly' && 'Top learners this week'}
              {activePeriod === 'monthly' && 'Top learners this month'}
              {activePeriod === 'all-time' && 'Top learners all time'}
            </CardDescription>
          </div>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 text-xs text-muted-foreground pb-2 border-b">
          <div className="col-span-1">Rank</div>
          <div className="col-span-2">User</div>
          <div className="col-span-1 text-right">XP</div>
        </div>
        
        <div className="space-y-2 mt-2">
          {users.map((user) => (
            <div 
              key={user.id}
              className={`grid grid-cols-4 items-center py-2 px-1 rounded-md ${
                user.is_current_user ? 'bg-muted font-medium' : ''
              }`}
            >
              <div className="col-span-1 flex items-center gap-1.5">
                {user.rank <= 3 ? (
                  <Medal className={`h-4 w-4 ${getMedalColor(user.rank)}`} />
                ) : (
                  <span className="w-4 text-center">{user.rank}</span>
                )}
              </div>
              
              <div className="col-span-2 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {getInitials(user.display_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="truncate">
                  {user.is_current_user ? (
                    <span>You</span>
                  ) : (
                    user.display_name
                  )}
                </div>
                
                {user.rank === 1 && (
                  <Crown className="h-3.5 w-3.5 ml-1 text-yellow-500" />
                )}
              </div>
              
              <div className="col-span-1 text-right flex items-center justify-end gap-1">
                <span>{user.xp.toLocaleString()}</span>
                
                <Badge variant="outline" className="ml-1 py-0 h-4 text-xs">
                  {user.streak_days}d
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/leaderboard" className="flex items-center justify-center gap-1">
            View Full Leaderboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Leaderboard;
