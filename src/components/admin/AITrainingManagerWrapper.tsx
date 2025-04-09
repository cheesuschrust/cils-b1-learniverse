
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Database, Volume2, Sliders, BarChart3, Activity } from 'lucide-react';

import AIModelSelector from '@/components/ai/AIModelSelector';
import VoiceSystemManager from '@/components/ai/VoiceSystemManager';
import TrainingDataManager from '@/components/ai/TrainingDataManager';
import AIAdvancedSettings from '@/components/ai/AIAdvancedSettings';

const AITrainingManagerWrapper: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Training Management</h2>
          <p className="text-muted-foreground">Configure, optimize and manage AI models and training data</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="ml-auto">
            Admin Access
          </Badge>
          <Badge variant="default" className="bg-green-600">
            System Online
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BrainCircuit className="mr-2 h-4 w-4 text-primary" />
              Active Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 in production, 1 in training
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="mr-2 h-4 w-4 text-primary" />
              Training Datasets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              245K samples, 98.7% labeled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="mr-2 h-4 w-4 text-primary" />
              System Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Normal operating conditions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-primary" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93.8%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.1% from previous version
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models" className="flex items-center">
            <BrainCircuit className="mr-2 h-4 w-4" />
            AI Models
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center">
            <Volume2 className="mr-2 h-4 w-4" />
            Voice System
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Training Data
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Sliders className="mr-2 h-4 w-4" />
            Advanced Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="models">
          <AIModelSelector />
        </TabsContent>
        
        <TabsContent value="voice">
          <VoiceSystemManager />
        </TabsContent>
        
        <TabsContent value="training">
          <TrainingDataManager />
        </TabsContent>
        
        <TabsContent value="settings">
          <AIAdvancedSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITrainingManagerWrapper;
