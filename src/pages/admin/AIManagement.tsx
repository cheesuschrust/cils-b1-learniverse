
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AIStatus } from '@/components/ai/AIStatus';
import { ModelPerformanceChart } from '@/components/admin/ModelPerformanceChart';
import { AIModelSelector } from '@/components/admin/AIModelSelector';
import { TrainingDataTable } from '@/components/admin/TrainingDataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Bot, Upload, BarChart, Settings } from 'lucide-react';

const AIManagement: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <Helmet>
        <title>AI Management | CILS Italian Exam Prep</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AI Training Management</h2>
            <p className="text-muted-foreground">
              Monitor and manage the AI systems that power language learning features
            </p>
          </div>
          <Badge variant="outline" className="ml-2">Admin Only</Badge>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AIStatus status="online" />
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
            <TabsTrigger value="training-data">
              <Bot className="h-4 w-4 mr-2" />
              Training Data
            </TabsTrigger>
            <TabsTrigger value="model-versions">
              <BarChart className="h-4 w-4 mr-2" />
              Model Versions
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </TabsTrigger>
            <TabsTrigger value="configuration">
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </TabsTrigger>
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
                <div className="bg-muted/20 rounded-md p-8 text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Model version comparison</h3>
                  <p className="text-muted-foreground mb-6">
                    Track performance improvements across different model versions and training runs.
                  </p>
                  <Button variant="outline">View History</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Training Data</CardTitle>
                <CardDescription>
                  Add new training data to improve model performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/20 rounded-md p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Add training data</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload CSV files with question-answer pairs or complete texts for analysis.
                  </p>
                  <div className="flex justify-center">
                    <Button>Select Files</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configuration" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>
                  Configure model parameters and thresholds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/20 rounded-md p-8 text-center">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Advanced settings</h3>
                  <p className="text-muted-foreground mb-6">
                    Adjust configuration parameters for AI models and inference endpoints.
                  </p>
                  <Button variant="outline">Configure Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AIManagement;
