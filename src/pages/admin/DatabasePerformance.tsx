
import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, Server, HardDrive, Cpu, Memory, Network, RefreshCw, 
  AlertTriangle, CheckCircle, ChevronDown, Clock, BarChart, FileText, ArrowRight
} from 'lucide-react';
import ResourceUsageChart from '@/components/admin/charts/ResourceUsageChart';

const DatabasePerformance: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('24h');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  
  // Mock data for database performance metrics
  const [metrics, setMetrics] = useState({
    queryResponseTime: { value: 125, change: -15, unit: 'ms' },
    activeSessions: { value: 24, change: 5, unit: '' },
    cacheHitRatio: { value: 92.5, change: 2.8, unit: '%' },
    diskUsage: { value: 63.2, change: 1.5, unit: '%' },
    cpuUsage: { value: 47, change: -3, unit: '%' },
    memoryUsage: { value: 72, change: 8, unit: '%' },
    slowQueries: { value: 3, change: -2, unit: '' },
  });
  
  const [issues, setIssues] = useState([
    { 
      id: 1, 
      type: 'warning', 
      message: 'Slow query detected on user_stats table', 
      details: 'Query execution time: 2.45s',
      timestamp: '2025-04-09T14:32:11', 
      status: 'open'
    },
    { 
      id: 2, 
      type: 'critical', 
      message: 'Index missing on frequently queried column', 
      details: 'Table: flashcards, Column: created_at',
      timestamp: '2025-04-09T10:15:42', 
      status: 'open'
    },
    { 
      id: 3, 
      type: 'info', 
      message: 'Database backup completed successfully', 
      details: 'Backup size: 245MB, Duration: 1m 12s',
      timestamp: '2025-04-09T05:00:03', 
      status: 'resolved'
    },
  ]);
  
  const [dbTables, setDbTables] = useState([
    { name: 'user_profiles', rows: 12458, size: '42.6MB', lastAnalyzed: '2025-04-08' },
    { name: 'flashcards', rows: 78921, size: '156.3MB', lastAnalyzed: '2025-04-08' },
    { name: 'flashcard_sets', rows: 3245, size: '12.8MB', lastAnalyzed: '2025-04-08' },
    { name: 'user_achievements', rows: 25678, size: '34.5MB', lastAnalyzed: '2025-04-08' },
    { name: 'user_stats', rows: 12458, size: '28.7MB', lastAnalyzed: '2025-04-07' },
    { name: 'daily_questions', rows: 365, size: '2.3MB', lastAnalyzed: '2025-04-08' },
    { name: 'question_responses', rows: 89742, size: '105.6MB', lastAnalyzed: '2025-04-08' },
  ]);
  
  // Simulate optimization process
  const runOptimization = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    toast({
      title: "Database optimization started",
      description: "This process may take several minutes to complete.",
    });
    
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          
          // Update mock metrics to show improvement
          setMetrics(prev => ({
            ...prev,
            queryResponseTime: { ...prev.queryResponseTime, value: 98, change: -27 },
            cacheHitRatio: { ...prev.cacheHitRatio, value: 95.8, change: 3.3 },
            diskUsage: { ...prev.diskUsage, value: 59.5, change: -3.7 },
            cpuUsage: { ...prev.cpuUsage, value: 42, change: -5 },
            slowQueries: { ...prev.slowQueries, value: 1, change: -2 },
          }));
          
          toast({
            title: "Database optimization completed",
            description: "Performance improvements have been applied successfully.",
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 600);
  };
  
  // Simulate refresh data
  const refreshData = () => {
    toast({
      title: "Refreshing metrics",
      description: "Latest database performance data is being fetched.",
    });
    
    // Simulate API call delay
    setTimeout(() => {
      // Slightly modify the metrics to simulate real-time changes
      setMetrics(prev => ({
        ...prev,
        queryResponseTime: { 
          ...prev.queryResponseTime, 
          value: Math.max(80, Math.min(200, prev.queryResponseTime.value + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 15))),
          change: Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1)
        },
        activeSessions: { 
          ...prev.activeSessions, 
          value: Math.max(5, Math.min(50, prev.activeSessions.value + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))),
          change: Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1)
        },
        cacheHitRatio: { 
          ...prev.cacheHitRatio, 
          value: Math.max(80, Math.min(99, prev.cacheHitRatio.value + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 2)),
          change: Math.random() * 3 * (Math.random() > 0.5 ? 1 : -1)
        },
        diskUsage: { 
          ...prev.diskUsage, 
          value: Math.max(50, Math.min(90, prev.diskUsage.value + (Math.random() > 0.7 ? 1 : -1) * Math.random() * 1.5)),
          change: Math.random() * 2 * (Math.random() > 0.5 ? 1 : -1)
        },
      }));
      
      toast({
        title: "Metrics updated",
        description: "Database performance metrics have been refreshed.",
      });
    }, 1200);
  };
  
  // Simulate fix issue
  const fixIssue = (id: number) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? {...issue, status: 'resolving'} : issue
    ));
    
    toast({
      title: "Addressing database issue",
      description: "Applying automated fix for the selected issue.",
    });
    
    // Simulate API call delay
    setTimeout(() => {
      setIssues(prev => prev.map(issue => 
        issue.id === id ? {...issue, status: 'resolved'} : issue
      ));
      
      toast({
        title: "Issue resolved",
        description: "The database issue has been successfully fixed.",
      });
    }, 2500);
  };
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Database Performance</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and optimize database performance metrics
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="6h">Last 6 hours</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={refreshData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Query Response Time
              </CardTitle>
              <CardDescription>Average query execution time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{metrics.queryResponseTime.value}</span>
                  <span className="text-sm ml-1">{metrics.queryResponseTime.unit}</span>
                </div>
                <div className={`text-sm font-medium ${metrics.queryResponseTime.change < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.queryResponseTime.change < 0 ? '↓' : '↑'} {Math.abs(metrics.queryResponseTime.change)}%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Cache Hit Ratio
              </CardTitle>
              <CardDescription>Percentage of cache hits vs. misses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{metrics.cacheHitRatio.value}</span>
                  <span className="text-sm ml-1">{metrics.cacheHitRatio.unit}</span>
                </div>
                <div className={`text-sm font-medium ${metrics.cacheHitRatio.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.cacheHitRatio.change > 0 ? '↑' : '↓'} {Math.abs(metrics.cacheHitRatio.change)}%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Active Sessions
              </CardTitle>
              <CardDescription>Current database connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{metrics.activeSessions.value}</span>
                  <span className="text-sm ml-1">{metrics.activeSessions.unit}</span>
                </div>
                <div className={`text-sm font-medium ${metrics.activeSessions.change < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.activeSessions.change > 0 ? '↑' : '↓'} {Math.abs(metrics.activeSessions.change)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                  <CardDescription>Database server resource utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Disk Usage</span>
                        </div>
                        <span className="text-sm">{metrics.diskUsage.value}%</span>
                      </div>
                      <Progress value={metrics.diskUsage.value} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">CPU Usage</span>
                        </div>
                        <span className="text-sm">{metrics.cpuUsage.value}%</span>
                      </div>
                      <Progress value={metrics.cpuUsage.value} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Memory className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Memory Usage</span>
                        </div>
                        <span className="text-sm">{metrics.memoryUsage.value}%</span>
                      </div>
                      <Progress value={metrics.memoryUsage.value} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Historical performance data</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResourceUsageChart />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest database events and operations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Automatic VACUUM operation completed</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Recovered 245MB of disk space from dead tuples
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>35m ago</span>
                      </div>
                    </div>
                  </li>
                  
                  <li className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Index created on flashcards.user_id</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created to improve query performance (auto-recommendation)
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>2h ago</span>
                      </div>
                    </div>
                  </li>
                  
                  <li className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Database backup completed</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Daily scheduled backup (245MB) completed successfully
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>5h ago</span>
                      </div>
                    </div>
                  </li>
                  
                  <li>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Slow query detected and logged</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Query on user_stats table took 2.45s to complete
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>9h ago</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="issues" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Issues</CardTitle>
                <CardDescription>Performance problems and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {issues.length > 0 ? (
                  <ul className="space-y-4">
                    {issues.map(issue => (
                      <li key={issue.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {issue.type === 'warning' && (
                              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            )}
                            {issue.type === 'critical' && (
                              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                            )}
                            {issue.type === 'info' && (
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            )}
                            <div>
                              <p className="font-medium">
                                {issue.message}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {issue.details}
                              </p>
                              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(issue.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            {issue.status === 'open' && (
                              <Button variant="outline" size="sm" onClick={() => fixIssue(issue.id)}>
                                Fix Issue
                              </Button>
                            )}
                            {issue.status === 'resolving' && (
                              <Button variant="outline" size="sm" disabled>
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                Fixing...
                              </Button>
                            )}
                            {issue.status === 'resolved' && (
                              <Button variant="ghost" size="sm" className="text-green-500" disabled>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolved
                              </Button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No Issues Detected</h3>
                    <p className="text-muted-foreground mt-1">
                      The database is currently running optimally
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Recommendations</CardTitle>
                <CardDescription>Suggested actions to improve database performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                      <BarChart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Add indexes to frequently queried columns</p>
                      <p className="text-muted-foreground mt-1">
                        Creating indexes on commonly queried columns can significantly improve query performance.
                      </p>
                      <Button variant="link" className="px-0 mt-1 h-auto text-primary">
                        View recommended indexes {"->"}
                      </Button>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Optimize query patterns</p>
                      <p className="text-muted-foreground mt-1">
                        Several queries could be optimized by reducing JOIN operations and improving WHERE clauses.
                      </p>
                      <Button variant="link" className="px-0 mt-1 h-auto text-primary">
                        View optimization suggestions {"->"}
                      </Button>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                      <HardDrive className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Archive historical data</p>
                      <p className="text-muted-foreground mt-1">
                        Moving older data to archive tables can improve performance of active data queries.
                      </p>
                      <Button variant="link" className="px-0 mt-1 h-auto text-primary">
                        View archiving plan {"->"}
                      </Button>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tables" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Tables</CardTitle>
                <CardDescription>Size and statistics for all tables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Table Name</th>
                        <th className="text-left py-3 px-4 font-medium">Rows</th>
                        <th className="text-left py-3 px-4 font-medium">Size</th>
                        <th className="text-left py-3 px-4 font-medium">Last Analyzed</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbTables.map((table, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{table.name}</td>
                          <td className="py-3 px-4">{table.rows.toLocaleString()}</td>
                          <td className="py-3 px-4">{table.size}</td>
                          <td className="py-3 px-4">{table.lastAnalyzed}</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              Analyze
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Query Performance</CardTitle>
                  <CardDescription>Most time-consuming queries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="border-b pb-4">
                      <div>
                        <p className="font-medium">SELECT * FROM user_stats WHERE registration_date {">"} $1</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm text-muted-foreground">
                            Avg. time: 2.45s, Executions: 142/day
                          </p>
                          <Button variant="link" size="sm" className="px-0 h-6">
                            View details
                          </Button>
                        </div>
                      </div>
                    </li>
                    <li className="border-b pb-4">
                      <div>
                        <p className="font-medium">SELECT * FROM flashcards WHERE user_id = $1 ORDER BY created_at</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm text-muted-foreground">
                            Avg. time: 1.89s, Executions: 256/day
                          </p>
                          <Button variant="link" size="sm" className="px-0 h-6">
                            View details
                          </Button>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <p className="font-medium">SELECT COUNT(*) FROM user_achievements WHERE achieved_at {">"} $1</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm text-muted-foreground">
                            Avg. time: 1.32s, Executions: 98/day
                          </p>
                          <Button variant="link" size="sm" className="px-0 h-6">
                            View details
                          </Button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Table Growth</CardTitle>
                  <CardDescription>Size increase over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResourceUsageChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Optimization</CardTitle>
                <CardDescription>Run maintenance tasks to improve performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isOptimizing ? (
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Optimization in Progress</AlertTitle>
                        <AlertDescription>
                          Database optimization is running. This may affect performance temporarily.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Progress:</span>
                          <span className="text-sm">{optimizationProgress}%</span>
                        </div>
                        <Progress value={optimizationProgress} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Current operation:</p>
                        <p className="text-sm text-muted-foreground">
                          {optimizationProgress < 30 && "Analyzing table statistics..."}
                          {optimizationProgress >= 30 && optimizationProgress < 60 && "Reindexing tables..."}
                          {optimizationProgress >= 60 && optimizationProgress < 90 && "Vacuum cleaning dead tuples..."}
                          {optimizationProgress >= 90 && "Finalizing optimizations..."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium">VACUUM & ANALYZE</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Reclaim storage occupied by dead tuples and update statistics
                          </p>
                          <Button variant="outline" className="mt-4" onClick={runOptimization}>
                            Run Optimization
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium">REINDEX</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Rebuild indexes to improve query performance
                          </p>
                          <Button variant="outline" className="mt-4">
                            Rebuild Indexes
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Optimization Schedule</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Regular Maintenance</p>
                            <ul className="mt-2 space-y-2">
                              <li className="text-sm flex items-baseline gap-2">
                                <span className="bg-primary/10 rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                </span>
                                <span>VACUUM: Daily at 3:00 AM</span>
                              </li>
                              <li className="text-sm flex items-baseline gap-2">
                                <span className="bg-primary/10 rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                </span>
                                <span>ANALYZE: Daily at 4:00 AM</span>
                              </li>
                              <li className="text-sm flex items-baseline gap-2">
                                <span className="bg-primary/10 rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                </span>
                                <span>REINDEX: Weekly on Sundays</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Last Maintenance</p>
                            <ul className="mt-2 space-y-2">
                              <li className="text-sm flex items-baseline gap-2">
                                <span className="bg-primary/10 rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                </span>
                                <span>VACUUM: 2025-04-08 03:00 AM</span>
                              </li>
                              <li className="text-sm flex items-baseline gap-2">
                                <span className="bg-primary/10 rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                </span>
                                <span>ANALYZE: 2025-04-08 04:00 AM</span>
                              </li>
                              <li className="text-sm flex items-baseline gap-2">
                                <span className="bg-primary/10 rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                </span>
                                <span>REINDEX: 2025-04-06 01:00 AM</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
                <CardDescription>Configure optimization parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Shared Buffers</label>
                        <span className="text-sm">2GB</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Work Memory</label>
                        <span className="text-sm">64MB</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Maintenance Work Memory</label>
                        <span className="text-sm">256MB</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Effective Cache Size</label>
                        <span className="text-sm">6GB</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                  
                  <Button variant="outline">
                    Adjust Database Parameters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default DatabasePerformance;
