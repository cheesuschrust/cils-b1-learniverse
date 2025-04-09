
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Cpu, Database, Gauge, Lock, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AIPlatformDetails: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Platform Architecture</CardTitle>
        <CardDescription>
          Technical details of our AI implementation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="client-side">
          <TabsList className="mb-4">
            <TabsTrigger value="client-side">Client-Side AI</TabsTrigger>
            <TabsTrigger value="server-side">Server-Side AI</TabsTrigger>
            <TabsTrigger value="security">Security & Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="client-side" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg border p-4 bg-blue-50">
                <div className="flex items-center mb-2">
                  <Cpu className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold">Client-Side AI Architecture</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our language learning platform uses Hugging Face Transformers.js to run efficient AI models 
                  directly in your browser. These models are downloaded once and cached locally,
                  enabling offline functionality and ensuring your data never leaves your device.
                </p>
                
                <div className="mt-3 space-y-3">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <h4 className="text-sm font-medium">Hugging Face Transformers</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Transformers.js allows us to run optimized, WebAssembly-compiled versions of popular
                      machine learning models directly in your browser. Models are quantized and optimized
                      for browser environments.
                    </p>
                    <div className="flex mt-2 gap-2">
                      <Badge variant="outline" className="text-xs">WebAssembly</Badge>
                      <Badge variant="outline" className="text-xs">ONNX Runtime</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <h4 className="text-sm font-medium">WebGPU Acceleration</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      On supported browsers, we use WebGPU to accelerate inference by up to 3x.
                      This technology enables high-performance ML processing directly on your GPU.
                      For older browsers, we automatically fall back to CPU processing.
                    </p>
                    <div className="flex mt-2 gap-2">
                      <Badge variant="outline" className="text-xs">WebGPU</Badge>
                      <Badge variant="outline" className="text-xs">WebGL Fallback</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center mb-2">
                  <Database className="h-5 w-5 text-orange-500 mr-2" />
                  <h3 className="font-semibold">Model Caching & Storage</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our platform intelligently manages model downloads and storage, minimizing bandwidth
                  usage while ensuring optimal performance.
                </p>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded bg-muted/50 p-2">
                    <span className="text-xs font-medium">IndexedDB Storage</span>
                    <span className="text-xs">100-250MB total</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-muted/50 p-2">
                    <span className="text-xs font-medium">Background Download</span>
                    <span className="text-xs">Progressive & Resumable</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-muted/50 p-2">
                    <span className="text-xs font-medium">Offline Availability</span>
                    <span className="text-xs">100% after initial download</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="server-side">
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center mb-2">
                  <Server className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="font-semibold">Server-Side AI Capabilities</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  For more complex AI tasks, we use server-side processing with larger, more powerful models.
                </p>
                
                <div className="mt-3 space-y-3">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <h4 className="text-sm font-medium">Content Generation & Analysis</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Our server-side models generate personalized learning content, analyze complex
                      writing samples, and provide detailed grammatical feedback. These models are significantly
                      larger than client-side models and require substantial computing resources.
                    </p>
                    <div className="flex mt-2 gap-2">
                      <Badge variant="outline" className="text-xs">Supabase Edge Functions</Badge>
                      <Badge variant="outline" className="text-xs">AI API Integration</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <h4 className="text-sm font-medium">Multi-Model Orchestration</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Our platform intelligently routes AI tasks to the appropriate model based on
                      complexity, latency requirements, and privacy considerations. Simple tasks are
                      handled in-browser, while complex tasks use server resources.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center mb-2">
                  <Lock className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-semibold">Privacy & Security</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our platform is designed with privacy as a core principle, minimizing data transmission
                  and ensuring secure processing.
                </p>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-start p-2 rounded bg-muted/50">
                    <Gauge className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium">Client-Side Processing</span>
                      <p className="text-xs text-muted-foreground">User data for translations, embeddings, and speech recognition never leaves your device</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-2 rounded bg-muted/50">
                    <Lock className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium">End-to-End Encryption</span>
                      <p className="text-xs text-muted-foreground">All server communications use TLS 1.3 with state-of-the-art encryption</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-2 rounded bg-muted/50">
                    <Brain className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium">No Training on User Data</span>
                      <p className="text-xs text-muted-foreground">Models are pre-trained and do not learn from your inputs or store your content</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIPlatformDetails;
