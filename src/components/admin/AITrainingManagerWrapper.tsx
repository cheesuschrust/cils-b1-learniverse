
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Brain, Database, LineChart, RefreshCw, Book, Upload } from 'lucide-react';
import { TrainingDataTable } from './TrainingDataTable';
import { ModelPerformanceChart } from './ModelPerformanceChart';
import { AIModelSelector } from './AIModelSelector';
import { Progress } from '@/components/ui/progress';
import { AIModelPerformance } from '@/types/ai';

const AITrainingManagerWrapper: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  // Check if current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has admin role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        
        if (error) throw error;
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          Please log in to access the AI Training Manager.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Restricted</AlertTitle>
        <AlertDescription>
          This area is restricted to administrators only.
        </AlertDescription>
      </Alert>
    );
  }

  // This is a placeholder component - implement full component in a production app
  // We're creating a wrapper structure that would be connected to real data in a complete implementation
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI Training Manager
        </CardTitle>
        <CardDescription>
          Manage AI training data, monitor model performance, and initiate training jobs
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="training-data">Training Data</TabsTrigger>
            <TabsTrigger value="model-management">Model Management</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Training Samples</p>
                    <p className="text-2xl font-bold">1,245</p>
                  </div>
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <Progress value={72} className="h-1" />
                <p className="text-xs text-muted-foreground mt-1">72% of target</p>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Model Accuracy</p>
                    <p className="text-2xl font-bold">87.3%</p>
                  </div>
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <Progress value={87.3} className="h-1" />
                <p className="text-xs text-muted-foreground mt-1">+2.1% from last version</p>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Latest Version</p>
                    <p className="text-2xl font-bold">v1.2.4</p>
                  </div>
                  <Book className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant="outline">Released: 7 days ago</Badge>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 h-64">
              <h3 className="font-medium mb-2">Model Performance</h3>
              <ModelPerformanceChart />
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="training-data">
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Training Data Samples</h3>
              <Button size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </div>
            
            <TrainingDataTable />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="model-management">
          <CardContent className="space-y-4">
            <AIModelSelector />
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Training Job Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Italian Grammar Analyzer v1.3</p>
                  <Badge>In Progress</Badge>
                </div>
                <Progress value={45} className="h-2" />
                <p className="text-xs text-muted-foreground">Estimated completion: 1.5 hours</p>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Deploy Model</h3>
              <div className="space-y-2">
                <p className="text-sm">Select a trained model to deploy to production:</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Italian Grammar v1.2.4</Button>
                  <Button className="flex-1">Deploy Selected</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t p-4 text-xs text-muted-foreground">
        <div>Last updated: {new Date().toLocaleDateString()}</div>
        <div>AI Training Environment: Production</div>
      </CardFooter>
    </Card>
  );
};

export default AITrainingManagerWrapper;
