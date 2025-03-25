
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { HelpCircle, Info, AlertCircle, Server, Shield, Cpu, Code, Database, Zap, Globe } from 'lucide-react';
import { AISystemInfo, getAISystemLimitations, getAllModels } from '@/utils/AISystemInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { checkWebGPUSupport } from '@/services/HuggingFaceService';

/**
 * AISystemInfoPanel Component
 * 
 * Displays comprehensive information about the AI system used in the application.
 * Includes details about capabilities, limitations, support, and privacy.
 */
const AISystemInfoPanel = () => {
  const [hasWebGPU, setHasWebGPU] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check for WebGPU support when component mounts
  React.useEffect(() => {
    const checkGPU = async () => {
      try {
        const result = await checkWebGPUSupport();
        setHasWebGPU(result);
      } catch (error) {
        console.error('Error checking WebGPU support:', error);
        setHasWebGPU(false);
      }
    };
    
    checkGPU();
  }, []);
  
  const allModels = getAllModels();
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              {AISystemInfo.name}
            </CardTitle>
            <CardDescription>
              Version {AISystemInfo.version} • {AISystemInfo.license}
            </CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="overview">
              <Info className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="models">
              <Database className="h-4 w-4 mr-2" />
              Models
            </TabsTrigger>
            <TabsTrigger value="limitations">
              <AlertCircle className="h-4 w-4 mr-2" />
              Limitations
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                System Description
              </h3>
              <p className="text-sm">{AISystemInfo.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <Code className="h-4 w-4 mr-1" />
                Capabilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AISystemInfo.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                    <span className="text-sm">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Language Support</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium mb-1">Primary Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {AISystemInfo.languageSupport.primary.map((lang, index) => (
                        <Badge key={index} variant="secondary">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">Basic Support</p>
                    <div className="flex flex-wrap gap-1">
                      {AISystemInfo.languageSupport.basic.map((lang, index) => (
                        <Badge key={index} variant="outline">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Technical Requirements</h3>
                <div className="space-y-2">
                  {Object.entries(AISystemInfo.requirements).map(([key, value], index) => (
                    <div key={index}>
                      <p className="text-xs font-medium mb-1 capitalize">{key}</p>
                      <p className="text-sm">{value}</p>
                    </div>
                  ))}
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">WebGPU Support</p>
                    <Badge variant={hasWebGPU ? "default" : "outline"}>
                      {hasWebGPU === null ? "Checking..." : hasWebGPU ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="models" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium flex items-center">
                <Database className="h-4 w-4 mr-1" />
                Available Models
              </h3>
              <Badge variant="outline">{allModels.length} Models</Badge>
            </div>
            
            <div className="space-y-4">
              {Object.keys(AISystemInfo.models).map((category) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-xs font-medium uppercase text-muted-foreground capitalize">{category} Models</h4>
                  <div className="space-y-2">
                    {AISystemInfo.models[category].map((model, index) => (
                      <div key={index} className="bg-muted p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">{model.name}</p>
                            <p className="text-xs text-muted-foreground">{model.provider}</p>
                          </div>
                          <Badge variant="outline">{model.size}</Badge>
                        </div>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3 mr-1" />
                          <span>{model.languages.join(", ")}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Zap className="h-3 w-3 mr-1" />
                          <span>Task: {model.task}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="limitations" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Limitations
              </h3>
              <div className="space-y-2">
                {getAISystemLimitations().map((limitation, index) => (
                  <div key={index} className="flex items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="text-sm">{limitation}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Usage Guidelines</h3>
              <div className="space-y-2">
                {AISystemInfo.usageGuidelines.map((guideline, index) => (
                  <div key={index} className="flex items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="text-sm">{guideline}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Performance Metrics</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium mb-1">Text Generation</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-muted p-2 rounded-md">
                      <span className="text-xs text-muted-foreground block">Speed</span>
                      <span>{AISystemInfo.performance.textGeneration.speed}</span>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <span className="text-xs text-muted-foreground block">Quality</span>
                      <span>{AISystemInfo.performance.textGeneration.quality}</span>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <span className="text-xs text-muted-foreground block">Context</span>
                      <span>{AISystemInfo.performance.textGeneration.contextLength}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium mb-1">Speech Recognition</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-muted p-2 rounded-md">
                      <span className="text-xs text-muted-foreground block">Accuracy</span>
                      <span>{AISystemInfo.performance.speechRecognition.accuracy}</span>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <span className="text-xs text-muted-foreground block">Languages</span>
                      <span>{AISystemInfo.performance.speechRecognition.languages.join(", ")}</span>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <span className="text-xs text-muted-foreground block">Conditions</span>
                      <span>{AISystemInfo.performance.speechRecognition.conditions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Privacy & Security
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(AISystemInfo.privacy).map(([key, value], index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded mr-2">
                    <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-0.5 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-xs text-muted-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted p-4 rounded-md mt-2">
              <div className="flex items-start">
                <Server className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Client-side Processing</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    This AI system runs entirely in the browser using Hugging Face Transformers, providing privacy by processing all data locally on the user's device. No data is sent to external servers for AI processing.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Documentation
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80 text-sm">
                Internal system documentation is available to administrators. Contains detailed information on configuration, models, and optimization.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="default" size="sm" onClick={() => window.open('https://huggingface.co/docs/transformers.js', '_blank')}>
          HuggingFace Docs
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AISystemInfoPanel;
