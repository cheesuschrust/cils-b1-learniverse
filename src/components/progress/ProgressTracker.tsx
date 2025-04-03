
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getProgressData } from '@/services/progressService';

const ProgressTracker = () => {
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: getProgressData
  });
  
  // Skill categories for CILS B1
  const skillCategories = [
    { name: 'Reading', progress: 65 },
    { name: 'Writing', progress: 45 },
    { name: 'Listening', progress: 78 },
    { name: 'Speaking', progress: 55 },
    { name: 'Grammar', progress: 70 }
  ];

  const mockTimeSeriesData = [
    { date: '2024-01', score: 45 },
    { date: '2024-02', score: 52 },
    { date: '2024-03', score: 58 },
    { date: '2024-04', score: 65 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CILS B1 Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {skillCategories.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{skill.name}</span>
                  <span>{skill.progress}%</span>
                </div>
                <Progress value={skill.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTimeSeriesData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
