
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Cpu, Shield, Download, Zap, Cog, VolumeX, Volume, Lightbulb } from 'lucide-react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { AIPreference } from '@/types/interface-fixes';

interface AISettingsProps {
  onClose: () => void;
}

const AISettings: React.FC<AISettingsProps> = ({ onClose }) => {
  const { isAIEnabled, toggleAI } = useAIUtils();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AIPreference>({
    defaultModelSize: 'medium',
    modelSize: 'medium',
    useWebGPU: true,
    voiceRate: 1,
    voicePitch: 1,
    italianVoiceURI: '',
    englishVoiceURI: '',
    defaultLanguage: 'english',
    processOnDevice: true,
    dataCollection: false,
    assistanceLevel: 2,
    autoLoadModels: true,
    cacheModels: true,
    processingSetting: 'balanced',
    optimizationLevel: 1,
    anonymousAnalytics: false,
    contentFiltering: true,
    enabled: isAIEnabled,
    temperature: 0.7,
    maxTokens: 1000,
    voiceEnabled: true,
    responseFormat: 'markdown',
    cacheResponses: true
  });
  
  const handleToggleChange = (key: keyof AIPreference) => (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: checked
    }));
  };
  
  const handleSelectChange = (key: keyof AIPreference) => (value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSliderChange = (key: keyof AIPreference) => (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };
  
  const saveSettings = () => {
    // This would persist settings to a backend service
    toast({
      title: "AI Settings Updated",
      description: "Your AI preferences have been saved."
    });
    
    // If the enabled state changed, toggle the AI
    if (settings.enabled !== isAIEnabled) {
      toggleAI();
    }
    
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          AI Settings
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="general">
        <div className="px-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Cog className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="model" className="flex items-center gap-1">
              <Cpu className="h-4 w-4" />
              <span className="hidden sm:inline">Model</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="space-y-6 pt-2">
          <TabsContent value="general" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable AI Features</Label>
                <p className="text-sm text-muted-foreground">Turn AI assistance on or off</p>
              </div>
              <Switch 
                checked={settings.enabled}
                onCheckedChange={handleToggleChange("enabled")}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Text-to-Speech</Label>
                <p className="text-sm text-muted-foreground">Enable voice pronunciation</p>
              </div>
              <Switch 
                checked={settings.voiceEnabled}
                onCheckedChange={handleToggleChange("voiceEnabled")}
                disabled={!settings.enabled}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Cache Responses</Label>
                <p className="text-sm text-muted-foreground">Save responses for offline use</p>
              </div>
              <Switch 
                checked={settings.cacheResponses}
                onCheckedChange={handleToggleChange("cacheResponses")}
                disabled={!settings.enabled}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-Load Models</Label>
                <p className="text-sm text-muted-foreground">Automatically prepare models on startup</p>
              </div>
              <Switch 
                checked={settings.autoLoadModels}
                onCheckedChange={handleToggleChange("autoLoadModels")}
                disabled={!settings.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-base">Assistance Level</Label>
                <span className="text-sm font-medium">
                  {settings.assistanceLevel === 1 ? 'Minimal' : 
                   settings.assistanceLevel === 2 ? 'Balanced' : 'Maximum'}
                </span>
              </div>
              <Slider 
                value={[settings.assistanceLevel || 2]}
                min={1}
                max={3}
                step={1}
                onValueChange={handleSliderChange("assistanceLevel")}
                disabled={!settings.enabled}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Minimal</span>
                <span>Balanced</span>
                <span>Maximum</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="model" className="space-y-4 mt-0">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Model Size</Label>
                <p className="text-sm text-muted-foreground">Balance between speed and quality</p>
              </div>
              <Select
                value={settings.modelSize as string}
                onValueChange={handleSelectChange("modelSize")}
                disabled={!settings.enabled}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (Fast)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="large">Large (Accurate)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Processing</Label>
                <p className="text-sm text-muted-foreground">Set processing quality preference</p>
              </div>
              <Select
                value={settings.processingSetting as string}
                onValueChange={handleSelectChange("processingSetting")}
                disabled={!settings.enabled}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Speed Priority</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="high-quality">Quality Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Process on Device</Label>
                <p className="text-sm text-muted-foreground">Run AI locally when possible</p>
              </div>
              <Switch 
                checked={settings.processOnDevice}
                onCheckedChange={handleToggleChange("processOnDevice")}
                disabled={!settings.enabled}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Use WebGPU</Label>
                <p className="text-sm text-muted-foreground">Hardware acceleration for better performance</p>
              </div>
              <Switch 
                checked={settings.useWebGPU}
                onCheckedChange={handleToggleChange("useWebGPU")}
                disabled={!settings.enabled || !settings.processOnDevice}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Cache Models</Label>
                <p className="text-sm text-muted-foreground">Store models for faster loading</p>
              </div>
              <Switch 
                checked={settings.cacheModels}
                onCheckedChange={handleToggleChange("cacheModels")}
                disabled={!settings.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-base">Temperature</Label>
                <span className="text-sm font-medium">{settings.temperature?.toFixed(1)}</span>
              </div>
              <Slider 
                value={[settings.temperature || 0.7]}
                min={0.1}
                max={1}
                step={0.1}
                onValueChange={handleSliderChange("temperature")}
                disabled={!settings.enabled}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Focused</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Content Filtering</Label>
                <p className="text-sm text-muted-foreground">Filter inappropriate content</p>
              </div>
              <Switch 
                checked={settings.contentFiltering}
                onCheckedChange={handleToggleChange("contentFiltering")}
                disabled={!settings.enabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Anonymous Analytics</Label>
                <p className="text-sm text-muted-foreground">Share anonymous usage data to improve the service</p>
              </div>
              <Switch 
                checked={settings.anonymousAnalytics}
                onCheckedChange={handleToggleChange("anonymousAnalytics")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Data Collection</Label>
                <p className="text-sm text-muted-foreground">Allow collection of your inputs to improve AI</p>
              </div>
              <Switch 
                checked={settings.dataCollection}
                onCheckedChange={handleToggleChange("dataCollection")}
              />
            </div>
            
            <div className="bg-muted p-3 rounded-md mt-4">
              <h4 className="font-medium flex items-center gap-1 mb-2">
                <Lightbulb className="h-4 w-4" />
                Privacy Information
              </h4>
              <p className="text-sm text-muted-foreground">
                When processing on device is enabled, your data stays on your computer and is not sent 
                to any servers for analysis. This provides maximum privacy but may limit some 
                advanced features.
              </p>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <div className="px-6 pb-6 pt-2 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={saveSettings}>
          Save Settings
        </Button>
      </div>
    </Card>
  );
};

export default AISettings;
