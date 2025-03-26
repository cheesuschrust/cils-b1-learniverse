
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart } from '@/components/ui/chart';
import { format, parseISO } from 'date-fns';

interface ProgressOverTimeProps {
  data: Array<{
    date: string;
    total: number;
    correct: number;
    score: number;
    timeSpent: number;
    attempts: number;
  }>;
}

const ProgressOverTime: React.FC<ProgressOverTimeProps> = ({ data }) => {
  // Format data for different chart types
  const formatDateLabel = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d');
    } catch (e) {
      return dateStr;
    }
  };
  
  const chartData = data.map(item => ({
    date: formatDateLabel(item.date),
    Questions: item.total,
    Correct: item.correct,
    Score: item.score
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Over Time</CardTitle>
        <CardDescription>
          Track your daily learning activity and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="questions">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="correct">Accuracy</TabsTrigger>
            <TabsTrigger value="score">Score</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions" className="h-[300px]">
            <LineChart 
              data={chartData}
              index="date"
              categories={["Questions"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value}`}
            />
          </TabsContent>
          
          <TabsContent value="correct" className="h-[300px]">
            <LineChart 
              data={chartData}
              index="date"
              categories={["Questions", "Correct"]}
              colors={["blue", "green"]}
              valueFormatter={(value) => `${value}`}
            />
          </TabsContent>
          
          <TabsContent value="score" className="h-[300px]">
            <LineChart 
              data={chartData}
              index="date"
              categories={["Score"]}
              colors={["purple"]}
              valueFormatter={(value) => `${value}%`}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressOverTime;
