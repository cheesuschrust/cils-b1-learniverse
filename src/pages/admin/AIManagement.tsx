
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Cpu, Settings, Brain, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AITrainingManager from '@/components/admin/AITrainingManager';
import AIStatus from '@/components/ai/AIStatus'; // Fixed: Using default import instead of named import
import { useAI } from '@/hooks/useAI';

const AIManagement = () => {
  const [activeTab, setActiveTab] = useState('status');
  const [modelTemperature, setModelTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [isReloading, setIsReloading] = useState(false);
  
  const { toast } = useToast();
  const { 
    isEnabled, 
    isModelLoaded, 
    toggleAI,
    generateText, 
    loadModel 
  } = useAI();
  
  const handleToggleAI = () => {
    const isEnabled = toggleAI();
    
    toast({
      title: isEnabled ? "AI Enabled" : "AI Disabled",
      description: isEnabled ? "AI models have been activated" : "AI models have been deactivated",
    });
  };
  
  const handleReloadModel = async () => {
    setIsReloading(true);
    
    try {
      await loadModel("text-generation");
      
      toast({
        title: "Model Reloaded",
        description: "AI model has been successfully reloaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reload AI model",
        variant: "destructive",
      });
    } finally {
      setIsReloading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>AI Management | Admin</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Management</h1>
      </div>
      
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="status" className="flex items-center">
            <Cpu className="h-4 w-4 mr-2" />
            Status
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center">
            <Brain className="h-4 w-4 mr-2" />
            Training
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI System Status</CardTitle>
              <CardDescription>
                View the current status of the AI system components
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <AIStatus />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">AI Models</h3>
                  <p className="text-sm text-muted-foreground">
                    {isModelLoaded ? 'Models are loaded and ready' : 'Models are not loaded'}
                  </p>
                </div>
                <Switch id="ai-models" checked={isEnabled} onCheckedChange={handleToggleAI} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI System Settings</CardTitle>
              <CardDescription>
                Configure the AI system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model-temperature">Model Temperature</Label>
                  <Input 
                    type="number" 
                    id="model-temperature" 
                    value={modelTemperature} 
                    onChange={(e) => setModelTemperature(parseFloat(e.target.value))}
                    placeholder="0.7"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input 
                    type="number" 
                    id="max-tokens" 
                    value={maxTokens} 
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    placeholder="2000"
                    min="100"
                    max="4000"
                    step="100"
                  />
                </div>
              </div>
              
              <Button variant="outline" disabled={isReloading} onClick={handleReloadModel}>
                {isReloading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Reloading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reload AI Model
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Training Management</CardTitle>
              <CardDescription>
                Manage AI training examples and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AITrainingManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIManagement;
