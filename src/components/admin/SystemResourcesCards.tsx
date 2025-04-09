
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Database, HardDrive, Server, Cpu, Memory, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIModelSummaryCard from '@/components/ai/AIModelSummaryCard';
import ResourceUsageChart from '@/components/admin/charts/ResourceUsageChart';

interface SystemMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  icon: React.ReactNode;
  criticalThreshold: number;
  warningThreshold: number;
}

const SystemResourcesCards: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Simulate fetching system metrics
  useEffect(() => {
    const fetchSystemMetrics = () => {
      setLoading(true);
      
      // In a real application, this would be an API call to your backend
      setTimeout(() => {
        setSystemMetrics([
          {
            name: 'CPU Usage',
            value: Math.floor(Math.random() * 40) + 20, // 20-60%
            max: 100,
            unit: '%',
            icon: <Cpu className="h-5 w-5 text-blue-500" />,
            criticalThreshold: 90,
            warningThreshold: 70
          },
          {
            name: 'Memory Usage',
            value: Math.floor(Math.random() * 30) + 40, // 40-70%
            max: 100,
            unit: '%',
            icon: <Memory className="h-5 w-5 text-purple-500" />,
            criticalThreshold: 90,
            warningThreshold: 80
          },
          {
            name: 'Disk Space',
            value: Math.floor(Math.random() * 20) + 60, // 60-80%
            max: 100,
            unit: '%',
            icon: <HardDrive className="h-5 w-5 text-amber-500" />,
            criticalThreshold: 90,
            warningThreshold: 80
          },
          {
            name: 'Database Size',
            value: Math.floor(Math.random() * 500) + 1500, // 1.5-2GB
            max: 5000,
            unit: 'MB',
            icon: <Database className="h-5 w-5 text-green-500" />,
            criticalThreshold: 4500,
            warningThreshold: 4000
          },
          {
            name: 'Network Traffic',
            value: Math.floor(Math.random() * 100) + 50, // 50-150 Mbps
            max: 1000,
            unit: 'Mbps',
            icon: <Network className="h-5 w-5 text-indigo-500" />,
            criticalThreshold: 800,
            warningThreshold: 600
          },
          {
            name: 'API Requests',
            value: Math.floor(Math.random() * 2000) + 3000, // 3000-5000 req/min
            max: 10000,
            unit: 'req/min',
            icon: <Server className="h-5 w-5 text-rose-500" />,
            criticalThreshold: 8000,
            warningThreshold: 6000
          }
        ]);
        
        setLoading(false);
        setLastUpdated(new Date());
      }, 1000);
    };
    
    fetchSystemMetrics();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(fetchSystemMetrics, 30 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const getStatusColor = (metric: SystemMetric) => {
    const percentage = (metric.value / metric.max) * 100;
    if (percentage >= metric.criticalThreshold) return 'bg-red-600';
    if (percentage >= metric.warningThreshold) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">System Resources</h2>
          <p className="text-sm text-muted-foreground">
            Monitor your system resources and performance
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2" 
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemMetrics.map((metric, index) => (
          <Card key={index} className={loading ? 'animate-pulse' : ''}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center">
                {metric.icon}
                <span className="ml-2">{metric.name}</span>
              </CardTitle>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(metric)}`}></div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-bold">
                  {metric.unit === '%' ? `${metric.value}%` : `${metric.value.toLocaleString()} ${metric.unit}`}
                </span>
                <span className="text-xs text-muted-foreground">
                  {metric.unit === '%' ? `${metric.max}%` : `${metric.max.toLocaleString()} ${metric.unit}`}
                </span>
              </div>
              <Progress 
                value={(metric.value / metric.max) * 100} 
                className={`h-2 ${(metric.value / metric.max) * 100 > metric.warningThreshold ? 'bg-amber-200' : ''}`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceUsageChart
          title="CPU & Memory Usage"
          description="Real-time CPU and memory utilization"
          timeRange="24h"
          height={300}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Disk Space Allocation</CardTitle>
            <CardDescription>Storage usage by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">Database Files</div>
                  <div className="text-sm text-muted-foreground">2.1 GB / 5.0 GB</div>
                </div>
                <Progress value={42} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">User Uploads</div>
                  <div className="text-sm text-muted-foreground">3.7 GB / 10.0 GB</div>
                </div>
                <Progress value={37} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">Application Assets</div>
                  <div className="text-sm text-muted-foreground">1.2 GB / 2.0 GB</div>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">Logs & Monitoring</div>
                  <div className="text-sm text-muted-foreground">0.8 GB / 3.0 GB</div>
                </div>
                <Progress value={27} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AIModelSummaryCard
          title="Database Performance"
          value="98.2%"
          icon="database"
          subtitle="Query response time: 24ms"
          changePercentage={2.1}
        />
        
        <AIModelSummaryCard
          title="API Performance"
          value="99.4%"
          icon="server"
          subtitle="Uptime this month"
          changePercentage={0.5}
        />
        
        <AIModelSummaryCard
          title="CDN Cache Hit"
          value="87.6%"
          icon="storage"
          subtitle="Global average"
          changePercentage={-1.2}
        />
        
        <AIModelSummaryCard
          title="Load Balancing"
          value="Optimal"
          icon="cpu"
          subtitle="Across 3 regions"
        />
      </div>
    </div>
  );
};

export default SystemResourcesCards;
