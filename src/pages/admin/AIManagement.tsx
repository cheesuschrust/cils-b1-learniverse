
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Brain, 
  Server, 
  Settings, 
  Cpu, 
  Database, 
  AlertTriangle, 
  FileText, 
  BarChart,
  Zap,
  RefreshCw,
  Gauge,
  Loader2,
  AlertCircle,
  Check,
  ArrowDownToLine,
  Shield,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

import AISystemInfoPanel from '@/components/admin/AISystemInfoPanel';
import AITrainingManagerWrapper from '@/components/ai/AITrainingManagerWrapper';
import { useAI } from '@/hooks/useAI';
import { AISystemInfo, getModelById, getAllModels } from '@/utils/AISystemInfo';
import * as AIService from '@/services/AIService';
import * as HuggingFaceService from '@/services/HuggingFaceService';
import { ContentType } from '@/types/contentType';

// Define interfaces for component props
interface ModelCardProps {
  model: any;
  isLoaded: boolean;
  onLoad: () => void;
  isLoading: boolean;
}

interface ModelListProps {
  models: any[];
  loadedModels: string[];
  onLoadModel: (modelId: string) => void;
  loadingModels: string[];
}

interface ModelBenchmarkProps {
  model: any;
}

interface AIMetricsProps {
  metrics: {
    inferenceTime: number;
    memoryUsage: number;
    deviceType: string;
    confidenceScores: Record<ContentType, number>;
  };
}

interface AISettingsForm {
  useWebGPU: boolean;
  autoLoadModels: boolean;
  cacheModels: boolean;
  defaultLanguage: string;
  processingSetting: string;
  defaultModelSize: string;
  optimizationLevel: number;
  logLevel: string;
}

// Model Card Component
const ModelCard: React.FC<ModelCardProps> = ({ model, isLoaded, onLoad, isLoading }) => {
  const { toast } = useToast();
  
  const handleLoadModel = () => {
    if (!isLoaded && !isLoading) {
      onLoad();
      toast({
        title: "Loading model",
        description: `Started loading ${model.name}. This may take a moment.`
      });
    }
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-1 text-md">
              <Cpu className="h-4 w-4" /> {model.name}
            </CardTitle>
            <CardDescription>{model.task}</CardDescription>
          </div>
          <Badge variant={isLoaded ? "default" : "outline"}>
            {isLoaded ? "Loaded" : "Not Loaded"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Provider:</span>
            <span className="font-medium">{model.provider}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Size:</span>
            <span className="font-medium">{model.size}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Languages:</span>
            <span className="font-medium">{model.languages.join(", ")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          onClick={handleLoadModel} 
          className="w-full"
          disabled={isLoaded || isLoading}
          variant={isLoaded ? "outline" : "default"}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoaded ? "Loaded" : isLoading ? "Loading..." : "Load Model"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Model List Component
const ModelList: React.FC<ModelListProps> = ({ models, loadedModels, onLoadModel, loadingModels }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map(model => (
        <ModelCard 
          key={model.id}
          model={model}
          isLoaded={loadedModels.includes(model.id)}
          onLoad={() => onLoadModel(model.id)}
          isLoading={loadingModels.includes(model.id)}
        />
      ))}
    </div>
  );
};

// AI Metrics Component
const AIMetrics: React.FC<AIMetricsProps> = ({ metrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gauge className="h-5 w-5 mr-2" />
          AI Performance Metrics
        </CardTitle>
        <CardDescription>
          Real-time performance metrics for the AI system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <Label>Inference Speed</Label>
              <span className="text-sm">{metrics.inferenceTime}ms</span>
            </div>
            <Progress value={Math.min(100, 100 - (metrics.inferenceTime / 10))} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <Label>Memory Usage</Label>
              <span className="text-sm">{metrics.memoryUsage}MB</span>
            </div>
            <Progress value={Math.min(100, (metrics.memoryUsage / 5))} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-muted rounded-md p-3">
              <div className="text-sm text-muted-foreground mb-1">Device</div>
              <div className="font-medium flex items-center">
                {metrics.deviceType === 'webgpu' ? (
                  <>
                    <Zap className="h-4 w-4 mr-1 text-green-500" />
                    WebGPU (Accelerated)
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4 mr-1 text-yellow-500" />
                    CPU (Standard)
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-muted rounded-md p-3">
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <div className="font-medium flex items-center">
                <Check className="h-4 w-4 mr-1 text-green-500" />
                Operational
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="font-medium mb-2 text-sm">Content Type Confidence</h4>
            <div className="space-y-3">
              {Object.entries(metrics.confidenceScores).slice(0, 5).map(([type, score]) => (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <Label className="capitalize">{type.replace('-', ' ')}</Label>
                    <span className="text-sm">{score}%</span>
                  </div>
                  <Progress value={score} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Model Benchmark Component
const ModelBenchmark: React.FC<ModelBenchmarkProps> = ({ model }) => {
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();
  
  const runBenchmark = async () => {
    try {
      setIsBenchmarking(true);
      
      // Simulate a benchmark
      toast({
        title: "Benchmark started",
        description: `Running benchmark for ${model.name}`
      });
      
      // Wait for 2 seconds to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random benchmark results
      const benchmarkResults = {
        inferenceTime: Math.round(Math.random() * 200 + 50),
        memoryUsage: Math.round(Math.random() * 500 + 100),
        tokensPerSecond: Math.round(Math.random() * 100 + 20),
        accuracy: (Math.random() * 20 + 75).toFixed(2)
      };
      
      setResults(benchmarkResults);
      
      toast({
        title: "Benchmark complete",
        description: `Completed benchmark for ${model.name}`
      });
    } catch (error) {
      toast({
        title: "Benchmark failed",
        description: `Error running benchmark for ${model.name}`,
        variant: "destructive"
      });
    } finally {
      setIsBenchmarking(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Gauge className="h-5 w-5 mr-2" />
          Model Benchmark: {model.name}
        </CardTitle>
        <CardDescription>
          Test the performance of this model on your current device
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Inference Time</div>
                <div className="text-2xl font-bold mt-1">{results.inferenceTime} ms</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Memory Usage</div>
                <div className="text-2xl font-bold mt-1">{results.memoryUsage} MB</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Tokens/Second</div>
                <div className="text-2xl font-bold mt-1">{results.tokensPerSecond}</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Accuracy</div>
                <div className="text-2xl font-bold mt-1">{results.accuracy}%</div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Device Information</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Runtime: Browser-based (WebAssembly)</p>
                <p>Hardware: {navigator.hardwareConcurrency} CPU Cores</p>
                <p>WebGPU Support: {navigator.gpu ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Run a benchmark to test the performance of this model on your current device.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runBenchmark} 
          className="w-full"
          disabled={isBenchmarking}
        >
          {isBenchmarking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Benchmark...
            </>
          ) : results ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Again
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Run Benchmark
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main AI Management Page
const AIManagement: React.FC = () => {
  const { isEnabled, toggleAI } = useAI();
  const [loadedModels, setLoadedModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    inferenceTime: 85,
    memoryUsage: 256,
    deviceType: 'cpu',
    confidenceScores: {
      'multiple-choice': 85,
      'flashcards': 80,
      'writing': 75,
      'speaking': 70,
      'listening': 90
    }
  });
  const [aiSettings, setAISettings] = useState<AISettingsForm>({
    useWebGPU: true,
    autoLoadModels: false,
    cacheModels: true,
    defaultLanguage: 'italian',
    processingSetting: 'balanced',
    defaultModelSize: 'medium',
    optimizationLevel: 5,
    logLevel: 'error'
  });
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  // Check for WebGPU support on component mount
  useEffect(() => {
    const checkGPUSupport = async () => {
      try {
        const hasWebGPU = await HuggingFaceService.checkWebGPUSupport();
        const deviceType = await HuggingFaceService.getDeviceType();
        
        setMetrics(prev => ({
          ...prev,
          deviceType
        }));
        
        setAISettings(prev => ({
          ...prev,
          useWebGPU: hasWebGPU
        }));
        
        if (hasWebGPU) {
          toast({
            title: "WebGPU Available",
            description: "Your device supports hardware acceleration for AI models."
          });
        }
      } catch (error) {
        console.error("Error checking WebGPU support:", error);
      }
    };
    
    checkGPUSupport();
  }, [toast]);
  
  const handleLoadModel = async (modelId: string) => {
    try {
      setLoadingModels(prev => [...prev, modelId]);
      
      // Load the model
      await AIService.loadModelById(modelId);
      
      // Update loaded models
      setLoadedModels(prev => [...prev, modelId]);
      toast({
        title: "Model Loaded",
        description: `Successfully loaded model: ${modelId}`
      });
      
      // Select this model if no model is currently selected
      if (!selectedModel) {
        const model = getModelById(modelId);
        setSelectedModel(model);
      }
    } catch (error) {
      toast({
        title: "Loading Failed",
        description: `Failed to load model: ${modelId}`,
        variant: "destructive"
      });
    } finally {
      setLoadingModels(prev => prev.filter(id => id !== modelId));
    }
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "AI system settings have been updated."
    });
  };
  
  const handleTest = async () => {
    try {
      const result = await AIService.testConnection();
      toast({
        title: result.success ? "Connection Successful" : "Connection Failed",
        description: result.message
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the AI service",
        variant: "destructive"
      });
    }
  };
  
  const allModels = getAllModels();
  
  return (
    <>
      <Helmet>
        <title>AI Management - Admin</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Brain className="h-7 w-7 mr-2" />
              AI Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and configure the AI system for language learning
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="ai-toggle"
                checked={isEnabled}
                onCheckedChange={toggleAI}
              />
              <Label htmlFor="ai-toggle" className="font-medium">
                {isEnabled ? "AI Enabled" : "AI Disabled"}
              </Label>
            </div>
            <Button variant="outline" onClick={handleTest}>
              <Server className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="overview" className="flex-1">
              <BarChart className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="models" className="flex-1">
              <Database className="h-4 w-4 mr-2" />
              Models
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="training" className="flex-1">
              <Brain className="h-4 w-4 mr-2" />
              Training
            </TabsTrigger>
            <TabsTrigger value="system" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              System Info
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      AI System Overview
                    </CardTitle>
                    <CardDescription>
                      Current status and capabilities of the AI system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{allModels.length}</div>
                        <div className="text-sm text-muted-foreground">Available Models</div>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{loadedModels.length}</div>
                        <div className="text-sm text-muted-foreground">Loaded Models</div>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{AISystemInfo.languageSupport.primary.length}</div>
                        <div className="text-sm text-muted-foreground">Languages</div>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{AISystemInfo.capabilities.length}</div>
                        <div className="text-sm text-muted-foreground">Capabilities</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-2">AI Capabilities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {AISystemInfo.capabilities.map((capability, index) => (
                          <div key={index} className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                            <span className="text-sm">{capability}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-medium mb-2">System Status</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center bg-muted p-3 rounded-md">
                          <Badge variant={isEnabled ? "default" : "outline"} className="mr-2">
                            {isEnabled ? "Active" : "Inactive"}
                          </Badge>
                          <span>AI System Status</span>
                        </div>
                        
                        <div className="flex items-center bg-muted p-3 rounded-md">
                          <Badge variant={metrics.deviceType === 'webgpu' ? "default" : "outline"} className="mr-2">
                            {metrics.deviceType === 'webgpu' ? "GPU" : "CPU"}
                          </Badge>
                          <span>Processing Device</span>
                        </div>
                        
                        <div className="flex items-center bg-muted p-3 rounded-md">
                          <Badge variant="outline" className="mr-2">
                            {AISystemInfo.version}
                          </Badge>
                          <span>System Version</span>
                        </div>
                        
                        <div className="flex items-center bg-muted p-3 rounded-md">
                          <Badge variant="outline" className="mr-2">
                            {AISystemInfo.license}
                          </Badge>
                          <span>License</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("models")}>
                      <Database className="h-4 w-4 mr-2" />
                      Manage Models
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <AIMetrics metrics={metrics} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      System Recommendations
                    </CardTitle>
                    <CardDescription>
                      Suggestions to improve AI system performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {!aiSettings.useWebGPU && (
                        <div className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Enable WebGPU for faster processing</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Your device supports WebGPU acceleration. Enable it in settings to significantly improve AI performance.
                            </p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => setAISettings({...aiSettings, useWebGPU: true})}
                            >
                              Enable WebGPU
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {loadedModels.length === 0 && (
                        <div className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Load essential models</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              No models are currently loaded. Load at least one model from each category for basic functionality.
                            </p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => setActiveTab("models")}
                            >
                              Load Models
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Privacy protection active</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            All AI processing is done locally on the user's device. No data is sent to external servers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ArrowDownToLine className="h-5 w-5 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("models")}>
                      <Database className="h-4 w-4 mr-2" />
                      Load Models
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("training")}>
                      <Brain className="h-4 w-4 mr-2" />
                      Manage Training
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("settings")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={handleTest}>
                      <Server className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toggleAI()}>
                      <Zap className="h-4 w-4 mr-2" />
                      {isEnabled ? "Disable AI" : "Enable AI"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="models" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">AI Models</h2>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="feature-extraction">Feature Extraction</SelectItem>
                    <SelectItem value="text-classification">Text Classification</SelectItem>
                    <SelectItem value="translation">Translation</SelectItem>
                    <SelectItem value="automatic-speech-recognition">Speech Recognition</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Models</CardTitle>
                    <CardDescription>
                      Models that can be used for various language learning tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ModelList 
                      models={allModels}
                      loadedModels={loadedModels}
                      onLoadModel={handleLoadModel}
                      loadingModels={loadingModels}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                {selectedModel ? (
                  <ModelBenchmark model={selectedModel} />
                ) : (
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Model Benchmark</CardTitle>
                      <CardDescription>
                        Select a model to run performance tests
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                      <div className="text-center">
                        <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Select a model from the list to benchmark</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  AI System Settings
                </CardTitle>
                <CardDescription>
                  Configure how the AI system operates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="webgpu-toggle">Use WebGPU Acceleration</Label>
                          <Switch 
                            id="webgpu-toggle"
                            checked={aiSettings.useWebGPU}
                            onCheckedChange={(checked) => setAISettings({...aiSettings, useWebGPU: checked})}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Enables hardware acceleration for faster AI processing when available
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="autoload-toggle">Auto-Load Models</Label>
                          <Switch 
                            id="autoload-toggle"
                            checked={aiSettings.autoLoadModels}
                            onCheckedChange={(checked) => setAISettings({...aiSettings, autoLoadModels: checked})}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Automatically load essential models on startup
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cache-toggle">Cache Models</Label>
                          <Switch 
                            id="cache-toggle"
                            checked={aiSettings.cacheModels}
                            onCheckedChange={(checked) => setAISettings({...aiSettings, cacheModels: checked})}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Store models in browser cache to reduce loading time
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="default-language">Default Language</Label>
                        <Select 
                          value={aiSettings.defaultLanguage}
                          onValueChange={(value) => setAISettings({...aiSettings, defaultLanguage: value})}
                        >
                          <SelectTrigger id="default-language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="italian">Italian</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="auto">Auto-detect</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Primary language for AI processing
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="processing-setting">Processing Setting</Label>
                        <RadioGroup 
                          value={aiSettings.processingSetting}
                          onValueChange={(value) => setAISettings({...aiSettings, processingSetting: value})}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fast" id="processing-fast" />
                            <Label htmlFor="processing-fast">Fast (Lower quality, less memory)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="balanced" id="processing-balanced" />
                            <Label htmlFor="processing-balanced">Balanced (Recommended)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high-quality" id="processing-high-quality" />
                            <Label htmlFor="processing-high-quality">High Quality (Slower, more memory)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="model-size">Default Model Size</Label>
                        <Select 
                          value={aiSettings.defaultModelSize}
                          onValueChange={(value) => setAISettings({...aiSettings, defaultModelSize: value})}
                        >
                          <SelectTrigger id="model-size">
                            <SelectValue placeholder="Select model size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small (Fast, Basic)</SelectItem>
                            <SelectItem value="medium">Medium (Balanced)</SelectItem>
                            <SelectItem value="large">Large (High Quality)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Preferred model size when multiple options are available
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="optimization-level">Optimization Level</Label>
                          <span className="text-sm">{aiSettings.optimizationLevel}/10</span>
                        </div>
                        <Slider
                          id="optimization-level"
                          min={1}
                          max={10}
                          step={1}
                          value={[aiSettings.optimizationLevel]}
                          onValueChange={(value) => setAISettings({...aiSettings, optimizationLevel: value[0]})}
                        />
                        <p className="text-sm text-muted-foreground">
                          Balance between speed and accuracy (higher = more accurate but slower)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="log-level">Log Level</Label>
                        <Select 
                          value={aiSettings.logLevel}
                          onValueChange={(value) => setAISettings({...aiSettings, logLevel: value})}
                        >
                          <SelectTrigger id="log-level">
                            <SelectValue placeholder="Select log level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="error">Errors Only</SelectItem>
                            <SelectItem value="warning">Warnings & Errors</SelectItem>
                            <SelectItem value="info">Informational</SelectItem>
                            <SelectItem value="debug">Debug (Verbose)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Level of detail for AI system logging
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Advanced Settings</Label>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Setting</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Queue Size</TableCell>
                          <TableCell>
                            <Input type="number" value="10" className="w-20" />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            Maximum number of concurrent AI tasks
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Cache Expiration</TableCell>
                          <TableCell>
                            <Input type="number" value="7" className="w-20" />
                            <span className="ml-2">days</span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            How long to keep cached models
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Task Timeout</TableCell>
                          <TableCell>
                            <Input type="number" value="30" className="w-20" />
                            <span className="ml-2">seconds</span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            Maximum time for AI task completion
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleSaveSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Privacy &amp; Security
                </CardTitle>
                <CardDescription>
                  Configure privacy-related settings for the AI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Local Processing Only</h4>
                      <p className="text-sm text-muted-foreground">
                        Process all data on the client device without sending to external servers
                      </p>
                    </div>
                    <Switch checked={true} disabled />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Store User Interactions</h4>
                      <p className="text-sm text-muted-foreground">
                        Save interaction history to improve AI training
                      </p>
                    </div>
                    <Switch checked={false} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Anonymous Analytics</h4>
                      <p className="text-sm text-muted-foreground">
                        Collect anonymous usage data to improve system performance
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Content Filtering</h4>
                      <p className="text-sm text-muted-foreground">
                        Filter inappropriate content in AI responses
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Edit Data Sharing Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="training">
            <AITrainingManagerWrapper />
          </TabsContent>
          
          <TabsContent value="system">
            <AISystemInfoPanel />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AIManagement;
