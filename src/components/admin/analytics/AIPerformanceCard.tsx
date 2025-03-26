
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AIPerformanceCardProps {
  data: {
    accuracy: {
      overall: number;
      speechRecognition: number;
      textGeneration: number;
      translation: number;
      flashcardGeneration: number;
    };
    byDay: { day: string; requests: number }[];
  };
}

export const AIPerformanceCard: React.FC<AIPerformanceCardProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI System Performance</CardTitle>
        <CardDescription>
          Accuracy metrics across different AI features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <div className="text-center mb-2">
              <span className="text-sm font-medium">Overall</span>
              <div className="text-2xl font-bold">{data.accuracy.overall}%</div>
            </div>
            <Progress value={data.accuracy.overall} className="h-2" />
          </div>
          <div>
            <div className="text-center mb-2">
              <span className="text-sm font-medium">Speech</span>
              <div className="text-2xl font-bold">{data.accuracy.speechRecognition}%</div>
            </div>
            <Progress value={data.accuracy.speechRecognition} className="h-2" />
          </div>
          <div>
            <div className="text-center mb-2">
              <span className="text-sm font-medium">Text</span>
              <div className="text-2xl font-bold">{data.accuracy.textGeneration}%</div>
            </div>
            <Progress value={data.accuracy.textGeneration} className="h-2" />
          </div>
          <div>
            <div className="text-center mb-2">
              <span className="text-sm font-medium">Translation</span>
              <div className="text-2xl font-bold">{data.accuracy.translation}%</div>
            </div>
            <Progress value={data.accuracy.translation} className="h-2" />
          </div>
          <div>
            <div className="text-center mb-2">
              <span className="text-sm font-medium">Flashcards</span>
              <div className="text-2xl font-bold">{data.accuracy.flashcardGeneration}%</div>
            </div>
            <Progress value={data.accuracy.flashcardGeneration} className="h-2" />
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
