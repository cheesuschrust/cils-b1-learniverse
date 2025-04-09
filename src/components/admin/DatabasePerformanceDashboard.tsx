
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Search, 
  Clock, 
  BarChart3, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LineChart, BarChart } from '@/components/admin/charts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

interface QueryMetrics {
  averageResponseTime: number;
  slowQueries: number;
  queriesPerMinute: number;
  activeConnections: number;
  cacheHitRatio: number;
  indexUsage: number;
  slowestQueries: Array<{
    query: string;
    avgTime: number;
    calls: number;
    table: string;
  }>;
  tableUsage: Array<{
    table: string;
    rows: number;
    size: string;
    indexSize: string;
    operations: number;
  }>;
  timeSeriesData: Array<{
    timestamp: string;
    responseTime: number;
    throughput: number;
    connections: number;
  }>;
}

const DatabasePerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<QueryMetrics>({
    averageResponseTime: 0,
    slowQueries: 0,
    queriesPerMinute: 0,
    activeConnections: 0,
    cacheHitRatio: 0,
    indexUsage: 0,
    slowestQueries: [],
    tableUsage: [],
    timeSeriesData: []
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const fetchDatabaseMetrics = async () => {
    setIsRefreshing(true);
    
    try {
      // In a real implementation, this would fetch actual database metrics from
      // either Supabase admin APIs or your own monitoring system
      
      // For demonstration purposes, we'll generate simulated metrics
      const simulateMetrics = (): QueryMetrics => {
        // Generate time series data for the past 24 hours
        const timeSeriesData = [];
        const now = new Date();
        for (let i = 24; i >= 0; i--) {
          const time = new Date(now);
          time.setHours(now.getHours() - i);
          
          const baseResponseTime = 25 + Math.random() * 15;
          const baseThroughput = 80 + Math.random() * 40;
          const baseConnections = 10 + Math.random() * 8;
          
          // Add some patterns to make data more realistic
          const hourFactor = 1 + (Math.sin(time.getHours() / 3.82) * 0.3); // Higher load during business hours
          
          timeSeriesData.push({
            timestamp: time.toISOString(),
            responseTime: baseResponseTime * hourFactor,
            throughput: baseThroughput * hourFactor,
            connections: Math.round(baseConnections * hourFactor)
          });
        }
        
        // Generate other metrics
        const averageResponseTime = 20 + Math.random() * 15;
        const queriesPerMinute = 100 + Math.random() * 50;
        const activeConnections = 12 + Math.random() * 8;
        
        // Generate sample slow queries
        const slowestQueries = [
          {
            query: "SELECT * FROM users JOIN user_profiles ON users.id = user_profiles.user_id WHERE subscription_tier = 'premium'",
            avgTime: 120 + Math.random() * 80,
            calls: Math.round(20 + Math.random() * 30),
            table: "users"
          },
          {
            query: "SELECT * FROM content_items WHERE status = 'published' AND metadata->>difficulty = 'advanced' ORDER BY created_at DESC",
            avgTime: 80 + Math.random() * 60,
            calls: Math.round(30 + Math.random() * 40),
            table: "content_items"
          },
          {
            query: "SELECT * FROM user_progress JOIN learning_content ON user_progress.content_id = learning_content.id WHERE user_id = :user_id",
            avgTime: 95 + Math.random() * 50,
            calls: Math.round(50 + Math.random() * 80),
            table: "user_progress"
          },
          {
            query: "UPDATE user_stats SET streak_days = streak_days + 1 WHERE user_id = :user_id AND last_activity_date = CURRENT_DATE - INTERVAL '1 day'",
            avgTime: 45 + Math.random() * 30,
            calls: Math.round(100 + Math.random() * 150),
            table: "user_stats"
          }
        ];
        
        // Generate sample table usage data
        const tableUsage = [
          {
            table: "users",
            rows: Math.round(2500 + Math.random() * 500),
            size: "48 MB",
            indexSize: "12 MB",
            operations: Math.round(2000 + Math.random() * 1000)
          },
          {
            table: "content_items",
            rows: Math.round(5000 + Math.random() * 1000),
            size: "256 MB",
            indexSize: "64 MB",
            operations: Math.round(3500 + Math.random() * 1500)
          },
          {
            table: "user_progress",
            rows: Math.round(15000 + Math.random() * 5000),
            size: "320 MB",
            indexSize: "96 MB",
            operations: Math.round(8000 + Math.random() * 2000)
          },
          {
            table: "flashcards",
            rows: Math.round(25000 + Math.random() * 5000),
            size: "192 MB",
            indexSize: "48 MB",
            operations: Math.round(6000 + Math.random() * 3000)
          },
          {
            table: "user_flashcard_progress",
            rows: Math.round(75000 + Math.random() * 25000),
            size: "384 MB",
            indexSize: "128 MB",
            operations: Math.round(12000 + Math.random() * 3000)
          }
        ];
        
        return {
          averageResponseTime,
          slowQueries: Math.round(5 + Math.random() * 10),
          queriesPerMinute,
          activeConnections,
          cacheHitRatio: 85 + Math.random() * 10,
          indexUsage: 90 + Math.random() * 8,
          slowestQueries,
          tableUsage,
          timeSeriesData
        };
      };
      
      // Check if we can connect to the database
      try {
        // In a real app, this would be a lightweight admin query to verify connection
        await supabase.from('users').select('id', { count: 'exact', head: true });
      } catch (dbError) {
        console.error("Database connection check failed:", dbError);
      }
      
      const newMetrics = simulateMetrics();
      setMetrics(newMetrics);
      
      toast({
        title: "Database Metrics Updated",
        description: `Last updated: ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error("Error fetching database metrics:", error);
      toast({
        title: "Error Updating Metrics",
        description: "Failed to fetch database performance metrics.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchDatabaseMetrics();
    
    // Set up auto-refresh interval
    const intervalId = setInterval(() => {
      fetchDatabaseMetrics();
    }, 300000); // Refresh every 5 minutes
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Database Performance</h2>
          <p className="text-muted-foreground">
            Monitor and optimize database performance metrics
          </p>
        </div>
        
        <Button 
          onClick={fetchDatabaseMetrics} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Updating...' : 'Refresh Metrics'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime.toFixed(1)} ms</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average query execution time
            </p>
            <Progress 
              value={Math.min(100, (metrics.averageResponseTime / 1))} 
              className="h-1 mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="mr-2 h-4 w-4 text-primary" />
              Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.queriesPerMinute.toFixed(0)}/min</div>
            <p className="text-xs text-muted-foreground mt-1">
              Queries processed per minute
            </p>
            <Progress 
              value={Math.min(100, (metrics.queriesPerMinute / 3))} 
              className="h-1 mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-primary" />
              Cache Hit Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cacheHitRatio.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Database cache effectiveness
            </p>
            <Progress 
              value={metrics.cacheHitRatio} 
              className="h-1 mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="mr-2 h-4 w-4 text-primary" />
              Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.activeConnections)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active database connections
            </p>
            <Progress 
              value={Math.min(100, (metrics.activeConnections * 5))} 
              className="h-1 mt-2" 
            />
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queries">Query Performance</TabsTrigger>
          <TabsTrigger value="tables">Table Statistics</TabsTrigger>
          <TabsTrigger value="health">Health Check</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Performance Trends</CardTitle>
              <CardDescription>
                24-hour performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <LineChart 
                data={metrics.timeSeriesData} 
                xField="timestamp" 
                yField="responseTime"
                color="#3b82f6"
                height={300}
                yAxisLabel="Response Time (ms)"
              />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-muted-foreground" />
                  Query Performance Issues
                </CardTitle>
                <CardDescription>
                  Potential performance bottlenecks
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.slowQueries > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Slow Queries Detected</h4>
                        <p className="text-sm text-muted-foreground">
                          {metrics.slowQueries} queries exceeded the performance threshold.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Top slow queries affecting performance:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
                        {metrics.slowestQueries.slice(0, 2).map((query, idx) => (
                          <li key={idx}>
                            Query on <span className="font-medium">{query.table}</span> table: {query.avgTime.toFixed(0)}ms avg
                          </li>
                        ))}
                      </ul>
                      <Button variant="link" className="text-xs h-auto p-0" onClick={() => setActiveTab("queries")}>
                        View all slow queries <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-center text-muted-foreground">No slow queries detected</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Connection Pool</CardTitle>
                <CardDescription>
                  Database connection statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Active</p>
                      <p className="text-xl font-semibold">{Math.round(metrics.activeConnections)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Available</p>
                      <p className="text-xl font-semibold">{20 - Math.round(metrics.activeConnections)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Pool Size</p>
                      <p className="text-xl font-semibold">20</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Utilization</p>
                      <p className="text-xl font-semibold">{(metrics.activeConnections / 20 * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Connection Pool Usage</p>
                    <Progress 
                      value={(metrics.activeConnections / 20) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Query Performance Analysis</CardTitle>
              <CardDescription>
                Slowest queries by average execution time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead className="text-right">Avg. Time</TableHead>
                    <TableHead className="text-right">Calls</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.slowestQueries.map((query, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs max-w-md truncate">
                        {query.query}
                      </TableCell>
                      <TableCell>{query.table}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={query.avgTime > 100 ? "destructive" : 
                                 query.avgTime > 50 ? "default" : "outline"}
                        >
                          {query.avgTime.toFixed(1)} ms
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{query.calls}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Query Throughput</CardTitle>
                <CardDescription>
                  Queries per minute over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={metrics.timeSeriesData} 
                  xField="timestamp" 
                  yField="throughput"
                  color="#10b981"
                  height={250}
                  yAxisLabel="Queries per Minute"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Query Distribution</CardTitle>
                <CardDescription>
                  Types of queries being executed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={[
                    { type: 'SELECT', count: Math.round(metrics.queriesPerMinute * 0.65) },
                    { type: 'INSERT', count: Math.round(metrics.queriesPerMinute * 0.15) },
                    { type: 'UPDATE', count: Math.round(metrics.queriesPerMinute * 0.12) },
                    { type: 'DELETE', count: Math.round(metrics.queriesPerMinute * 0.05) },
                    { type: 'OTHER', count: Math.round(metrics.queriesPerMinute * 0.03) }
                  ]} 
                  xField="type"
                  yField="count"
                  height={250}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Table Statistics</CardTitle>
              <CardDescription>
                Size and usage metrics by table
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead className="text-right">Rows</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead className="text-right">Index Size</TableHead>
                    <TableHead className="text-right">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.tableUsage.map((table, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{table.table}</TableCell>
                      <TableCell className="text-right">{table.rows.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{table.size}</TableCell>
                      <TableCell className="text-right">{table.indexSize}</TableCell>
                      <TableCell className="text-right">{table.operations.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Table Size Distribution</CardTitle>
                <CardDescription>
                  Database storage allocation by table
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={metrics.tableUsage.map(table => ({
                    name: table.table,
                    size: parseInt(table.size.replace(' MB', ''))
                  }))} 
                  xField="name"
                  yField="size"
                  height={250}
                  color="#8b5cf6"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Table Operations</CardTitle>
                <CardDescription>
                  Query operations by table
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={metrics.tableUsage.map(table => ({
                    name: table.table,
                    operations: table.operations
                  }))} 
                  xField="name"
                  yField="operations"
                  height={250}
                  color="#f59e0b"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Database Health Status
                </CardTitle>
                <CardDescription>
                  Current health status of database systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-sm font-medium">Connection Status</p>
                      <div className="flex items-center mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <p className="text-sm">Connected</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Replication Status</p>
                      <div className="flex items-center mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <p className="text-sm">Healthy</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vacuum Status</p>
                      <div className="flex items-center mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <p className="text-sm">Up to date</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Backup Status</p>
                      <div className="flex items-center mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <p className="text-sm">Latest: 3h ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Database Uptime</p>
                    <p className="text-lg font-semibold">32 days, 17 hours</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last restart: {new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>
                  Database resource consumption metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">CPU Usage</div>
                      <div className="text-sm text-muted-foreground">{Math.round(metrics.activeConnections * 3)}%</div>
                    </div>
                    <Progress 
                      value={metrics.activeConnections * 3} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Memory Usage</div>
                      <div className="text-sm text-muted-foreground">{Math.round(metrics.activeConnections * 4)}%</div>
                    </div>
                    <Progress 
                      value={metrics.activeConnections * 4} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Disk I/O</div>
                      <div className="text-sm text-muted-foreground">{Math.round(metrics.queriesPerMinute / 5)} MB/s</div>
                    </div>
                    <Progress 
                      value={(metrics.queriesPerMinute / 5) * 2} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Connection Utilization</div>
                      <div className="text-sm text-muted-foreground">{(metrics.activeConnections / 20 * 100).toFixed(1)}%</div>
                    </div>
                    <Progress 
                      value={(metrics.activeConnections / 20) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Recommendations</CardTitle>
              <CardDescription>
                Suggestions for database optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.cacheHitRatio < 90 && (
                  <div className="flex items-start space-x-3 border p-3 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Low Cache Hit Ratio</h4>
                      <p className="text-sm text-muted-foreground">
                        Consider increasing the database cache allocation to improve query performance.
                      </p>
                    </div>
                  </div>
                )}
                
                {metrics.indexUsage < 95 && (
                  <div className="flex items-start space-x-3 border p-3 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Index Usage Could Be Improved</h4>
                      <p className="text-sm text-muted-foreground">
                        Some queries may not be utilizing indexes efficiently. Review query plans for optimization opportunities.
                      </p>
                    </div>
                  </div>
                )}
                
                {metrics.slowQueries > 0 && (
                  <div className="flex items-start space-x-3 border p-3 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Slow Queries Detected</h4>
                      <p className="text-sm text-muted-foreground">
                        {metrics.slowQueries} queries are performing below optimal levels. Consider reviewing and optimizing these queries.
                      </p>
                    </div>
                  </div>
                )}
                
                {metrics.cacheHitRatio >= 90 && metrics.indexUsage >= 95 && metrics.slowQueries === 0 && (
                  <div className="flex items-start space-x-3 border border-green-100 dark:border-green-900 bg-green-50 dark:bg-green-950/50 p-3 rounded-md">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Database is Well Optimized</h4>
                      <p className="text-sm text-muted-foreground">
                        All performance metrics are within optimal ranges. No immediate optimizations needed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabasePerformanceDashboard;
