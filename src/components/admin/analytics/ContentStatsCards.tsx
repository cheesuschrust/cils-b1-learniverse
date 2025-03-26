
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, MessageSquare, FileQuestion } from "lucide-react";
import { supabase } from '@/lib/supabase';

const ContentStatsCards: React.FC = () => {
  const [stats, setStats] = useState({
    totalContent: 0,
    totalQuestions: 0,
    contentToday: 0,
    questionsToday: 0
  });
  
  useEffect(() => {
    const fetchContentStats = async () => {
      try {
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();
        
        // Get total content count
        const { count: contentCount, error: contentError } = await supabase
          .from('content')
          .select('*', { count: 'exact', head: true });
        
        // Get content added today
        const { count: contentTodayCount, error: contentTodayError } = await supabase
          .from('content')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayStr);
        
        // Get total questions count
        const { count: questionsCount, error: questionsError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true });
        
        // Get questions added today
        const { count: questionsTodayCount, error: questionsTodayError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayStr);
        
        setStats({
          totalContent: contentCount || 0,
          totalQuestions: questionsCount || 0,
          contentToday: contentTodayCount || 0,
          questionsToday: questionsTodayCount || 0
        });
      } catch (error) {
        console.error('Error fetching content stats:', error);
      }
    };
    
    fetchContentStats();
  }, []);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Content</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalContent.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.contentToday > 0 ? `+${stats.contentToday} today` : ''}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          <FileQuestion className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQuestions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.questionsToday > 0 ? `+${stats.questionsToday} today` : ''}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Questions/Content</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalContent > 0 
              ? (stats.totalQuestions / stats.totalContent).toFixed(1) 
              : '0'}
          </div>
          <p className="text-xs text-muted-foreground">
            Questions per content item
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Content Engagement</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">
            Average interactions per item
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentStatsCards;
