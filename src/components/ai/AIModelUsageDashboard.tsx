
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, BarChart3, PieChart as PieChartIcon, TrendingUp, Users, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpTooltip } from '@/components/help/HelpTooltip';

const AIModelUsageDashboard: React.FC = () => {
  // Example data for the charts
  const usageData = [
    { date: '2025-01-01', queries: 1240, users: 345, newUsers: 42, responseTime: 0.9 },
    { date: '2025-01-08', queries: 1580, users: 392, newUsers: 38, responseTime: 1.1 },
    { date: '2025-01-15', queries: 1790, users: 450, newUsers: 65, responseTime: 1.0 },
    { date: '2025-01-22', queries: 2100, users: 501, newUsers: 54, responseTime: 0.8 },
    { date: '2025-01-29', queries: 2340, users: 542, newUsers: 48, responseTime: 0.7 },
    { date: '2025-02-05', queries: 2580, users: 589, newUsers: 52, responseTime: 0.8 },
    { date: '2025-02-12', queries: 2790, users: 621, newUsers: 35, responseTime: 0.9 },
    { date: '2025-02-19', queries: 3050, users: 682, newUsers: 63, responseTime: 0.8 },
    { date: '2025-02-26', queries: 3320, users: 724, newUsers: 46, responseTime: 0.7 },
    { date: '2025-03-05', queries: 3580, users: 768, newUsers: 49, responseTime: 0.6 },
    { date: '2025-03-12', queries: 3880, users: 812, newUsers: 58, responseTime: 0.7 },
    { date: '2025-03-19', queries: 4120, users: 857, newUsers: 51, responseTime: 0.8 },
  ];
  
  const modelUsage = [
    { name: 'Language Assistant', value: 42 },
    { name: 'Question Generator', value: 28 },
    { name: 'Speech Recognition', value: 12 },
    { name: 'Cultural Context', value: 10 },
    { name: 'Writing Evaluator', value: 8 },
  ];
  
  const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'];
  
  const queryTypeData = [
    { queryType: 'Translation', count: 4250 },
    { queryType: 'Grammar Help', count: 3820 },
    { queryType: 'Conversation', count: 3150 },
    { queryType: 'Vocabulary', count: 2980 },
    { queryType: 'Exam Practice', count: 2560 },
    { queryType: 'Cultural Info', count: 1890 },
    { queryType: 'Pronunciation', count: 1450 },
  ];
  
  const timeOfDayData = [
    { hour: '00:00', queries: 120 },
    { hour: '02:00', queries: 85 },
    { hour: '04:00', queries: 60 },
    { hour: '06:00', queries: 140 },
    { hour: '08:00', queries: 380 },
    { hour: '10:00', queries: 620 },
    { hour: '12:00', queries: 720 },
    { hour: '14:00', queries: 680 },
    { hour: '16:00', queries: 780 },
    { hour: '18:00', queries: 820 },
    { hour: '20:00', queries: 750 },
    { hour: '22:00', queries: 320 },
  ];
  
  const userLevelData = [
    { level: 'A1 - Beginner', users: 128 },
    { level: 'A2 - Elementary', users: 245 },
    { level: 'B1 - Intermediate', users: 342 },
    { level: 'B2 - Upper Int.', users: 185 },
    { level: 'C1 - Advanced', users: 95 },
    { level: 'C2 - Proficient', users: 42 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Usage Analytics</h2>
          <p className="text-muted-foreground">
            Insights into how users are interacting with the AI systems
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select defaultValue="last-12-weeks">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-12-weeks">Last 12 weeks</SelectItem>
              <SelectItem value="last-6-months">Last 6 months</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <HelpTooltip content="These analytics show how your Italian learning AI models are being used across the platform. You can adjust the timeframe to see different periods." />
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center">
            <BrainCircuit className="mr-2 h-4 w-4" />
            Model Usage
          </TabsTrigger>
          <TabsTrigger value="queries" className="flex items-center">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Query Types
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            User Analysis
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Usage Trends</CardTitle>
              <CardDescription>Total AI queries and active users over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={usageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="queries" 
                      name="AI Queries" 
                      stroke="#3498db" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="users" 
                      name="Active Users" 
                      stroke="#2ecc71" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Distribution</CardTitle>
                <CardDescription>Usage distribution across AI models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={modelUsage}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {modelUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Query Types</CardTitle>
                <CardDescription>Most common AI query categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={queryTypeData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="queryType" 
                        type="category" 
                        tick={{ fontSize: 12 }} 
                        width={100}
                      />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3498db" name="Queries" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="models" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
              <CardDescription>Performance metrics for each AI model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                      <span className="font-medium">Italian Language Assistant</span>
                    </div>
                    <span className="text-sm">92% accuracy</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Queries: 24,350</span>
                      <span>Avg Response Time: 0.7s</span>
                      <span>User Satisfaction: 94%</span>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-950 h-8 rounded-md overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-md" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="font-medium">Question Generator</span>
                    </div>
                    <span className="text-sm">87% accuracy</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Queries: 16,230</span>
                      <span>Avg Response Time: 1.2s</span>
                      <span>User Satisfaction: 89%</span>
                    </div>
                    <div className="bg-green-100 dark:bg-green-950 h-8 rounded-md overflow-hidden">
                      <div className="bg-green-500 h-full rounded-md" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="font-medium">Speech Recognition</span>
                    </div>
                    <span className="text-sm">85% accuracy</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Queries: 8,745</span>
                      <span>Avg Response Time: 1.8s</span>
                      <span>User Satisfaction: 82%</span>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-950 h-8 rounded-md overflow-hidden">
                      <div className="bg-yellow-500 h-full rounded-md" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                      <span className="font-medium">Cultural Context Engine</span>
                    </div>
                    <span className="text-sm">91% accuracy</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Queries: 6,120</span>
                      <span>Avg Response Time: 0.9s</span>
                      <span>User Satisfaction: 93%</span>
                    </div>
                    <div className="bg-red-100 dark:bg-red-950 h-8 rounded-md overflow-hidden">
                      <div className="bg-red-500 h-full rounded-md" style={{ width: '91%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="queries" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Query Types</CardTitle>
                <CardDescription>Most common AI query categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={queryTypeData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="queryType" 
                        type="category" 
                        tick={{ fontSize: 12 }} 
                        width={100}
                      />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3498db" name="Queries" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Time of Day Analysis</CardTitle>
                <CardDescription>AI query distribution by hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeOfDayData}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="queries" fill="#9b59b6" name="Queries" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Popular AI Interactions</CardTitle>
              <CardDescription>Most common questions and interactions with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">1.</span>
                    <span>"Come si dice... in italiano?"</span>
                  </div>
                  <Badge variant="secondary">4,250 queries</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">2.</span>
                    <span>"Correggi questa frase per favore"</span>
                  </div>
                  <Badge variant="secondary">3,820 queries</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">3.</span>
                    <span>"Qual è la differenza tra ... e ...?"</span>
                  </div>
                  <Badge variant="secondary">3,150 queries</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">4.</span>
                    <span>"Dammi un esempio di congiuntivo"</span>
                  </div>
                  <Badge variant="secondary">2,980 queries</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">5.</span>
                    <span>"Quali sono le domande comuni nell'esame CILS?"</span>
                  </div>
                  <Badge variant="secondary">2,560 queries</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Language Levels</CardTitle>
                <CardDescription>Distribution of users by Italian proficiency level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userLevelData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#2ecc71" name="Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>New Users</CardTitle>
                <CardDescription>New users interacting with AI features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={usageData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="newUsers" 
                        name="New Users" 
                        stroke="#e74c3c" 
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>How users are engaging with AI features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                      5.2
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Avg. AI queries per user per day
                    </p>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md">
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold text-green-700 dark:text-green-300">
                      78%
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Return rate for AI features
                    </p>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-md">
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                      12.5 min
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Avg. session time with AI
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Time</CardTitle>
              <CardDescription>Average AI response time in seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={usageData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis domain={[0, 'dataMax + 0.5']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      name="Response Time (s)" 
                      stroke="#9b59b6" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Accuracy by Model</CardTitle>
                <CardDescription>Accuracy rates for each AI model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Language Assistant</span>
                      <span className="text-sm">92%</span>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-950 h-3 rounded-full">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Question Generator</span>
                      <span className="text-sm">87%</span>
                    </div>
                    <div className="bg-green-100 dark:bg-green-950 h-3 rounded-full">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Speech Recognition</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-950 h-3 rounded-full">
                      <div className="bg-yellow-500 h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Cultural Context</span>
                      <span className="text-sm">91%</span>
                    </div>
                    <div className="bg-red-100 dark:bg-red-950 h-3 rounded-full">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '91%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Writing Evaluator</span>
                      <span className="text-sm">86%</span>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-950 h-3 rounded-full">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '86%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="text-sm font-medium">Average Response Time</h4>
                        <p className="text-xs text-muted-foreground">Across all AI models</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">0.8s</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BrainCircuit className="mr-2 h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="text-sm font-medium">Model Accuracy</h4>
                        <p className="text-xs text-muted-foreground">Average across all models</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">88.2%</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="text-sm font-medium">User Satisfaction</h4>
                        <p className="text-xs text-muted-foreground">Based on feedback and ratings</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">91%</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="text-sm font-medium">Improvement Rate</h4>
                        <p className="text-xs text-muted-foreground">Month-over-month accuracy growth</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold">+1.8%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIModelUsageDashboard;
