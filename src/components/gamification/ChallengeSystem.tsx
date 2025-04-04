
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Star, Calendar, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  goal_count: number;
  current_count: number;
  expires_at: Date | null;
  reward_xp: number;
  challenge_type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: string;
  is_completed: boolean;
}

const ChallengeSystem: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Fetch user's challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // In a real app, fetch challenges from the database
        // Here, we generate mock challenges
        const mockChallenges: Challenge[] = [
          {
            id: '1',
            title: 'Daily Grammar Review',
            description: 'Complete 3 grammar exercises today',
            goal_count: 3,
            current_count: 2,
            expires_at: new Date(new Date().setHours(23, 59, 59, 999)),
            reward_xp: 20,
            challenge_type: 'daily',
            category: 'grammar',
            is_completed: false
          },
          {
            id: '2',
            title: 'Vocabulary Master',
            description: 'Learn 50 new words this week',
            goal_count: 50,
            current_count: 32,
            expires_at: getWeekEndDate(),
            reward_xp: 100,
            challenge_type: 'weekly',
            category: 'vocabulary',
            is_completed: false
          },
          {
            id: '3',
            title: 'Perfect Streak',
            description: 'Maintain a 7-day login streak',
            goal_count: 7,
            current_count: 5,
            expires_at: null,
            reward_xp: 50,
            challenge_type: 'special',
            category: 'consistency',
            is_completed: false
          },
          {
            id: '4',
            title: 'Conversation Practice',
            description: 'Complete 5 speaking exercises',
            goal_count: 5,
            current_count: 5,
            expires_at: getWeekEndDate(),
            reward_xp: 75,
            challenge_type: 'weekly',
            category: 'speaking',
            is_completed: true
          }
        ];
        
        setChallenges(mockChallenges);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        toast({
          title: 'Error',
          description: 'Failed to load challenges.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChallenges();
  }, [user, toast]);
  
  // Helper function to get the end of the current week
  function getWeekEndDate(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysUntilSunday = 7 - dayOfWeek;
    const endOfWeek = new Date();
    endOfWeek.setDate(now.getDate() + daysUntilSunday);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }
  
  // Filter challenges based on active category
  const filteredChallenges = activeCategory === 'all'
    ? challenges
    : challenges.filter(challenge => 
        activeCategory === 'completed' 
          ? challenge.is_completed 
          : challenge.challenge_type === activeCategory && !challenge.is_completed
      );
  
  // Handle challenge claim
  const handleClaimReward = async (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;
    
    try {
      // In a production app, this would be a database update
      setChallenges(challenges.map(c => 
        c.id === challengeId ? { ...c, is_completed: true } : c
      ));
      
      // Show success toast
      toast({
        title: 'Challenge Completed!',
        description: `You earned ${challenge.reward_xp} XP for completing ${challenge.title}.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: 'Error',
        description: 'Failed to claim reward.',
        variant: 'destructive'
      });
    }
  };
  
  // Format time remaining
  const formatTimeRemaining = (expiresAt: Date | null): string => {
    if (!expiresAt) return 'No expiration';
    
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    }
    
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };
  
  // Icon mapping for challenge types
  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'weekly': return <Star className="h-5 w-5 text-purple-500" />;
      case 'monthly': return <Trophy className="h-5 w-5 text-amber-500" />;
      case 'special': return <Target className="h-5 w-5 text-red-500" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Challenges</CardTitle>
          <CardDescription>Complete challenges to earn XP</CardDescription>
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Challenges</CardTitle>
            <CardDescription>Complete challenges to earn XP</CardDescription>
          </div>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Trophy className="h-3 w-3" /> {challenges.filter(c => c.is_completed).length} completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 pb-2 overflow-x-auto">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('all')}
          >
            All
          </Button>
          <Button
            variant={activeCategory === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('daily')}
          >
            Daily
          </Button>
          <Button
            variant={activeCategory === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={activeCategory === 'special' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('special')}
          >
            Special
          </Button>
          <Button
            variant={activeCategory === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('completed')}
          >
            Completed
          </Button>
        </div>
        
        {filteredChallenges.length > 0 ? (
          <div className="space-y-4">
            {filteredChallenges.map((challenge) => (
              <div 
                key={challenge.id}
                className={`border rounded-lg p-4 ${challenge.is_completed ? 'bg-muted' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getChallengeIcon(challenge.challenge_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{challenge.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {challenge.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {challenge.description}
                    </p>
                    
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{challenge.current_count}/{challenge.goal_count}</span>
                      </div>
                      <Progress 
                        value={(challenge.current_count / challenge.goal_count) * 100}
                        className="h-1.5"
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {challenge.is_completed 
                            ? 'Completed' 
                            : formatTimeRemaining(challenge.expires_at)}
                        </span>
                      </div>
                      
                      {challenge.is_completed ? (
                        <Badge variant="outline" className="bg-green-100">Claimed</Badge>
                      ) : challenge.current_count >= challenge.goal_count ? (
                        <Button 
                          size="sm"
                          onClick={() => handleClaimReward(challenge.id)}
                        >
                          Claim {challenge.reward_xp} XP
                        </Button>
                      ) : (
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <Star className="h-3 w-3" /> {challenge.reward_xp} XP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No {activeCategory === 'all' ? '' : activeCategory} challenges available at the moment.
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" size="sm" className="w-full">
          View All Challenges
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeSystem;
