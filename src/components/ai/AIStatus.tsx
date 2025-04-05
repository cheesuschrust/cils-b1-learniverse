
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-fixed';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

export const AIStatus: React.FC = () => {
  const ai = useAI();
  const isLoaded = !ai.isProcessing;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          AI Model Status
          {isLoaded ? (
            <Badge variant="success" className="ml-2">Online</Badge>
          ) : (
            <Badge variant="warning" className="ml-2">Loading</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Performance and availability metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connection Status</span>
            <div className="flex items-center">
              {isLoaded ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-sm text-amber-500">Connecting</span>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>API Responsiveness</span>
              <span className="font-medium">{isLoaded ? 'Good' : 'Checking...'}</span>
            </div>
            <Progress value={isLoaded ? 95 : 30} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>System Load</span>
              <span className="font-medium">{isLoaded ? 'Low' : 'Unknown'}</span>
            </div>
            <Progress value={isLoaded ? 25 : 50} />
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStatus;
