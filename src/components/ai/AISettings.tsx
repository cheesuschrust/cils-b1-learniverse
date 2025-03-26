
import React from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Wand2, Zap, Brain, Settings2, ArrowCounterclockwise } from 'lucide-react';

interface AISettingsProps {
  defaultTab?: string;
}

const AISettings: React.FC<AISettingsProps> = ({ defaultTab = "general" }) => {
  const { settings, updateSettings, resetSettings, isAIEnabled, toggleAI } = useAIUtils();

  // Update a numerical setting
  const handleNumberSetting = (key: keyof AISettings, value: number) => {
    updateSettings({ [key]: value });
  };
  
  // Update a string setting
  const handleStringSetting = (key: keyof AISettings, value: string) => {
    updateSettings({ [key]: value });
  };
  
  // Update a boolean setting
  const handleBooleanSetting = (key: keyof AISettings, value: boolean) => {
    updateSettings({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI Assistant Settings
        </CardTitle>
        <CardDescription>
          Configure how the AI language learning assistant works for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Label htmlFor="ai-toggle" className="font-medium">Enable AI Features</Label>
            <Switch
              id="ai-toggle"
              checked={isAIEnabled}
              onCheckedChange={toggleAI}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetSettings}
            className="flex items-center"
          >
            <ArrowCounterclockwise className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
        
        <Tabs defaultValue={defaultTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general" className="flex items-center">
              <Settings2 className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="model" className="flex items-center">
              <Brain className="mr-2 h-4 w-4" />
              Model
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex items-center">
              <Wand2 className="mr-2 h-4 w-4" />
              Responses
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="assistant-name">Assistant Name</Label>
                <input
                  id="assistant-name"
                  className="w-full p-2 border rounded"
                  value={settings.assistantName}
                  onChange={(e) => handleStringSetting('assistantName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred-voice">Preferred Voice</Label>
                <Select 
                  value={settings.preferredVoice}
                  onValueChange={(value) => handleStringSetting('preferredVoice', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural</SelectItem>
                    <SelectItem value="clear">Clear</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="learning-style">Learning Style</Label>
                <Select 
                  value={settings.learningStyle}
                  onValueChange={(value) => handleStringSetting('learningStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select learning style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="structured">Structured</SelectItem>
                    <SelectItem value="exploratory">Exploratory</SelectItem>
                    <SelectItem value="challenge">Challenge-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="model">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model-select">AI Model</Label>
                <Select 
                  value={settings.model}
                  onValueChange={(value) => handleStringSetting('model', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o (More accurate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Temperature</Label>
                  <span className="text-sm text-muted-foreground">{settings.temperature}</span>
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[settings.temperature]}
                  onValueChange={(value) => handleNumberSetting('temperature', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  {settings.temperature < 0.4 
                    ? "Lower temperature produces more focused, deterministic responses" 
                    : settings.temperature > 0.7 
                      ? "Higher temperature produces more creative, varied responses"
                      : "Balanced temperature combines focus with creativity"}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="responses">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Response Length</Label>
                  <span className="text-sm text-muted-foreground">{settings.responseLength} words</span>
                </div>
                <Slider
                  min={50}
                  max={500}
                  step={50}
                  value={[settings.responseLength]}
                  onValueChange={(value) => handleNumberSetting('responseLength', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedback-level">Feedback Detail</Label>
                <Select 
                  value={settings.feedbackLevel}
                  onValueChange={(value: 'detailed' | 'summary' | 'minimal') => 
                    handleStringSetting('feedbackLevel', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback detail level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Context Window</Label>
                  <span className="text-sm text-muted-foreground">{settings.contextWindow} messages</span>
                </div>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[settings.contextWindow]}
                  onValueChange={(value) => handleNumberSetting('contextWindow', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  This controls how many previous messages the AI remembers for context.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AISettings;
