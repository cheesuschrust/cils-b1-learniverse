
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Settings, 
  Database, 
  FileText, 
  Search, 
  Plus, 
  Save, 
  Trash2, 
  History, 
  PlayCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ChatbotService from '@/services/ChatbotService';
import { ChatbotSettings, KnowledgeBaseEntry, ChatbotTrainingExample, ChatSession } from '@/types/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import EnhancedChatbot from '@/components/chatbot/EnhancedChatbot';

const ChatbotManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [settings, setSettings] = useState<ChatbotSettings>(ChatbotService.getSettings());
  const [isTestOpen, setIsTestOpen] = useState(false);
  const { toast } = useToast();
  
  // Handlers for settings tab
  const handleSaveSettings = () => {
    const updatedSettings = ChatbotService.updateSettings(settings);
    setSettings(updatedSettings);
    
    toast({
      title: "Settings Saved",
      description: "Chatbot settings have been updated successfully.",
    });
  };
  
  const handleSettingChange = (field: keyof ChatbotSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chatbot Management</h1>
          <p className="text-muted-foreground">Configure and manage the AI chatbot assistant</p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsTestOpen(!isTestOpen)}
        >
          {isTestOpen ? (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Close Test Chat
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Test Chatbot
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`col-span-1 lg:col-span-${isTestOpen ? 2 : 3}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="settings" className="flex items-center justify-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="flex items-center justify-center">
                <Database className="h-4 w-4 mr-2" />
                Knowledge Base
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center justify-center">
                <FileText className="h-4 w-4 mr-2" />
                Training
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center justify-center">
                <History className="h-4 w-4 mr-2" />
                Chat History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Chatbot Settings</CardTitle>
                  <CardDescription>
                    Configure how the chatbot behaves and appears to users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enabled" className="flex items-center">
                        Enable Chatbot
                        <Badge className="ml-2" variant={settings.enabled ? 'default' : 'outline'}>
                          {settings.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </Label>
                      <Switch 
                        id="enabled" 
                        checked={settings.enabled}
                        onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Chatbot Name</Label>
                      <Input 
                        id="name" 
                        value={settings.name}
                        onChange={(e) => handleSettingChange('name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl">Avatar URL</Label>
                      <Input 
                        id="avatarUrl" 
                        value={settings.avatarUrl || ''}
                        onChange={(e) => handleSettingChange('avatarUrl', e.target.value)}
                        placeholder="https://example.com/avatar.png"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Welcome Message</Label>
                      <Textarea 
                        id="welcomeMessage" 
                        value={settings.welcomeMessage}
                        onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fallbackMessage">Fallback Message</Label>
                      <Textarea 
                        id="fallbackMessage" 
                        value={settings.fallbackMessage}
                        onChange={(e) => handleSettingChange('fallbackMessage', e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            id="confidenceThreshold" 
                            type="number" 
                            min="0" 
                            max="1" 
                            step="0.1"
                            value={settings.confidenceThreshold}
                            onChange={(e) => handleSettingChange('confidenceThreshold', parseFloat(e.target.value))}
                          />
                          <span className="text-muted-foreground">(0-1)</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maxContextLength">Max Context Length</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            id="maxContextLength" 
                            type="number" 
                            min="1" 
                            max="20"
                            value={settings.maxContextLength}
                            onChange={(e) => handleSettingChange('maxContextLength', parseInt(e.target.value))}
                          />
                          <span className="text-muted-foreground">messages</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="suggestFeedback">Ask for Feedback</Label>
                      <Switch 
                        id="suggestFeedback" 
                        checked={settings.suggestFeedback}
                        onCheckedChange={(checked) => handleSettingChange('suggestFeedback', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="suggestRelatedQuestions">Suggest Related Questions</Label>
                      <Switch 
                        id="suggestRelatedQuestions" 
                        checked={settings.suggestRelatedQuestions}
                        onCheckedChange={(checked) => handleSettingChange('suggestRelatedQuestions', checked)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveSettings} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="knowledge">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base</CardTitle>
                  <CardDescription>
                    Manage the information that the chatbot uses to answer questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input placeholder="Search knowledge base..." />
                      <Button variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Entry
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg">
                      <div className="grid grid-cols-12 bg-muted p-2 rounded-t-lg border-b">
                        <div className="col-span-3 font-medium">Title</div>
                        <div className="col-span-5 font-medium">Content</div>
                        <div className="col-span-2 font-medium">Category</div>
                        <div className="col-span-2 font-medium">Actions</div>
                      </div>
                      
                      <ScrollArea className="h-[400px]">
                        {knowledgeBase.map((entry) => (
                          <div key={entry.id} className="grid grid-cols-12 p-2 border-b last:border-0 hover:bg-muted/50">
                            <div className="col-span-3 truncate">{entry.title}</div>
                            <div className="col-span-5 truncate">{entry.content}</div>
                            <div className="col-span-2">
                              <Badge variant="outline">{entry.category}</Badge>
                            </div>
                            <div className="col-span-2 flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground">
                      Showing {knowledgeBase.length} entries in the knowledge base
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="training">
              <Card>
                <CardHeader>
                  <CardTitle>Training Examples</CardTitle>
                  <CardDescription>
                    Add example Q&A pairs to train the chatbot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Training Example
                  </Button>
                  
                  <div className="text-sm text-muted-foreground text-center">
                    This feature will allow you to create and manage training examples for the chatbot.
                    You can add example questions and their ideal answers to improve the AI responses.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Chat History</CardTitle>
                  <CardDescription>
                    View and analyze past conversations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-muted-foreground">Total Sessions</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">0%</div>
                        <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-sm text-muted-foreground text-center">
                    Chat history and analytics will be available here.
                    You'll be able to review conversations, identify common questions,
                    and improve the chatbot's performance based on user interactions.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {isTestOpen && (
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Test Chatbot</CardTitle>
                <CardDescription>
                  Try out the chatbot with your current settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedChatbot showHeader={false} maxHeight="600px" />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotManager;
