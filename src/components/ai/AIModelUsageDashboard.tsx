
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Bot, Cpu, FileDown, Database, Clock, ArrowUpCircle } from 'lucide-react';

const AIModelUsageDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Model Usage Dashboard
        </CardTitle>
        <CardDescription>
          Detailed metrics on AI model usage, performance, and integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="usage">
          <TabsList className="mb-4">
            <TabsTrigger value="usage">Usage & Performance</TabsTrigger>
            <TabsTrigger value="integration">Integration Map</TabsTrigger>
            <TabsTrigger value="resource">Resource Usage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client-side models */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Client-side Models</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Browser</Badge>
                  </div>
                  <CardDescription>Models running in user's browser</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium">MixedBread AI Embeddings</div>
                      <div className="text-sm text-muted-foreground">50 MB</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={100} className="h-2 flex-1" />
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Runs entirely in browser, no data sent to servers. Used for text similarity and matching.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium">Opus MT (IT-EN/EN-IT)</div>
                      <div className="text-sm text-muted-foreground">85 MB each</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={100} className="h-2 flex-1" />
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Translation models that run in the browser. No external API calls for basic translation tasks.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium">Whisper Tiny</div>
                      <div className="text-sm text-muted-foreground">75 MB</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={100} className="h-2 flex-1" />
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Available</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Speech recognition for pronunciation exercises. Only loaded when needed.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Server-side models */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Server-side Models</CardTitle>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Cloud</Badge>
                  </div>
                  <CardDescription>Models running on our servers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium">Qwen 7B Chat</div>
                      <div className="text-sm text-muted-foreground">14 GB</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={70} className="h-2 flex-1" />
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 text-xs">In Progress</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Language model for content generation and chat interfaces. Runs on our servers.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium">Italian Fine-tuned LLM</div>
                      <div className="text-sm text-muted-foreground">7 GB</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={30} className="h-2 flex-1" />
                      <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200 text-xs">Planned</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Specialized language model for Italian learning. The only model with continuous learning capability.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Model Learning & Training Status</CardTitle>
                <CardDescription>How models are updated and trained in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-3">
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <Cpu className="h-4 w-4 mr-1 text-blue-500" />
                        Client-side Models
                      </h4>
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 mb-2">
                        Inference Only
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        These models are pre-trained and do not learn from user data. They perform inference only.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <Database className="h-4 w-4 mr-1 text-green-500" />
                        Qwen 7B Chat
                      </h4>
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 mb-2">
                        Inference Only
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        This server-side model uses a fixed model that does not update from user interactions.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <ArrowUpCircle className="h-4 w-4 mr-1 text-purple-500" />
                        Italian Fine-tuned LLM
                      </h4>
                      <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200 mb-2">
                        Continuous Learning
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        This model has continuous learning capability from user interactions and feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integration" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Flashcards page */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Flashcards Page</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">MixedBread Embeddings</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        Used to compare answer similarity and group related flashcards.
                      </p>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Opus MT</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        Powers the translation feature in flashcards for dual-language display.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Speaking Practice */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Speaking Practice</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Whisper Tiny</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        Transcribes user speech for pronunciation assessment.
                      </p>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">MixedBread Embeddings</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        Compares user pronunciation with expected text semantically.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Content Generator */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Content Generator</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Qwen 7B Chat</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        Generates customized learning content and exercises.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resource" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Resource Requirements</CardTitle>
                <CardDescription>Hardware and network resources for AI functionality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Client-side Requirements</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Disk Space (Models):</span>
                        <span className="font-medium">~210 MB total</span>
                      </li>
                      <li className="flex justify-between">
                        <span>RAM Usage (Peak):</span>
                        <span className="font-medium">~300 MB</span>
                      </li>
                      <li className="flex justify-between">
                        <span>WebGPU Acceleration:</span>
                        <span className="font-medium text-green-600">3x Performance Boost</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Initial Download:</span>
                        <span className="font-medium">One-time, cached</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h3 className="text-sm font-medium mb-2">Server-side Resources</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>GPU Compute:</span>
                        <span className="font-medium">On-demand scaling</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-medium">~600ms average</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Data Privacy:</span>
                        <span className="font-medium">Session data only</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIModelUsageDashboard;
