
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AITrainingManager from '@/components/admin/AITrainingManager';
import { AIArchitectureExplainer, AIModelUsageDashboard } from '@/components/ai';

const AIConfigurator: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>AI Configuration - Admin</title>
        </Helmet>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">AI Configuration</h1>
          <p className="text-muted-foreground">
            Manage AI models, training data, and integration settings
          </p>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <AIArchitectureExplainer />
          </TabsContent>
          
          <TabsContent value="models">
            <Card>
              <CardHeader>
                <CardTitle>AI Models Management</CardTitle>
                <CardDescription>
                  Configure and manage AI models used throughout the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Configure which AI models are active and their settings. 
                  Adjust confidence thresholds and processing parameters.
                </p>
                <p>Coming soon: Model version control and A/B testing functionality</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="training">
            <AITrainingManager />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AIModelUsageDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AIConfigurator;
