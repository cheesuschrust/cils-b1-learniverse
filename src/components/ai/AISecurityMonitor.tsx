
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, AlertTriangle, CheckCircle, Clock, UserCheck, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AISecurityMonitor: React.FC = () => {
  const [securitySettings, setSecuritySettings] = React.useState({
    encryptResponses: true,
    logSensitiveData: false,
    maxQueriesPerMinute: 30,
    userDataRetention: 90, // days
  });

  const securityMetrics = {
    threatDetections: 12,
    blockedRequests: 87,
    averageRiskScore: 18, // 0-100
    vulnerabilities: [
      { severity: 'low', count: 3 },
      { severity: 'medium', count: 1 },
      { severity: 'high', count: 0 },
    ],
    lastScan: new Date(Date.now() - 86400000), // 1 day ago
    complianceScore: 94,
  };

  const recentEvents = [
    { id: 1, type: 'anomaly-detection', description: 'Unusual query pattern detected', timestamp: new Date(Date.now() - 3600000), severity: 'medium' },
    { id: 2, type: 'access-control', description: 'Failed authentication attempt', timestamp: new Date(Date.now() - 7200000), severity: 'low' },
    { id: 3, type: 'rate-limit', description: 'Rate limit exceeded for anonymous user', timestamp: new Date(Date.now() - 18000000), severity: 'low' },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="warning" className="bg-amber-500">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-primary" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Secure</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last scan: {securityMetrics.lastScan.toLocaleDateString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-primary" />
                  Threat Detections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityMetrics.threatDetections}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {securityMetrics.blockedRequests} requests blocked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-primary" />
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="text-2xl font-bold">{securityMetrics.complianceScore}%</div>
                  <Progress value={securityMetrics.complianceScore} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Overview</CardTitle>
              <CardDescription>Current system vulnerabilities by severity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityMetrics.vulnerabilities.map((vuln, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-3 ${
                        vuln.severity === 'high' ? 'bg-red-500' : 
                        vuln.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="capitalize">{vuln.severity} Severity</div>
                    </div>
                    <div className="font-medium">{vuln.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Security-related events from the AI system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.type}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>{event.timestamp.toLocaleTimeString()}</TableCell>
                      <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure AI security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="encrypt-responses">Encrypt Responses</Label>
                  <p className="text-sm text-muted-foreground">End-to-end encryption for sensitive data</p>
                </div>
                <Switch 
                  id="encrypt-responses" 
                  checked={securitySettings.encryptResponses}
                  onCheckedChange={(checked) => handleSettingChange('encryptResponses', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="log-sensitive">Log Sensitive Data</Label>
                  <p className="text-sm text-muted-foreground">Keep detailed logs of sensitive operations</p>
                </div>
                <Switch 
                  id="log-sensitive" 
                  checked={securitySettings.logSensitiveData}
                  onCheckedChange={(checked) => handleSettingChange('logSensitiveData', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-queries">Max Queries Per Minute</Label>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    id="max-queries"
                    className="w-full p-2 border rounded-md"
                    value={securitySettings.maxQueriesPerMinute}
                    onChange={(e) => handleSettingChange('maxQueriesPerMinute', parseInt(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={30}>30</option>
                    <option value={60}>60</option>
                    <option value={100}>100</option>
                  </select>
                  <div className="text-sm text-muted-foreground pt-2">
                    Current: {securitySettings.maxQueriesPerMinute} per minute
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-retention">User Data Retention (days)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    id="data-retention"
                    className="w-full p-2 border rounded-md"
                    value={securitySettings.userDataRetention}
                    onChange={(e) => handleSettingChange('userDataRetention', parseInt(e.target.value))}
                  >
                    <option value={30}>30</option>
                    <option value={60}>60</option>
                    <option value={90}>90</option>
                    <option value={180}>180</option>
                    <option value={365}>365</option>
                  </select>
                  <div className="text-sm text-muted-foreground pt-2">
                    Current: {securitySettings.userDataRetention} days
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Regulatory compliance for AI systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>GDPR Compliance</div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">Compliant</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>AI Ethics Guidelines</div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">Compliant</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>Data Protection</div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">Compliant</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    <div>CCPA Compliance</div>
                  </div>
                  <Badge variant="outline" className="bg-amber-50">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISecurityMonitor;
