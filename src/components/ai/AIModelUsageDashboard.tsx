
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BrainCircuit, Cpu, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const modelUsageData = [
  {
    name: 'Jan',
    embeddings: 2400,
    translation: 1800,
    speech: 800,
  },
  {
    name: 'Feb',
    embeddings: 3000,
    translation: 2200,
    speech: 1200,
  },
  {
    name: 'Mar',
    embeddings: 2800,
    translation: 2600,
    speech: 1600,
  },
  {
    name: 'Apr',
    embeddings: 3600,
    translation: 2900,
    speech: 2100,
  },
  {
    name: 'May',
    embeddings: 4200,
    translation: 3200,
    speech: 2400,
  },
  {
    name: 'Jun',
    embeddings: 3800,
    translation: 3000,
    speech: 2200,
  },
];

const modelDistributionData = [
  { name: 'MixedBread Embeddings', value: 45, color: '#8884d8' },
  { name: 'Opus MT Translation', value: 35, color: '#82ca9d' },
  { name: 'Whisper Tiny', value: 20, color: '#ffc658' },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const AIModelUsageDashboard: React.FC = () => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center">
              <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
              AI Model Usage Dashboard
            </CardTitle>
            <CardDescription>
              Analytics for AI model usage across the platform
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            Last 6 Months
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="usage" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Usage Trends
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center">
              <PieChartIcon className="mr-2 h-4 w-4" />
              Model Distribution
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="space-y-4">
            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Cpu className="h-4 w-4 mr-2 text-blue-600" />
                Monthly API Calls by Model Type
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={modelUsageData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="embeddings" name="Embeddings" fill="#8884d8" />
                    <Bar dataKey="translation" name="Translation" fill="#82ca9d" />
                    <Bar dataKey="speech" name="Speech Recognition" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#8884d8] mb-1"></div>
                  <span className="font-medium">Embeddings</span>
                  <span className="text-muted-foreground text-xs">MixedBread Models</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#82ca9d] mb-1"></div>
                  <span className="font-medium">Translation</span>
                  <span className="text-muted-foreground text-xs">Opus MT Models</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#ffc658] mb-1"></div>
                  <span className="font-medium">Speech</span>
                  <span className="text-muted-foreground text-xs">Whisper Models</span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Embeddings models show the highest usage across all months, with consistent growth. 
                Translation models show seasonal fluctuations, while speech recognition is steadily 
                increasing as more users discover voice features.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-4">
            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3">Overall API Call Distribution</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {modelDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                {modelDistributionData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: entry.color }}></div>
                    <span className="font-medium">{entry.name}</span>
                    <span className="text-muted-foreground text-xs">{entry.value}% of calls</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Model Usage Insights</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-[#8884d8] mt-1.5 mr-2"></div>
                  <span>Embedding models are primarily used for semantic search and content recommendations</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-[#82ca9d] mt-1.5 mr-2"></div>
                  <span>Translation models power the bilingual content and user interface elements</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-[#ffc658] mt-1.5 mr-2"></div>
                  <span>Speech recognition is growing in usage as pronunciation features gain popularity</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIModelUsageDashboard;
