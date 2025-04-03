
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Server, 
  Database, 
  Clock, 
  HardDrive, 
  Cpu, 
  BarChart 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { LineChart } from '@/components/admin/charts';
import { useToast } from '@/hooks/use-toast';

const SystemHealth: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [systemStatus, setSystemStatus] = useState({
    api: { status: 'operational', latency: 187, uptime: 99.98 },
    database: { status: 'operational', latency: 32, uptime: 99.99 },
    ai: { status: 'operational', latency: 342, uptime: 99.95 },
    auth: { status: 'operational', latency: 124, uptime: 99.99 },
    storage: { status: 'operational', latency: 216, uptime: 99.98 }
  });
  
  const [resources, setResources] = useState({
    cpu: 38,
    memory: 52,
    disk: 47,
    requests: 65
  });
  
  const [cpuHistory] = useState([
    { timestamp: '13:00', value: 32 },
    { timestamp: '13:05', value: 35 },
    { timestamp: '13:10', value: 37 },
    { timestamp: '13:15', value: 42 },
    { timestamp: '13:20', value: 45 },
    { timestamp: '13:25', value: 38 },
    { timestamp: '13:30', value: 36 },
    { timestamp: '13:35', value: 35 },
    { timestamp: '13:40', value: 39 },
    { timestamp: '13:45', value: 38 }
  ]);
  
  const [recentIncidents, setRecentIncidents] = useState([
    { 
      id: 'inc-001', 
      service: 'API Server', 
      status: 'resolved', 
      started: '2023-04-15T14:22:10Z', 
      resolved: '2023-04-15T15:48:30Z',
      description: 'Intermittent timeouts on API endpoints',
      impact: 'Minor'
    },
    { 
      id: 'inc-002', 
      service: 'AI Models', 
      status: 'resolved', 
      started: '2023-04-02T08:15:00Z', 
      resolved: '2023-04-02T10:30:45Z',
      description: 'Increased latency in AI model inference',
      impact: 'Moderate'
    }
  ]);

  useEffect(() => {
    // In a real app, we would fetch system health metrics here
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const refreshStatus = () => {
    setLoading(true);
    // In a real app, we would fetch fresh system health metrics
    setTimeout(() => {
      toast({
        title: "System Status Refreshed",
        description: "All systems are operational.",
      });
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-amber-500">Degraded</Badge>;
      case 'outage':
        return <Badge className="bg-red-500">Outage</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="text-green-500 border-green-500">Resolved</Badge>;
      case 'investigating':
        return <Badge className="bg-amber-500">Investigating</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>System Health - Admin</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Health</h1>
            <p className="text-muted-foreground mt-2">
              Monitor system performance and review incidents
            </p>
          </div>
          
          <Button onClick={refreshStatus} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>
        
        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5 text-muted-foreground" />
              Service Status
            </CardTitle>
            <CardDescription>
              Current status of system components
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(systemStatus).map(([service, data]) => (
                  <div key={service} className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <div 
                          className={`h-3 w-3 rounded-full mr-2 ${
                            data.status === 'operational' 
                              ? 'bg-green-500' 
                              : data.status === 'degraded' 
                                ? 'bg-amber-500' 
                                : 'bg-red-500'
                          }`}
                        ></div>
                        <div className="font-medium capitalize">{service}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 ml-5">
                        {data.uptime}% uptime in last 90 days
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm mr-4">
                        <span className="font-medium">{data.latency}ms</span>
                        <span className="text-muted-foreground"> latency</span>
                      </div>
                      {getStatusBadge(data.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Resource Utilization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="mr-2 h-5 w-5 text-muted-foreground" />
                Resource Utilization
              </CardTitle>
              <CardDescription>
                Current resource usage across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">CPU</div>
                    <div className="text-sm text-muted-foreground">{resources.cpu}%</div>
                  </div>
                  <Progress value={resources.cpu} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Memory</div>
                    <div className="text-sm text-muted-foreground">{resources.memory}%</div>
                  </div>
                  <Progress value={resources.memory} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Disk</div>
                    <div className="text-sm text-muted-foreground">{resources.disk}%</div>
                  </div>
                  <Progress value={resources.disk} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Request Queue</div>
                    <div className="text-sm text-muted-foreground">{resources.requests}%</div>
                  </div>
                  <Progress value={resources.requests} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-muted-foreground" />
                CPU Usage History
              </CardTitle>
              <CardDescription>
                Last 45 minutes of CPU utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart data={cpuHistory} xField="timestamp" yField="value" height={200} />
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground" />
              Recent Incidents
            </CardTitle>
            <CardDescription>
              History of service incidents and resolutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIncidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-2" />
                      <p className="text-muted-foreground">No incidents reported in the last 90 days</p>
                    </TableCell>
                  </TableRow>
                ) : recentIncidents.map((incident) => {
                  const started = new Date(incident.started);
                  const resolved = incident.resolved ? new Date(incident.resolved) : new Date();
                  const duration = Math.round((resolved.getTime() - started.getTime()) / (1000 * 60)); // in minutes
                  
                  return (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{incident.service}</TableCell>
                      <TableCell>{incident.description}</TableCell>
                      <TableCell>
                        <Badge variant={incident.impact === 'Minor' ? 'outline' : 'secondary'}>
                          {incident.impact}
                        </Badge>
                      </TableCell>
                      <TableCell>{started.toLocaleString()}</TableCell>
                      <TableCell>{duration} minutes</TableCell>
                      <TableCell>{getStatusBadge(incident.status)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default SystemHealth;
