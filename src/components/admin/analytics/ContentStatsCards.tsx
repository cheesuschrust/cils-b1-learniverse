
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface ContentStatsCardsProps {
  period: string;
}

const ContentStatsCards: React.FC<ContentStatsCardsProps> = ({ period }) => {
  // This would normally come from an API call based on the period
  const contentStats = {
    totalContent: period === '7d' ? 1872 : period === '30d' ? 1984 : 2153,
    newContent: period === '7d' ? 24 : period === '30d' ? 112 : 387,
    completionRate: period === '7d' ? 78.4 : period === '30d' ? 76.2 : 72.8,
    engagementScore: period === '7d' ? 8.7 : period === '30d' ? 8.4 : 8.2
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{contentStats.totalContent}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">6.2%</span>
            <span className="ml-1">from last {period}</span>
          </div>
          <Progress value={85} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">New Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{contentStats.newContent}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">12.8%</span>
            <span className="ml-1">from last {period}</span>
          </div>
          <Progress value={68} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{contentStats.completionRate}%</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowDownIcon className="h-3 w-3 text-amber-500 mr-1" />
            <span className="text-amber-500 font-medium">1.4%</span>
            <span className="ml-1">from last {period}</span>
          </div>
          <Progress value={contentStats.completionRate} className="h-1 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{contentStats.engagementScore}/10</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">0.3</span>
            <span className="ml-1">from last {period}</span>
          </div>
          <Progress value={contentStats.engagementScore * 10} className="h-1 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentStatsCards;
