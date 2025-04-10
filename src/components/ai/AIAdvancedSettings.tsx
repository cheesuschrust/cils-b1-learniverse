
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sliders, Cpu, Gauge, RefreshCw, Upload, Download, Crosshair, Wrench, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const AIAdvancedSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [advancedSettings, setAdvancedSettings] = useState({
    // Performance settings
    maxWorkers: 4,
    cacheSize: 100, // MB
    useTensorflow: true,
    optimizationLevel: 'balanced',
    
    // Request settings
    maxTokens: 1024,
    requestTimeout: 30, // seconds
    retries: 3,
    
    // Training settings
    batchSize: 32,
    epochs: 5,
    learningRate: 0.001,
    validationSplit: 0.2,
    
    // Security settings
    enableContentFilter: true,
    logRequests: true,
    maxRequestsPerMinute: 60,
    
    // Export/Import settings
    exportFormat: 'json',
    importValidation: true
  });
  
  const handleSettingChange = (key: string, value: any) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Advanced AI settings have been updated successfully.",
    });
  };
  
  const handleReset = () => {
    // In a real app, this would reset to defaults
    toast({
      title: "Settings Reset",
      description: "Advanced AI settings have been reset to default values.",
    });
  };
  
  const handleExportModel = () => {
    toast({
      title: "Export Started",
      description: "Model export has been initiated. This may take some time.",
    });
  };
  
  const handleImportModel = () => {
    toast({
      title: "Import Started",
      description: "Model import has been initiated. This may take some time.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance" className="flex items-center">
            <Gauge className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center">
            <Crosshair className="mr-2 h-4 w-4" />
            Request Handling
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="exportimport" className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            Export/Import
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimization</CardTitle>
              <CardDescription>Configure system performance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-workers">Worker Threads</Label>
                  <span className="text-sm">{advancedSettings.maxWorkers}</span>
                </div>
                <Slider 
                  id="max-workers"
                  min={1} 
                  max={8} 
                  step={1}
                  value={[advancedSettings.maxWorkers]} 
                  onValueChange={(value) => handleSettingChange('maxWorkers', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Number of parallel processing threads (higher uses more CPU)
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cache-size">Model Cache Size (MB)</Label>
                  <span className="text-sm">{advancedSettings.cacheSize} MB</span>
                </div>
                <Slider 
                  id="cache-size"
                  min={50} 
                  max={500} 
                  step={50}
                  value={[advancedSettings.cacheSize]} 
                  onValueChange={(value) => handleSettingChange('cacheSize', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Memory allocated for caching model responses
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="use-tensorflow">Use TensorFlow.js</Label>
                  <p className="text-sm text-muted-foreground">Enable TensorFlow acceleration</p>
                </div>
                <Switch 
                  id="use-tensorflow" 
                  checked={advancedSettings.useTensorflow}
                  onCheckedChange={(checked) => handleSettingChange('useTensorflow', checked)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="optimization-level">Optimization Level</Label>
                <RadioGroup 
                  id="optimization-level"
                  value={advancedSettings.optimizationLevel}
                  onValueChange={(value) => handleSettingChange('optimizationLevel', value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="accuracy" id="accuracy" />
                    <Label htmlFor="accuracy" className="flex items-center">
                      <Crosshair className="mr-2 h-4 w-4 text-blue-500" />
                      Accuracy Focused
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="balanced" />
                    <Label htmlFor="balanced" className="flex items-center">
                      <Gauge className="mr-2 h-4 w-4 text-green-500" />
                      Balanced
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="speed" id="speed" />
                    <Label htmlFor="speed" className="flex items-center">
                      <Cpu className="mr-2 h-4 w-4 text-amber-500" />
                      Speed Focused
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Higher performance settings will increase resource usage. 
                  Adjust based on your system capabilities.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Configuration</CardTitle>
              <CardDescription>Configure AI request parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <span className="text-sm">{advancedSettings.maxTokens}</span>
                </div>
                <Slider 
                  id="max-tokens"
                  min={128} 
                  max={2048} 
                  step={128}
                  value={[advancedSettings.maxTokens]} 
                  onValueChange={(value) => handleSettingChange('maxTokens', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum length of generated responses
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="request-timeout">Request Timeout (seconds)</Label>
                  <span className="text-sm">{advancedSettings.requestTimeout} seconds</span>
                </div>
                <Slider 
                  id="request-timeout"
                  min={5} 
                  max={60} 
                  step={5}
                  value={[advancedSettings.requestTimeout]} 
                  onValueChange={(value) => handleSettingChange('requestTimeout', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Time to wait before marking a request as failed
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="retries">Max Retries</Label>
                  <span className="text-sm">{advancedSettings.retries}</span>
                </div>
                <Slider 
                  id="retries"
                  min={0} 
                  max={5} 
                  step={1}
                  value={[advancedSettings.retries]} 
                  onValueChange={(value) => handleSettingChange('retries', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Number of times to retry failed requests
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-rpm">Max Requests per Minute</Label>
                  <span className="text-sm">{advancedSettings.maxRequestsPerMinute}</span>
                </div>
                <Slider 
                  id="max-rpm"
                  min={10} 
                  max={120} 
                  step={10}
                  value={[advancedSettings.maxRequestsPerMinute]} 
                  onValueChange={(value) => handleSettingChange('maxRequestsPerMinute', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Rate limiting for AI requests
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="content-filter">Content Filter</Label>
                  <p className="text-sm text-muted-foreground">Filter inappropriate content</p>
                </div>
                <Switch 
                  id="content-filter" 
                  checked={advancedSettings.enableContentFilter}
                  onCheckedChange={(checked) => handleSettingChange('enableContentFilter', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="log-requests">Log Requests</Label>
                  <p className="text-sm text-muted-foreground">Save AI request history</p>
                </div>
                <Switch 
                  id="log-requests" 
                  checked={advancedSettings.logRequests}
                  onCheckedChange={(checked) => handleSettingChange('logRequests', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="training" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Configuration</CardTitle>
              <CardDescription>Configure AI model training parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <span className="text-sm">{advancedSettings.batchSize}</span>
                </div>
                <Slider 
                  id="batch-size"
                  min={8} 
                  max={64} 
                  step={8}
                  value={[advancedSettings.batchSize]} 
                  onValueChange={(value) => handleSettingChange('batchSize', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Number of samples processed before model update
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="epochs">Training Epochs</Label>
                  <span className="text-sm">{advancedSettings.epochs}</span>
                </div>
                <Slider 
                  id="epochs"
                  min={1} 
                  max={10} 
                  step={1}
                  value={[advancedSettings.epochs]} 
                  onValueChange={(value) => handleSettingChange('epochs', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Number of complete passes through the training dataset
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="learning-rate">Learning Rate</Label>
                  <span className="text-sm">{advancedSettings.learningRate}</span>
                </div>
                <Slider 
                  id="learning-rate"
                  min={0.0001} 
                  max={0.01} 
                  step={0.0001}
                  value={[advancedSettings.learningRate]} 
                  onValueChange={(value) => handleSettingChange('learningRate', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Step size for model weight updates
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="validation-split">Validation Split</Label>
                  <span className="text-sm">{advancedSettings.validationSplit}</span>
                </div>
                <Slider 
                  id="validation-split"
                  min={0.1} 
                  max={0.5} 
                  step={0.1}
                  value={[advancedSettings.validationSplit]} 
                  onValueChange={(value) => handleSettingChange('validationSplit', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Portion of training data used for validation
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md flex items-center">
                <Wrench className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Advanced training parameters should be adjusted based on your specific dataset 
                  and training objectives. Improper settings may lead to overfitting or underfitting.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exportimport" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Export & Import</CardTitle>
              <CardDescription>Transfer AI models and configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Export Settings</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Export Format</Label>
                    <Select 
                      value={advancedSettings.exportFormat} 
                      onValueChange={(value) => handleSettingChange('exportFormat', value)}
                    >
                      <SelectTrigger id="export-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="onnx">ONNX</SelectItem>
                        <SelectItem value="tensorflowjs">TensorFlow.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium">Export Options</h5>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="export-weights" defaultChecked />
                      <Label htmlFor="export-weights">Include Weights</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="export-config" defaultChecked />
                      <Label htmlFor="export-config">Include Configuration</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="export-metadata" defaultChecked />
                      <Label htmlFor="export-metadata">Include Metadata</Label>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleExportModel}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Model
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Import Settings</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="import-validation">Validate Import</Label>
                      <p className="text-sm text-muted-foreground">Check compatibility before import</p>
                    </div>
                    <Switch 
                      id="import-validation" 
                      checked={advancedSettings.importValidation}
                      onCheckedChange={(checked) => handleSettingChange('importValidation', checked)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium">Import Options</h5>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="merge-weights" />
                      <Label htmlFor="merge-weights">Merge with existing model</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="replace-config" defaultChecked />
                      <Label htmlFor="replace-config">Replace configuration</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="backup-current" defaultChecked />
                      <Label htmlFor="backup-current">Backup current model</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model-file">Select Model File</Label>
                    <Input id="model-file" type="file" />
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={handleImportModel}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import Model
                  </Button>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Importing models can override existing settings and may cause compatibility issues.
                  Always backup your current models before importing new ones.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default AIAdvancedSettings;
