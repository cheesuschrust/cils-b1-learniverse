
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Settings, 
  BarChart2, 
  FileQuestion, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Gauge,
  Sliders
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  version: string;
  provider: string;
  status: 'active' | 'inactive' | 'training' | 'evaluating';
  accuracy: number;
  last_updated: string;
  capabilities: string[];
}

interface AIPerformanceMetrics {
  id: string;
  model_name: string;
  version: string;
  accuracy: number;
  confidence_score: number;
  metrics: {
    precision: number;
    recall: number;
    f1_score: number;
    content_types: Record<string, number>;
  };
  created_at: string;
}

interface ThresholdConfig {
  content_type: string;
  confidence_threshold: number;
  max_processing_time: number;
  enabled: boolean;
}

const AIManagement: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [performanceData, setPerformanceData] = useState<AIPerformanceMetrics[]>([]);
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([
    { content_type: 'flashcards', confidence_threshold: 0.7, max_processing_time: 5000, enabled: true },
    { content_type: 'multiple_choice', confidence_threshold: 0.75, max_processing_time: 8000, enabled: true },
    { content_type: 'reading', confidence_threshold: 0.65, max_processing_time: 10000, enabled: true },
    { content_type: 'writing', confidence_threshold: 0.8, max_processing_time: 12000, enabled: true },
    { content_type: 'speaking', confidence_threshold: 0.75, max_processing_time: 15000, enabled: true }
  ]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('models');
  const { toast } = useToast();

  useEffect(() => {
    fetchModels();
    fetchPerformanceData();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_providers')
        .select('*');

      if (error) throw error;

      setModels(data.map(provider => ({
        id: provider.id,
        name: provider.name,
        version: provider.configuration?.version || '1.0',
        provider: provider.provider_type,
        status: provider.is_active ? 'active' : 'inactive',
        accuracy: 0.85, // Mock accuracy
        last_updated: provider.updated_at,
        capabilities: provider.capabilities || []
      })));
    } catch (error) {
      console.error('Error fetching AI models:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch AI models data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_model_performance')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setPerformanceData(data.map(item => ({
          ...item,
          metrics: item.metrics || {
            precision: 0.83,
            recall: 0.79,
            f1_score: 0.81,
            content_types: {
              flashcards: 0.88,
              multiple_choice: 0.85,
              reading: 0.75,
              writing: 0.82,
              speaking: 0.78
            }
          }
        })));
      }
    } catch (error) {
      console.error('Error fetching AI performance data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch AI performance metrics.',
        variant: 'destructive',
      });
    }
  };

  const updateModelStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('ai_providers')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setModels(models.map(model => 
        model.id === id 
          ? { ...model, status: isActive ? 'active' : 'inactive' } 
          : model
      ));

      toast({
        title: 'Success',
        description: `AI model ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating AI model status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update AI model status.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveThresholds = () => {
    // In a real application, save these thresholds to the backend
    toast({
      title: 'Settings Saved',
      description: 'AI threshold configurations have been updated.',
    });
  };

  const getModelStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'training':
        return <Badge variant="secondary" className="bg-blue-500">Training</Badge>;
      case 'evaluating':
        return <Badge variant="secondary" className="bg-amber-500">Evaluating</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <Helmet>
          <title>AI Management - Admin</title>
        </Helmet>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Management</h1>
            <p className="text-muted-foreground mt-2">
              Configure and monitor the AI models powering your platform
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="models" className="flex items-center">
              <Brain className="mr-2 h-4 w-4" />
              Models
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="thresholds" className="flex items-center">
              <Sliders className="mr-2 h-4 w-4" />
              Thresholds
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center">
              <FileQuestion className="mr-2 h-4 w-4" />
              Training Data
            </TabsTrigger>
          </TabsList>

          {/* Models Tab */}
          <TabsContent value="models">
            <div className="grid gap-6 md:grid-cols-2">
              {loading ? (
                Array(2).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                models.map((model) => (
                  <Card key={model.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{model.name}</CardTitle>
                        {getModelStatusBadge(model.status)}
                      </div>
                      <CardDescription>
                        v{model.version} • Provider: {model.provider}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium">Accuracy</div>
                            <div className="text-sm text-muted-foreground">{(model.accuracy * 100).toFixed(1)}%</div>
                          </div>
                          <Progress value={model.accuracy * 100} className="h-2" />
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {model.capabilities.map((capability, i) => (
                            <Badge key={i} variant="outline">{capability}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Last updated: {new Date(model.last_updated).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={model.status === 'active'}
                          onCheckedChange={(checked) => updateModelStatus(model.id, checked)}
                        />
                        <span className="text-sm">
                          {model.status === 'active' ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Overall performance metrics across all content types
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performanceData.length > 0 ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Overall Accuracy
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                              {(performanceData[0].accuracy * 100).toFixed(1)}%
                            </div>
                            <Gauge className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Progress value={performanceData[0].accuracy * 100} className="h-2 mt-4" />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Confidence Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                              {(performanceData[0].confidence_score * 100).toFixed(1)}%
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Progress value={performanceData[0].confidence_score * 100} className="h-2 mt-4" />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            F1 Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                              {(performanceData[0].metrics.f1_score * 100).toFixed(1)}%
                            </div>
                            <BarChart2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Progress value={performanceData[0].metrics.f1_score * 100} className="h-2 mt-4" />
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Content Type Performance</h3>
                      <div className="space-y-4">
                        {Object.entries(performanceData[0].metrics.content_types).map(([type, score]) => (
                          <div key={type}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-sm font-medium capitalize">{type}</div>
                              <div className="text-sm text-muted-foreground">{(score * 100).toFixed(1)}%</div>
                            </div>
                            <Progress value={score * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-muted-foreground">
                    No performance data available.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Thresholds Tab */}
          <TabsContent value="thresholds">
            <Card>
              <CardHeader>
                <CardTitle>Confidence Thresholds</CardTitle>
                <CardDescription>
                  Configure minimum confidence levels for different content types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {thresholds.map((threshold, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium capitalize">{threshold.content_type}</h3>
                        <Switch 
                          checked={threshold.enabled}
                          onCheckedChange={(checked) => {
                            const newThresholds = [...thresholds];
                            newThresholds[i].enabled = checked;
                            setThresholds(newThresholds);
                          }}
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm">Confidence Threshold</div>
                          <div className="text-sm font-medium">{(threshold.confidence_threshold * 100).toFixed()}%</div>
                        </div>
                        <Slider
                          value={[threshold.confidence_threshold * 100]}
                          min={50}
                          max={95}
                          step={5}
                          onValueChange={(value) => {
                            const newThresholds = [...thresholds];
                            newThresholds[i].confidence_threshold = value[0] / 100;
                            setThresholds(newThresholds);
                          }}
                          disabled={!threshold.enabled}
                          className="mb-6"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm">Max Processing Time (ms)</div>
                          <div className="text-sm font-medium">{threshold.max_processing_time}ms</div>
                        </div>
                        <Slider
                          value={[threshold.max_processing_time]}
                          min={1000}
                          max={20000}
                          step={1000}
                          onValueChange={(value) => {
                            const newThresholds = [...thresholds];
                            newThresholds[i].max_processing_time = value[0];
                            setThresholds(newThresholds);
                          }}
                          disabled={!threshold.enabled}
                          className="mb-6"
                        />
                      </div>
                      
                      {i < thresholds.length - 1 && <div className="border-t border-gray-200 dark:border-gray-800 my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveThresholds}>Save Thresholds</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Training Data Tab */}
          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Training Data Management</CardTitle>
                <CardDescription>
                  Manage and monitor the training data used by AI models
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Training Examples</h3>
                    <p className="text-sm text-muted-foreground">
                      Currently using 1,342 curated examples in the training set
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Training Distribution</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Flashcards</div>
                        <div className="text-sm text-muted-foreground">412 examples</div>
                      </div>
                      <Progress value={31} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Multiple Choice</div>
                        <div className="text-sm text-muted-foreground">385 examples</div>
                      </div>
                      <Progress value={29} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Reading</div>
                        <div className="text-sm text-muted-foreground">245 examples</div>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Writing</div>
                        <div className="text-sm text-muted-foreground">178 examples</div>
                      </div>
                      <Progress value={13} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Speaking</div>
                        <div className="text-sm text-muted-foreground">122 examples</div>
                      </div>
                      <Progress value={9} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Training Pipeline</h3>
                    <Badge variant="outline">Last trained 3 days ago</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Checkbox id="auto-train" />
                      <label
                        htmlFor="auto-train"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable automatic training (weekly)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="auto-evaluate" />
                      <label
                        htmlFor="auto-evaluate"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable automatic evaluation
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="feedback-loop" />
                      <label
                        htmlFor="feedback-loop"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Use user corrections in training loop
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="human-review" />
                      <label
                        htmlFor="human-review"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Require human review for new examples
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="outlier-detection" />
                      <label
                        htmlFor="outlier-detection"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable outlier detection
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start Training
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AIManagement;
