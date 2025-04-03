
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Bot, 
  Settings, 
  AlertTriangle, 
  Save, 
  BarChart as BarChartIcon,
  RefreshCw, 
  Check, 
  X, 
  RotateCw,
  Sliders, 
  Server,
  Database,
  Webhook,
  Cpu,
  GitBranch
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AIModel {
  id: string;
  model_name: string;
  version: string;
  accuracy: number;
  confidence_score: number;
  training_date: string | null;
  metrics: any;
  created_at: string;
  updated_at: string;
}

const AIManagement = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProvider, setActiveProvider] = useState('openai');
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  const { toast } = useToast();
  
  const perfData = [
    { date: '2023-01', accuracy: 85, confidence: 72, errors: 15 },
    { date: '2023-02', accuracy: 87, confidence: 75, errors: 13 },
    { date: '2023-03', accuracy: 86, confidence: 74, errors: 14 },
    { date: '2023-04', accuracy: 89, confidence: 78, errors: 11 },
    { date: '2023-05', accuracy: 91, confidence: 82, errors: 9 },
    { date: '2023-06', accuracy: 93, confidence: 85, errors: 7 },
  ];
  
  // Mock error analysis data
  const errorCategories = [
    { category: 'Grammar Classification', count: 23, percentage: 38 },
    { category: 'Word Sense Disambiguation', count: 18, percentage: 30 },
    { category: 'Cultural Context', count: 12, percentage: 20 },
    { category: 'Idiomatic Expressions', count: 7, percentage: 12 },
  ];
  
  useEffect(() => {
    fetchModels();
  }, []);
  
  const fetchModels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_model_performance')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setModels(data);
      }
    } catch (error) {
      console.error('Error fetching AI models:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch AI models. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const simulateModelTraining = () => {
    setIsTrainingModel(true);
    setTrainingProgress(0);
    
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTrainingModel(false);
          
          toast({
            title: 'Training Complete',
            description: 'The AI model has been trained successfully.',
          });
          
          // Add new model to the list
          const newModel = {
            id: `model-${Date.now()}`,
            model_name: 'Italian GPT',
            version: `1.${models.length + 1}`,
            accuracy: 94.5,
            confidence_score: 86.2,
            training_date: new Date().toISOString(),
            metrics: {
              precision: 0.92,
              recall: 0.89,
              f1_score: 0.90,
              training_samples: 2450,
              training_time_minutes: 35
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          setModels(prev => [newModel, ...prev]);
          
          return 0;
        }
        return prev + 2;
      });
    }, 300);
    
    return () => clearInterval(interval);
  };
  
  return (
    <div className="space-y-6">
      <Helmet>
        <title>AI Management - Admin</title>
      </Helmet>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Management</h1>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchModels}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          <Button onClick={simulateModelTraining} disabled={isTrainingModel}>
            {isTrainingModel ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Cpu className="mr-2 h-4 w-4" />
                Train New Model
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isTrainingModel && (
        <Card className="border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span className="flex items-center">
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Training in Progress
              </span>
              <span className="text-sm">{trainingProgress}%</span>
            </CardTitle>
            <CardDescription>
              Training a new version of the Italian language model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={trainingProgress} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Training Data</p>
                <p className="text-xl font-semibold">2,450</p>
                <p className="text-xs text-muted-foreground">samples</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Model Size</p>
                <p className="text-xl font-semibold">1.2B</p>
                <p className="text-xs text-muted-foreground">parameters</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Training Mode</p>
                <p className="text-xl font-semibold">Fine-tune</p>
                <p className="text-xs text-muted-foreground">from base model</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">ETA</p>
                <p className="text-xl font-semibold">{Math.ceil((100 - trainingProgress) / 2)}</p>
                <p className="text-xs text-muted-foreground">minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="models">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          <TabsTrigger value="training">Training Pipeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Models</CardTitle>
              <CardDescription>
                Manage and monitor AI models and their performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Training Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 ml-auto"></div></TableCell>
                      </TableRow>
                    ))
                  ) : models.length > 0 ? (
                    models.map((model, index) => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">{model.model_name}</TableCell>
                        <TableCell>v{model.version}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={model.accuracy >= 90 ? 'text-green-600' : 'text-amber-600'}>
                              {model.accuracy}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={model.confidence_score >= 80 ? 'text-green-600' : 'text-amber-600'}>
                              {model.confidence_score}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {model.training_date ? new Date(model.training_date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={index === 0 ? 'default' : 'outline'}>
                            {index === 0 ? 'Active' : 'Archived'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {index !== 0 && (
                              <Button variant="outline" size="sm">
                                Activate
                              </Button>
                            )}
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <GitBranch className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No AI models found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={models.slice(0, 3).map(m => ({
                        name: `v${m.version}`,
                        accuracy: m.accuracy,
                        confidence: m.confidence_score
                      }))}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="accuracy" name="Accuracy" fill="#4f46e5" />
                      <Bar dataKey="confidence" name="Confidence" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Metrics Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {models.length > 0 && models[0].metrics ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Precision</span>
                        <span className="font-medium">{models[0].metrics.precision?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <Progress value={models[0].metrics.precision * 100 || 0} className="h-2 mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Recall</span>
                        <span className="font-medium">{models[0].metrics.recall?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <Progress value={models[0].metrics.recall * 100 || 0} className="h-2 mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>F1 Score</span>
                        <span className="font-medium">{models[0].metrics.f1_score?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <Progress value={models[0].metrics.f1_score * 100 || 0} className="h-2 mt-1" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No metrics available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model Details</CardTitle>
              </CardHeader>
              <CardContent>
                {models.length > 0 ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Training Samples:</span>
                      <span className="font-medium">{models[0].metrics?.training_samples || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Training Time:</span>
                      <span className="font-medium">{models[0].metrics?.training_time_minutes || 'N/A'} minutes</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Model Size:</span>
                      <span className="font-medium">1.2B parameters</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Base Model:</span>
                      <span className="font-medium">GPT-3.5</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {new Date(models[0].created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(models[0].updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No model details available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  View Full Specification
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Provider Settings</CardTitle>
              <CardDescription>
                Configure your AI model providers and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Active Provider</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select which AI provider to use for inference.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${activeProvider === 'openai' ? 'border-primary bg-primary/5' : ''}`} onClick={() => setActiveProvider('openai')}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">OpenAI</h4>
                      {activeProvider === 'openai' && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">GPT-4 based models</p>
                  </div>
                  
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${activeProvider === 'azure' ? 'border-primary bg-primary/5' : ''}`} onClick={() => setActiveProvider('azure')}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Azure OpenAI</h4>
                      {activeProvider === 'azure' && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Self-hosted GPT models</p>
                  </div>
                  
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${activeProvider === 'custom' ? 'border-primary bg-primary/5' : ''}`} onClick={() => setActiveProvider('custom')}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Custom Model</h4>
                      {activeProvider === 'custom' && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Self-trained Italian model</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Model Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Configure parameters and thresholds for the AI model.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                        <span className="text-muted-foreground">{confidenceThreshold}%</span>
                      </div>
                      <Slider
                        id="confidence-threshold"
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[70]}
                        value={[confidenceThreshold]}
                        onValueChange={(value) => setConfidenceThreshold(value[0])}
                        className="mb-6"
                      />
                      <p className="text-xs text-muted-foreground">
                        Responses below this confidence threshold will be flagged for human review.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <Select defaultValue="0.7">
                        <SelectTrigger id="temperature">
                          <SelectValue placeholder="Select temperature" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.3">0.3 (More focused)</SelectItem>
                          <SelectItem value="0.5">0.5</SelectItem>
                          <SelectItem value="0.7">0.7 (Balanced)</SelectItem>
                          <SelectItem value="0.9">0.9</SelectItem>
                          <SelectItem value="1.0">1.0 (More creative)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Max Tokens</Label>
                      <Select defaultValue="1024">
                        <SelectTrigger id="max-tokens">
                          <SelectValue placeholder="Select max tokens" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="256">256</SelectItem>
                          <SelectItem value="512">512</SelectItem>
                          <SelectItem value="1024">1,024</SelectItem>
                          <SelectItem value="2048">2,048</SelectItem>
                          <SelectItem value="4096">4,096</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-correct">Auto-Correction</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically correct minor errors in user input
                        </p>
                      </div>
                      <Switch id="auto-correct" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="confidence-score">Show Confidence Score</Label>
                        <p className="text-xs text-muted-foreground">
                          Display confidence score to users with responses
                        </p>
                      </div>
                      <Switch id="confidence-score" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="fallback">Human Fallback</Label>
                        <p className="text-xs text-muted-foreground">
                          Use human review for low-confidence responses
                        </p>
                      </div>
                      <Switch id="fallback" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="logging">Enhanced Logging</Label>
                        <p className="text-xs text-muted-foreground">
                          Log detailed model interactions for analysis
                        </p>
                      </div>
                      <Switch id="logging" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input id="api-key" type="password" value="●●●●●●●●●●●●●●●●●●" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-endpoint">API Endpoint</Label>
                    <Input id="api-endpoint" defaultValue="https://api.openai.com/v1" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>
                Configure webhook endpoints and third-party integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Webhook Endpoint</Label>
                    <div className="flex space-x-2">
                      <Input defaultValue="https://example.com/api/italian-ai-webhook" />
                      <Button variant="outline" size="icon">
                        <Webhook className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications when model predictions require review.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Authentication</Label>
                    <Select defaultValue="bearer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select auth type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="api-key">API Key</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Secret Token</Label>
                    <Input type="password" value="●●●●●●●●●●●●●●●●●●" />
                  </div>
                </div>
                
                <div>
                  <div className="space-y-2 mb-4">
                    <Label>Event Types</Label>
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="low-confidence" defaultChecked />
                        <Label htmlFor="low-confidence">Low Confidence Predictions</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="errors" defaultChecked />
                        <Label htmlFor="errors">Error Events</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="model-updates" defaultChecked />
                        <Label htmlFor="model-updates">Model Updates</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="training-complete" />
                        <Label htmlFor="training-complete">Training Completion</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="user-feedback" />
                        <Label htmlFor="user-feedback">User Feedback</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Server className="mr-2 h-4 w-4" />
                    Test Webhook
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Track AI model performance over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={perfData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#4f46e5" strokeWidth={2} />
                    <Line type="monotone" dataKey="confidence" name="Confidence %" stroke="#06b6d4" strokeWidth={2} />
                    <Line type="monotone" dataKey="errors" name="Errors" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Accuracy</p>
                        <p className="text-2xl font-bold">92.4%</p>
                      </div>
                      <Badge variant={92.4 >= 90 ? 'default' : 'outline'} className="ml-auto">
                        +2.5%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Response Time</p>
                        <p className="text-2xl font-bold">0.45s</p>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        -0.12s
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Error Rate</p>
                        <p className="text-2xl font-bold">2.3%</p>
                      </div>
                      <Badge variant="default" className="bg-green-600 ml-auto">
                        -1.2%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Type Performance</CardTitle>
                <CardDescription>
                  AI model accuracy across different content types.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Grammar Exercises</span>
                      <span className="font-medium">94.5%</span>
                    </div>
                    <Progress value={94.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Vocabulary Questions</span>
                      <span className="font-medium">92.8%</span>
                    </div>
                    <Progress value={92.8} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Conversation Analysis</span>
                      <span className="font-medium">89.2%</span>
                    </div>
                    <Progress value={89.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reading Comprehension</span>
                      <span className="font-medium">87.5%</span>
                    </div>
                    <Progress value={87.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cultural References</span>
                      <span className="font-medium">85.1%</span>
                    </div>
                    <Progress value={85.1} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Feedback</CardTitle>
                <CardDescription>
                  User satisfaction with AI-generated responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Helpful</span>
                    </div>
                    <span className="font-medium">78.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Somewhat Helpful</span>
                    </div>
                    <span className="font-medium">15.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Not Helpful</span>
                    </div>
                    <span className="font-medium">6.3%</span>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Top Feedback Categories</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accuracy of Explanations</span>
                        <span className="text-green-600">+24%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Clarity of Responses</span>
                        <span className="text-green-600">+18%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cultural Context</span>
                        <span className="text-red-600">-12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Analysis</CardTitle>
              <CardDescription>
                Identify and analyze error patterns to improve model performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-medium mb-4">Error Categories</h3>
                    <div className="space-y-4">
                      {errorCategories.map((category, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{category.category}</span>
                            <span className="font-medium">{category.count} errors ({category.percentage}%)</span>
                          </div>
                          <Progress value={category.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-4">Error Trend</h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { month: 'Jan', errors: 28 },
                          { month: 'Feb', errors: 25 },
                          { month: 'Mar', errors: 22 },
                          { month: 'Apr', errors: 19 },
                          { month: 'May', errors: 15 },
                          { month: 'Jun', errors: 12 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="errors" name="Error Count" stroke="#ef4444" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        -57% errors over 6 months
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-4">Recent Errors</h3>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Error Type</TableHead>
                          <TableHead>User Input</TableHead>
                          <TableHead>AI Response</TableHead>
                          <TableHead>Expected</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Grammar Classification</TableCell>
                          <TableCell>"Ho mangiato un panino ieri"</TableCell>
                          <TableCell>Present Tense</TableCell>
                          <TableCell>Past Tense</TableCell>
                          <TableCell>62%</TableCell>
                          <TableCell>2h ago</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Word Sense</TableCell>
                          <TableCell>"Sono andato in banca"</TableCell>
                          <TableCell>River Bank</TableCell>
                          <TableCell>Financial Bank</TableCell>
                          <TableCell>58%</TableCell>
                          <TableCell>5h ago</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Cultural Context</TableCell>
                          <TableCell>"Facciamo aperitivo"</TableCell>
                          <TableCell>Let's have drinks</TableCell>
                          <TableCell>Let's have pre-dinner drinks & snacks</TableCell>
                          <TableCell>72%</TableCell>
                          <TableCell>12h ago</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">
                <BarChartIcon className="mr-2 h-4 w-4" />
                View Full Error Report
              </Button>
            </CardFooter>
          </Card>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Auto-detection flagged potential issues</AlertTitle>
            <AlertDescription>
              Our system has identified a pattern of increased errors in cultural context translations. 
              Consider adding more training data for these specific scenarios.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Pipeline</CardTitle>
              <CardDescription>
                Configure and manage the AI model training pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Training Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Grammar Examples</span>
                          <span className="font-medium">1,250</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Vocabulary</span>
                          <span className="font-medium">3,500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Conversations</span>
                          <span className="font-medium">850</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cultural References</span>
                          <span className="font-medium">620</span>
                        </div>
                        <div className="pt-2 mt-2 border-t">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Total Examples</span>
                            <span>6,220</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        <Database className="mr-2 h-3 w-3" />
                        Manage Data
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Training Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Auto-training</p>
                            <p className="text-xs text-muted-foreground">Weekly on new data</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Full retraining</p>
                            <p className="text-xs text-muted-foreground">Monthly</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Low-resource mode</p>
                            <p className="text-xs text-muted-foreground">Save GPU resources</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="mr-2 h-3 w-3" />
                        Configure
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Last Training</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Date</span>
                          <span className="font-medium">June 15, 2023</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Duration</span>
                          <span className="font-medium">35 minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Samples</span>
                          <span className="font-medium">2,450</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Result</span>
                          <Badge variant="outline" className="ml-auto">Success</Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button size="sm" className="w-full" onClick={simulateModelTraining} disabled={isTrainingModel}>
                        {isTrainingModel ? (
                          <>
                            <RotateCw className="mr-2 h-3 w-3 animate-spin" />
                            Training...
                          </>
                        ) : (
                          <>
                            <RotateCw className="mr-2 h-3 w-3" />
                            Train Now
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Training Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="base-model">Base Model</Label>
                          <Select defaultValue="gpt-3.5">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a base model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="llama-2">LLaMA 2</SelectItem>
                              <SelectItem value="mistral">Mistral</SelectItem>
                              <SelectItem value="custom">Custom Model</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="training-method">Training Method</Label>
                          <Select defaultValue="fine-tuning">
                            <SelectTrigger>
                              <SelectValue placeholder="Select training method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fine-tuning">Fine-tuning</SelectItem>
                              <SelectItem value="rlhf">Reinforcement Learning (RLHF)</SelectItem>
                              <SelectItem value="dpo">Direct Preference Optimization</SelectItem>
                              <SelectItem value="full">Full Model Training</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="epochs">Training Epochs</Label>
                          <Select defaultValue="3">
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of epochs" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Epoch</SelectItem>
                              <SelectItem value="2">2 Epochs</SelectItem>
                              <SelectItem value="3">3 Epochs</SelectItem>
                              <SelectItem value="4">4 Epochs</SelectItem>
                              <SelectItem value="5">5 Epochs</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="learning-rate">Learning Rate</Label>
                          <Select defaultValue="5e-5">
                            <SelectTrigger>
                              <SelectValue placeholder="Select learning rate" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1e-5">1e-5 (Very Low)</SelectItem>
                              <SelectItem value="5e-5">5e-5 (Low)</SelectItem>
                              <SelectItem value="1e-4">1e-4 (Medium)</SelectItem>
                              <SelectItem value="5e-4">5e-4 (High)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="batch-size">Batch Size</Label>
                          <Select defaultValue="16">
                            <SelectTrigger>
                              <SelectValue placeholder="Select batch size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="16">16</SelectItem>
                              <SelectItem value="32">32</SelectItem>
                              <SelectItem value="64">64</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="use-gpu">Use GPU Acceleration</Label>
                            <Switch id="use-gpu" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <Label htmlFor="distributed">Distributed Training</Label>
                            <Switch id="distributed" />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <Label htmlFor="save-checkpoints">Save Checkpoints</Label>
                            <Switch id="save-checkpoints" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button variant="outline">Reset Defaults</Button>
                    <Button>Save Configuration</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIManagement;
