
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

export const AIStatus: React.FC = () => {
  const { status, isModelLoaded } = useAI();
  
  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'loading':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
      case 'inactive':
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'active':
        return 'All AI systems operational';
      case 'loading':
        return 'AI models are loading';
      case 'error':
        return 'AI service unavailable';
      case 'inactive':
      default:
        return 'AI services inactive';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>AI System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
          <Badge variant={isModelLoaded ? "default" : "outline"}>
            {isModelLoaded ? "Models Loaded" : "Models Not Loaded"}
          </Badge>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          {isModelLoaded 
            ? "Client-side AI models are loaded and ready for use" 
            : "Click 'Load Models' in AI settings to enable client-side processing"}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStatus;
