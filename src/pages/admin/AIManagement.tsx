
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAI } from '@/hooks/useAI';
import { 
  Cpu, Settings, Database, Share2, BarChart4, CheckCircle2, 
  AlertTriangle, Server, HardDrive, RefreshCcw, Loader2,
  Eye, EyeOff, FileUp, Brain, Terminal, Code
} from 'lucide-react';

const AIManagement = () => {
  const { 
    isEnabled, isModelLoaded, isProcessing, toggleAI, 
    generateText, loadModel 
  } = useAI();
  const { toast } = useToast();
  
  // Mock state for the admin interface
  const [aiStatus, setAiStatus] = useState({
    systemEnabled: isEnabled,
    defaultModelSize: 'medium' as 'small' | 'medium' | 'large',
    userOverridesAllowed: true,
    processingMode: 'hybrid' as 'cloud' | 'local' | 'hybrid',
    trainingEnabled: true,
    feedbackThreshold: 80,
    contentGenerationLimit: 50,
    modelUpdateFrequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    defaultLanguageModel: 'gpt2' as string,
    enforceContentFilters: true,
    systemLoad: 42,
    activeUsers: 18,
    apiCallsToday: 287,
    averageResponseTime: 1.2,
  });
  
  const [testPrompt, setTestPrompt] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  
  const handleSystemToggle = (checked: boolean) => {
    setAiStatus(prev => ({ ...prev, systemEnabled: checked }));
    toggleAI(checked);
    
    toast({
      title: checked ? 'AI System Enabled' : 'AI System Disabled',
      description: checked 
        ? 'Users can now use AI-powered features according to their permission levels' 
        : 'AI features are now disabled system-wide',
    });
  };
  
  const handlePromptTest = async () => {
    if (!testPrompt.trim()) return;
    
    setIsGeneratingTest(true);
    setTestResponse('');
    
    try {
      const result = await generateText(testPrompt, {
        maxLength: 100,
        temperature: 0.7
      });
      
      setTestResponse(result.generated_text);
    } catch (error: any) {
      setTestResponse(`Error: ${error.message || 'Failed to generate response'}`);
      toast({
        title: 'Test Generation Failed',
        description: error.message || 'There was an error generating a response',
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingTest(false);
    }
  };
  
  const handleModelReload = async () => {
    try {
      await loadModel('text-generation');
      toast({
        title: 'Model Reloaded',
        description: 'The AI model has been successfully reloaded',
      });
    } catch (error) {
      console.error('Error reloading model:', error);
    }
  };
  
  // Simulated data for charts and graphs
  const modelPerformance = [
    { model: 'text-small', accuracy: 78, speed: 92, memory: 15 },
    { model: 'text-medium', accuracy: 86, speed: 77, memory: 42 },
    { model: 'text-large', accuracy: 94, speed: 61, memory: 85 },
  ];
  
  const usageByFeature = [
    { feature: 'Multiple Choice', usage: 42 },
    { feature: 'Flashcards', usage: 28 },
    { feature: 'Writing Assistance', usage: 18 },
    { feature: 'Speaking Practice', usage: 12 },
  ];
  
  return (
    <>
      <Helmet>
        <title>AI Management - Admin Panel</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Cpu className="mr-3 h-8 w-8" /> AI Management
            </h1>
            <p className="text-muted-foreground">
              Configure and monitor AI functionality across the platform
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={isEnabled ? "default" : "outline"} className="py-1.5 px-3">
              {isModelLoaded ? (
                <span className="flex items-center">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Model Loaded
                </span>
              ) : (
                <span className="flex items-center">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  Model Not Loaded
                </span>
              )}
            </Badge>
            
            <Button onClick={handleModelReload} size="sm" variant="outline" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reload Model
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">System Status</h3>
                  <Badge 
                    variant={aiStatus.systemEnabled ? "default" : "destructive"}
                    className="px-2 py-0.5"
                  >
                    {aiStatus.systemEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Global AI system control
                </p>
                <Switch 
                  checked={aiStatus.systemEnabled} 
                  onCheckedChange={handleSystemToggle}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">System Load</h3>
                  <span className={`text-sm font-medium ${aiStatus.systemLoad > 80 ? 'text-destructive' : 'text-green-600'}`}>
                    {aiStatus.systemLoad}%
                  </span>
                </div>
                <Progress 
                  value={aiStatus.systemLoad} 
                  className="h-2" 
                />
                <p className="text-sm text-muted-foreground pt-1">
                  {aiStatus.systemLoad > 80 ? 'High load' : aiStatus.systemLoad > 50 ? 'Moderate load' : 'Normal operation'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-medium">Active Users</h3>
                <div className="text-2xl font-bold">
                  {aiStatus.activeUsers}
                  <span className="text-sm font-normal text-muted-foreground ml-1">users</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Currently using AI features
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-medium">API Calls Today</h3>
                <div className="text-2xl font-bold">
                  {aiStatus.apiCallsToday.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-1">calls</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Avg. response time: {aiStatus.averageResponseTime} sec
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Global Settings</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span>Models</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-1">
              <BarChart4 className="h-4 w-4" />
              <span>Monitoring</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-1">
              <Terminal className="h-4 w-4" />
              <span>Testing</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Global AI Settings</CardTitle>
                  <CardDescription>
                    Configure system-wide AI behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label className="text-base">Default Model Size</Label>
                      <p className="text-sm text-muted-foreground">For new users and guests</p>
                    </div>
                    <Select
                      value={aiStatus.defaultModelSize}
                      onValueChange={(value) => setAiStatus(prev => ({...prev, defaultModelSize: value as any}))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select model size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (Fast)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="large">Large (Quality)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Allow User Overrides</Label>
                      <p className="text-sm text-muted-foreground">Let users adjust their AI settings</p>
                    </div>
                    <Switch 
                      checked={aiStatus.userOverridesAllowed}
                      onCheckedChange={(checked) => setAiStatus(prev => ({...prev, userOverridesAllowed: checked}))}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label className="text-base">Processing Mode</Label>
                      <p className="text-sm text-muted-foreground">Where AI processing occurs</p>
                    </div>
                    <Select
                      value={aiStatus.processingMode}
                      onValueChange={(value) => setAiStatus(prev => ({...prev, processingMode: value as any}))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select processing mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cloud" className="flex items-center gap-2">
                          <Server className="h-4 w-4 inline mr-2" />
                          Cloud Only
                        </SelectItem>
                        <SelectItem value="local" className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 inline mr-2" />
                          Local Only
                        </SelectItem>
                        <SelectItem value="hybrid" className="flex items-center gap-2">
                          <Share2 className="h-4 w-4 inline mr-2" />
                          Hybrid (Recommended)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Training</Label>
                      <p className="text-sm text-muted-foreground">Allow AI to learn from interactions</p>
                    </div>
                    <Switch 
                      checked={aiStatus.trainingEnabled}
                      onCheckedChange={(checked) => setAiStatus(prev => ({...prev, trainingEnabled: checked}))}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="feedback-threshold" className="text-base">Feedback Confidence Threshold</Label>
                        <span className="text-sm font-medium">{aiStatus.feedbackThreshold}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Minimum confidence required for AI feedback</p>
                      <Slider 
                        id="feedback-threshold"
                        defaultValue={[aiStatus.feedbackThreshold]} 
                        max={100} 
                        min={50} 
                        step={5} 
                        onValueChange={(value) => setAiStatus(prev => ({...prev, feedbackThreshold: value[0]}))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="content-limit" className="text-base">Content Generation Limit</Label>
                        <span className="text-sm font-medium">{aiStatus.contentGenerationLimit}/day</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Maximum AI-generated content per user daily</p>
                      <Slider 
                        id="content-limit"
                        defaultValue={[aiStatus.contentGenerationLimit]} 
                        max={100} 
                        min={10} 
                        step={5}
                        onValueChange={(value) => setAiStatus(prev => ({...prev, contentGenerationLimit: value[0]}))}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Save Global Settings</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content & Monitoring</CardTitle>
                  <CardDescription>
                    Configure content generation and monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label className="text-base">Model Update Frequency</Label>
                      <p className="text-sm text-muted-foreground">How often to update AI models</p>
                    </div>
                    <Select
                      value={aiStatus.modelUpdateFrequency}
                      onValueChange={(value) => setAiStatus(prev => ({...prev, modelUpdateFrequency: value as any}))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label className="text-base">Default Language Model</Label>
                      <p className="text-sm text-muted-foreground">Base model for text generation</p>
                    </div>
                    <Select
                      value={aiStatus.defaultLanguageModel}
                      onValueChange={(value) => setAiStatus(prev => ({...prev, defaultLanguageModel: value}))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt2">GPT-2</SelectItem>
                        <SelectItem value="distilgpt2">DistilGPT-2</SelectItem>
                        <SelectItem value="custom">Custom Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enforce Content Filters</Label>
                      <p className="text-sm text-muted-foreground">Filter inappropriate AI-generated content</p>
                    </div>
                    <Switch 
                      checked={aiStatus.enforceContentFilters}
                      onCheckedChange={(checked) => setAiStatus(prev => ({...prev, enforceContentFilters: checked}))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-base">Custom Prompt Templates</Label>
                    <p className="text-sm text-muted-foreground">Define system prompts for different content types</p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Multiple Choice Questions</AccordionTrigger>
                        <AccordionContent>
                          <Textarea 
                            className="min-h-[120px]" 
                            defaultValue={`Generate {{count}} {{difficulty}} level {{language}} multiple choice questions about {{topic}}.\nFor each question, provide 4 options with one correct answer.\nInclude an explanation for the correct answer.`}
                          />
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Grammar Explanations</AccordionTrigger>
                        <AccordionContent>
                          <Textarea 
                            className="min-h-[120px]"
                            defaultValue={`Explain the following {{language}} grammar concept: {{concept}}.\nProvide examples and common mistakes to avoid.\nKeep the explanation at {{difficulty}} level.`} 
                          />
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Speaking Exercises</AccordionTrigger>
                        <AccordionContent>
                          <Textarea 
                            className="min-h-[120px]"
                            defaultValue={`Create a {{difficulty}} level speaking exercise about {{topic}} in {{language}}.\nInclude a conversation starter, 5 follow-up questions, and vocabulary notes.`} 
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full gap-3">
                    <Button variant="outline" className="flex-1">Reset to Defaults</Button>
                    <Button className="flex-1">Save Changes</Button>
                  </div>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>
                    Configure which user roles can access AI features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Students</h3>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="student-flashcards" className="text-sm">Flashcards</Label>
                            <Switch id="student-flashcards" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="student-quiz" className="text-sm">Multiple Choice</Label>
                            <Switch id="student-quiz" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="student-speaking" className="text-sm">Speaking Practice</Label>
                            <Switch id="student-speaking" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="student-writing" className="text-sm">Writing Help</Label>
                            <Switch id="student-writing" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="student-listening" className="text-sm">Listening Exercises</Label>
                            <Switch id="student-listening" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Teachers</h3>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="teacher-content" className="text-sm">Content Creation</Label>
                            <Switch id="teacher-content" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="teacher-feedback" className="text-sm">Student Feedback</Label>
                            <Switch id="teacher-feedback" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="teacher-assessment" className="text-sm">Assessment Generation</Label>
                            <Switch id="teacher-assessment" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="teacher-analysis" className="text-sm">Performance Analysis</Label>
                            <Switch id="teacher-analysis" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="teacher-customize" className="text-sm">Model Customization</Label>
                            <Switch id="teacher-customize" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Administrators</h3>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-system" className="text-sm">System Configuration</Label>
                            <Switch id="admin-system" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-models" className="text-sm">Model Management</Label>
                            <Switch id="admin-models" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-analytics" className="text-sm">Usage Analytics</Label>
                            <Switch id="admin-analytics" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-training" className="text-sm">Model Training</Label>
                            <Switch id="admin-training" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-api" className="text-sm">API Integration</Label>
                            <Switch id="admin-api" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">Update Access Controls</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="models">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Available Models</CardTitle>
                  <CardDescription>
                    Models currently available in the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {modelPerformance.map((model) => (
                      <div key={model.model} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{model.model}</div>
                          <Badge variant={model.model === 'text-medium' ? 'default' : 'outline'}>
                            {model.model === 'text-medium' ? 'Default' : 'Available'}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <span className="text-muted-foreground">Accuracy:</span>
                            <div className="flex items-center justify-between">
                              <Progress value={model.accuracy} className="h-1.5 mr-2 flex-1" />
                              <span className="text-xs">{model.accuracy}%</span>
                            </div>
                            
                            <span className="text-muted-foreground">Speed:</span>
                            <div className="flex items-center justify-between">
                              <Progress value={model.speed} className="h-1.5 mr-2 flex-1" />
                              <span className="text-xs">{model.speed}%</span>
                            </div>
                            
                            <span className="text-muted-foreground">Memory:</span>
                            <div className="flex items-center justify-between">
                              <Progress value={model.memory} className="h-1.5 mr-2 flex-1" />
                              <span className="text-xs">{model.memory}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                          <Button size="sm" variant="outline">Test</Button>
                          <Button size="sm" variant={model.model === 'text-medium' ? 'secondary' : 'default'}>
                            {model.model === 'text-medium' ? 'Default' : 'Set as Default'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <FileUp className="h-4 w-4 mr-2" />
                    Upload Custom Model
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Detailed model performance analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Question Generation</Label>
                        <Badge variant="outline">87% Accurate</Badge>
                      </div>
                      <Progress value={87} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Based on 1,248 samples with expert review
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Grammar Explanations</Label>
                        <Badge variant="outline">92% Accurate</Badge>
                      </div>
                      <Progress value={92} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Based on 872 samples with expert review
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Vocabulary Creation</Label>
                        <Badge variant="outline">95% Accurate</Badge>
                      </div>
                      <Progress value={95} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Based on 3,451 samples with expert review
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Speech Recognition</Label>
                        <Badge variant="outline">78% Accurate</Badge>
                      </div>
                      <Progress value={78} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Based on 642 audio samples with expert review
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Writing Assessment</Label>
                        <Badge variant="outline">84% Accurate</Badge>
                      </div>
                      <Progress value={84} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Based on 1,024 samples with expert review
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">Download Report</Button>
                  <Button className="flex-1">Recalibrate Models</Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Model Training</CardTitle>
                  <CardDescription>
                    Train and fine-tune AI models with custom data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label className="text-base">Training Dataset</Label>
                        <Select defaultValue="italian-general">
                          <SelectTrigger>
                            <SelectValue placeholder="Select dataset" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="italian-general">Italian General</SelectItem>
                            <SelectItem value="italian-beginner">Italian Beginner</SelectItem>
                            <SelectItem value="italian-intermediate">Italian Intermediate</SelectItem>
                            <SelectItem value="italian-advanced">Italian Advanced</SelectItem>
                            <SelectItem value="italian-specialized">Italian Specialized</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          8,745 examples, last updated 14 days ago
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-base">Target Model</Label>
                        <Select defaultValue="text-medium">
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text-small">text-small</SelectItem>
                            <SelectItem value="text-medium">text-medium</SelectItem>
                            <SelectItem value="text-large">text-large</SelectItem>
                            <SelectItem value="custom">New Custom Model</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Model that will be trained with the dataset
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-base">Training Duration</Label>
                        <Select defaultValue="standard">
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quick">Quick (1 hour)</SelectItem>
                            <SelectItem value="standard">Standard (4 hours)</SelectItem>
                            <SelectItem value="extended">Extended (12 hours)</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive (24 hours)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Longer training typically yields better results
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base">Advanced Options</Label>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="learning-rate" className="text-sm">Learning Rate</Label>
                            <span className="text-xs font-medium">0.0005</span>
                          </div>
                          <Slider 
                            id="learning-rate"
                            defaultValue={[0.0005]} 
                            max={0.01} 
                            min={0.0001} 
                            step={0.0001}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="batch-size" className="text-sm">Batch Size</Label>
                            <span className="text-xs font-medium">16</span>
                          </div>
                          <Slider 
                            id="batch-size"
                            defaultValue={[16]} 
                            max={64} 
                            min={1} 
                            step={1}
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Save Checkpoints</Label>
                            <p className="text-xs text-muted-foreground">Save model states during training</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Validation Split</Label>
                            <p className="text-xs text-muted-foreground">Percentage of data for validation</p>
                          </div>
                          <Select defaultValue="10">
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="%" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="10">10%</SelectItem>
                              <SelectItem value="15">15%</SelectItem>
                              <SelectItem value="20">20%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-3 ml-auto">
                    <Button variant="outline">Schedule Training</Button>
                    <Button>Start Training Now</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="monitoring">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Usage by Feature</CardTitle>
                  <CardDescription>
                    AI feature usage distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usageByFeature.map((feature) => (
                      <div key={feature.feature} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{feature.feature}</span>
                          <span className="text-xs">{feature.usage}%</span>
                        </div>
                        <Progress value={feature.usage} className="h-2" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-medium mb-3">Top User Queries</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">"Generate vocabulary about food"</span>
                        <Badge variant="outline">128 times</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">"Create quiz about Italian verbs"</span>
                        <Badge variant="outline">92 times</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">"Explain subjunctive mood"</span>
                        <Badge variant="outline">87 times</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">"Help with writing an email"</span>
                        <Badge variant="outline">64 times</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Download Full Usage Report</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Monitoring</CardTitle>
                  <CardDescription>
                    AI system performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Response Times</h3>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Average Response Time</span>
                          <span className="text-xs font-medium">{aiStatus.averageResponseTime} sec</span>
                        </div>
                        <Progress value={aiStatus.averageResponseTime * 10} className="h-1.5" />
                        <p className="text-xs text-muted-foreground">
                          Last 24 hours
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">API Calls</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-muted p-3 rounded-md text-center">
                          <div className="text-xl font-bold">{aiStatus.apiCallsToday.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Today</div>
                        </div>
                        <div className="bg-muted p-3 rounded-md text-center">
                          <div className="text-xl font-bold">12.8k</div>
                          <div className="text-xs text-muted-foreground">This Week</div>
                        </div>
                        <div className="bg-muted p-3 rounded-md text-center">
                          <div className="text-xl font-bold">42.3k</div>
                          <div className="text-xs text-muted-foreground">This Month</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">System Health</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium">Content Generation</div>
                            <div className="text-xs text-muted-foreground">Operational</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium">Speech Processing</div>
                            <div className="text-xs text-muted-foreground">Operational</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium">Question Answering</div>
                            <div className="text-xs text-muted-foreground">Operational</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium">Content Analysis</div>
                            <div className="text-xs text-muted-foreground">Operational</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View System Dashboard</Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Error Monitoring</CardTitle>
                  <CardDescription>
                    Review and analyze AI system errors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <div>
                          <div className="font-medium">Content Generation Error</div>
                          <div className="text-sm text-muted-foreground">2 hours ago</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Warning
                      </Badge>
                    </div>
                    <div className="p-4 border-b">
                      <div className="text-sm mb-2">
                        Failed to generate content due to model timeout
                      </div>
                      <div className="bg-muted p-3 rounded-md text-xs font-mono">
                        <code>Error: Request timed out after 10000ms. Model processing exceeded timeout threshold.</code>
                      </div>
                    </div>
                    <div className="p-4 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium">Request ID:</div>
                          <div className="text-muted-foreground">req_7a8b9c0d1e2f</div>
                        </div>
                        <div>
                          <div className="font-medium">User:</div>
                          <div className="text-muted-foreground">user@example.com</div>
                        </div>
                        <div>
                          <div className="font-medium">Model:</div>
                          <div className="text-muted-foreground">text-large</div>
                        </div>
                        <div>
                          <div className="font-medium">Endpoint:</div>
                          <div className="text-muted-foreground">/api/ai/generate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md mt-4">
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="font-medium">Model Loading Error</div>
                          <div className="text-sm text-muted-foreground">5 hours ago</div>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        Error
                      </Badge>
                    </div>
                    <div className="p-4 border-b">
                      <div className="text-sm mb-2">
                        Failed to load AI model due to memory constraints
                      </div>
                      <div className="bg-muted p-3 rounded-md text-xs font-mono">
                        <code>Error: WebGPU device out of memory. Cannot allocate 2048MB for model weights.</code>
                      </div>
                    </div>
                    <div className="p-4 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium">Request ID:</div>
                          <div className="text-muted-foreground">req_3e4f5g6h7i8j</div>
                        </div>
                        <div>
                          <div className="font-medium">User:</div>
                          <div className="text-muted-foreground">admin@example.com</div>
                        </div>
                        <div>
                          <div className="font-medium">Model:</div>
                          <div className="text-muted-foreground">custom-gpt-xl</div>
                        </div>
                        <div>
                          <div className="font-medium">Endpoint:</div>
                          <div className="text-muted-foreground">/api/ai/load-model</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-3 w-full">
                    <Button variant="outline" className="flex-1">View All Errors</Button>
                    <Button className="flex-1">Clear Resolved Errors</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="testing">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>AI Test Console</CardTitle>
                  <CardDescription>
                    Test AI responses with custom prompts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="test-prompt">Prompt</Label>
                      <Textarea 
                        id="test-prompt"
                        placeholder="Enter a prompt to test the AI response..."
                        className="min-h-24 mt-1.5"
                        value={testPrompt}
                        onChange={(e) => setTestPrompt(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Select defaultValue="text-generation">
                        <SelectTrigger>
                          <SelectValue placeholder="Select AI task" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-generation">Text Generation</SelectItem>
                          <SelectItem value="question-answering">Question Answering</SelectItem>
                          <SelectItem value="classification">Classification</SelectItem>
                          <SelectItem value="summarization">Summarization</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="text-medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-small">text-small</SelectItem>
                          <SelectItem value="text-medium">text-medium</SelectItem>
                          <SelectItem value="text-large">text-large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4">
                      <Label>Response</Label>
                      <div className="border rounded-md mt-1.5 p-4 min-h-24 bg-muted/50">
                        {isGeneratingTest ? (
                          <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : testResponse ? (
                          <div className="text-sm whitespace-pre-wrap">{testResponse}</div>
                        ) : (
                          <div className="text-sm text-muted-foreground text-center">
                            Response will appear here
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-3 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setTestPrompt('');
                        setTestResponse('');
                      }}
                    >
                      Clear
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={handlePromptTest}
                      disabled={isGeneratingTest || !testPrompt.trim() || !isEnabled}
                    >
                      {isGeneratingTest ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Test Prompt'
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Metrics & Visualizations</CardTitle>
                  <CardDescription>
                    Analyze AI performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Model Comparison</h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Quality</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-16">text-small</span>
                            <Progress value={65} className="h-2 flex-1" />
                            <span className="text-xs w-8">65%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-16">text-medium</span>
                            <Progress value={82} className="h-2 flex-1" />
                            <span className="text-xs w-8">82%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-16">text-large</span>
                            <Progress value={95} className="h-2 flex-1" />
                            <span className="text-xs w-8">95%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Speed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-16">text-small</span>
                            <Progress value={92} className="h-2 flex-1" />
                            <span className="text-xs w-8">92%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-16">text-medium</span>
                            <Progress value={78} className="h-2 flex-1" />
                            <span className="text-xs w-8">78%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-16">text-large</span>
                            <Progress value={45} className="h-2 flex-1" />
                            <span className="text-xs w-8">45%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Recent Test Results</h3>
                      <div className="bg-muted/50 p-3 rounded-md space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">Accuracy Score</div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            87%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">Response Latency</div>
                          <Badge variant="outline">842ms</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">Memory Usage</div>
                          <Badge variant="outline">124MB</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">API Timeout Rate</div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            2.4%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Content Filtering</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Safe Mode</Label>
                            <p className="text-xs text-muted-foreground">Filter potentially unsafe content</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="filter-threshold" className="text-sm">Filter Threshold</Label>
                            <span className="text-xs font-medium">75%</span>
                          </div>
                          <Slider 
                            id="filter-threshold"
                            defaultValue={[75]} 
                            max={100} 
                            min={0} 
                            step={5}
                          />
                          <p className="text-xs text-muted-foreground">
                            Higher values apply stricter filtering
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Run Full Test Suite</Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle>Developer Tools</CardTitle>
                    <CardDescription>
                      Advanced tools for AI development and testing
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    For Advanced Users
                  </Badge>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="api" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="api" className="flex items-center gap-1">
                        <Code className="h-4 w-4" />
                        <span>API Testing</span>
                      </TabsTrigger>
                      <TabsTrigger value="logs" className="flex items-center gap-1">
                        <Terminal className="h-4 w-4" />
                        <span>System Logs</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="api">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="endpoint">API Endpoint</Label>
                          <Select defaultValue="textgen">
                            <SelectTrigger id="endpoint">
                              <SelectValue placeholder="Select endpoint" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="textgen">/api/ai/generate</SelectItem>
                              <SelectItem value="classify">/api/ai/classify</SelectItem>
                              <SelectItem value="qa">/api/ai/question-answer</SelectItem>
                              <SelectItem value="feedback">/api/ai/feedback</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="payload">Request Payload</Label>
                          <Textarea 
                            id="payload"
                            className="min-h-24 font-mono text-xs"
                            defaultValue={`{
  "prompt": "Generate a beginner-level Italian vocabulary list about food",
  "max_length": 500,
  "temperature": 0.7,
  "frequency_penalty": 0.5,
  "presence_penalty": 0.0
}`}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="method">Method</Label>
                            <Select defaultValue="POST">
                              <SelectTrigger id="method">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="format">Response Format</Label>
                            <Select defaultValue="json">
                              <SelectTrigger id="format">
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="text">Plain Text</SelectItem>
                                <SelectItem value="html">HTML</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between">
                            <Label>Response (Preview)</Label>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Prettify
                            </Button>
                          </div>
                          <div className="bg-muted p-3 rounded-md overflow-auto max-h-48">
                            <pre className="text-xs font-mono">
{`{
  "id": "gen-8a7b6c5d4e3f",
  "generated_text": "Here's a beginner-level Italian vocabulary list about food:\\n\\n1. il pane - bread\\n2. la pasta - pasta\\n3. la pizza - pizza\\n4. il formaggio - cheese\\n5. il pomodoro - tomato\\n6. l'acqua - water\\n7. il caffè - coffee\\n8. il tè - tea\\n9. il latte - milk\\n10. lo zucchero - sugar\\n11. il sale - salt\\n12. il pepe - pepper\\n13. la carne - meat\\n14. il pesce - fish\\n15. la frutta - fruit\\n16. la verdura - vegetables\\n17. il dolce - dessert\\n18. il gelato - ice cream\\n19. la colazione - breakfast\\n20. il pranzo - lunch\\n21. la cena - dinner\\n\\nCommon phrases:\\n- Ho fame - I'm hungry\\n- Ho sete - I'm thirsty\\n- Buon appetito! - Enjoy your meal!\\n- È delizioso - It's delicious\\n- Il conto, per favore - The bill, please",
  "model": "text-medium",
  "processing_time": 842,
  "token_count": 187,
  "status": "success"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline">Save Request</Button>
                        <Button>Send Request</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="logs">
                      <div className="border rounded-md">
                        <div className="bg-muted/50 p-2 border-b flex items-center justify-between">
                          <span className="text-sm font-medium">System Logs</span>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Clear</Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <EyeOff className="h-3.5 w-3.5 mr-1" />
                              Filter
                            </Button>
                          </div>
                        </div>
                        <div className="p-0">
                          <pre className="text-xs font-mono overflow-auto p-3 max-h-[350px] text-muted-foreground">
{`[2023-03-15 14:32:18] [INFO] AI system initialized with model: text-medium
[2023-03-15 14:32:19] [INFO] WebGPU acceleration enabled
[2023-03-15 14:32:20] [INFO] Model loaded successfully in 1.24s
[2023-03-15 14:35:42] [INFO] API request received: /api/ai/generate
[2023-03-15 14:35:43] [INFO] Processing prompt (length: 58 chars)
[2023-03-15 14:35:44] [INFO] Response generated in 842ms (187 tokens)
[2023-03-15 14:38:12] [WARN] High memory usage detected: 78% of available WebGPU memory
[2023-03-15 14:40:27] [INFO] API request received: /api/ai/generate
[2023-03-15 14:40:28] [INFO] Processing prompt (length: 112 chars)
[2023-03-15 14:40:30] [INFO] Response generated in 1.8s (342 tokens)
[2023-03-15 14:45:16] [ERROR] Model timeout: Request took too long (> 10s)
[2023-03-15 14:45:16] [INFO] Falling back to cloud processing
[2023-03-15 14:45:18] [INFO] Cloud response received in 2.4s
[2023-03-15 14:50:22] [INFO] API request received: /api/ai/classify
[2023-03-15 14:50:23] [INFO] Classification completed in 342ms
[2023-03-15 14:55:41] [INFO] Cache hit ratio: 68% (124/182 requests)
[2023-03-15 15:00:00] [INFO] Hourly stats: 182 requests, avg time 1.2s, error rate 1.6%`}
                          </pre>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline">Download Logs</Button>
                        <Button>Refresh</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AIManagement;
