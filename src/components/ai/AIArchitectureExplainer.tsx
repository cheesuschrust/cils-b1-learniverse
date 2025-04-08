
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AIArchitectureExplainer: React.FC = () => {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle>AI Architecture Overview</CardTitle>
        <CardDescription>
          Detailed explanation of our hybrid AI architecture with client-side and server-side components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="client-side">Client-Side AI</TabsTrigger>
            <TabsTrigger value="server-side">Server-Side AI</TabsTrigger>
            <TabsTrigger value="training">Learning & Training</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-md border">
              <h3 className="text-lg font-medium mb-2">Hybrid Client-Server AI Architecture</h3>
              <p className="text-sm text-muted-foreground">
                Our application uses a hybrid AI architecture that combines the advantages of both 
                client-side and server-side AI models. This approach provides:
              </p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground mt-2 space-y-1">
                <li><strong>Privacy:</strong> Client-side models run entirely in your browser, keeping sensitive data on your device</li>
                <li><strong>Offline Support:</strong> Core functionality works without an internet connection after initial model download</li>
                <li><strong>Low Latency:</strong> Client-side processing eliminates network delays for key interactive features</li>
                <li><strong>Advanced Capabilities:</strong> Server-side models provide more sophisticated AI capabilities when needed</li>
                <li><strong>Continuous Improvement:</strong> Server models learn and improve over time while respecting privacy</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md border bg-blue-50/50">
                <h4 className="font-medium flex items-center">
                  <Badge variant="outline" className="mr-2 bg-blue-100 text-blue-800">Client-Side</Badge>
                  Browser-Based AI
                </h4>
                <p className="text-sm mt-2">
                  Lightweight models downloaded and run directly in your browser using WebGPU when available.
                  Total download size: ~295MB (downloaded progressively and cached).
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Privacy Level:</span>
                    <span className="font-medium">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning Capability:</span>
                    <span className="font-medium">None (Inference Only)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Internet Required:</span>
                    <span className="font-medium">Only for initial download</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-md border bg-green-50/50">
                <h4 className="font-medium flex items-center">
                  <Badge variant="outline" className="mr-2 bg-green-100 text-green-800">Server-Side</Badge>
                  Cloud-Based AI
                </h4>
                <p className="text-sm mt-2">
                  Powerful large language models running on secure cloud infrastructure.
                  No downloads required, processing happens on our servers.
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Privacy Level:</span>
                    <span className="font-medium">Medium (data minimized)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning Capability:</span>
                    <span className="font-medium">Full (Continuous improvement)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Internet Required:</span>
                    <span className="font-medium">Yes (Always)</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="client-side">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Client-Side Models (Hugging Face Transformers)</h3>
              <p className="text-sm text-muted-foreground">
                These models are downloaded to your device and run directly in your browser using WebAssembly and WebGPU 
                (when available). After initial download, they're cached for offline use.
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Pages Used</TableHead>
                    <TableHead>Learning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      MixedBread AI Embeddings<br/>
                      <span className="text-xs text-muted-foreground">mixedbread-ai/mxbai-embed-xsmall-v1</span>
                    </TableCell>
                    <TableCell>50MB</TableCell>
                    <TableCell>Text embeddings, semantic similarity, content comparison</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Flashcards</Badge>
                        <Badge variant="outline" className="text-xs">Speaking Practice</Badge>
                        <Badge variant="outline" className="text-xs">AI Assistant</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Inference Only</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Whisper Tiny<br/>
                      <span className="text-xs text-muted-foreground">onnx-community/whisper-tiny.en</span>
                    </TableCell>
                    <TableCell>75MB</TableCell>
                    <TableCell>Speech recognition, audio transcription, pronunciation analysis</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Speaking Practice</Badge>
                        <Badge variant="outline" className="text-xs">Pronunciation</Badge>
                        <Badge variant="outline" className="text-xs">AI Assistant</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Inference Only</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Opus MT Translation<br/>
                      <span className="text-xs text-muted-foreground">Helsinki-NLP/opus-mt-en-it & opus-mt-it-en</span>
                    </TableCell>
                    <TableCell>85MB each</TableCell>
                    <TableCell>Text translation between English and Italian</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Flashcards</Badge>
                        <Badge variant="outline" className="text-xs">Content Generator</Badge>
                        <Badge variant="outline" className="text-xs">AI Assistant</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Inference Only</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="p-4 bg-muted/20 rounded-md">
                <h4 className="font-medium mb-2">Key Implementation Details</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Download Process:</strong> Models are downloaded progressively when needed and cached in IndexedDB 
                    using the browser's Cache API.
                  </li>
                  <li>
                    <strong>Hardware Acceleration:</strong> Models leverage WebGPU on compatible devices, with automatic 
                    fallback to CPU if not available.
                  </li>
                  <li>
                    <strong>Offline Support:</strong> Once downloaded, models can be used without an internet connection.
                  </li>
                  <li>
                    <strong>Privacy:</strong> All processing happens locally in the browser, with no data sent to external servers.
                  </li>
                  <li>
                    <strong>Learning Capability:</strong> These models do not learn or adapt from user data (inference only).
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="server-side">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Server-Side Models</h3>
              <p className="text-sm text-muted-foreground">
                These models run on our secure cloud infrastructure. They provide more advanced AI capabilities
                and can learn and improve over time.
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Pages Used</TableHead>
                    <TableHead>Learning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Qwen 7B Chat<br/>
                      <span className="text-xs text-muted-foreground">Alibaba/Qwen/7B-Chat</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Server-Side</Badge>
                    </TableCell>
                    <TableCell>Advanced conversational AI, complex content generation, writing evaluation</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">AI Assistant</Badge>
                        <Badge variant="outline" className="text-xs">Content Generator</Badge>
                        <Badge variant="outline" className="text-xs">Test Preparation</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Learning Enabled</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Italian-finetuned LLM<br/>
                      <span className="text-xs text-muted-foreground">Custom fine-tuned model (Planned)</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Server-Side</Badge>
                    </TableCell>
                    <TableCell>Italian language generation, citizenship test preparation, cultural context</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Citizenship Test</Badge>
                        <Badge variant="outline" className="text-xs">Cultural Content</Badge>
                        <Badge variant="outline" className="text-xs">Italian Conversation</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Learning Enabled</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="p-4 bg-muted/20 rounded-md">
                <h4 className="font-medium mb-2">Key Implementation Details</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Hosting:</strong> Models are hosted on secure cloud infrastructure with scalable resources.
                  </li>
                  <li>
                    <strong>Learning Process:</strong> Models are continuously improved using anonymized interaction data
                    with explicit user consent.
                  </li>
                  <li>
                    <strong>Data Privacy:</strong> Personal information is minimized, and data retention is limited to
                    the necessary training period only.
                  </li>
                  <li>
                    <strong>API Access:</strong> Client applications connect to these models via secure API endpoints with
                    rate limiting and authentication.
                  </li>
                  <li>
                    <strong>Fallback Mechanisms:</strong> System can fallback to simpler models during high load or service disruption.
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="training">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Learning & Training Capabilities</h3>
              <p className="text-sm text-muted-foreground">
                Our AI system combines both non-learning client-side models and continuously improving server-side models.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Client-Side Models</CardTitle>
                    <CardDescription>Inference-only models that run in your browser</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong>Learning Capability:</strong> 
                        <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700">No Learning</Badge>
                      </div>
                      <p>
                        Client-side models (Hugging Face Transformers) are pre-trained and do not learn from user interactions.
                        They perform inference only, which means they apply their fixed knowledge to new inputs without 
                        modifying their internal parameters.
                      </p>
                      <div className="mt-2">
                        <strong>Benefits:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Enhanced privacy as no data leaves your device</li>
                          <li>Consistent performance without unexpected changes</li>
                          <li>No ongoing training costs or complexity</li>
                          <li>Works offline after initial download</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Server-Side Models</CardTitle>
                    <CardDescription>Learning-enabled models that run on our servers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong>Learning Capability:</strong> 
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">Continuous Learning</Badge>
                      </div>
                      <p>
                        Server-side models (Qwen, Custom LLMs) can learn and improve over time based on anonymized 
                        user interactions data. This enables them to enhance their performance, correct errors, and 
                        adapt to user needs.
                      </p>
                      <div className="mt-2">
                        <strong>Learning Process:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Collect anonymized interaction data with consent</li>
                          <li>Identify common patterns, errors, and improvement areas</li>
                          <li>Regular retraining and fine-tuning cycles</li>
                          <li>Validation against test sets before deployment</li>
                          <li>Gradual rollout of improved models</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Data Privacy in Training Process</h4>
                <p className="text-sm text-muted-foreground">
                  We take data privacy seriously in our AI training process. Here's how we protect your data:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  <li>Explicit consent obtained before using data for training</li>
                  <li>All personally identifiable information is removed before training</li>
                  <li>Data is anonymized and aggregated to prevent individual identification</li>
                  <li>Limited data retention period after which training data is deleted</li>
                  <li>Opt-out option available at any time through user settings</li>
                  <li>Transparency about which models learn and which don't</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIArchitectureExplainer;
