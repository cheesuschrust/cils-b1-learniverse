
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const AIArchitectureExplainer: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Architecture Implementation</CardTitle>
        <CardDescription>
          Detailed explanation of our AI implementation architecture, including client-side and server-side components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="client">Client-Side AI</TabsTrigger>
            <TabsTrigger value="server">Server-Side AI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="prose max-w-none">
              <h3>Hybrid AI Implementation Architecture</h3>
              <p>
                Our system utilizes a hybrid approach to AI implementation, combining client-side and server-side models 
                to optimize for performance, privacy, and capability.
              </p>
              
              <h4>Key Architectural Components:</h4>
              <ul>
                <li>
                  <strong>Client-Side Models:</strong> Smaller, optimized models from Hugging Face that run directly in the user's browser 
                  using WebAssembly and WebGPU (when available). These models handle tasks like speech recognition, translation, 
                  text embeddings, and classification.
                </li>
                <li>
                  <strong>Server-Side Models:</strong> Larger, more powerful models hosted on cloud infrastructure, 
                  including Qwen models for complex generation tasks. These handle content generation, conversation, 
                  and specialized language processing.
                </li>
                <li>
                  <strong>Progressive Enhancement:</strong> The system intelligently falls back to server-side processing 
                  when client capabilities are insufficient.
                </li>
                <li>
                  <strong>Privacy-Focused Design:</strong> Whenever possible, processing happens locally on the client to minimize 
                  data transmission and enhance privacy.
                </li>
              </ul>
              
              <h4>Learning vs. Inference:</h4>
              <p>
                Most models in our system operate in <strong>inference-only mode</strong>, meaning they don't learn or 
                adapt from user interactions. They apply pre-trained knowledge to generate outputs. The exceptions are:
              </p>
              <ul>
                <li>
                  <strong>Content Recommendation Engine:</strong> Adapts based on user interactions to improve content suggestions (server-side).
                </li>
                <li>
                  <strong>Specialized Italian Language Model:</strong> Periodically fine-tuned based on aggregated user data to improve 
                  Italian language capabilities (server-side only).
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="client" className="space-y-4 pt-4">
            <div className="prose max-w-none">
              <h3>Client-Side AI Implementation (Hugging Face)</h3>
              
              <p>
                Our client-side AI implementation leverages Hugging Face Transformers.js, which allows running machine learning models 
                directly in the browser without sending user data to external servers.
              </p>
              
              <h4>Download & Storage:</h4>
              <p>
                Models are downloaded from Hugging Face's model hub the first time they're needed and then cached in the browser's 
                IndexedDB storage. This means:
              </p>
              <ul>
                <li>Initial load requires downloading models (50MB - 260MB each)</li>
                <li>Subsequent visits use cached models with no download needed</li>
                <li>Models can be updated when new versions are available</li>
                <li>Users can manually clear the cache if storage space is a concern</li>
              </ul>
              
              <h4>Performance Optimizations:</h4>
              <ul>
                <li>
                  <strong>WebGPU Acceleration:</strong> On supported browsers/devices, models use GPU acceleration for faster inference.
                </li>
                <li>
                  <strong>Quantized Models:</strong> We use 8-bit quantized models to reduce size and improve performance.
                </li>
                <li>
                  <strong>Progressive Loading:</strong> UI remains responsive while models load in the background.
                </li>
                <li>
                  <strong>Lazy Loading:</strong> Models are only loaded when needed for specific features.
                </li>
              </ul>
              
              <h4>Client-Side Models Implementation by Page:</h4>
              <div className="not-prose">
                <dl className="space-y-4 mt-4">
                  <div className="border rounded-md p-3">
                    <dt className="font-semibold flex items-center gap-2">
                      Flashcards Page
                      <Badge variant="outline">MixedBread AI Embeddings</Badge>
                      <Badge variant="outline">Opus MT Translation</Badge>
                    </dt>
                    <dd className="text-sm mt-1">
                      Uses text embeddings to measure similarity between user responses and correct answers. 
                      Translation models convert content between English and Italian for bilingual flashcards. 
                      All processing happens locally on device.
                    </dd>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <dt className="font-semibold flex items-center gap-2">
                      Speaking Practice
                      <Badge variant="outline">Whisper Tiny</Badge>
                      <Badge variant="outline">MixedBread AI Embeddings</Badge>
                    </dt>
                    <dd className="text-sm mt-1">
                      Uses Whisper for speech recognition to transcribe user's spoken Italian. Text embeddings 
                      compare transcription with expected text to evaluate pronunciation accuracy. 
                      Processing happens entirely in the browser for privacy.
                    </dd>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <dt className="font-semibold flex items-center gap-2">
                      Writing Assessment
                      <Badge variant="outline">DistilBERT</Badge>
                      <Badge variant="outline">MixedBread AI Embeddings</Badge>
                    </dt>
                    <dd className="text-sm mt-1">
                      Uses DistilBERT for grammar analysis and text classification. Embeddings measure semantic 
                      similarity between user writing and reference texts. Simple error detection happens client-side, 
                      while complex analysis may leverage server-side processing.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="server" className="space-y-4 pt-4">
            <div className="prose max-w-none">
              <h3>Server-Side AI Implementation (Qwen & Others)</h3>
              
              <p>
                Our server-side AI implementation uses Supabase Edge Functions to host API endpoints that leverage more powerful 
                AI models for complex generation tasks.
              </p>
              
              <h4>Model Hosting:</h4>
              <p>
                Server-side models are hosted on cloud infrastructure and accessed via API endpoints. This approach allows using 
                larger models that wouldn't fit in browser environments.
              </p>
              
              <h4>Key Server-Side Capabilities:</h4>
              <ul>
                <li>
                  <strong>Content Generation:</strong> Creating Italian learning content, examples, and exercises.
                </li>
                <li>
                  <strong>Conversation:</strong> Powering the AI tutor for interactive Italian conversations.
                </li>
                <li>
                  <strong>Question Generation:</strong> Creating custom quizzes and tests based on specific topics.
                </li>
                <li>
                  <strong>Complex Analysis:</strong> Performing deep language analysis that exceeds client capabilities.
                </li>
              </ul>
              
              <h4>Implementation Details:</h4>
              <ul>
                <li>Serverless architecture using Supabase Edge Functions</li>
                <li>Rate limiting to manage resource consumption</li>
                <li>Caching common requests to improve performance</li>
                <li>User-specific context management for personalization</li>
              </ul>
              
              <h4>Server-Side Models Implementation by Page:</h4>
              <div className="not-prose">
                <dl className="space-y-4 mt-4">
                  <div className="border rounded-md p-3">
                    <dt className="font-semibold flex items-center gap-2">
                      AI Assistant
                      <Badge variant="secondary">Qwen 7B Chat</Badge>
                    </dt>
                    <dd className="text-sm mt-1">
                      Uses Qwen 7B Chat model to provide conversational Italian practice and answer questions about 
                      Italian language and culture. The model maintains conversation context to provide coherent responses 
                      across multiple turns. Hosted on serverless edge functions.
                    </dd>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <dt className="font-semibold flex items-center gap-2">
                      Content Generator
                      <Badge variant="secondary">Qwen 7B Chat</Badge>
                    </dt>
                    <dd className="text-sm mt-1">
                      Uses Qwen 7B to generate custom Italian learning content based on user specifications 
                      (topic, difficulty level, etc.). Generates reading passages, dialogue examples, and 
                      cultural explanations. Access controlled by user subscription tier.
                    </dd>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <dt className="font-semibold flex items-center gap-2">
                      Citizenship Test Prep
                      <Badge variant="secondary">Italian-finetuned LLM</Badge>
                      <Badge>Planned</Badge>
                    </dt>
                    <dd className="text-sm mt-1">
                      Will use a specialized model fine-tuned with Italian citizenship test materials to generate 
                      practice questions and provide explanations of Italian civics, history, and culture. 
                      Currently in development with planned 2025 release.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIArchitectureExplainer;
