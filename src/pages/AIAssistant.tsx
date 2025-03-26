
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles, BookOpen, BarChart3 } from 'lucide-react';
import StudyAssistant from '@/components/ai/StudyAssistant';
import LearningPathRecommendations from '@/components/ai/LearningPathRecommendations';
import SmartContentGenerator from '@/components/ai/SmartContentGenerator';
import LearningInsightsReport from '@/components/ai/LearningInsightsReport';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAIUtils } from '@/contexts/AIUtilsContext';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('assistant');
  const { settings, updateSettings } = useAIUtils();
  
  const toggleAIFeatures = () => {
    updateSettings({ enabled: !settings.enabled });
  };
  
  return (
    <>
      <Helmet>
        <title>AI Learning Assistant | Language Learning</title>
      </Helmet>
      
      <div className="container py-8 max-w-5xl">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Sparkles className="h-6 w-6 text-blue-500 mr-2" />
                  AI Learning Assistant
                </CardTitle>
                <CardDescription>
                  Personalized learning assistance powered by artificial intelligence
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="ai-toggle" 
                  checked={settings.enabled}
                  onCheckedChange={toggleAIFeatures}
                />
                <Label htmlFor="ai-toggle">AI Features {settings.enabled ? 'Enabled' : 'Disabled'}</Label>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              <p>
                Our AI assistant helps personalize your language learning journey by providing
                tailored recommendations, generating practice content, and analyzing your progress.
                All suggestions are meant to support your learning goals while respecting your 
                preferred approach to learning.
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="assistant">
                  <Bot className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Study Assistant</span>
                </TabsTrigger>
                <TabsTrigger value="path">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Learning Path</span>
                </TabsTrigger>
                <TabsTrigger value="content">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Content Generator</span>
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Insights</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="assistant">
                <StudyAssistant />
              </TabsContent>
              
              <TabsContent value="path">
                <LearningPathRecommendations />
              </TabsContent>
              
              <TabsContent value="content">
                <SmartContentGenerator />
              </TabsContent>
              
              <TabsContent value="insights">
                <LearningInsightsReport />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
          <h3 className="font-medium mb-2">About AI Recommendations</h3>
          <p className="mb-2">
            Our AI features analyze your learning patterns, performance, and goals to provide 
            personalized suggestions and content. Here's how we use your data:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your study habits and performance are analyzed to identify optimal learning times</li>
            <li>Quiz results help us detect knowledge gaps and suggest focused practice</li>
            <li>Content you interact with influences our recommendations for new material</li>
            <li>All processing is done securely with privacy as a priority</li>
          </ul>
          <div className="mt-4 flex space-x-4">
            <Button variant="outline" size="sm">
              Privacy Policy
            </Button>
            <Button variant="ghost" size="sm">
              Adjust AI Settings
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
