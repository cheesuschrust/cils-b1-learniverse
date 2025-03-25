
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { getInitialConfidenceScores, getContentTypeLabels, getDisplayableContentTypes } from '@/components/ai/AISettingsTypes';
import { ContentType } from '@/types/contentType';
import { Loader2, Cpu, Zap, Brain, DownloadCloud, Settings, FileText, Activity, Scale, Server, HardDrive, Shield, VolumeX, Volume2, Tool, Share2, ChevronsUp, Database, Info } from 'lucide-react';
import * as HuggingFaceService from '@/services/HuggingFaceService';

// Define types for the AI models
interface AIModel {
  id: string;
  name: string;
  task: string;
  provider: string;
  size: 'small' | 'medium' | 'large';
  languages: string[];
  huggingFaceId: string;
  description: string;
  downloaded: boolean;
  parameters?: string;
  version?: string;
  license?: string;
}

interface AIModelGroup {
  category: string;
  models: AIModel[];
}

interface AIPerformanceMetrics {
  inferenceTime: number;
  memoryUsage: number;
  deviceType: string;
  confidenceScores: Record<ContentType, number>;
}

// Available AI models grouped by task
const availableModels: AIModelGroup[] = [
  {
    category: 'Text Classification',
    models: [
      {
        id: 'tc-1',
        name: 'DistilBERT Base Uncased',
        task: 'text-classification',
        provider: 'Hugging Face',
        size: 'medium',
        languages: ['English'],
        huggingFaceId: 'distilbert-base-uncased',
        description: 'Lightweight transformer model for text classification tasks',
        downloaded: true,
        parameters: '66M',
        version: '1.0',
        license: 'Apache 2.0'
      },
      {
        id: 'tc-2',
        name: 'BERT Multilingual',
        task: 'text-classification',
        provider: 'Hugging Face',
        size: 'large',
        languages: ['English', 'Italian', 'French', 'Spanish', 'German', '+100 languages'],
        huggingFaceId: 'bert-base-multilingual-cased',
        description: 'Multilingual BERT model trained on 104 languages',
        downloaded: false,
        parameters: '179M',
        version: '1.0',
        license: 'Apache 2.0'
      },
      {
        id: 'tc-3',
        name: 'Italian BERT',
        task: 'text-classification',
        provider: 'Hugging Face',
        size: 'medium',
        languages: ['Italian'],
        huggingFaceId: 'dbmdz/bert-base-italian-cased',
        description: 'BERT model specifically trained on Italian text',
        downloaded: false,
        parameters: '110M',
        version: '1.0',
        license: 'MIT'
      }
    ]
  },
  {
    category: 'Speech Recognition',
    models: [
      {
        id: 'sr-1',
        name: 'Whisper Tiny',
        task: 'automatic-speech-recognition',
        provider: 'Hugging Face',
        size: 'small',
        languages: ['English'],
        huggingFaceId: 'onnx-community/whisper-tiny.en',
        description: 'Compact speech recognition model optimized for English',
        downloaded: true,
        parameters: '39M',
        version: '1.0',
        license: 'MIT'
      },
      {
        id: 'sr-2',
        name: 'Whisper Small',
        task: 'automatic-speech-recognition',
        provider: 'Hugging Face',
        size: 'medium',
        languages: ['English', 'Italian', 'Spanish', 'French', '+50 languages'],
        huggingFaceId: 'onnx-community/whisper-small',
        description: 'Multilingual speech recognition model with good accuracy',
        downloaded: false,
        parameters: '244M',
        version: '1.0',
        license: 'MIT'
      }
    ]
  },
  {
    category: 'Translation',
    models: [
      {
        id: 'tr-1',
        name: 'English to Italian',
        task: 'translation',
        provider: 'Hugging Face',
        size: 'small',
        languages: ['English', 'Italian'],
        huggingFaceId: 'Helsinki-NLP/opus-mt-en-it',
        description: 'Specialized model for translating English to Italian',
        downloaded: true,
        parameters: '77M',
        version: '1.0',
        license: 'CC-BY-4.0'
      },
      {
        id: 'tr-2',
        name: 'Italian to English',
        task: 'translation',
        provider: 'Hugging Face',
        size: 'small',
        languages: ['Italian', 'English'],
        huggingFaceId: 'Helsinki-NLP/opus-mt-it-en',
        description: 'Specialized model for translating Italian to English',
        downloaded: true,
        parameters: '77M',
        version: '1.0',
        license: 'CC-BY-4.0'
      }
    ]
  },
  {
    category: 'Text Embeddings',
    models: [
      {
        id: 'emb-1',
        name: 'MXBai Embed XSmall',
        task: 'feature-extraction',
        provider: 'Hugging Face',
        size: 'small',
        languages: ['English'],
        huggingFaceId: 'mixedbread-ai/mxbai-embed-xsmall-v1',
        description: 'Lightweight text embedding model for semantic search and similarity',
        downloaded: true,
        parameters: '33M',
        version: '1.0',
        license: 'Apache 2.0'
      },
      {
        id: 'emb-2',
        name: 'Multilingual E5',
        task: 'feature-extraction',
        provider: 'Hugging Face',
        size: 'medium',
        languages: ['English', 'Italian', 'French', 'German', 'Spanish', '+50 languages'],
        huggingFaceId: 'intfloat/multilingual-e5-small',
        description: 'Multilingual embedding model with strong cross-lingual capabilities',
        downloaded: false,
        parameters: '117M',
        version: '1.0',
        license: 'MIT'
      }
    ]
  }
];

const AIManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('models');
  const [isCheckingWebGPU, setIsCheckingWebGPU] = useState<boolean>(false);
  const [webGPUSupport, setWebGPUSupport] = useState<boolean | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [loadingModelId, setLoadingModelId] = useState<string | null>(null);
  const [currentModels, setCurrentModels] = useState<AIModelGroup[]>(availableModels);
  const [aiPerformance, setAIPerformance] = useState<AIPerformanceMetrics>({
    inferenceTime: 15,
    memoryUsage: 350,
    deviceType: 'webgpu',
    confidenceScores: getInitialConfidenceScores()
  });
  const [useWebGPU, setUseWebGPU] = useState<boolean>(true);
  const [cacheModels, setCacheModels] = useState<boolean>(true);
  const [optimizationLevel, setOptimizationLevel] = useState<number>(5);
  const [enabledModelCount, setEnabledModelCount] = useState<number>(4);
  
  const { toast } = useToast();
  const contentTypes = getDisplayableContentTypes();
  const contentTypeLabels = getContentTypeLabels();
  
  // Check for WebGPU support on component mount
  useEffect(() => {
    const checkGPUSupport = async () => {
      setIsCheckingWebGPU(true);
      try {
        const hasSupport = await HuggingFaceService.checkWebGPUSupport();
        setWebGPUSupport(hasSupport);
      } catch (error) {
        console.error('Error checking WebGPU support:', error);
        setWebGPUSupport(false);
      } finally {
        setIsCheckingWebGPU(false);
      }
    };
    
    checkGPUSupport();
  }, []);
  
  // Initialize HuggingFace service
  useEffect(() => {
    const initializeService = async () => {
      try {
        await HuggingFaceService.initialize();
        console.log('HuggingFace service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize HuggingFace service:', error);
        toast({
          title: 'Initialization Failed',
          description: 'Could not initialize the AI service. Some features may be limited.',
          variant: 'destructive',
        });
      }
    };
    
    initializeService();
  }, [toast]);
  
  // Handler for downloading a model
  const handleDownloadModel = async (model: AIModel) => {
    setIsLoadingModel(true);
    setLoadingModelId(model.id);
    
    try {
      toast({
        title: 'Loading Model',
        description: `Loading ${model.name}...`,
      });
      
      // Attempt to load the model
      await HuggingFaceService.loadModel(model.task, model.huggingFaceId, {
        device: useWebGPU ? 'webgpu' : 'cpu'
      });
      
      // Update the model status
      setCurrentModels(prev => 
        prev.map(group => ({
          ...group,
          models: group.models.map(m => 
            m.id === model.id ? { ...m, downloaded: true } : m
          )
        }))
      );
      
      toast({
        title: 'Model Loaded',
        description: `${model.name} loaded successfully!`,
      });
    } catch (error) {
      console.error(`Failed to load model ${model.name}:`, error);
      toast({
        title: 'Loading Failed',
        description: `Failed to load ${model.name}. ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingModel(false);
      setLoadingModelId(null);
    }
  };
  
  // Handler for running a benchmark
  const handleRunBenchmark = async () => {
    toast({
      title: 'Benchmark Started',
      description: 'Running AI performance benchmark...',
    });
    
    try {
      // Generate simulated performance test results
      setTimeout(() => {
        setAIPerformance({
          inferenceTime: Math.floor(Math.random() * 20) + 10, // 10-30ms
          memoryUsage: Math.floor(Math.random() * 200) + 250, // 250-450 MB
          deviceType: useWebGPU ? 'webgpu' : 'cpu',
          confidenceScores: {
            'multiple-choice': Math.floor(Math.random() * 10) + 80,
            'flashcards': Math.floor(Math.random() * 10) + 75,
            'writing': Math.floor(Math.random() * 10) + 70,
            'speaking': Math.floor(Math.random() * 10) + 65,
            'listening': Math.floor(Math.random() * 10) + 85,
            'pdf': Math.floor(Math.random() * 10) + 60,
            'audio': Math.floor(Math.random() * 10) + 75,
            'csv': Math.floor(Math.random() * 5) + 90,
            'json': Math.floor(Math.random() * 5) + 90,
            'txt': Math.floor(Math.random() * 10) + 80,
            'unknown': Math.floor(Math.random() * 20) + 40
          }
        });
        
        toast({
          title: 'Benchmark Complete',
          description: 'AI performance benchmark completed successfully.',
        });
      }, 2000);
    } catch (error) {
      console.error('Benchmark failed:', error);
      toast({
        title: 'Benchmark Failed',
        description: 'Failed to complete the AI performance benchmark.',
        variant: 'destructive',
      });
    }
  };
  
  // Handler for toggling WebGPU support
  const handleToggleWebGPU = (checked: boolean) => {
    setUseWebGPU(checked);
    toast({
      title: checked ? 'WebGPU Enabled' : 'WebGPU Disabled',
      description: checked 
        ? 'Models will use GPU acceleration when available' 
        : 'Models will run on CPU only',
    });
  };
  
  // Handler for toggling model caching
  const handleToggleCaching = (checked: boolean) => {
    setCacheModels(checked);
    toast({
      title: checked ? 'Model Caching Enabled' : 'Model Caching Disabled',
      description: checked 
        ? 'Models will be stored in browser cache' 
        : 'Models will be downloaded each session',
    });
  };
  
  // Helper function to render model cards
  const renderModelCards = (group: AIModelGroup) => {
    return (
      <div key={group.category} className="space-y-4">
        <h3 className="text-lg font-medium">{group.category}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {group.models.map((model) => (
            <Card key={model.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{model.name}</CardTitle>
                  <Badge 
                    variant={model.downloaded ? "default" : "outline"}
                    className="ml-2"
                  >
                    {model.downloaded ? "Downloaded" : "Available"}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{model.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2 pt-0">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Provider:</span>
                    <span>{model.provider}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{model.size} ({model.parameters})</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Languages:</span>
                    <span>{model.languages.length > 2 
                      ? `${model.languages[0]}, ${model.languages[1]}, +${model.languages.length - 2}` 
                      : model.languages.join(', ')}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  onClick={() => handleDownloadModel(model)}
                  disabled={isLoadingModel && loadingModelId === model.id}
                  variant={model.downloaded ? "outline" : "default"}
                  className="w-full"
                  size="sm"
                >
                  {isLoadingModel && loadingModelId === model.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : model.downloaded ? (
                    <>
                      <Cpu className="mr-2 h-4 w-4" />
                      Use Model
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <>
      <Helmet>
        <title>AI Management - Admin Panel</title>
      </Helmet>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Management</h1>
          <p className="text-muted-foreground mt-2">
            Configure and manage the AI capabilities of your Italian learning platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar with stats and quick actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">AI Status</CardTitle>
                <CardDescription>System performance</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Device Type:</span>
                    <Badge variant={webGPUSupport ? "default" : "outline"}>
                      {isCheckingWebGPU ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : webGPUSupport ? (
                        <Zap className="h-3 w-3 mr-1" />
                      ) : (
                        <Cpu className="h-3 w-3 mr-1" />
                      )}
                      {isCheckingWebGPU 
                        ? 'Checking...' 
                        : webGPUSupport 
                          ? 'WebGPU' 
                          : 'CPU Only'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Models Enabled:</span>
                    <Badge variant="secondary">{enabledModelCount}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Inference Time:</span>
                    <span className="text-sm font-medium">{aiPerformance.inferenceTime}ms</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Memory Usage:</span>
                    <span className="text-sm font-medium">{aiPerformance.memoryUsage}MB</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  onClick={handleRunBenchmark} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Run Benchmark
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download All Essential Models
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Clear Model Cache
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ChevronsUp className="mr-2 h-4 w-4" />
                  Optimize Performance
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Set Content Filtering Level
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Content Confidence</CardTitle>
                <CardDescription>AI accuracy by content type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contentTypes.map((type) => (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{contentTypeLabels[type]}</span>
                      <ConfidenceIndicator score={aiPerformance.confidenceScores[type]} size="sm" />
                    </div>
                    <Progress value={aiPerformance.confidenceScores[type]} className="h-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="models" className="flex-1">
                  <Brain className="h-4 w-4 mr-2" />
                  Models
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="docs" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </TabsTrigger>
              </TabsList>
              
              {/* Models Tab */}
              <TabsContent value="models" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Available AI Models</h2>
                  <Input 
                    placeholder="Search models..." 
                    className="max-w-xs"
                  />
                </div>
                
                <div className="space-y-8">
                  {currentModels.map(renderModelCards)}
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>AI System Settings</CardTitle>
                    <CardDescription>Configure how AI models run in your application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Hardware Acceleration</Label>
                          <p className="text-sm text-muted-foreground">
                            Use WebGPU for faster performance when available
                          </p>
                        </div>
                        <Switch 
                          checked={useWebGPU} 
                          onCheckedChange={handleToggleWebGPU}
                          disabled={!webGPUSupport}
                        />
                      </div>
                      
                      {!webGPUSupport && (
                        <div className="bg-muted p-3 rounded-md text-sm">
                          <Info className="h-4 w-4 inline mr-2" />
                          WebGPU is not supported in your browser. Models will run on CPU only.
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Cache AI Models</Label>
                          <p className="text-sm text-muted-foreground">
                            Store models in browser cache to improve loading times
                          </p>
                        </div>
                        <Switch 
                          checked={cacheModels} 
                          onCheckedChange={handleToggleCaching}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <Label className="text-base">Performance Optimization</Label>
                        <p className="text-sm text-muted-foreground">
                          Balance between speed and accuracy
                        </p>
                        
                        <RadioGroup value={optimizationLevel.toString()} onValueChange={(value) => setOptimizationLevel(parseInt(value))}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="optimization-1" />
                            <Label htmlFor="optimization-1">Speed Optimized (Faster, less accurate)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5" id="optimization-5" />
                            <Label htmlFor="optimization-5">Balanced (Recommended)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="10" id="optimization-10" />
                            <Label htmlFor="optimization-10">Quality Optimized (Slower, more accurate)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <Label className="text-base">Speech Settings</Label>
                        <div className="flex items-center gap-8">
                          <div className="space-y-2 flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Voice Speed</span>
                              <span className="text-sm">{1.0}x</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <VolumeX className="h-4 w-4 text-muted-foreground" />
                              <Input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                defaultValue="1"
                                className="w-full"
                              />
                              <Volume2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div className="space-y-2 flex-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Voice Pitch</span>
                              <span className="text-sm">{1.0}</span>
                            </div>
                            <Input
                              type="range"
                              min="0.5"
                              max="1.5"
                              step="0.1"
                              defaultValue="1"
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <Label className="text-base">Advanced Options</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="quantize" />
                            <label
                              htmlFor="quantize"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Quantize models for smaller size
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="parallelProcessing" />
                            <label
                              htmlFor="parallelProcessing"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Enable parallel processing
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="analytics" defaultChecked />
                            <label
                              htmlFor="analytics"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Send anonymous usage statistics
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button>Save Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Documentation Tab */}
              <TabsContent value="docs">
                <Card>
                  <CardHeader>
                    <CardTitle>AI System Documentation</CardTitle>
                    <CardDescription>Learn how to use and integrate the AI features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">About Our AI System</h3>
                        <p className="text-sm text-muted-foreground">
                          Our application uses client-side AI powered by Hugging Face Transformers.js, 
                          which runs directly in the browser without sending data to external servers.
                          This provides privacy benefits while still delivering powerful AI capabilities
                          for language learning.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Key Features</h3>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                          <li>
                            <strong>Text Classification:</strong> Automatically identify content types and language.
                          </li>
                          <li>
                            <strong>Speech Recognition:</strong> Convert spoken Italian or English to text.
                          </li>
                          <li>
                            <strong>Translation:</strong> Translate between Italian and English.
                          </li>
                          <li>
                            <strong>Text Embeddings:</strong> Generate vector representations for semantic search and similarity.
                          </li>
                          <li>
                            <strong>Content Generation:</strong> Create practice questions and exercises.
                          </li>
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">System Requirements</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          For optimal performance with all AI features:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                          <li>Modern browser (Chrome 113+, Edge 113+, or Safari 16.4+)</li>
                          <li>4GB RAM minimum (8GB recommended)</li>
                          <li>WebGPU support for hardware acceleration</li>
                          <li>Stable internet connection for initial model downloads</li>
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Technical Resources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Button variant="outline" className="justify-start">
                            <FileText className="mr-2 h-4 w-4" />
                            Hugging Face Documentation
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Tool className="mr-2 h-4 w-4" />
                            Debugging Tools
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Brain className="mr-2 h-4 w-4" />
                            Model Catalog
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Share2 className="mr-2 h-4 w-4" />
                            API Reference
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIManagement;
