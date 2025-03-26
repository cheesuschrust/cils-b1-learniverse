
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ContentStatsCardsProps {
  data: {
    totalLessons: number;
    completedLessons: number;
    flashcards: number;
    averageScore: number;
  };
}

export const ContentStatsCards: React.FC<ContentStatsCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalLessons.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Available in the platform
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.completedLessons.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Total user completions
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.flashcards.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Available for practice
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.averageScore}%</div>
          <div className="text-xs text-muted-foreground mt-1">
            Average lesson completion score
          </div>
          <Progress 
            value={data.averageScore} 
            className="h-1 mt-2" 
          />
        </CardContent>
      </Card>
    </div>
  );
};
