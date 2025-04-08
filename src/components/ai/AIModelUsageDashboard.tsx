
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart, PieChart, DonutChart } from '@/components/admin/charts';
import { Badge } from '@/components/ui/badge';

const AIModelUsageDashboard: React.FC = () => {
  // Model usage data by type
  const modelUsageData = [
    { name: 'Embeddings (MixedBread)', value: 42, fill: '#8884d8' },
    { name: 'Translation (Opus MT)', value: 28, fill: '#82ca9d' },
    { name: 'Speech Recognition', value: 18, fill: '#ffc658' },
    { name: 'Text Classification', value: 12, fill: '#ff8042' }
  ];

  // Model usage by page
  const pageUsageData = [
    { name: 'Flashcards', embeddings: 15, translation: 12, speech: 0, classification: 3 },
    { name: 'Speaking Practice', embeddings: 8, translation: 5, speech: 12, classification: 2 },
    { name: 'AI Assistant', embeddings: 12, translation: 10, speech: 6, classification: 4 },
    { name: 'Test Preparation', embeddings: 7, translation: 1, speech: 0, classification: 3 }
  ];

  // Performance metrics
  const performanceData = [
    { name: 'Day 1', client: 1200, server: 350 },
    { name: 'Day 2', client: 1300, server: 380 },
    { name: 'Day 3', client: 1400, server: 410 },
    { name: 'Day 4', client: 1350, server: 390 },
    { name: 'Day 5', client: 1500, server: 430 },
    { name: 'Day 6', client: 1600, server: 450 },
    { name: 'Day 7', client: 1750, server: 470 }
  ];

  // Download size data
  const downloadSizeData = [
    { name: 'MixedBread Embeddings', size: 50, category: 'Embeddings' },
    { name: 'Whisper Tiny', size: 75, category: 'Speech' },
    { name: 'Opus MT (EN-IT)', size: 85, category: 'Translation' },
    { name: 'Opus MT (IT-EN)', size: 85, category: 'Translation' }
  ];

  // Hardware acceleration usage
  const hardwareAccelerationData = [
    { name: 'WebGPU Supported', value: 68 },
    { name: 'CPU Fallback', value: 32 }
  ];

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>AI Model Usage Dashboard</CardTitle>
            <CardDescription>
              Analytics on AI model usage, performance, and resource consumption
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Client-side AI
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Server-side AI
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="usage">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="usage">Usage Distribution</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="resources">Resource Usage</TabsTrigger>
            <TabsTrigger value="pages">Page Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Client-Side Model Usage</h3>
                <div className="h-80">
                  <PieChart 
                    data={modelUsageData}
                    dataKey="value"
                    nameKey="name"
                    legend={true}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Distribution of client-side AI model usage by type
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Model Usage Trends</h3>
                <div className="h-80">
                  <LineChart 
                    data={[
                      { date: 'Mon', embeddings: 10, translation: 8, speech: 5, classification: 3 },
                      { date: 'Tue', embeddings: 12, translation: 9, speech: 6, classification: 4 },
                      { date: 'Wed', embeddings: 15, translation: 11, speech: 7, classification: 5 },
                      { date: 'Thu', embeddings: 18, translation: 12, speech: 8, classification: 6 },
                      { date: 'Fri', embeddings: 20, translation: 15, speech: 10, classification: 7 },
                      { date: 'Sat', embeddings: 22, translation: 17, speech: 12, classification: 8 },
                      { date: 'Sun', embeddings: 25, translation: 18, speech: 15, classification: 9 }
                    ]}
                    xAxisDataKey="date"
                    series={[
                      { dataKey: 'embeddings', name: 'Embeddings', color: '#8884d8' },
                      { dataKey: 'translation', name: 'Translation', color: '#82ca9d' },
                      { dataKey: 'speech', name: 'Speech', color: '#ffc658' },
                      { dataKey: 'classification', name: 'Classification', color: '#ff8042' }
                    ]}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Weekly trends in AI model usage by type
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Processing Time Comparison</h3>
                <div className="h-80">
                  <LineChart 
                    data={performanceData}
                    xAxisDataKey="name"
                    series={[
                      { dataKey: 'client', name: 'Client-Side Processing (ms)', color: '#8884d8' },
                      { dataKey: 'server', name: 'Server-Side Processing (ms)', color: '#82ca9d' }
                    ]}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Comparison of client vs server processing times (milliseconds)
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Model Inference Accuracy</h3>
                <div className="h-80">
                  <BarChart 
                    data={[
                      { model: 'Embeddings', accuracy: 92 },
                      { model: 'Translation', accuracy: 88 },
                      { model: 'Speech', accuracy: 85 },
                      { model: 'Classification', accuracy: 90 },
                      { model: 'Server LLM', accuracy: 95 }
                    ]}
                    xAxisDataKey="model"
                    series={[
                      { dataKey: 'accuracy', name: 'Accuracy (%)', color: '#8884d8' }
                    ]}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Model accuracy percentages based on evaluation metrics
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-muted/20 rounded-md">
              <h3 className="text-lg font-medium mb-2">Performance Optimization Tips</h3>
              <ul className="list-disc pl-6 text-sm space-y-1">
                <li>Enable WebGPU in your browser settings for up to 3x faster AI processing</li>
                <li>Preload models for frequently used features to eliminate initial loading delays</li>
                <li>For speech recognition, use a high-quality microphone in a quiet environment</li>
                <li>Only load the models you need for your current activity to conserve memory</li>
                <li>Check your hardware acceleration status in the Resources tab</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Model Download Sizes</h3>
                <div className="h-80">
                  <BarChart 
                    data={downloadSizeData}
                    xAxisDataKey="name"
                    series={[
                      { dataKey: 'size', name: 'Size (MB)', color: '#8884d8' }
                    ]}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Download size of each client-side model in megabytes
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Hardware Acceleration Usage</h3>
                <div className="h-80">
                  <DonutChart 
                    data={hardwareAccelerationData}
                    dataKey="value"
                    nameKey="name"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Percentage of users with WebGPU hardware acceleration
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-muted/20 rounded-md">
              <h3 className="text-lg font-medium mb-2">Resource Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Storage Usage</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      <div className="flex justify-between">
                        <span>Total Model Storage:</span>
                        <span className="font-medium">295 MB</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex justify-between">
                        <span>User Data Cache:</span>
                        <span className="font-medium">25 MB</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex justify-between">
                        <span>Application Storage:</span>
                        <span className="font-medium">15 MB</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">335 MB</span>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Memory Usage (Average)</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      <div className="flex justify-between">
                        <span>Embeddings Model:</span>
                        <span className="font-medium">120 MB</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex justify-between">
                        <span>Translation Model:</span>
                        <span className="font-medium">180 MB</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex justify-between">
                        <span>Speech Recognition:</span>
                        <span className="font-medium">150 MB</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="pages" className="space-y-4">
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">AI Usage by Page</h3>
              <div className="h-80">
                <BarChart 
                  data={pageUsageData}
                  xAxisDataKey="name"
                  series={[
                    { dataKey: 'embeddings', name: 'Embeddings', color: '#8884d8' },
                    { dataKey: 'translation', name: 'Translation', color: '#82ca9d' },
                    { dataKey: 'speech', name: 'Speech', color: '#ffc658' },
                    { dataKey: 'classification', name: 'Classification', color: '#ff8042' }
                  ]}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Distribution of AI model usage across different pages
              </p>
            </div>
            
            <div className="mt-4 p-4 bg-muted/20 rounded-md">
              <h3 className="text-lg font-medium mb-2">Page-Specific AI Implementation</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Flashcards Page</h4>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>Embeddings:</strong> Used for semantic similarity between terms and definitions</li>
                    <li><strong>Translation:</strong> Provides translations for flashcard content</li>
                    <li><strong>Classification:</strong> Categorizes flashcards by difficulty and topic</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Speaking Practice</h4>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>Speech Recognition:</strong> Transcribes user's spoken Italian for evaluation</li>
                    <li><strong>Embeddings:</strong> Compares spoken text similarity to expected phrases</li>
                    <li><strong>Translation:</strong> Provides guidance in user's native language</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">AI Assistant</h4>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>Server LLM:</strong> Powers conversational capabilities and complex interactions</li>
                    <li><strong>Embeddings:</strong> Analyzes conversation context and retrieves relevant responses</li>
                    <li><strong>Translation:</strong> Handles bilingual conversation capabilities</li>
                    <li><strong>Speech:</strong> Enables voice interaction with the assistant</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Test Preparation</h4>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>Server LLM:</strong> Generates test questions and evaluates responses</li>
                    <li><strong>Embeddings:</strong> Measures answer similarity and provides scoring</li>
                    <li><strong>Classification:</strong> Identifies question types and difficulty levels</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIModelUsageDashboard;
