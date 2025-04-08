
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface ProgressStats {
  totalCompleted: number;
  currentStreak: number;
  averageScore: number;
  timeSpent: number; // in minutes
  lastActive: Date | null;
  categoryProgress: Record<string, number>; // category name -> completion percentage
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<ProgressStats>({
    totalCompleted: 0,
    currentStreak: 0,
    averageScore: 0,
    timeSpent: 0,
    lastActive: null,
    categoryProgress: {},
  });

  const fetchUserProgress = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch user stats from Supabase
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (statsError) throw statsError;
      
      // Fetch category progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('content_id, progress_percentage, score')
        .eq('user_id', user.id);
      
      if (progressError) throw progressError;
      
      // Fetch categories to map content to categories
      const { data: contentData, error: contentError } = await supabase
        .from('learning_content')
        .select('id, category_id')
        .in('id', progressData?.map(p => p.content_id) || []);
      
      if (contentError) throw contentError;
      
      // Calculate category progress
      const categoryProgress: Record<string, number> = {};
      const contentByCategoryId: Record<string, number[]> = {};
      
      contentData?.forEach(content => {
        if (!content.category_id) return;
        
        if (!contentByCategoryId[content.category_id]) {
          contentByCategoryId[content.category_id] = [];
        }
        
        const progressItem = progressData?.find(p => p.content_id === content.id);
        if (progressItem) {
          contentByCategoryId[content.category_id].push(progressItem.progress_percentage || 0);
        }
      });
      
      // Calculate average progress per category
      Object.entries(contentByCategoryId).forEach(([categoryId, progressValues]) => {
        if (progressValues.length > 0) {
          const sum = progressValues.reduce((acc, val) => acc + val, 0);
          categoryProgress[categoryId] = Math.round(sum / progressValues.length);
        } else {
          categoryProgress[categoryId] = 0;
        }
      });
      
      // Calculate overall stats
      const totalCompleted = progressData?.filter(p => p.progress_percentage === 100).length || 0;
      const scores = progressData?.map(p => p.score).filter(Boolean) as number[];
      const averageScore = scores.length > 0 
        ? Math.round(scores.reduce((acc, val) => acc + val, 0) / scores.length) 
        : 0;
      
      setStats({
        totalCompleted,
        currentStreak: userStats?.streak_days || 0,
        averageScore,
        timeSpent: Math.round((userStats?.time_spent || 0) / 60), // convert seconds to minutes
        lastActive: userStats?.last_activity_date ? new Date(userStats.last_activity_date) : null,
        categoryProgress,
      });
    } catch (error) {
      console.error('Error fetching user progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your progress. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (contentId: string, progressPercentage: number, score?: number, timeSpent?: number) => {
    if (!user) return;
    
    try {
      // Check if entry exists
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .single();
      
      const now = new Date().toISOString();
      
      if (existingProgress) {
        // Update existing progress
        await supabase
          .from('user_progress')
          .update({
            progress_percentage: progressPercentage,
            score: score !== undefined ? score : null,
            time_spent: timeSpent !== undefined ? timeSpent : null,
            last_activity: now,
            updated_at: now,
          })
          .eq('id', existingProgress.id);
      } else {
        // Create new progress entry
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            content_id: contentId,
            progress_percentage: progressPercentage,
            score: score,
            time_spent: timeSpent,
            last_activity: now,
            created_at: now,
            updated_at: now,
          });
      }
      
      // Update user stats
      await supabase.rpc('update_user_activity', {
        user_id: user.id,
        time_spent_seconds: timeSpent || 0,
      });
      
      // Refresh stats
      fetchUserProgress();
      
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to update progress. Please try again later.',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  return {
    stats,
    isLoading,
    fetchUserProgress,
    updateProgress,
  };
};
