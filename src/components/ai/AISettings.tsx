
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Info } from 'lucide-react'; // Changed ArrowCounterClockwise to RotateCcw
import { AISettingsProps } from '@/types/AISettingsProps';
import { AIModel, AISettings as AISettingsType } from '@/types/ai'; // Use AISettingsType to avoid name conflict
import { adaptModelToSize } from '@/utils/modelAdapter';
import { Input } from '@/components/ui/input'; // Added missing Input import

const defaultSettings: AISettingsType = {
  enabled: true,
  model: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 1024,
  features: {
    flashcards: true,
    questions: true,
    listening: true,
    speaking: true,
    writing: true,
    translation: true,
    explanation: true,
    correction: true,
    simplified: true
  },
  streaming: true,
  contentSafety: true,
  provider: 'openai',
  debugMode: false
};

const AISettings: React.FC<AISettingsProps> = ({ initialSettings, onSettingsChange, onClose }) => {
  const [settings, setSettings] = useState<AISettingsType>(initialSettings || defaultSettings);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: newValue,
    }));
  };

  const handleSliderChange = (value: number[], name: string) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value[0],
    }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      features: {
        ...prevSettings.features,
        [feature]: checked,
      },
    }));
  };

  const handleModelChange = (model: AIModel) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      model: model,
    }));
  };

  const handleProviderChange = (provider: string) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      provider: provider as 'openai' | 'anthropic' | 'mistral' | 'local',
    }));
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    try {
      onSettingsChange?.(settings);
      toast({
        title: 'Settings saved',
        description: 'AI settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: 'Could not save AI settings. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Settings</CardTitle>
        <CardDescription>
          Configure AI behavior and features for content generation.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="enabled">AI Enabled</Label>
              <Switch
                id="enabled"
                name="enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
              />
              <p className="text-sm text-muted-foreground">
                Enable or disable AI features across the application.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select value={settings.model} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-instant">Claude Instant</SelectItem>
                  <SelectItem value="claude-2">Claude 2</SelectItem>
                  <SelectItem value="mistral-small">Mistral Small</SelectItem>
                  <SelectItem value="mistral-medium">Mistral Medium</SelectItem>
                  <SelectItem value="mistral-large">Mistral Large</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose the AI model to use for content generation.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">AI Provider</Label>
              <Select value={settings.provider} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="mistral">Mistral</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Select the AI provider to use for content generation.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Slider
                id="temperature"
                name="temperature"
                defaultValue={[settings.temperature]}
                max={1}
                step={0.1}
                onValueChange={(value) => handleSliderChange(value, 'temperature')}
              />
              <p className="text-sm text-muted-foreground">
                Adjust the temperature of the AI model (0.0 - 1.0). Lower values
                result in more predictable output.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                type="number"
                id="maxTokens"
                name="maxTokens"
                value={String(settings.maxTokens)}
                onChange={handleInputChange}
              />
              <p className="text-sm text-muted-foreground">
                Set the maximum number of tokens for AI-generated content.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="features" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="flashcards">Flashcards</Label>
              <Switch
                id="flashcards"
                name="flashcards"
                checked={settings.features.flashcards}
                onCheckedChange={(checked) => handleFeatureChange('flashcards', checked)}
              />
              <p className="text-sm text-muted-foreground">
                Enable AI-powered flashcard generation.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="questions">Questions</Label>
              <Switch
                id="questions"
                name="questions"
                checked={settings.features.questions}
                onCheckedChange={(checked) => handleFeatureChange('questions', checked)}
              />
              <p className="text-sm text-muted-foreground">
                Enable AI-powered question generation.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="listening">Listening</Label>
              <Switch
                id="listening"
                name="listening"
                checked={settings.features.listening}
                onCheckedChange={(checked) => handleFeatureChange('listening', checked)}
              />
              <p className="text-sm text-muted-foreground">
                Enable AI-powered listening exercise generation.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="speaking">Speaking</Label>
              <Switch
                id="speaking"
                name="speaking"
                checked={settings.features.speaking}
                onCheckedChange={(checked) => handleFeatureChange('speaking', checked)}
              />
              <p className="text-sm text-muted-foreground">
                Enable AI-powered speaking exercise generation.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="writing">Writing</Label>
              <Switch
                id="writing"
                name="writing"
                checked={settings.features.writing}
                onCheckedChange={(checked) => handleFeatureChange('writing', checked)}
              />
              <p className="text-sm text-muted-foreground">
                Enable AI-powered writing prompt generation and correction.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="translation">Translation</Label>
              <Switch
                id="translation"
                name="translation"
                checked={settings.features.translation}
                onCheckedChange={(checked) => handleFeatureChange('translation', checked)}
              />
              <p className="text-sm text-muted-foreground">
                Enable AI-powered translation features.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation</Label>
              <Switch
                id="explanation"
                name="explanation"
                checked={settings.features.explanation}
                onCheckedChange={(checked) => handleFeatureChange('explanation', checked)}
              />
              <p className="text-sm text-muted-foreground">
                Enable AI-powered explanations for content.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="correction">Correction</Label>
              <Switch
                id="correction"
                name="correction"
                checked={settings.features.correction}
                onCheckedChange={(checked) => handleFeatureChange('correction', checked)}
              />
              <p className="text-sm text-muted-foreground">
                Enable AI-powered content correction features.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="simplified">Simplified</Label>
              <Switch
                id="simplified"
                name="simplified"
                checked={settings.features.simplified}
                onCheckedChange={(checked) => handleFeatureChange('simplified', checked)}
              />
              <p className="text-sm text-muted-foreground">
                Enable AI-powered content simplification features.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="streaming">Streaming</Label>
              <Switch
                id="streaming"
                name="streaming"
                checked={settings.streaming}
                onCheckedChange={(checked) => setSettings({ ...settings, streaming: checked })}
              />
              <p className="text-sm text-muted-foreground">
                Enable or disable streaming responses from the AI model.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contentSafety">Content Safety</Label>
              <Switch
                id="contentSafety"
                name="contentSafety"
                checked={settings.contentSafety}
                onCheckedChange={(checked) => setSettings({ ...settings, contentSafety: checked })}
              />
              <p className="text-sm text-muted-foreground">
                Enable or disable content safety filtering for AI-generated
                content.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="debugMode">Debug Mode</Label>
              <Switch
                id="debugMode"
                name="debugMode"
                checked={settings.debugMode}
                onCheckedChange={(checked) => setSettings({ ...settings, debugMode: checked })}
              />
              <p className="text-sm text-muted-foreground">
                Enable or disable debug mode for AI interactions.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handleResetSettings}
          disabled={isLoading}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AISettings;
