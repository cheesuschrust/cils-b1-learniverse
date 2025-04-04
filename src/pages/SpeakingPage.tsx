
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Notification } from '@/components/ui/notification';
import { useAuth } from '@/contexts/AuthContext';
import SpeakingModule from '@/components/speaking/SpeakingModule';
import { supabase } from '@/lib/supabase-client';
import { isPremiumUser } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const SpeakingPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      setIsLoading(true);
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Check if user is premium
        const userIsPremium = await isPremiumUser(user.id);
        setIsPremium(userIsPremium);
        
        // Fetch user speaking stats
        const { data, error } = await supabase
          .from('user_stats')
          .select('speaking_score')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        setUserStats(data);
      } catch (error) {
        console.error('Error fetching user status:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch user data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserStatus();
  }, [user, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Speaking Practice | Italian Language Learning</title>
      </Helmet>
      
      <div className="container py-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Speaking Practice</h1>
          <p className="text-muted-foreground">
            Improve your Italian pronunciation and speaking skills with interactive exercises
          </p>
          
          {userStats && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="px-3 py-1">
                Speaking Level: {userStats.speaking_score ? Math.floor(userStats.speaking_score / 20) + 1 : 1}
              </Badge>
              {!isPremium && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Free Account
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {!isPremium && (
          <Notification
            type="info"
            title="Premium Features Available"
            description="Upgrade to Premium for unlimited speaking exercises, advanced pronunciation feedback, and personalized speaking prompts."
            actions={
              <Button size="sm" variant="outline" className="mt-2">
                Upgrade Now
              </Button>
            }
            className="mb-4"
          />
        )}
        
        <SpeakingModule />
      </div>
    </>
  );
};

export default SpeakingPage;
