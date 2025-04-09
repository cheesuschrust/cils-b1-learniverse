
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  HardDrive, 
  Database, 
  Server, 
  Cpu, 
  AlertTriangle, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown,
  ServerCrash,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ResourceUsageChart from './charts/ResourceUsageChart';
import AIModelSummaryCard from '../ai/AIModelSummaryCard';
import { supabase } from '@/integrations/supabase/client';

interface ResourceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  database: number;
  networkIn: number;
  networkOut: number;
  responseTime: number;
  uptime: number;
  lastUpdated: Date;
}

const SystemResourceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ResourceMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    database: 0,
    networkIn: 0,
    networkOut: 0,
    responseTime: 0,
    uptime: 0,
    lastUpdated: new Date()
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const fetchResourceMetrics = async () => {
    setIsRefreshing(true);
    
    try {
      // In a real implementation, this would be an API call to a backend service
      // or directly retrieving metrics from a monitoring service
      
      // For demo purposes, we'll generate random values
      const simulateApiCall = () => {
        return new Promise<ResourceMetrics>((resolve) => {
          setTimeout(() => {
            resolve({
              cpu: Math.floor(Math.random() * 35) + 25, // 25-60%
              memory: Math.floor(Math.random() * 25) + 35, // 35-60%
              disk: Math.floor(Math.random() * 15) + 40, // 40-55%
              database: Math.floor(Math.random() * 20) + 30, // 30-50%
              networkIn: Math.floor(Math.random() * 50) + 150, // 150-200 Mbps
              networkOut: Math.floor(Math.random() * 30) + 80, // 80-110 Mbps
              responseTime: Math.floor(Math.random() * 60) + 120, // 120-180ms
              uptime: 99.98, // High uptime percentage
              lastUpdated: new Date()
            });
          }, 800); // Simulate API delay
        });
      };
      
      // Optionally, check Supabase database size if connected
      // This would be a real metric in production
      try {
        // This would be an admin query in production to get actual DB stats
        // For now, we'll just check if we can connect
        await supabase.from('users').select('id', { count: 'exact', head: true });
        
        // In a real application, you would update the database metric based on actual data
      } catch (dbError) {
        console.error("Database check failed:", dbError);
      }
      
      const newMetrics = await simulateApiCall();
      setMetrics(newMetrics);
      
      toast({
        title: "Metrics Updated",
        description: `Last updated: ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error("Error fetching resource metrics:", error);
      toast({
        title: "Error Updating Metrics",
        description: "Failed to fetch system resource metrics.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchResourceMetrics();
    
    // Set up auto-refresh interval
    const intervalId = setInterval(() => {
      fetchResourceMetrics();
    }, 60000); // Refresh every minute
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  const getStatusBadge = (value: number) => {
    if (value < 50) {
      return <Badge className="bg-green-500">Normal</Badge>;
    } else if (value < 80) {
      return <Badge className="bg-yellow-500">Moderate</Badge>;
    } else {
      return <Badge className="bg-red-500">High</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Resources</h2>
          <p className="text-muted-foreground">
            Monitor and manage system resources and performance
          </p>
        </div>
        
        <Button 
          onClick={fetchResourceMetrics} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Updating...' : 'Refresh Metrics'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AIModelSummaryCard
          title="CPU Usage"
          value={`${metrics.cpu}%`}
          icon="cpu"
          progress={metrics.cpu}
          subtitle="Server processing power"
        />
        
        <AIModelSummaryCard
          title="Memory Allocation"
          value={`${metrics.memory}%`}
          icon="server"
          progress={metrics.memory}
          subtitle="RAM utilization"
        />
        
        <AIModelSummaryCard
          title="Disk Space"
          value={`${metrics.disk}%`}
          icon="storage"
          progress={metrics.disk}
          subtitle="Storage utilization"
        />
        
        <AIModelSummaryCard
          title="Database Load"
          value={`${metrics.database}%`}
          icon="database"
          progress={metrics.database}
          subtitle="DB connection utilization"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cpu">CPU & Memory</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ResourceUsageChart 
              title="CPU Usage Trends" 
              description="Historical CPU utilization" 
              resourceType="cpu"
            />
            
            <ResourceUsageChart 
              title="Memory Usage Trends" 
              description="Historical memory utilization" 
              resourceType="memory"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                System Response Time
              </CardTitle>
              <CardDescription>
                API and database response time metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">API Response Time</div>
                    <div className="text-sm text-muted-foreground">{metrics.responseTime} ms</div>
                  </div>
                  <Progress 
                    value={Math.min(100, (metrics.responseTime / 5))} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">Database Query Time</div>
                    <div className="text-sm text-muted-foreground">{metrics.responseTime * 0.7} ms</div>
                  </div>
                  <Progress 
                    value={Math.min(100, (metrics.responseTime * 0.7 / 3))} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">AI Model Inference Time</div>
                    <div className="text-sm text-muted-foreground">{metrics.responseTime * 2.5} ms</div>
                  </div>
                  <Progress 
                    value={Math.min(100, (metrics.responseTime * 2.5 / 10))} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cpu" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="mr-2 h-5 w-5 text-muted-foreground" />
                  CPU Details
                </CardTitle>
                <CardDescription>
                  Detailed CPU metrics and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Current Load</p>
                      <p className="text-2xl font-bold">{metrics.cpu}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <div>{getStatusBadge(metrics.cpu)}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cores</p>
                      <p className="text-lg font-semibold">4 vCPU</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Clock Speed</p>
                      <p className="text-lg font-semibold">2.5 GHz</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Load Distribution</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map((core) => (
                        <div key={core} className="space-y-1">
                          <p className="text-xs text-center">Core {core}</p>
                          <Progress 
                            value={Math.max(10, metrics.cpu + Math.floor(Math.random() * 20) - 10)} 
                            className="h-1" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5 text-muted-foreground" />
                  Memory Details
                </CardTitle>
                <CardDescription>
                  Detailed memory metrics and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Current Usage</p>
                      <p className="text-2xl font-bold">{metrics.memory}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <div>{getStatusBadge(metrics.memory)}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Memory</p>
                      <p className="text-lg font-semibold">16 GB</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Available</p>
                      <p className="text-lg font-semibold">
                        {Math.round(16 * (100 - metrics.memory) / 100)} GB
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Memory Allocation</p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Application</span>
                          <span>{Math.round(metrics.memory * 0.6)}%</span>
                        </div>
                        <Progress 
                          value={metrics.memory * 0.6} 
                          className="h-1" 
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Database</span>
                          <span>{Math.round(metrics.memory * 0.3)}%</span>
                        </div>
                        <Progress 
                          value={metrics.memory * 0.3} 
                          className="h-1" 
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>System</span>
                          <span>{Math.round(metrics.memory * 0.1)}%</span>
                        </div>
                        <Progress 
                          value={metrics.memory * 0.1} 
                          className="h-1" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <ResourceUsageChart 
            title="Historical CPU & Memory Usage" 
            description="7-day trend of CPU and memory utilization" 
            timeRange="7d"
          />
        </TabsContent>
        
        <TabsContent value="storage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="mr-2 h-5 w-5 text-muted-foreground" />
                  Disk Storage
                </CardTitle>
                <CardDescription>
                  Physical storage metrics and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Usage</p>
                      <p className="text-2xl font-bold">{metrics.disk}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <div>{getStatusBadge(metrics.disk)}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Space</p>
                      <p className="text-lg font-semibold">500 GB</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Available</p>
                      <p className="text-lg font-semibold">
                        {Math.round(500 * (100 - metrics.disk) / 100)} GB
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Storage Distribution</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Application Files</span>
                          <span>2.5 GB</span>
                        </div>
                        <Progress value={2.5 / 5} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Database Files</span>
                          <span>145 GB</span>
                        </div>
                        <Progress value={145 / 5} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>User Uploads</span>
                          <span>78 GB</span>
                        </div>
                        <Progress value={78 / 5} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>System Files</span>
                          <span>25 GB</span>
                        </div>
                        <Progress value={25 / 5} className="h-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5 text-muted-foreground" />
                  Database Storage
                </CardTitle>
                <CardDescription>
                  Database size and storage metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Usage</p>
                      <p className="text-2xl font-bold">{metrics.database}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <div>{getStatusBadge(metrics.database)}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Allocation</p>
                      <p className="text-lg font-semibold">250 GB</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Available</p>
                      <p className="text-lg font-semibold">
                        {Math.round(250 * (100 - metrics.database) / 100)} GB
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Table Space Distribution</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>User Data</span>
                          <span>45 GB</span>
                        </div>
                        <Progress value={45 / 2.5} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Content Data</span>
                          <span>65 GB</span>
                        </div>
                        <Progress value={65 / 2.5} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Analytics Data</span>
                          <span>28 GB</span>
                        </div>
                        <Progress value={28 / 2.5} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>System Data</span>
                          <span>7 GB</span>
                        </div>
                        <Progress value={7 / 2.5} className="h-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <ResourceUsageChart 
            title="Storage Usage Trends" 
            description="30-day storage usage pattern" 
            resourceType="disk"
            timeRange="30d"
          />
        </TabsContent>
        
        <TabsContent value="network" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Traffic</CardTitle>
                <CardDescription>
                  Current network bandwidth utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ArrowDown className="mr-2 h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Inbound</p>
                        <p className="text-2xl font-bold">{metrics.networkIn} Mbps</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ArrowUp className="mr-2 h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Outbound</p>
                        <p className="text-2xl font-bold">{metrics.networkOut} Mbps</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Bandwidth Usage</p>
                    <Progress 
                      value={Math.min(100, ((metrics.networkIn + metrics.networkOut) / 10))} 
                      className="h-2" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((metrics.networkIn + metrics.networkOut) / 10)}% of available bandwidth
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ServerCrash className="mr-2 h-5 w-5 text-muted-foreground" />
                  System Alerts
                </CardTitle>
                <CardDescription>
                  Recent system health alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.memory > 70 || metrics.cpu > 70 ? (
                  <div className="space-y-4">
                    {metrics.memory > 70 && (
                      <div className="flex items-start space-x-3 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">High Memory Usage</h4>
                          <p className="text-sm text-muted-foreground">
                            Memory usage has exceeded 70% threshold.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {metrics.cpu > 70 && (
                      <div className="flex items-start space-x-3 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">High CPU Usage</h4>
                          <p className="text-sm text-muted-foreground">
                            CPU usage has exceeded 70% threshold.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32">
                    <Server className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-center text-muted-foreground">All systems are operating normally</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last verified: {new Date().toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>System Uptime</CardTitle>
              <CardDescription>
                Uptime statistics and service availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">Service Uptime</p>
                  <p className="text-lg font-bold">{metrics.uptime}%</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Web Application</span>
                      <span className="text-green-500 font-medium">100%</span>
                    </div>
                    <Progress value={100} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>API Services</span>
                      <span className="text-green-500 font-medium">99.98%</span>
                    </div>
                    <Progress value={99.98} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Database</span>
                      <span className="text-green-500 font-medium">99.99%</span>
                    </div>
                    <Progress value={99.99} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI Services</span>
                      <span className="text-green-500 font-medium">99.95%</span>
                    </div>
                    <Progress value={99.95} className="h-1" />
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    System has been running for 127 days, 14 hours without interruption.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemResourceDashboard;
