
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { useAI } from '@/contexts/AIContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Grid, BarChart, Settings2, Save, RefreshCw, Brain, Loader2, AlertCircle } from 'lucide-react';
import AITrainingManager from '@/components/admin/AITrainingManager';

const AIManagement: React.FC = () => {
  const { toast } = useToast();
  const { 
    isAIEnabled, 
    remainingCredits, 
    usageLimit, 
    loadModel, 
    status,
    isModelLoaded 
  } = useAIUtils();

  const { 
    settings, 
    updateSettings, 
    resetSettings, 
    isConfigured 
  } = useAI();

  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt);
  const [temperature, setTemperature] = useState(settings.temperature);
  const [maxTokens, setMaxTokens] = useState(settings.maxTokens);
  const [modelName, setModelName] = useState(settings.modelName);
  const [enableVoice, setEnableVoice] = useState(settings.enableVoice);

  const handleSaveSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      updateSettings({
        apiKey,
        systemPrompt,
        temperature,
        maxTokens,
        modelName,
        enableVoice
      });
      setIsLoading(false);
      toast({
        title: 'Settings Saved',
        description: 'AI settings have been updated successfully.',
      });
    }, 1000);
  };

  const handleResetSettings = () => {
    resetSettings();
    setApiKey('');
    setSystemPrompt(settings.systemPrompt);
    setTemperature(settings.temperature);
    setMaxTokens(settings.maxTokens);
    setModelName(settings.modelName);
    setEnableVoice(settings.enableVoice);
    toast({
      title: 'Settings Reset',
      description: 'AI settings have been reset to defaults.',
    });
  };

  const handleReloadModels = async () => {
    setIsLoading(true);
    try {
      await loadModel('text-processing');
      toast({
        title: 'Models Reloaded',
        description: 'AI models have been successfully reloaded.',
      });
    } catch (error) {
      console.error('Error reloading models:', error);
      toast({
        title: 'Error',
        description: 'Failed to reload AI models. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Management | Admin Dashboard</title>
      </Helmet>
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">AI Management</h1>
            <p className="text-muted-foreground">Configure and monitor AI services for the platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isAIEnabled ? "default" : "outline"} 
              className="gap-1"
            >
              {status === 'ready' ? (
                <Brain className="h-4 w-4" />
              ) : status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {isAIEnabled ? 'AI Enabled' : 'AI Disabled'}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span>{remainingCredits}/{usageLimit} Credits</span>
            </Badge>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              <span>AI Settings</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Training & Models</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>AI Status</CardTitle>
                  <CardDescription>Current system status and health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={status === 'ready' ? 'default' : status === 'loading' ? 'secondary' : 'destructive'}>
                        {status === 'ready' ? 'Online' : status === 'loading' ? 'Loading' : 'Error'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Models Loaded:</span>
                      <span>{isModelLoaded ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">API Connected:</span>
                      <span>{isConfigured ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Model:</span>
                      <span>{settings.modelName}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2" 
                    onClick={handleReloadModels}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Reload Models
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>AI usage and credit information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available Credits:</span>
                      <span>{remainingCredits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credit Limit:</span>
                      <span>{usageLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usage Level:</span>
                      <span>{Math.round(((usageLimit - remainingCredits) / usageLimit) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${((usageLimit - remainingCredits) / usageLimit) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>AI Features</CardTitle>
                  <CardDescription>Available AI capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <FeatureStatusItem 
                      title="Text Generation" 
                      isEnabled={isAIEnabled && isModelLoaded} 
                    />
                    <FeatureStatusItem 
                      title="Content Processing" 
                      isEnabled={isAIEnabled && isModelLoaded} 
                    />
                    <FeatureStatusItem 
                      title="Text-to-Speech" 
                      isEnabled={isAIEnabled && settings.enableVoice} 
                    />
                    <FeatureStatusItem 
                      title="Translation" 
                      isEnabled={isAIEnabled && isModelLoaded} 
                    />
                    <FeatureStatusItem 
                      title="Quiz Generation" 
                      isEnabled={isAIEnabled && isModelLoaded} 
                    />
                    <FeatureStatusItem 
                      title="Speech Recognition" 
                      isEnabled={isAIEnabled && isModelLoaded} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Model Configuration</CardTitle>
                  <CardDescription>
                    Configure AI model settings and API connections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input 
                        id="api-key" 
                        type="password" 
                        placeholder="Enter API key" 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)} 
                      />
                      <p className="text-xs text-muted-foreground">
                        API key for the language model service
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model-name">Model</Label>
                      <Select value={modelName} onValueChange={setModelName}>
                        <SelectTrigger id="model-name">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Small</SelectItem>
                          <SelectItem value="mixtral-8x7b">Mixtral 8x7B</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Select the AI model to use for text generation
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea 
                      id="system-prompt" 
                      placeholder="Enter system prompt" 
                      value={systemPrompt} 
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      System prompt for the language model to define its behavior
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
                          <span className="text-xs text-muted-foreground">
                            {temperature < 0.4 ? 'More Focused' : temperature > 0.7 ? 'More Creative' : 'Balanced'}
                          </span>
                        </div>
                        <Slider
                          id="temperature"
                          min={0}
                          max={1}
                          step={0.1}
                          value={[temperature]}
                          onValueChange={([value]) => setTemperature(value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Controls randomness: lower values are more deterministic
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
                        </div>
                        <Slider
                          id="max-tokens"
                          min={100}
                          max={4000}
                          step={100}
                          value={[maxTokens]}
                          onValueChange={([value]) => setMaxTokens(value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum number of tokens to generate in responses
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enableVoice">Text-to-Speech</Label>
                          <p className="text-xs text-muted-foreground">
                            Enable voice synthesis for AI responses
                          </p>
                        </div>
                        <Switch
                          id="enableVoice"
                          checked={enableVoice}
                          onCheckedChange={setEnableVoice}
                        />
                      </div>
                      
                      {enableVoice && (
                        <div className="space-y-2">
                          <Label htmlFor="voice-model">Voice Model</Label>
                          <Select defaultValue="alloy">
                            <SelectTrigger id="voice-model">
                              <SelectValue placeholder="Select voice" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                              <SelectItem value="echo">Echo (Male)</SelectItem>
                              <SelectItem value="fable">Fable (Female)</SelectItem>
                              <SelectItem value="onyx">Onyx (Male)</SelectItem>
                              <SelectItem value="nova">Nova (Female)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Usage Warning</AlertTitle>
                        <AlertDescription>
                          Increasing max tokens or enabling voice features will consume more credits.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleResetSettings}
                    disabled={isLoading}
                  >
                    Reset to Defaults
                  </Button>
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="mt-6">
            <AITrainingManager />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

interface FeatureStatusItemProps {
  title: string;
  isEnabled: boolean;
}

const FeatureStatusItem: React.FC<FeatureStatusItemProps> = ({ title, isEnabled }) => {
  return (
    <div className="flex items-center justify-between">
      <span>{title}</span>
      <Badge variant={isEnabled ? 'default' : 'outline'}>
        {isEnabled ? 'Enabled' : 'Disabled'}
      </Badge>
    </div>
  );
};

export default AIManagement;
