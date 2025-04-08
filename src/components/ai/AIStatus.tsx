
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Server, Cpu, Activity } from 'lucide-react';

interface AIStatusProps {
  status?: 'online' | 'offline' | 'degraded' | 'maintenance';
}

export const AIStatus: React.FC<AIStatusProps> = ({ status = 'online' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'maintenance':
        return 'bg-blue-500';
      case 'offline':
      default:
        return 'bg-red-500';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'online':
        return 'All AI systems operational';
      case 'degraded':
        return 'Experiencing performance issues';
      case 'maintenance':
        return 'Scheduled maintenance in progress';
      case 'offline':
      default:
        return 'AI systems are currently offline';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI System Status</CardTitle>
          <Badge className="text-xs" variant="outline">
            <span className={`mr-1.5 h-2 w-2 rounded-full ${getStatusColor()}`}></span>
            {status}
          </Badge>
        </div>
        <CardDescription>{getStatusMessage()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Bot className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Language Models</span>
            </div>
            <Badge variant={status === 'online' ? 'outline' : 'secondary'}>
              100%
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Server className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Inference API</span>
            </div>
            <Badge variant={status === 'online' ? 'outline' : 'secondary'}>
              100%
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Training Pipeline</span>
            </div>
            <Badge variant={status === 'online' ? 'outline' : 'secondary'}>
              100%
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Recent Requests</span>
            </div>
            <span className="text-sm font-medium">1,253 / day</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
