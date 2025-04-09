
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Database, Volume2, Sliders } from 'lucide-react';

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
          <AIAdvancedSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITrainingManagerWrapper;
