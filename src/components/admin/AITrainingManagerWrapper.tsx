
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AIStatus } from '@/components/ai/AIStatus';
import { ModelPerformanceChart } from '@/components/admin/ModelPerformanceChart';
import { AIModelSelector } from '@/components/admin/AIModelSelector';
import { TrainingDataTable } from '@/components/admin/TrainingDataTable';

const AITrainingManagerWrapper: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">AI Training Management</h2>
        <Badge variant="outline" className="ml-2">Admin Only</Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AIStatus />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Model Performance</CardTitle>
            <CardDescription>
              Current model accuracy and confidence metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModelPerformanceChart />
          </CardContent>
        </Card>
        <AIModelSelector />
      </div>
      
      <Tabs defaultValue="training-data" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="training-data">Training Data</TabsTrigger>
          <TabsTrigger value="model-versions">Model Versions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="training-data" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Data Management</CardTitle>
              <CardDescription>
                Review and manage data used for model training
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrainingDataTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="model-versions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Version History</CardTitle>
              <CardDescription>
                Compare performance across model versions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Model version comparison will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics for AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Performance analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="configuration" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Configure model parameters and thresholds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configuration options will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITrainingManagerWrapper;
