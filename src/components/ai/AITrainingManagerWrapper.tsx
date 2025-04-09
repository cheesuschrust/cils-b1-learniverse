
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Database, Volume2, Sliders, BarChart3, Activity, Shield } from 'lucide-react';
import { HelpTooltip } from '@/components/help/HelpTooltip';

import AIModelSelector from '@/components/ai/AIModelSelector';
import VoiceSystemManager from '@/components/ai/VoiceSystemManager';
import TrainingDataManager from '@/components/ai/TrainingDataManager';
import AIAdvancedSettings from '@/components/ai/AIAdvancedSettings';
import AISecurityMonitor from '@/components/ai/AISecurityMonitor';

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
            <HelpTooltip 
              content="This section is only accessible to users with admin privileges."
              className="ml-1"
            />
          </Badge>
          <Badge variant="default" className="bg-green-600">
            System Online
            <HelpTooltip 
              content="The AI training system is currently online and operational."
              className="ml-1"
            />
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BrainCircuit className="mr-2 h-4 w-4 text-primary" />
              Active Models
              <HelpTooltip 
                content="The number of AI models currently deployed and in training."
                className="ml-1"
              />
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
              Training Data
              <HelpTooltip 
                content="The amount of training data available in your system."
                className="ml-1"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-xs text-muted-foreground mt-1">
              15,432 training samples
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Volume2 className="mr-2 h-4 w-4 text-primary" />
              Voice Synthesis
              <HelpTooltip 
                content="Usage statistics for the voice synthesis system."
                className="ml-1"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Availability rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="mr-2 h-4 w-4 text-primary" />
              System Health
              <HelpTooltip 
                content="Overall health status of the AI training infrastructure."
                className="ml-1"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Excellent</div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="models" className="w-full">
        <TabsList>
          <TabsTrigger value="models" className="flex items-center">
            <BrainCircuit className="mr-2 h-4 w-4" />
            Models
            <HelpTooltip 
              content="Configure and manage the AI models used in your application."
              className="ml-1"
            />
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center">
            <Volume2 className="mr-2 h-4 w-4" />
            Voice
            <HelpTooltip 
              content="Configure text-to-speech and speech-to-text capabilities."
              className="ml-1"
            />
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Training Data
            <HelpTooltip 
              content="Manage the data used to train and fine-tune your AI models."
              className="ml-1"
            />
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Security
            <HelpTooltip 
              content="Configure security settings for your AI models and data."
              className="ml-1"
            />
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Sliders className="mr-2 h-4 w-4" />
            Settings
            <HelpTooltip 
              content="Advanced configuration options for the AI training system."
              className="ml-1"
            />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="models" className="mt-6">
          <AIModelSelector />
        </TabsContent>
        
        <TabsContent value="voice" className="mt-6">
          <VoiceSystemManager />
        </TabsContent>
        
        <TabsContent value="data" className="mt-6">
          <TrainingDataManager />
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <AISecurityMonitor />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <AIAdvancedSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITrainingManagerWrapper;
