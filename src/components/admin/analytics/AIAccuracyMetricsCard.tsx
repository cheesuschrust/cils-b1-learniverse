
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

interface AIAccuracyMetricsCardProps {
  accuracy: {
    overall: number;
    speechRecognition: number;
    textGeneration: number;
    translation: number;
    flashcardGeneration: number;
  };
}

export const AIAccuracyMetricsCard: React.FC<AIAccuracyMetricsCardProps> = ({ accuracy }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Accuracy Metrics</CardTitle>
        <CardDescription>
          Performance across different AI features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">Overall Accuracy</Label>
            <div className="flex items-center">
              <Progress value={accuracy.overall} className="h-4 flex-1" />
              <span className="ml-4 font-medium">{accuracy.overall}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">Speech Recognition</Label>
              <div className="flex items-center">
                <Progress value={accuracy.speechRecognition} className="h-3 flex-1" />
                <span className="ml-4 font-medium">{accuracy.speechRecognition}%</span>
              </div>
              
              <Label className="mb-2 mt-4 block">Text Generation</Label>
              <div className="flex items-center">
                <Progress value={accuracy.textGeneration} className="h-3 flex-1" />
                <span className="ml-4 font-medium">{accuracy.textGeneration}%</span>
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Translation</Label>
              <div className="flex items-center">
                <Progress value={accuracy.translation} className="h-3 flex-1" />
                <span className="ml-4 font-medium">{accuracy.translation}%</span>
              </div>
              
              <Label className="mb-2 mt-4 block">Flashcard Generation</Label>
              <div className="flex items-center">
                <Progress value={accuracy.flashcardGeneration} className="h-3 flex-1" />
                <span className="ml-4 font-medium">{accuracy.flashcardGeneration}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
