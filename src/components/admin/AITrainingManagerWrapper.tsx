
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Database, Volume2, Sliders } from 'lucide-react';

import AIModelSelector from '@/components/ai/AIModelSelector';
import VoiceSystemManager from '@/components/ai/VoiceSystemManager';
import TrainingDataManager from '@/components/ai/TrainingDataManager';

const AITrainingManagerWrapper: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Training Management</h2>
          <p className="text-muted-foreground">Configure, optimize and manage AI models and training data</p>
        </div>
        <Badge variant="outline" className="ml-auto">
          Admin Access
        </Badge>
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
          <Card>
            <CardHeader>
              <CardTitle>Advanced AI Settings</CardTitle>
              <CardDescription>
                Configure system-wide AI settings and performance optimizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-12 text-center">
                <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-lg font-medium mb-2">Advanced Settings Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're working on advanced AI configuration options for system administrators.
                  Check back in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITrainingManagerWrapper;
