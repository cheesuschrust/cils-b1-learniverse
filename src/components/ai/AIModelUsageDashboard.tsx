
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, DonutChart } from '@/components/admin/charts';

const mockClientSideUsageData = [
  { name: 'Flashcards', value: 34, model: 'MixedBread Embeddings' },
  { name: 'Speaking', value: 27, model: 'Whisper Tiny' },
  { name: 'Translation', value: 21, model: 'Opus MT' },
  { name: 'Writing', value: 18, model: 'DistilBERT' },
];

const mockServerSideUsageData = [
  { name: 'Content Generation', value: 42, model: 'Qwen 7B' },
  { name: 'Question Generation', value: 31, model: 'Qwen 7B' },
  { name: 'Conversation', value: 27, model: 'Qwen 7B' },
];

const mockPerformanceData = [
  { name: 'MixedBread Embeddings', accuracy: 92, latency: 120, userSatisfaction: 4.3 },
  { name: 'Whisper Tiny', accuracy: 87, latency: 350, userSatisfaction: 3.9 },
  { name: 'Opus MT EN-IT', accuracy: 89, latency: 180, userSatisfaction: 4.1 },
  { name: 'Opus MT IT-EN', accuracy: 88, latency: 190, userSatisfaction: 4.0 },
  { name: 'DistilBERT', accuracy: 90, latency: 150, userSatisfaction: 4.2 },
  { name: 'Qwen 7B', accuracy: 94, latency: 850, userSatisfaction: 4.5 },
];

const mockClientPerformanceByDevice = [
  { name: 'High-end Desktop', avgLatency: 110, success: 99 },
  { name: 'Mid-range Laptop', avgLatency: 230, success: 97 },
  { name: 'Budget Laptop', avgLatency: 450, success: 91 },
  { name: 'Tablet', avgLatency: 380, success: 93 },
  { name: 'High-end Mobile', avgLatency: 520, success: 89 },
  { name: 'Mid-range Mobile', avgLatency: 780, success: 82 },
  { name: 'Budget Mobile', avgLatency: 920, success: 76 },
];

const mockStorageUsage = [
  { name: 'MixedBread Embeddings', size: 50 },
  { name: 'Whisper Tiny', size: 75 },
  { name: 'Opus MT Models', size: 170 },
  { name: 'DistilBERT', size: 260 },
  { name: 'Cached Data', size: 45 },
];

const mockModelUsageOverTime = [
  { month: 'Jan', whisper: 120, embeddings: 230, translation: 180, classification: 90 },
  { month: 'Feb', whisper: 150, embeddings: 280, translation: 170, classification: 110 },
  { month: 'Mar', whisper: 180, embeddings: 310, translation: 220, classification: 130 },
  { month: 'Apr', whisper: 220, embeddings: 350, translation: 250, classification: 160 },
  { month: 'May', whisper: 270, embeddings: 380, translation: 290, classification: 190 },
  { month: 'Jun', whisper: 310, embeddings: 420, translation: 330, classification: 230 },
];

const AIModelUsageDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Model Usage Dashboard</CardTitle>
          <CardDescription>
            Comprehensive overview of AI model usage, performance metrics, and resource consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="usage">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="usage">Usage Distribution</TabsTrigger>
              <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
              <TabsTrigger value="resources">Resource Consumption</TabsTrigger>
              <TabsTrigger value="trends">Usage Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="usage" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client-side Model Usage</CardTitle>
                    <CardDescription>
                      Distribution of client-side AI model usage across features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DonutChart 
                      data={mockClientSideUsageData}
                      dataKey="value"
                      nameKey="name"
                      colors={['#36A2EB', '#FFCE56', '#4BC0C0', '#FF6384']}
                    />
                    <div className="mt-4 text-xs text-muted-foreground">
                      <p className="font-medium">Note:</p>
                      <p>Client-side models are downloaded and cached in the browser. The size of each model is shown in the Resources tab.</p>
                      <p>These models run locally without sending user data to external servers, ensuring privacy.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Server-side Model Usage</CardTitle>
                    <CardDescription>
                      Distribution of server-side AI model usage across features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DonutChart 
                      data={mockServerSideUsageData}
                      dataKey="value"
                      nameKey="name"
                      colors={['#8D99AE', '#EF233C', '#2B2D42']}
                    />
                    <div className="mt-4 text-xs text-muted-foreground">
                      <p className="font-medium">Note:</p>
                      <p>Server-side models are hosted on cloud infrastructure and accessed via API.</p>
                      <p>These models are larger and more powerful but require internet connectivity.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Performance Comparison</CardTitle>
                    <CardDescription>
                      Accuracy, latency, and user satisfaction metrics by model
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart 
                      data={mockPerformanceData}
                      xAxisDataKey="name"
                      bars={[
                        { dataKey: "accuracy", fill: "#4BC0C0", name: "Accuracy (%)" },
                        { dataKey: "latency", fill: "#FF6384", name: "Latency (ms)" },
                        { dataKey: "userSatisfaction", fill: "#FFCE56", name: "User Rating (0-5)" }
                      ]}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Client Performance by Device</CardTitle>
                    <CardDescription>
                      How client-side models perform across different devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart 
                      data={mockClientPerformanceByDevice}
                      xAxisDataKey="name"
                      bars={[
                        { dataKey: "avgLatency", fill: "#FF6384", name: "Avg. Latency (ms)" },
                        { dataKey: "success", fill: "#4BC0C0", name: "Success Rate (%)" }
                      ]}
                    />
                    <div className="mt-4 text-xs text-muted-foreground">
                      <p>Performance varies significantly by device capability. Lower-end devices may experience longer load times and processing delays.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client-side Storage Usage</CardTitle>
                    <CardDescription>
                      Browser storage consumed by downloaded models and cached data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart 
                      data={mockStorageUsage}
                      xAxisDataKey="name"
                      bars={[
                        { dataKey: "size", fill: "#36A2EB", name: "Size (MB)" }
                      ]}
                    />
                    <div className="mt-4 text-xs text-muted-foreground">
                      <p className="font-medium">Total Local Storage Usage: 600 MB</p>
                      <p>Models are downloaded once and cached in the browser for future use.</p>
                      <p>Users can clear cache to free up space, but models will need to be re-downloaded.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Optimization</CardTitle>
                    <CardDescription>
                      Strategies for optimizing AI model resource usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Progressive Web App (PWA) Implementation</h4>
                      <p className="text-sm text-muted-foreground">Using PWA features to manage model downloads and cache efficiently.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Quantized Models</h4>
                      <p className="text-sm text-muted-foreground">Using 8-bit quantization to reduce model size by 65-75% with minimal accuracy loss.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">WebGPU Acceleration</h4>
                      <p className="text-sm text-muted-foreground">Leveraging WebGPU for up to 3x faster inference on supported browsers and devices.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Model Streaming</h4>
                      <p className="text-sm text-muted-foreground">Streaming large models in chunks to allow immediate usage while still downloading.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Hybrid Execution</h4>
                      <p className="text-sm text-muted-foreground">Switching between client and server models based on device capability and network conditions.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Usage Over Time</CardTitle>
                  <CardDescription>
                    Monthly usage trends for different AI models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={mockModelUsageOverTime}
                    xAxisDataKey="month"
                    lines={[
                      { dataKey: "whisper", stroke: "#FF6384", name: "Speech Recognition" },
                      { dataKey: "embeddings", stroke: "#36A2EB", name: "Text Embeddings" },
                      { dataKey: "translation", stroke: "#FFCE56", name: "Translation" },
                      { dataKey: "classification", stroke: "#4BC0C0", name: "Text Classification" }
                    ]}
                  />
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>Client-side model usage has been steadily increasing as more users adopt the application.</p>
                    <p>Speech recognition and embedding models are the most frequently used features.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelUsageDashboard;
