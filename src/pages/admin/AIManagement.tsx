
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import AISetupWizard from '@/components/ai/AISetupWizard';
import { useAI } from '@/contexts/AIContext';
import { Sparkles, RefreshCw, Play, AlertCircle, Check, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AIManagement = () => {
  const { settings, updateSettings, isConfigured } = useAI();
  const [showWizard, setShowWizard] = useState(!isConfigured);
  const [testPrompt, setTestPrompt] = useState('Translate this to Italian: "Hello, how are you?"');
  const [testResponse, setTestResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('settings');

  const handleTestAI = () => {
    if (!testPrompt.trim()) return;
    
    setIsLoading(true);
    setTestResponse('');
    
    // Simulate API call
    setTimeout(() => {
      setTestResponse('Ciao, come stai?');
      setIsLoading(false);
    }, 1500);
  };

  const handleSaveSettings = (newSettings: any) => {
    updateSettings(newSettings);
  };

  return (
    <>
      <Helmet>
        <title>AI Management | Admin</title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Management</h1>
          <p className="text-muted-foreground mt-1">Configure and manage AI capabilities for the platform</p>
        </div>
        
        {showWizard ? (
          <AISetupWizard onComplete={() => setShowWizard(false)} />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
                <TabsList>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="testing">Test AI</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button onClick={() => setShowWizard(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Reconfigure
              </Button>
            </div>
            
            <TabsContent value="settings" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>AI Provider Settings</CardTitle>
                  <CardDescription>Configure your AI provider and model settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="apiKey">API Key</Label>
                        <Input 
                          type="password" 
                          id="apiKey" 
                          value="••••••••••••••••" 
                          readOnly 
                        />
                        <p className="text-xs text-muted-foreground">
                          The API key is hidden for security reasons
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="modelName">Model Name</Label>
                        <Input 
                          id="modelName" 
                          value={settings.modelName} 
                          onChange={(e) => handleSaveSettings({ modelName: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="systemPrompt">System Prompt</Label>
                        <textarea 
                          id="systemPrompt" 
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                          value={settings.systemPrompt}
                          onChange={(e) => handleSaveSettings({ systemPrompt: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          This prompt sets the behavior of the AI for all interactions
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="temperature">Temperature: {settings.temperature}</Label>
                        <Slider 
                          id="temperature"
                          min={0} 
                          max={1} 
                          step={0.1} 
                          value={[settings.temperature]} 
                          onValueChange={(value) => handleSaveSettings({ temperature: value[0] })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Lower values make responses more consistent, higher values more creative
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="maxTokens">Max Tokens: {settings.maxTokens}</Label>
                        <Slider 
                          id="maxTokens"
                          min={100} 
                          max={4000} 
                          step={100} 
                          value={[settings.maxTokens]} 
                          onValueChange={(value) => handleSaveSettings({ maxTokens: value[0] })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum length of AI responses in tokens
                        </p>
                      </div>
                      
                      <div className="pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="enableVoice">Enable Voice Features</Label>
                          <Switch 
                            id="enableVoice" 
                            checked={settings.enableVoice}
                            onCheckedChange={(checked) => handleSaveSettings({ enableVoice: checked })}
                          />
                        </div>
                        
                        <Button variant="outline" onClick={() => handleSaveSettings(settings)} className="w-full">
                          <Save className="mr-2 h-4 w-4" />
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>AI Features</CardTitle>
                  <CardDescription>Enable or disable specific AI features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Content Generation</p>
                        <p className="text-sm text-muted-foreground">Generate flashcards, quizzes and exercises</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Content Translation</p>
                        <p className="text-sm text-muted-foreground">Translate content between Italian and English</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Writing Assessment</p>
                        <p className="text-sm text-muted-foreground">Evaluate and provide feedback on student writing</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Speaking Practice</p>
                        <p className="text-sm text-muted-foreground">Conversation practice and pronunciation feedback</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="testing" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Test AI Integration</CardTitle>
                  <CardDescription>Test your AI configuration with different prompts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Test Prompt</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="prompt" 
                        value={testPrompt}
                        onChange={(e) => setTestPrompt(e.target.value)}
                        placeholder="Enter a test prompt"
                        className="flex-1"
                      />
                      <Button onClick={handleTestAI} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Run Test
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {testResponse && (
                    <div className="mt-6 p-4 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-2">AI Response:</p>
                      <p className="text-sm">{testResponse}</p>
                    </div>
                  )}
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Testing helps verify that your AI configuration is working correctly.
                      Try different types of prompts related to Italian language learning.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logs" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>AI Interaction Logs</CardTitle>
                  <CardDescription>Review recent AI interactions for monitoring and debugging</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left font-medium">Timestamp</th>
                          <th className="py-2 px-4 text-left font-medium">User</th>
                          <th className="py-2 px-4 text-left font-medium">Request Type</th>
                          <th className="py-2 px-4 text-left font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { time: '2 minutes ago', user: 'maria.rossi@example.com', type: 'Translation', status: 'Success' },
                          { time: '15 minutes ago', user: 'luigi.verdi@example.com', type: 'Content Generation', status: 'Success' },
                          { time: '35 minutes ago', user: 'giovanni.bianchi@example.com', type: 'Writing Feedback', status: 'Failed' },
                          { time: '1 hour ago', user: 'admin@cilslearniverse.com', type: 'System Test', status: 'Success' },
                          { time: '2 hours ago', user: 'francesca.russo@example.com', type: 'Speaking Practice', status: 'Success' },
                        ].map((log, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-2 px-4 text-sm">{log.time}</td>
                            <td className="py-2 px-4 text-sm">{log.user}</td>
                            <td className="py-2 px-4 text-sm">{log.type}</td>
                            <td className="py-2 px-4 text-sm">
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {log.status === 'Success' ? (
                                  <Check className="mr-1 h-3 w-3" />
                                ) : (
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                )}
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button variant="outline">
                      View All Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        )}
      </div>
    </>
  );
};

export default AIManagement;
