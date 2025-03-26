
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Award, Calendar } from 'lucide-react';

interface SessionAnalysisProps {
  data: {
    totalSessions: number;
    averageSessionLength: number;
    averageQuestionsPerSession: number;
    averageScorePercentage: number;
    optimalTimeOfDay: string | null;
    completionRate: number;
    timePerQuestion: number;
  } | null;
}

const SessionAnalysis: React.FC<SessionAnalysisProps> = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Analysis</CardTitle>
          <CardDescription>
            Insights about your study sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">No session data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Analysis</CardTitle>
        <CardDescription>
          Insights about your study sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg. Session</span>
            </div>
            <p className="text-2xl font-bold">{data.averageSessionLength} min</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Award className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg. Score</span>
            </div>
            <p className="text-2xl font-bold">{data.averageScorePercentage}%</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Questions per Session</span>
            <span className="text-sm text-muted-foreground">{data.averageQuestionsPerSession}</span>
          </div>
          <Progress 
            value={Math.min(100, (data.averageQuestionsPerSession / 20) * 100)} 
            className="h-2" 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Completion Rate</span>
            <span className="text-sm text-muted-foreground">{data.completionRate}%</span>
          </div>
          <Progress value={data.completionRate} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Time per Question</span>
            <span className="text-sm text-muted-foreground">{data.timePerQuestion} sec</span>
          </div>
          <Progress 
            value={Math.min(100, (data.timePerQuestion / 60) * 100)} 
            className="h-2" 
          />
        </div>
        
        {data.optimalTimeOfDay && (
          <div className="border rounded-md p-3 mt-6">
            <div className="flex items-center mb-2">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Optimal Study Time</span>
            </div>
            <p className="text-lg font-bold">{data.optimalTimeOfDay}</p>
            <p className="text-xs text-muted-foreground">Based on your best performance</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionAnalysis;
