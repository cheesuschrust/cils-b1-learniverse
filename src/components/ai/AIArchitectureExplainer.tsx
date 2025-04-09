
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bot, Cpu, FileDown, Cloud, ArrowUpDown, Globe, ShieldCheck } from 'lucide-react';

const AIArchitectureExplainer: React.FC = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Architecture Explainer
        </CardTitle>
        <CardDescription>
          Detailed explanation of the AI architecture used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="clientside">Client-side AI</TabsTrigger>
            <TabsTrigger value="serverside">Server-side AI</TabsTrigger>
            <TabsTrigger value="data">Data Flow</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p>
                Our application uses a hybrid AI architecture that combines client-side and server-side models to provide a responsive, private, and powerful user experience.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Key Architecture Components</h3>
              
              <div className="mt-2 space-y-4">
                <div className="flex items-start gap-2 border-l-2 border-blue-500 pl-3">
                  <Cpu className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Client-side AI (Browser)</h4>
                    <p className="text-sm text-muted-foreground">
                      Small but powerful models (50-85MB) run directly in the user's browser. These models are downloaded once and cached for future use, enabling offline functionality. They handle tasks like text embeddings, translation, and speech recognition without sending data to servers.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 border-l-2 border-green-500 pl-3">
                  <Cloud className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Server-side AI (Cloud)</h4>
                    <p className="text-sm text-muted-foreground">
                      Larger, more powerful models (7-14GB) run on our secure cloud infrastructure. These handle complex tasks like content generation, conversation, and specialized language understanding. Only one model (Italian Fine-tuned LLM) has continuous learning capability - all others are inference-only.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 border-l-2 border-purple-500 pl-3">
                  <ArrowUpDown className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Hybrid Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      The application intelligently routes tasks between client and server based on complexity, privacy requirements, and resource needs. Simple tasks stay on the client, while complex generation goes to the server.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature Type</TableHead>
                  <TableHead>Client-side AI</TableHead>
                  <TableHead>Server-side AI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Data Privacy</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      High (100% Local)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Medium (Server Processing)
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Offline Capability</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Full Support
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      Requires Connection
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Model Complexity</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Medium (Specialized)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      High (General Purpose)
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Learning Capability</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                      None (Inference Only)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      Italian LLM Only
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="clientside" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium">Client-side AI Details</h3>
              <p>
                Our client-side AI uses optimized models that run entirely in the user's browser using WebAssembly and WebGPU acceleration (when available). All processing happens locally without sending data to external servers.
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">MixedBread AI Embeddings</CardTitle>
                  <CardDescription>50MB model for semantic understanding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Technical Details</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Text embedding model that converts language to numerical vectors</li>
                      <li>• 384-dimensional embeddings with distilled knowledge from larger models</li>
                      <li>• Optimized for in-browser execution using WebAssembly</li>
                      <li>• Downloaded once and cached for all future use</li>
                      <li>• Does not learn from user data - static model</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Used For</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Semantic similarity between texts (comparing answers)</li>
                      <li>• Grouping similar vocabulary items </li>
                      <li>• Analyzing semantic closeness of user responses</li>
                      <li>• Powering vocabulary relationship mapping</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Opus MT Translation Models</CardTitle>
                  <CardDescription>85MB each for EN-IT and IT-EN translation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Technical Details</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Specialized neural machine translation models</li>
                      <li>• Two separate models handle each translation direction</li>
                      <li>• Optimized for in-browser use with ONNX Runtime</li>
                      <li>• Downloaded and cached on first use</li>
                      <li>• Static models that perform inference only</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Used For</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Translating vocabulary items in real-time</li>
                      <li>• Powering dual-language flashcards</li>
                      <li>• Providing alternative translations for difficult phrases</li>
                      <li>• Translation tool throughout the application</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Whisper Tiny</CardTitle>
                  <CardDescription>75MB model for speech recognition</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Technical Details</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Compact automatic speech recognition model</li>
                      <li>• Optimized for recognizing Italian pronunciation</li>
                      <li>• Runs in browser using WebAssembly with lazy loading</li>
                      <li>• Only downloaded when speech recognition is needed</li>
                      <li>• Performs inference only, no continuous learning</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Used For</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Transcribing user speech for pronunciation assessment</li>
                      <li>• Speaking practice with feedback</li>
                      <li>• Voice command recognition in the application</li>
                      <li>• Dictation capabilities for writing exercises</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">DistilBERT Base</CardTitle>
                  <CardDescription>260MB model for text classification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Technical Details</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Distilled BERT model for text classification tasks</li>
                      <li>• Fine-tuned for Italian language understanding</li>
                      <li>• Browser-optimized with progressive loading</li>
                      <li>• Loaded only when text classification is needed</li>
                      <li>• Static model with no learning capabilities</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Used For</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Content classification by difficulty level</li>
                      <li>• Grammar analysis in writing exercises</li>
                      <li>• Sentiment analysis of user responses</li>
                      <li>• Topic classification for content organization</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="serverside" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium">Server-side AI Details</h3>
              <p>
                Our server-side AI models run in secure cloud environments and handle more complex tasks that require larger models. Only one model has continuous learning capabilities.
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Qwen 7B Chat</CardTitle>
                  <CardDescription>14GB language model for generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Technical Details</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• 7 billion parameter general-purpose language model</li>
                      <li>• Hosted on serverless edge functions</li>
                      <li>• Average response time: ~1 second</li>
                      <li>• Stateless implementation for security</li>
                      <li>• No continuous learning - inference only</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Used For</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• AI assistant for answering user questions</li>
                      <li>• Content generation for learning materials</li>
                      <li>• Exercise creation based on difficulty levels</li>
                      <li>• Custom feedback generation for exercises</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Implementation Status</h4>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      In Progress
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Italian-finetuned LLM</CardTitle>
                  <CardDescription>7GB specialized language model</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Technical Details</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Specialized model fine-tuned for Italian language teaching</li>
                      <li>• Hosted on dedicated cloud infrastructure</li>
                      <li>• Continuously learning and improving from interactions</li>
                      <li>• Anonymized training data from user interactions</li>
                      <li>• The only model with active learning capability</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Used For</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Italian conversation practice with feedback</li>
                      <li>• Cultural content generation for citizenship tests</li>
                      <li>• Specialized language exercises with dialect awareness</li>
                      <li>• Context-aware grammar correction</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Implementation Status</h4>
                    <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                      Planned
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">AI Data Flow & Privacy</CardTitle>
                <CardDescription>How data flows through our AI systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-medium flex items-center">
                      <ShieldCheck className="mr-2 h-5 w-5 text-green-500" />
                      Data Privacy Architecture
                    </h3>
                    <p>
                      Our AI architecture is designed with privacy as a core principle. Client-side models process data locally whenever possible, and server-side interactions follow strict privacy guidelines.
                    </p>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Cpu className="h-4 w-4 mr-1 text-blue-500" />
                        Client-side Data Flow
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• All data stays on the user's device</li>
                        <li>• Models are downloaded once and cached</li>
                        <li>• No data sent to external servers for inference</li>
                        <li>• Processing happens within the browser sandbox</li>
                        <li>• User data never leaves the browser for basic tasks</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Cloud className="h-4 w-4 mr-1 text-green-500" />
                        Server-side Data Flow
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Requests sent to secure edge functions</li>
                        <li>• Data transmitted over encrypted connections</li>
                        <li>• No persistent storage of request content</li>
                        <li>• Session-based processing only</li>
                        <li>• Only the Italian LLM learns from anonymized data</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-1 text-purple-500" />
                      Learning & Improvement Process
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Only the Italian-finetuned LLM has a learning component. Here's how it works:
                    </p>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">
                      <li>User interactions are anonymized by removing all personal identifiers</li>
                      <li>Only high-quality examples that meet quality thresholds are used for training</li>
                      <li>Data is aggregated across many users to prevent individual identification</li>
                      <li>Users can opt out of contributing to model improvement</li>
                      <li>The model is periodically retrained on accumulated examples</li>
                    </ol>
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

export default AIArchitectureExplainer;
