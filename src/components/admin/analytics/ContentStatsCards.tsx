
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileText, FileCheck, FilePlus, BookOpen } from 'lucide-react';

const ContentStatsCards: React.FC = () => {
  // Mock data for content statistics
  const contentStats = {
    total: 2450,
    published: 1850,
    draft: 420,
    inReview: 180,
    engagement: 76, // percentage
    averageCompletion: 68, // percentage
    avgTimeSpent: 14.2, // minutes per content item
  };
  
  // Mock data for content by type
  const contentTypeData = [
    { name: 'Flashcards', count: 620 },
    { name: 'Reading', count: 340 },
    { name: 'Grammar', count: 480 },
    { name: 'Listening', count: 290 },
    { name: 'Speaking', count: 210 },
    { name: 'Writing', count: 180 },
    { name: 'Quizzes', count: 330 },
  ];
  
  // Mock data for content engagement over time
  const engagementData = [
    { month: 'Jan', engagement: 65 },
    { month: 'Feb', engagement: 68 },
    { month: 'Mar', engagement: 72 },
    { month: 'Apr', engagement: 69 },
    { month: 'May', engagement: 74 },
    { month: 'Jun', engagement: 76 },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Items in the content library
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats.published.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((contentStats.published / contentStats.total) * 100)}% of total content
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <FilePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats.draft.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((contentStats.draft / contentStats.total) * 100)}% of total content
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats.engagement}%</div>
            <p className="text-xs text-muted-foreground">
              Average content engagement
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Content by Type</CardTitle>
            <CardDescription>Distribution of content across different formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contentTypeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" name="Content Items" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
            <CardDescription>Content engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={engagementData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    name="Engagement %" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Content Performance Metrics</CardTitle>
          <CardDescription>Key metrics for content effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Avg. Completion Rate</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {contentStats.averageCompletion}%
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                +3.5% from last month
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Avg. Time Spent</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {contentStats.avgTimeSpent} min
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                +1.2 minutes from last month
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Top Category</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                Flashcards
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                25% of total content
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 border border-dashed rounded-md">
            <h4 className="font-medium mb-2">Content Recommendations</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Create more speaking exercises - engagement is 32% higher than average</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Improve grammar quizzes - completion rate is 15% below average</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Add more beginner-level content - highest user growth is in this segment</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ContentStatsCards;
