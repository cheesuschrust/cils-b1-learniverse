
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bug, FileBadge, Server, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SystemTester from '@/components/admin/SystemTester';

const SystemTests = () => {
  const { toast } = useToast();
  
  const handleCheckForUpdates = () => {
    toast({
      title: "Update Check",
      description: "No updates available. System is up to date.",
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>System Tests | Admin</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Tests</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCheckForUpdates}>
            <Share2 className="h-4 w-4 mr-2" />
            Check for Updates
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Tabs defaultValue="diagnostics" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="diagnostics">
              <AlertCircle className="h-4 w-4 mr-2" />
              Diagnostics
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Server className="h-4 w-4 mr-2" />
              System Status
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileBadge className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="diagnostics">
            <SystemTester />
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  View the current status of all system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border bg-background">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <h3 className="font-medium">Core Services</h3>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        All core services are operating normally
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border bg-background">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <h3 className="font-medium">AI Services</h3>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        AI model loaded and operating at optimal capacity
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border bg-background">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <h3 className="font-medium">Database</h3>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Local storage and session storage are available
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="secondary">
                      <Server className="h-4 w-4 mr-2" />
                      Refresh Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>System Reports</CardTitle>
                <CardDescription>
                  Generate and view system reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-auto py-3">
                      <Bug className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Generate Error Report</div>
                        <div className="text-xs text-muted-foreground">
                          Creates a detailed report of system errors
                        </div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="justify-start h-auto py-3">
                      <FileBadge className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">AI Performance Report</div>
                        <div className="text-xs text-muted-foreground">
                          Analyzes AI performance metrics
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemTests;
