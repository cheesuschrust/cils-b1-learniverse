
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Cpu, Lightning, Save, Server, Shield, Sliders, Zap } from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  size: string;
  performance: number;
  accuracy: number;
  isLocal: boolean;
}

interface ConfigOption {
  id: string;
  name: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

const AIModelSelector: React.FC = () => {
  // Sample model data
  const embeddingModels: ModelOption[] = [
    { id: 'mxbai-small', name: 'MixedBread Embed Small', size: '50MB', performance: 85, accuracy: 88, isLocal: true },
    { id: 'mxbai-base', name: 'MixedBread Embed Base', size: '110MB', performance: 75, accuracy: 92, isLocal: true },
    { id: 'mxbai-large', name: 'MixedBread Embed Large', size: '320MB', performance: 60, accuracy: 96, isLocal: false },
  ];
  
  const translationModels: ModelOption[] = [
    { id: 'opus-tiny', name: 'Opus MT Tiny (EN-IT)', size: '40MB', performance: 90, accuracy: 82, isLocal: true },
    { id: 'opus-base', name: 'Opus MT Base (EN-IT)', size: '85MB', performance: 80, accuracy: 88, isLocal: true },
    { id: 'opus-large', name: 'Opus MT Large (EN-IT)', size: '220MB', performance: 65, accuracy: 94, isLocal: false },
  ];
  
  const speechModels: ModelOption[] = [
    { id: 'whisper-tiny', name: 'Whisper Tiny', size: '75MB', performance: 88, accuracy: 85, isLocal: true },
    { id: 'whisper-base', name: 'Whisper Base', size: '150MB', performance: 78, accuracy: 90, isLocal: true },
    { id: 'whisper-small', name: 'Whisper Small', size: '460MB', performance: 62, accuracy: 95, isLocal: false },
  ];
  
  // Configuration options
  const configOptions: ConfigOption[] = [
    { id: 'temperature', name: 'Temperature', description: 'Controls randomness of outputs', value: 0.7, min: 0, max: 1, step: 0.1 },
    { id: 'topP', name: 'Top P', description: 'Controls diversity via nucleus sampling', value: 0.9, min: 0, max: 1, step: 0.05 },
    { id: 'cacheSize', name: 'Cache Size (MB)', description: 'Maximum local storage for models', value: 500, min: 100, max: 1000, step: 100 },
    { id: 'batchSize', name: 'Batch Size', description: 'Number of parallel operations', value: 8, min: 1, max: 32, step: 1 },
  ];
  
  // State for selected models and configurations
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState(embeddingModels[0].id);
  const [selectedTranslationModel, setSelectedTranslationModel] = useState(translationModels[0].id);
  const [selectedSpeechModel, setSelectedSpeechModel] = useState(speechModels[0].id);
  const [offlineMode, setOfflineMode] = useState(true);
  const [configValues, setConfigValues] = useState<Record<string, number>>(
    configOptions.reduce((acc, option) => ({ ...acc, [option.id]: option.value }), {})
  );
  
  // Handle configuration change
  const handleConfigChange = (id: string, value: number) => {
    setConfigValues(prev => ({ ...prev, [id]: value }));
  };
  
  // Handle save configuration
  const handleSaveConfig = () => {
    console.log('Saving configuration:', {
      models: {
        embedding: selectedEmbeddingModel,
        translation: selectedTranslationModel,
        speech: selectedSpeechModel,
      },
      offlineMode,
      configValues,
    });
    // In a real app, this would save to API or local storage
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          AI Model Configuration
        </CardTitle>
        <CardDescription>
          Select and configure AI models for different learning tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="models" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="models" className="flex items-center">
              <Cpu className="mr-2 h-4 w-4" />
              Models Selection
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center">
              <Sliders className="mr-2 h-4 w-4" />
              Advanced Configuration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="space-y-6">
            <div className="space-y-6 mt-4">
              {/* Embedding Models */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Embedding Models</Label>
                  <Badge variant="outline" className="font-mono text-xs">
                    for recommendations & search
                  </Badge>
                </div>
                
                <div className="border rounded-lg p-4">
                  <Select value={selectedEmbeddingModel} onValueChange={setSelectedEmbeddingModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select embedding model" />
                    </SelectTrigger>
                    <SelectContent>
                      {embeddingModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {model.size}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Performance</Label>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ 
                            width: `${embeddingModels.find(m => m.id === selectedEmbeddingModel)?.performance || 0}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Accuracy</Label>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ 
                            width: `${embeddingModels.find(m => m.id === selectedEmbeddingModel)?.accuracy || 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Translation Models */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Translation Models</Label>
                  <Badge variant="outline" className="font-mono text-xs">
                    for language translation
                  </Badge>
                </div>
                
                <div className="border rounded-lg p-4">
                  <Select value={selectedTranslationModel} onValueChange={setSelectedTranslationModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select translation model" />
                    </SelectTrigger>
                    <SelectContent>
                      {translationModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {model.size}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Performance</Label>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ 
                            width: `${translationModels.find(m => m.id === selectedTranslationModel)?.performance || 0}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Accuracy</Label>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ 
                            width: `${translationModels.find(m => m.id === selectedTranslationModel)?.accuracy || 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Speech Recognition Models */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Speech Recognition Models</Label>
                  <Badge variant="outline" className="font-mono text-xs">
                    for pronunciation practice
                  </Badge>
                </div>
                
                <div className="border rounded-lg p-4">
                  <Select value={selectedSpeechModel} onValueChange={setSelectedSpeechModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select speech model" />
                    </SelectTrigger>
                    <SelectContent>
                      {speechModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {model.size}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Performance</Label>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ 
                            width: `${speechModels.find(m => m.id === selectedSpeechModel)?.performance || 0}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Accuracy</Label>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ 
                            width: `${speechModels.find(m => m.id === selectedSpeechModel)?.accuracy || 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Offline Mode Toggle */}
              <div className="border rounded-lg p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium flex items-center" htmlFor="offline-mode">
                    <Shield className="mr-2 h-4 w-4 text-green-600" />
                    Offline Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Process all AI tasks locally for privacy and offline use
                  </p>
                </div>
                <Switch
                  id="offline-mode"
                  checked={offlineMode}
                  onCheckedChange={setOfflineMode}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-6 mt-4">
              {/* Advanced Configuration Options */}
              {configOptions.map(option => (
                <div key={option.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">{option.name}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={configValues[option.id]}
                        onChange={(e) => handleConfigChange(option.id, parseFloat(e.target.value))}
                        className="w-20 text-right"
                        min={option.min}
                        max={option.max}
                        step={option.step}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                  <Slider
                    defaultValue={[configValues[option.id]]}
                    max={option.max}
                    min={option.min}
                    step={option.step}
                    onValueChange={(value) => handleConfigChange(option.id, value[0])}
                  />
                </div>
              ))}
              
              {/* Fallback Options */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium flex items-center">
                    <Server className="mr-2 h-4 w-4 text-purple-600" />
                    Server Fallback Settings
                  </Label>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm" htmlFor="fallback-enabled">Allow server fallback for complex tasks</Label>
                    <Switch id="fallback-enabled" defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm" htmlFor="privacy-mode">Enhanced privacy mode</Label>
                    <Switch id="privacy-mode" defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm" htmlFor="auto-optimization">Automatic model optimization</Label>
                    <Switch id="auto-optimization" defaultChecked={true} />
                  </div>
                </div>
              </div>
              
              {/* System Status */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium flex items-center">
                    <Zap className="mr-2 h-4 w-4 text-amber-500" />
                    System Status
                  </Label>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WebGPU Support:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Storage Usage:</span>
                    <span>175MB / 500MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Models:</span>
                    <span>3 local, 0 remote</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveConfig} className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIModelSelector;
