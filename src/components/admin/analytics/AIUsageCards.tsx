
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AIUsageCards: React.FC = () => {
  // Mock data for AI usage over time
  const usageData = [
    { date: '2023-03-01', calls: 38450, tokens: 5.2 },
    { date: '2023-04-01', calls: 42280, tokens: 5.8 },
    { date: '2023-05-01', calls: 45120, tokens: 6.1 },
    { date: '2023-06-01', calls: 48980, tokens: 6.5 },
    { date: '2023-07-01', calls: 51240, tokens: 6.8 },
    { date: '2023-08-01', calls: 56350, tokens: 7.4 },
  ];
  
  // Mock data for AI usage by feature
  const featureUsageData = [
    { feature: 'Q Generation', beginner: 12450, intermediate: 18320, advanced: 8640 },
    { feature: 'Translation', beginner: 9840, intermediate: 11250, advanced: 4920 },
    { feature: 'Evaluation', beginner: 5690, intermediate: 7840, advanced: 3210 },
    { feature: 'Classification', beginner: 4320, intermediate: 6750, advanced: 2980 },
    { feature: 'Corrections', beginner: 8940, intermediate: 10320, advanced: 6540 },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>AI Usage Trends</CardTitle>
            <CardDescription>Monthly API calls and token consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={usageData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="calls" 
                    stroke="#6366f1" 
                    fill="#6366f1" 
                    fillOpacity={0.3}
                    name="API Calls"
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="tokens" 
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="Tokens (millions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>AI usage and cost distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Monthly Cost</div>
                <div className="text-3xl font-bold">$1,842</div>
                <div className="text-xs text-muted-foreground mt-1">+9.5% from last month</div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Question Generation</span>
                    <span className="font-medium">$945</span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '51%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Content Evaluation</span>
                    <span className="font-medium">$405</span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Translation Services</span>
                    <span className="font-medium">$295</span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '16%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Other Features</span>
                    <span className="font-medium">$197</span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '11%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>AI Usage by Difficulty Level</CardTitle>
          <CardDescription>Feature usage broken down by content difficulty level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={featureUsageData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="beginner" stackId="a" fill="#3b82f6" name="Beginner Content" />
                <Bar dataKey="intermediate" stackId="a" fill="#10b981" name="Intermediate Content" />
                <Bar dataKey="advanced" stackId="a" fill="#8b5cf6" name="Advanced Content" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-4 border border-dashed rounded-md">
            <h4 className="font-medium mb-2">Optimization Insights</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Question generation consumes the most resources - consider implementing caching for common questions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Intermediate content has the highest AI usage - prioritize optimization for this difficulty level</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Cost per operation is decreasing as volume increases - continue to scale for better efficiency</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AIUsageCards;
