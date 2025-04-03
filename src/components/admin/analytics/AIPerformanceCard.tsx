
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AIPerformanceData {
  name: string;
  accuracy: number;
  questions: number;
}

interface AIPerformanceCardProps {
  data: AIPerformanceData[];
}

const AIPerformanceCard: React.FC<AIPerformanceCardProps> = ({ data }) => {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-500';
    if (accuracy >= 80) return 'bg-blue-500';
    if (accuracy >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (accuracy: number) => {
    if (accuracy >= 85) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (accuracy >= 75) return <CheckCircle2 className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const averageAccuracy = data.reduce((sum, item) => sum + item.accuracy, 0) / data.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Performance by Type
            </CardTitle>
            <CardDescription>
              Accuracy metrics across different content types
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Avg: {averageAccuracy.toFixed(1)}%</span>
            {getStatusIcon(averageAccuracy)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.questions.toLocaleString()} questions analyzed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.accuracy}%</span>
                  {getStatusIcon(item.accuracy)}
                </div>
              </div>
              <Progress 
                value={item.accuracy} 
                className="h-2" 
                indicatorClassName={getAccuracyColor(item.accuracy)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPerformanceCard;
