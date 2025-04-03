
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AIPerformanceData {
  name: string;
  accuracy: number;
  questions: number;
}

interface AIPerformanceCardProps {
  data: AIPerformanceData[];
}

const AIPerformanceCard: React.FC<AIPerformanceCardProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Accuracy by Content Type</CardTitle>
        <CardDescription>Model performance across different question types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{item.name}</span>
                    {item.accuracy >= 90 ? (
                      <Badge variant="default" className="ml-2 bg-green-500">High</Badge>
                    ) : item.accuracy >= 80 ? (
                      <Badge variant="default" className="ml-2 bg-amber-500">Good</Badge>
                    ) : (
                      <Badge variant="outline" className="ml-2">Needs Improvement</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.questions.toLocaleString()} questions processed
                  </div>
                </div>
                <div className="text-lg font-bold">{item.accuracy}%</div>
              </div>
              <Progress value={item.accuracy} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPerformanceCard;
