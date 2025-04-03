
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useAI } from '@/hooks/useAI';

const AIAccuracyMetricsCard: React.FC = () => {
  // Mock data for AI accuracy by content type
  const accuracyData = [
    { type: 'Grammar', accuracy: 94 },
    { type: 'Vocabulary', accuracy: 96 },
    { type: 'Reading', accuracy: 92 },
    { type: 'Writing', accuracy: 86 },
    { type: 'Speaking', accuracy: 82 },
    { type: 'Listening', accuracy: 89 },
  ];
  
  // Access AI context for more contextual information
  const ai = useAI();
  
  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle>AI Accuracy by Content Type</CardTitle>
        <CardDescription>Accuracy metrics across different learning areas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={accuracyData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="type" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Accuracy %"
                dataKey="accuracy"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          {accuracyData.map((item) => (
            <div key={item.type} className="text-center p-2 rounded-md bg-muted/50">
              <div className="text-sm font-medium truncate">{item.type}</div>
              <div className="text-2xl font-bold">{item.accuracy}%</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 border border-dashed rounded-md">
          <h4 className="font-medium mb-2">Improvement Opportunities</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Speaking recognition needs fine-tuning for regional accents</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Writing evaluation could benefit from more training examples</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Grammar detection excelling with current model configuration</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAccuracyMetricsCard;
