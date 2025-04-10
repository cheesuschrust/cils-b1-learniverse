
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Zap, Cpu, Server, Gauge, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AIModel } from '@/types/ai-types';

const AIModelSelector: React.FC = () => {
  const { toast } = useToast();
  
  const [availableModels, setAvailableModels] = useState<AIModel[]>([
    { 
      id: '1', 
      name: 'Italian Language Assistant', 
      provider: 'HuggingFace', 
      capabilities: ['text-generation', 'translation', 'grammar-check'], 
      accuracy: 0.92, 
      confidenceScore: 0.89, 
      isActive: true, 
      version: '1.2.0',
      lastTrainedAt: new Date('2025-03-15')
    },
    { 
      id: '2', 
      name: 'CILS Question Generator', 
      provider: 'Local Model', 
      capabilities: ['question-generation', 'assessment'], 
      accuracy: 0.87, 
      confidenceScore: 0.85, 
      isActive: true, 
      version: '0.9.4',
      lastTrainedAt: new Date('2025-03-20')
    },
    { 
      id: '3', 
      name: 'Italian Speech Recognition', 
      provider: 'HuggingFace', 
      capabilities: ['speech-to-text', 'accent-detection'], 
      accuracy: 0.85, 
      confidenceScore: 0.82, 
      isActive: false, 
      version: '0.8.1',
      lastTrainedAt: new Date('2025-02-28')
    },
    { 
      id: '4', 
      name: 'Cultural Context Engine', 
      provider: 'Local Model', 
      capabilities: ['cultural-context', 'relevance-analysis'], 
      accuracy: 0.91, 
      confidenceScore: 0.88, 
      isActive: true, 
      version: '1.0.5',
      lastTrainedAt: new Date('2025-03-10')
    }
  ]);
  
  const [settings, setSettings] = useState({
    confidenceThreshold: 0.75,
    enableGPUAcceleration: true,
    debugMode: false,
    cacheResponses: true,
    maxTokens: 1024,
    temperatureValue: 0.7,
    useAdvancedFeatures: true
  });
  
  const toggleModelActive = (id: string) => {
    setAvailableModels(models => 
      models.map(model => 
        model.id === id 
          ? { ...model, isActive: !model.isActive } 
          : model
      )
    );
    
    const model = availableModels.find(m => m.id === id);
    
    toast({
      title: model?.isActive ? "Model Deactivated" : "Model Activated",
      description: `${model?.name} has been ${model?.isActive ? "deactivated" : "activated"} successfully.`,
    });
  };
  
  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "AI model settings have been updated successfully.",
    });
  };
  
  const trainModel = (id: string) => {
    toast({
      title: "Training Started",
      description: "Model training has been initiated. This may take some time.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active-models">
        <TabsList>
          <TabsTrigger value="active-models" className="flex items-center">
            <BrainCircuit className="mr-2 h-4 w-4" />
            Active Models
          </TabsTrigger>
          <TabsTrigger value="available-models" className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            Available Models
          </TabsTrigger>
          <TabsTrigger value="model-settings" className="flex items-center">
            <Gauge className="mr-2 h-4 w-4" />
            Model Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active-models" className="mt-6 space-y-4">
          {availableModels.filter(model => model.isActive).map(model => (
            <Card key={model.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {model.name}
                      <Badge className="ml-2" variant="outline">v{model.version}</Badge>
                    </CardTitle>
                    <CardDescription>Provider: {model.provider}</CardDescription>
                  </div>
                  <Switch 
                    checked={model.isActive} 
                    onCheckedChange={() => toggleModelActive(model.id)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span>Accuracy</span>
                      <span>{(model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={model.accuracy * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span>Confidence Score</span>
                      <span>{(model.confidenceScore * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={model.confidenceScore * 100} className="h-2" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {model.capabilities.map((cap, idx) => (
                      <Badge key={idx} variant="secondary" className="capitalize">
                        {cap.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Last trained: {model.lastTrainedAt?.toLocaleDateString()}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => trainModel(model.id)}
                >
                  Retrain Model
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {availableModels.filter(model => model.isActive).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No active models. Activate models from the Available Models tab.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="available-models" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableModels.map(model => (
              <Card key={model.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{model.name}</CardTitle>
                      <CardDescription>Provider: {model.provider}</CardDescription>
                    </div>
                    <Switch 
                      checked={model.isActive} 
                      onCheckedChange={() => toggleModelActive(model.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Accuracy: {(model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Cpu className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Version: {model.version}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {model.capabilities.map((cap, idx) => (
                        <Badge key={idx} variant="secondary" className="capitalize">
                          {cap.replace(/-/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed flex flex-col justify-center items-center p-6">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Add New Model</p>
              <Button variant="outline" size="sm" className="mt-4">
                Import Model
              </Button>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="model-settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>Advanced settings for AI model behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="gpu-acceleration">GPU Acceleration</Label>
                  <p className="text-sm text-muted-foreground">Use WebGPU for faster processing</p>
                </div>
                <Switch 
                  id="gpu-acceleration" 
                  checked={settings.enableGPUAcceleration}
                  onCheckedChange={(checked) => handleSettingChange('enableGPUAcceleration', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cache-responses">Cache Responses</Label>
                  <p className="text-sm text-muted-foreground">Store responses for frequently asked questions</p>
                </div>
                <Switch 
                  id="cache-responses" 
                  checked={settings.cacheResponses}
                  onCheckedChange={(checked) => handleSettingChange('cacheResponses', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="debug-mode">Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">Show detailed model information</p>
                </div>
                <Switch 
                  id="debug-mode" 
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                  <span className="text-sm">{(settings.confidenceThreshold * 100).toFixed(0)}%</span>
                </div>
                <Slider 
                  id="confidence-threshold"
                  min={0} 
                  max={100} 
                  step={1}
                  value={[settings.confidenceThreshold * 100]} 
                  onValueChange={(value) => handleSettingChange('confidenceThreshold', value[0] / 100)}
                />
                <p className="text-xs text-muted-foreground">
                  Responses below this confidence level will be filtered
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Temperature</Label>
                  <span className="text-sm">{settings.temperatureValue.toFixed(1)}</span>
                </div>
                <Slider 
                  id="temperature"
                  min={0} 
                  max={1} 
                  step={0.1}
                  value={[settings.temperatureValue]} 
                  onValueChange={(value) => handleSettingChange('temperatureValue', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Higher values produce more creative responses
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <span className="text-sm">{settings.maxTokens}</span>
                </div>
                <Slider 
                  id="max-tokens"
                  min={128} 
                  max={2048} 
                  step={128}
                  value={[settings.maxTokens]} 
                  onValueChange={(value) => handleSettingChange('maxTokens', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum length of generated responses
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button onClick={saveSettings} className="ml-auto">
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIModelSelector;
