
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, BarChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, FileText, BarChart3, BarChart2, Clock, BookOpen } from 'lucide-react';
import ProgressTracker from '@/components/progress/ProgressTracker';
import { exportProgressReport } from '@/services/progressService';
import { useToast } from '@/hooks/use-toast';

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  const handleExportReport = async () => {
    try {
      const report = await exportProgressReport();
      
      // In a real app, this would create a downloadable file
      console.log('Exporting report:', report);
      
      toast({
        title: 'Report Exported',
        description: 'Your progress report has been exported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your progress report.',
        variant: 'destructive',
      });
    }
  };

  // Mock data for CILS B1 readiness
  const readinessScores = [
    { name: 'Reading', score: 75, passing: 65 },
    { name: 'Writing', score: 60, passing: 65 },
    { name: 'Listening', score: 80, passing: 65 },
    { name: 'Speaking', score: 68, passing: 65 }
  ];

  // Mock data for time spent studying
  const timeData = [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 30 },
    { day: 'Wed', minutes: 60 },
    { day: 'Thu', minutes: 25 },
    { day: 'Fri', minutes: 50 },
    { day: 'Sat', minutes: 20 },
    { day: 'Sun', minutes: 40 }
  ];

  // Mock study recommendations
  const recommendations = [
    {
      area: 'Writing',
      recommendation: 'Focus on written exercises using past tense. Try to write a paragraph about your last vacation.',
      priority: 'high'
    },
    {
      area: 'Vocabulary',
      recommendation: 'Build your vocabulary around citizenship and civic topics. Review the civic duties flashcards.',
      priority: 'medium'
    },
    {
      area: 'Reading',
      recommendation: 'Practice reading news articles about current events in Italy to improve comprehension and learn context-specific vocabulary.',
      priority: 'medium'
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <Button onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <ProgressTracker />
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CILS B1 Readiness Assessment</CardTitle>
              <CardDescription>
                Your current skill levels compared to CILS B1 passing requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={readinessScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#2563eb" name="Your Score" />
                    <Bar dataKey="passing" fill="#d1d5db" name="Passing Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Time Analysis</CardTitle>
              <CardDescription>
                Minutes spent studying per day over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="minutes" fill="#8884d8" stroke="#8884d8" name="Minutes" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Total study time this week: {timeData.reduce((total, day) => total + day.minutes, 0)} minutes
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Recommendations</CardTitle>
              <CardDescription>
                Personalized suggestions to improve your Italian proficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                          ${rec.priority === 'high' ? 'bg-red-100 text-red-600' : 
                            rec.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 
                            'bg-blue-100 text-blue-600'}`}>
                          {rec.area === 'Writing' && <FileText className="h-5 w-5" />}
                          {rec.area === 'Vocabulary' && <BookOpen className="h-5 w-5" />}
                          {rec.area === 'Reading' && <BookOpen className="h-5 w-5" />}
                          {rec.area === 'Listening' && <Clock className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{rec.area}</h3>
                          <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressPage;
