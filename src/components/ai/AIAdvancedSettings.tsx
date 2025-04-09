
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, Save, RotateCcw, Cpu, Gauge, Zap, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIAdvancedSettings: React.FC = () => {
  const [memoryAllocation, setMemoryAllocation] = useState(40);
  const [processingThreads, setProcessingThreads] = useState(4);
  const [optimizationLevel, setOptimizationLevel] = useState('balanced');
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [batchSize, setBatchSize] = useState(16);
  const [maxTokenLength, setMaxTokenLength] = useState(150);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    setSaveInProgress(true);
    
    // Simulate saving
    setTimeout(() => {
      setSaveInProgress(false);
      toast({
        title: "Settings Saved",
        description: "AI system settings have been updated successfully",
      });
    }, 1500);
  };

  const handleResetSettings = () => {
    setMemoryAllocation(40);
    setProcessingThreads(4);
    setOptimizationLevel('balanced');
    setCacheEnabled(true);
    setDebugMode(false);
    setBatchSize(16);
    setMaxTokenLength(150);
    
    toast({
      title: "Settings Reset",
      description: "AI system settings have been reset to defaults",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
          Advanced AI Settings
        </CardTitle>
        <CardDescription>
          Configure system-wide AI settings and performance optimizations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">
              <Gauge className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="processing">
              <Cpu className="h-4 w-4 mr-2" />
              Processing
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="memory-allocation">Memory Allocation</Label>
                <span className="text-sm font-medium">{memoryAllocation}%</span>
              </div>
              <Slider
                id="memory-allocation"
                min={10}
                max={80}
                step={5}
                defaultValue={[memoryAllocation]}
                onValueChange={(value) => setMemoryAllocation(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Percentage of system memory allocated to AI processing
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="processing-threads">Processing Threads</Label>
                <span className="text-sm font-medium">{processingThreads}</span>
              </div>
              <Slider
                id="processing-threads"
                min={1}
                max={8}
                step={1}
                defaultValue={[processingThreads]}
                onValueChange={(value) => setProcessingThreads(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Number of concurrent processing threads
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="optimization">Optimization Level</Label>
              <Select value={optimizationLevel} onValueChange={setOptimizationLevel}>
                <SelectTrigger id="optimization">
                  <SelectValue placeholder="Select optimization level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speed">Speed (Faster, Less Accurate)</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="quality">Quality (Slower, More Accurate)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cache-enabled" className="text-base">Response Caching</Label>
                <p className="text-xs text-muted-foreground">
                  Cache frequent AI responses for faster retrieval
                </p>
              </div>
              <Switch 
                id="cache-enabled" 
                checked={cacheEnabled}
                onCheckedChange={setCacheEnabled}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="processing" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="batch-size">Batch Size</Label>
              <Select value={batchSize.toString()} onValueChange={(value) => setBatchSize(parseInt(value))}>
                <SelectTrigger id="batch-size">
                  <SelectValue placeholder="Select batch size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 (Lower Memory Usage)</SelectItem>
                  <SelectItem value="16">16 (Default)</SelectItem>
                  <SelectItem value="32">32 (Faster Processing)</SelectItem>
                  <SelectItem value="64">64 (High Performance)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Number of samples processed in a single batch
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="max-tokens">Max Token Length</Label>
                <span className="text-sm font-medium">{maxTokenLength}</span>
              </div>
              <Slider
                id="max-tokens"
                min={50}
                max={500}
                step={10}
                defaultValue={[maxTokenLength]}
                onValueChange={(value) => setMaxTokenLength(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of tokens to process in a single request
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language-model">Default Language Model</Label>
              <Select defaultValue="gpt-4o-mini">
                <SelectTrigger id="language-model">
                  <SelectValue placeholder="Select language model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini (Default)</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o (Premium)</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="llama-3">Llama 3 (Local)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="debug-mode" className="text-base">Debug Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Enable detailed logging for AI operations
                </p>
              </div>
              <Switch 
                id="debug-mode" 
                checked={debugMode}
                onCheckedChange={setDebugMode}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key (Hidden)</Label>
              <Input 
                id="api-key" 
                type="password" 
                value="●●●●●●●●●●●●●●●●●●●●"
                readOnly 
              />
              <p className="text-xs text-muted-foreground">
                API key used for external AI service communication
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="access-level">Access Level</Label>
              <Select defaultValue="admin">
                <SelectTrigger id="access-level">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator (Full Access)</SelectItem>
                  <SelectItem value="manager">Content Manager</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="content-filter" className="text-base">Content Filtering</Label>
                <p className="text-xs text-muted-foreground">
                  Filter inappropriate or sensitive content
                </p>
              </div>
              <Switch id="content-filter" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="audit-logging" className="text-base">Audit Logging</Label>
                <p className="text-xs text-muted-foreground">
                  Log all AI interactions for security review
                </p>
              </div>
              <Switch id="audit-logging" defaultChecked />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleResetSettings}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings} disabled={saveInProgress}>
          {saveInProgress ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-pulse" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIAdvancedSettings;
