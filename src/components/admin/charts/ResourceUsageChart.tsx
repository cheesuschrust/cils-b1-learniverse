
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, BarChart } from '@/components/admin/charts';
import { HardDrive, Database, Cpu, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResourceUsageChartProps {
  title?: string;
  description?: string;
  resourceType?: 'disk' | 'database' | 'memory' | 'cpu' | 'all';
  timeRange?: '24h' | '7d' | '30d' | '90d';
  showControls?: boolean;
  height?: number;
}

const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({
  title = "System Resource Usage",
  description = "Monitor system resources over time",
  resourceType = 'all',
  timeRange = '24h',
  showControls = true,
  height = 300
}) => {
  const [activeTab, setActiveTab] = useState<string>(resourceType !== 'all' ? resourceType : 'cpu');
  const [activeTimeRange, setActiveTimeRange] = useState<string>(timeRange);
  const [data, setData] = useState<any[]>([]);
  
  // Generate mock time-series data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const data: any[] = [];
      
      const points = activeTimeRange === '24h' ? 24 
                   : activeTimeRange === '7d' ? 7 
                   : activeTimeRange === '30d' ? 30 
                   : 90;
      
      for (let i = points; i >= 0; i--) {
        const date = new Date();
        
        if (activeTimeRange === '24h') {
          date.setHours(now.getHours() - i);
        } else {
          date.setDate(now.getDate() - i);
        }
        
        const baseValue = Math.floor(Math.random() * 40) + 30; // Base value between 30-70%
        const variation = Math.floor(Math.random() * 15) - 7; // Variation between -7 and +7
        
        data.push({
          timestamp: date.toISOString(),
          cpu: Math.min(100, Math.max(10, baseValue + variation)),
          memory: Math.min(100, Math.max(15, baseValue + 5 + variation)),
          disk: Math.min(100, Math.max(20, baseValue - 5 + variation)), 
          database: Math.min(100, Math.max(25, baseValue + 3 + variation))
        });
      }
      
      return data;
    };
    
    setData(generateData());
    
    // Auto-refresh every 5 minutes if viewing 24h data
    if (activeTimeRange === '24h') {
      const intervalId = setInterval(() => {
        setData(generateData());
      }, 5 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [activeTimeRange]);
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'cpu': return <Cpu className="h-4 w-4" />;
      case 'memory': return <Server className="h-4 w-4" />;
      case 'disk': return <HardDrive className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          
          {showControls && (
            <div className="flex space-x-2">
              <Button 
                variant={activeTimeRange === "24h" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveTimeRange("24h")}
              >
                24h
              </Button>
              <Button 
                variant={activeTimeRange === "7d" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveTimeRange("7d")}
              >
                7d
              </Button>
              <Button 
                variant={activeTimeRange === "30d" ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveTimeRange("30d")}
              >
                30d
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {resourceType === 'all' ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="cpu" className="flex items-center">
                {getIcon('cpu')}
                <span className="ml-2">CPU</span>
              </TabsTrigger>
              <TabsTrigger value="memory" className="flex items-center">
                {getIcon('memory')}
                <span className="ml-2">Memory</span>
              </TabsTrigger>
              <TabsTrigger value="disk" className="flex items-center">
                {getIcon('disk')}
                <span className="ml-2">Disk</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center">
                {getIcon('database')}
                <span className="ml-2">Database</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cpu">
              <LineChart 
                data={data} 
                xField="timestamp" 
                yField="cpu" 
                height={height}
                color="#3b82f6"
                yAxisLabel="Usage %"
              />
            </TabsContent>
            
            <TabsContent value="memory">
              <LineChart 
                data={data} 
                xField="timestamp" 
                yField="memory" 
                height={height}
                color="#8b5cf6"
                yAxisLabel="Usage %"
              />
            </TabsContent>
            
            <TabsContent value="disk">
              <LineChart 
                data={data} 
                xField="timestamp" 
                yField="disk" 
                height={height}
                color="#10b981"
                yAxisLabel="Usage %"
              />
            </TabsContent>
            
            <TabsContent value="database">
              <LineChart 
                data={data} 
                xField="timestamp" 
                yField="database" 
                height={height}
                color="#f59e0b"
                yAxisLabel="Usage %"
              />
            </TabsContent>
          </Tabs>
        ) : (
          <LineChart 
            data={data} 
            xField="timestamp" 
            yField={resourceType} 
            height={height}
            color={
              resourceType === 'cpu' ? '#3b82f6' :
              resourceType === 'memory' ? '#8b5cf6' :
              resourceType === 'disk' ? '#10b981' :
              resourceType === 'database' ? '#f59e0b' : '#3b82f6'
            }
            yAxisLabel="Usage %"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceUsageChart;
