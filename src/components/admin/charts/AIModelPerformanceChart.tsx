
import React from 'react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer, 
  Tooltip, 
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ContentType } from '@/types/contentType';

interface AIModelPerformanceChartProps {
  confidenceScores?: Record<ContentType, number>;
  height?: number;
}

const AIModelPerformanceChart: React.FC<AIModelPerformanceChartProps> = ({ 
  confidenceScores,
  height = 300 
}) => {
  // Default confidence scores if none provided
  const scores = confidenceScores || {
    'multiple-choice': 85,
    'flashcards': 82,
    'writing': 78,
    'speaking': 75,
    'listening': 80
  };

  // Format the data for the radar chart
  const data = [
    { subject: 'Multiple Choice', score: scores['multiple-choice'], fullMark: 100 },
    { subject: 'Flashcards', score: scores['flashcards'], fullMark: 100 },
    { subject: 'Writing', score: scores['writing'], fullMark: 100 },
    { subject: 'Speaking', score: scores['speaking'], fullMark: 100 },
    { subject: 'Listening', score: scores['listening'], fullMark: 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Performance by Content Type</CardTitle>
        <CardDescription>Confidence scores across different content types</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Current Model"
                dataKey="score"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIModelPerformanceChart;
