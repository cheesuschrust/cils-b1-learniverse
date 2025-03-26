
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AIUsageCardsProps {
  data: {
    totalProcessed: number;
    speechRecognition: number;
    textGeneration: number;
    translation: number;
  };
}

export const AIUsageCards: React.FC<AIUsageCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total AI Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalProcessed.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Processed requests
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Speech Recognition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.speechRecognition.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Audio processed
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Text Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.textGeneration.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Content generated
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Translation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.translation.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Texts translated
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
