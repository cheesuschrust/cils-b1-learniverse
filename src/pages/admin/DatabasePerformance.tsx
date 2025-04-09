
import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DatabasePerformanceDashboard from '@/components/admin/DatabasePerformanceDashboard';
import DynamicSEO from '@/components/marketing/DynamicSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Table, 
  RefreshCw, 
  Clock, 
  Activity, 
  FileText,
  AlertTriangle,
  Search,
  Loader
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AIModelSummaryCard from '@/components/ai/AIModelSummaryCard';
import ResourceUsageChart from '@/components/admin/charts/ResourceUsageChart';

const DatabasePerformancePage: React.FC = () => {
  const [tableMetrics, setTableMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  useEffect(() => {
    const fetchDatabaseMetrics = () => {
      setLoading(true);
      
      // In a real application, this would be an API call to your backend
      setTimeout(() => {
        setTableMetrics([
          { 
            name: 'users', 
            size: '1.2 GB', 
            rowCount: 125642, 
            indexSize: '350 MB',
            lastVacuum: '2 days ago',
            readQPS: 145.2,
            writeQPS: 12.4,
            cacheMissRate: 0.8,
            growthRate: 2.1
          },
          { 
            name: 'content_items', 
            size: '2.8 GB', 
            rowCount: 287432, 
            indexSize: '720 MB',
            lastVacuum: '1 day ago',
            readQPS: 234.6,
            writeQPS: 8.2,
            cacheMissRate: 1.2,
            growthRate: 4.3
          },
          { 
            name: 'user_progress', 
            size: '1.5 GB', 
            rowCount: 1542345, 
            indexSize: '420 MB',
            lastVacuum: '3 days ago',
            readQPS: 187.3,
            writeQPS: 42.8,
            cacheMissRate: 2.1,
            growthRate: 8.7
          },
          { 
            name: 'flashcards', 
            size: '950 MB', 
            rowCount: 524138, 
            indexSize: '280 MB',
            lastVacuum: '4 days ago',
            readQPS: 98.4,
            writeQPS: 5.7,
            cacheMissRate: 0.5,
            growthRate: 1.8
          },
          { 
            name: 'learning_content', 
            size: '850 MB', 
            rowCount: 12435, 
            indexSize: '150 MB',
            lastVacuum: '5 days ago',
            readQPS: 176.2,
            writeQPS: 2.3,
            cacheMissRate: 0.3,
            growthRate: 0.9
          }
        ]);
        
        setLoading(false);
        setLastUpdated(new Date());
      }, 1000);
    };
    
    fetchDatabaseMetrics();
    
    // Auto-refresh every 60 seconds
    const intervalId = setInterval(fetchDatabaseMetrics, 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="Database Performance"
        description="Monitor and optimize database performance, query efficiency, and table statistics."
        keywords="database performance, query optimization, SQL performance, admin dashboard"
        type="website"
      />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Database Performance</h1>
          <p className="text-muted-foreground">
            Monitor database health, query performance, and optimize storage usage
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <AIModelSummaryCard
            title="Database Size"
            value="7.8 GB"
            icon="database"
            subtitle="Total stored data"
            progress={39}
          />
          
          <AIModelSummaryCard
            title="Active Connections"
            value="28"
            icon="server"
            subtitle="Current database sessions"
            progress={28}
          />
          
          <AIModelSummaryCard
            title="Query Latency"
            value="24ms"
            icon="cpu"
            subtitle="Average response time"
            changePercentage={-12}
          />
          
          <AIModelSummaryCard
            title="Cache Hit Ratio"
            value="98.2%"
            icon="storage"
            subtitle="Buffer efficiency"
            progress={98}
            changePercentage={1.5}
          />
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex items-center">
              <Table className="mr-2 h-4 w-4" />
              Tables
            </TabsTrigger>
            <TabsTrigger value="queries" className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Queries
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResourceUsageChart
                title="Database Queries"
                description="Read and write operations per minute"
                resourceType="database"
                timeRange="24h"
                height={300}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Connection Pool</CardTitle>
                  <CardDescription>Database connection metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Active Connections</div>
                        <div className="text-sm text-muted-foreground">28 / 100</div>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Connection Wait Time</div>
                        <div className="text-sm text-muted-foreground">3.2ms average</div>
                      </div>
                      <Progress value={16} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Connection Utilization</div>
                        <div className="text-sm text-muted-foreground">42% efficiency</div>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium text-sm mb-2">Connection Pool Health</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Total Created</div>
                          <div className="text-lg font-medium">124</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Idle</div>
                          <div className="text-lg font-medium">72</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Max Lifetime</div>
                          <div className="text-lg font-medium">30min</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-blue-500" />
                    Database Uptime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42 days</div>
                  <p className="text-xs text-muted-foreground">Last restarted: Feb 26, 2025</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <RefreshCw className="mr-2 h-4 w-4 text-green-500" />
                    Last Backup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3 hours ago</div>
                  <p className="text-xs text-muted-foreground">Backup size: 6.2 GB</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                    Slow Queries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3 detected</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <DatabasePerformanceDashboard />
            </div>
          </TabsContent>
          
          <TabsContent value="tables">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Database Tables</CardTitle>
                  <CardDescription>
                    Table sizes, row counts, and performance metrics
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="flex items-center" disabled={loading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="animate-spin h-6 w-6 mr-2" />
                    <span>Loading table data...</span>
                  </div>
                ) : (
                  <div className="relative overflow-x-auto border rounded-md">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-4 py-3">Table Name</th>
                          <th scope="col" className="px-4 py-3">Size</th>
                          <th scope="col" className="px-4 py-3">Row Count</th>
                          <th scope="col" className="px-4 py-3">Indices</th>
                          <th scope="col" className="px-4 py-3">Read QPS</th>
                          <th scope="col" className="px-4 py-3">Write QPS</th>
                          <th scope="col" className="px-4 py-3">Growth</th>
                          <th scope="col" className="px-4 py-3">Last Vacuum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableMetrics.map((table, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-3 font-medium">{table.name}</td>
                            <td className="px-4 py-3">{table.size}</td>
                            <td className="px-4 py-3">{table.rowCount.toLocaleString()}</td>
                            <td className="px-4 py-3">{table.indexSize}</td>
                            <td className="px-4 py-3">{table.readQPS}</td>
                            <td className="px-4 py-3">{table.writeQPS}</td>
                            <td className="px-4 py-3">
                              <Badge variant={table.growthRate > 5 ? "default" : "outline"}>
                                {table.growthRate}% / week
                              </Badge>
                            </td>
                            <td className="px-4 py-3">{table.lastVacuum}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="mt-4 text-sm text-muted-foreground">
                  Total database size: <span className="font-medium">7.8 GB</span> • 
                  Tables: <span className="font-medium">23</span> • 
                  Last updated: <span className="font-medium">{lastUpdated.toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="queries">
            <Card>
              <CardHeader>
                <CardTitle>Query Performance</CardTitle>
                <CardDescription>
                  Monitor and optimize slow queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Query Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Queries / Second</div>
                        <div className="text-lg font-medium">458.6</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Avg. Response Time</div>
                        <div className="text-lg font-medium">24ms</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Slow Queries (>500ms)</div>
                        <div className="text-lg font-medium">3</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Failed Queries</div>
                        <div className="text-lg font-medium">0</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Slow Queries</h4>
                    <div className="border rounded-md">
                      <div className="p-4 border-b">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">SELECT * FROM user_progress WHERE user_id = ? AND completed = false</span>
                          <Badge variant="outline" className="text-amber-500">742ms</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Count: 47 • Last executed: 14 minutes ago
                        </div>
                        <div className="text-xs text-amber-500 mt-1">
                          Recommendation: Add index on (user_id, completed)
                        </div>
                      </div>
                      
                      <div className="p-4 border-b">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">SELECT * FROM content_items WHERE created_at > ? ORDER BY created_at DESC</span>
                          <Badge variant="outline" className="text-amber-500">624ms</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Count: 18 • Last executed: 32 minutes ago
                        </div>
                        <div className="text-xs text-amber-500 mt-1">
                          Recommendation: Add index on created_at column
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">SELECT * FROM flashcards WHERE category_id IN (?) AND difficulty > ?</span>
                          <Badge variant="outline" className="text-amber-500">586ms</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Count: 26 • Last executed: 47 minutes ago
                        </div>
                        <div className="text-xs text-amber-500 mt-1">
                          Recommendation: Add composite index on (category_id, difficulty)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration</CardTitle>
                  <CardDescription>Database configuration parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm p-2 border-b">
                      <span className="font-medium">max_connections</span>
                      <span>100</span>
                    </div>
                    <div className="flex justify-between text-sm p-2 border-b">
                      <span className="font-medium">shared_buffers</span>
                      <span>1GB</span>
                    </div>
                    <div className="flex justify-between text-sm p-2 border-b">
                      <span className="font-medium">work_mem</span>
                      <span>16MB</span>
                    </div>
                    <div className="flex justify-between text-sm p-2 border-b">
                      <span className="font-medium">maintenance_work_mem</span>
                      <span>256MB</span>
                    </div>
                    <div className="flex justify-between text-sm p-2 border-b">
                      <span className="font-medium">effective_cache_size</span>
                      <span>4GB</span>
                    </div>
                    <div className="flex justify-between text-sm p-2 border-b">
                      <span className="font-medium">random_page_cost</span>
                      <span>1.1</span>
                    </div>
                    <div className="flex justify-between text-sm p-2">
                      <span className="font-medium">max_wal_size</span>
                      <span>2GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance</CardTitle>
                  <CardDescription>Database maintenance tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Vacuum Database
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Export Schema
                      </Button>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Scheduled Tasks</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Database Backup</span>
                          <span>Every 6 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vacuum Full</span>
                          <span>Weekly (Sunday)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Analyze</span>
                          <span>Daily</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default DatabasePerformancePage;
