
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ContentDistributionChart from '@/components/admin/charts/ContentDistributionChart';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ContentStats {
  type: string;
  count: number;
  change: number;
  color: string;
}

const ContentTypeCard: React.FC = () => {
  // Mock data for content types
  const contentTypes: ContentStats[] = [
    { type: 'Flashcards', count: 1250, change: 12, color: '#3b82f6' },
    { type: 'Multiple Choice', count: 870, change: 5, color: '#10b981' },
    { type: 'Reading', count: 540, change: -2, color: '#8b5cf6' },
    { type: 'Writing', count: 320, change: 8, color: '#f59e0b' },
    { type: 'Speaking', count: 280, change: 15, color: '#ef4444' },
    { type: 'Listening', count: 210, change: 3, color: '#06b6d4' },
  ];

  // Format data for the pie chart
  const chartData = contentTypes.map(item => ({
    name: item.type,
    value: item.count,
    color: item.color
  }));

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Content Type Distribution</CardTitle>
        <CardDescription>Breakdown of content items by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ContentDistributionChart data={chartData} height={300} />
          </div>
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Content Items by Type</h4>
              <div className="space-y-3">
                {contentTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: type.color }}
                      ></div>
                      <span>{type.type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{type.count}</span>
                      <Badge 
                        variant={type.change >= 0 ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {type.change >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(type.change)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Content Growth</h4>
              <div className="text-2xl font-bold">3,470</div>
              <div className="text-sm text-muted-foreground">Total content items</div>
              <div className="mt-2 flex items-center text-sm text-green-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>8.2% increase from last month</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentTypeCard;
