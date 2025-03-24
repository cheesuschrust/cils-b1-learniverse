
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, FileUp, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAI } from '@/hooks/useAI';

const AITrainingManagerWrapper = () => {
  const { isProcessing, generateText } = useAI();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = React.useState('examples');
  const [trainingStatus, setTrainingStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const handleAddExamples = () => {
    setTrainingStatus('loading');
    
    setTimeout(() => {
      setTrainingStatus('success');
      toast({
        title: "Training examples added",
        description: "New examples have been added to improve AI performance",
      });
    }, 1500);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Training Manager
        </CardTitle>
        <CardDescription>
          Add training examples and manage AI performance
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="examples">Training Examples</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="examples" className="space-y-4 pt-4">
            <div className="flex flex-col gap-2 mb-4">
              <div className="text-sm text-muted-foreground">
                Add training examples to improve AI accuracy and confidence.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Button 
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-auto py-3 px-4"
                  onClick={handleAddExamples}
                  disabled={isProcessing || trainingStatus === 'loading'}
                >
                  <FileUp className="h-4 w-4 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">Upload Examples</div>
                    <div className="text-xs text-muted-foreground">
                      Add examples from a file
                    </div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-auto py-3 px-4"
                  onClick={handleAddExamples}
                  disabled={isProcessing || trainingStatus === 'loading'}
                >
                  <Check className="h-4 w-4 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">Manual Examples</div>
                    <div className="text-xs text-muted-foreground">
                      Add examples manually
                    </div>
                  </div>
                </Button>
              </div>
              
              {trainingStatus === 'loading' && (
                <div className="flex items-center gap-2 text-sm mt-4">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processing training examples...</span>
                </div>
              )}
              
              {trainingStatus === 'success' && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500 mt-4">
                  <Check className="h-4 w-4" />
                  <span>Training examples successfully added</span>
                </div>
              )}
              
              {trainingStatus === 'error' && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-500 mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Error adding training examples</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4 pt-4">
            <div className="text-sm text-muted-foreground mb-4">
              View and analyze AI performance metrics.
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm font-medium mb-1">Confidence Score</div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-xs text-muted-foreground mt-1">+3% from last week</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-sm font-medium mb-1">Accuracy</div>
                <div className="text-2xl font-bold">92%</div>
                <div className="text-xs text-muted-foreground mt-1">+1% from last week</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Configure AI training settings.
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Training Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Check className="mr-2 h-4 w-4" />
                Export Training Metrics
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AITrainingManagerWrapper;
