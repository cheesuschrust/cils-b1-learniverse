
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, Bot, Zap, Gauge, Brain } from 'lucide-react';

interface AIUsageCardsProps {
  period: string;
}

const AIUsageCards: React.FC<AIUsageCardsProps> = ({ period }) => {
  // Mock data - in a real app, this would come from API
  const stats = {
    totalRequests: 325745,
    averageResponseTime: 187,
    averageConfidence: 87.5,
    errorRate: 2.1
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Total AI Requests
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">+8.3%</span>
            <span className="ml-1">from last {period === '7d' ? 'week' : 'month'}</span>
          </div>
          <Progress value={78} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Response Time
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageResponseTime}ms</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" transform="rotate(90)" />
            <span className="text-green-500 font-medium">-15ms</span>
            <span className="ml-1">from last {period === '7d' ? 'week' : 'month'}</span>
          </div>
          <Progress value={40} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Confidence Score
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageConfidence}%</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">+2.3%</span>
            <span className="ml-1">from last {period === '7d' ? 'week' : 'month'}</span>
          </div>
          <Progress value={stats.averageConfidence} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Error Rate
            <Badge variant="outline" className="text-green-500 border-green-500">Low</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.errorRate}%</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" transform="rotate(90)" />
            <span className="text-green-500 font-medium">-0.4%</span>
            <span className="ml-1">from last {period === '7d' ? 'week' : 'month'}</span>
          </div>
          <Progress value={stats.errorRate * 5} className="h-1 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AIUsageCards;
