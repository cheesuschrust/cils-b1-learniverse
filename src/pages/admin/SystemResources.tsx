
import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SystemResourceDashboard from '@/components/admin/SystemResourceDashboard';
import DynamicSEO from '@/components/marketing/DynamicSEO';
import SystemResourcesCards from '@/components/admin/SystemResourcesCards';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HardDrive, Database, Server, Activity, Shield } from 'lucide-react';

const SystemResourcesPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DynamicSEO 
        title="System Resources"
        description="Monitor and manage system resources, database performance, and infrastructure health."
        keywords="system resources, monitoring, performance, database, admin dashboard"
        type="website"
      />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">System Resources</h1>
          <p className="text-muted-foreground">
            Monitor system performance, database health, and infrastructure metrics
          </p>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center">
              <Server className="mr-2 h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex items-center">
              <HardDrive className="mr-2 h-4 w-4" />
              Storage
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <SystemResourcesCards />
          </TabsContent>
          
          <TabsContent value="resources">
            <SystemResourceDashboard />
          </TabsContent>
          
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Database Performance</CardTitle>
                <CardDescription>
                  Monitor database metrics, query performance, and connection health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Please visit the Database Performance page for detailed metrics
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="storage">
            <Card>
              <CardHeader>
                <CardTitle>Storage Management</CardTitle>
                <CardDescription>
                  Monitor storage usage and optimize disk space
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">20.0 GB</div>
                        <p className="text-xs text-muted-foreground">Allocated capacity</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Used Space</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">7.8 GB</div>
                        <p className="text-xs text-muted-foreground">39% of total capacity</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Available Space</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">12.2 GB</div>
                        <p className="text-xs text-green-600">Sufficient space available</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Monitoring</CardTitle>
                <CardDescription>
                  Monitor security metrics and access patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">342</div>
                        <p className="text-xs text-muted-foreground">Current active users</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Login Attempts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-muted-foreground">Last 24 hours</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">1.9% of total attempts</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default SystemResourcesPage;
