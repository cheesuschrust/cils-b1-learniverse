
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AISettings, AISettingsProps } from '@/types';

const AISettingsComponent: React.FC<AISettingsProps> = ({
  settings,
  onSettingsChange,
  onSave,
  onReset,
  availableModels = ['gpt-4o-mini', 'gpt-4o', 'mistral-small', 'claude-instant'],
  isLoading = false
}) => {
  const [formState, setFormState] = useState<AISettings>(settings);

  const handleChange = (field: string, value: any) => {
    const newSettings = {
      ...formState,
      [field]: value
    };
    
    setFormState(newSettings);
    onSettingsChange(newSettings);
  };

  const handleFeatureChange = (feature: string, value: boolean) => {
    const newSettings = {
      ...formState,
      features: {
        ...(formState.features || {
          grammarCorrection: true,
          pronunciationFeedback: true,
          vocabularySuggestions: true,
          culturalContext: true,
          contentGeneration: true,
          errorCorrection: true,
          pronunciationHelp: true,
          personalization: true
        }),
        [feature]: value
      }
    };
    
    setFormState(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Settings</CardTitle>
        <CardDescription>
          Configure AI behavior and features
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="model">AI Model</Label>
            <Select
              value={formState.model}
              onValueChange={(value) => handleChange('model', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Different models have different capabilities and speed
            </p>
          </div>
          
          <div>
            <Label htmlFor="temperature">Temperature ({formState.temperature})</Label>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[formState.temperature || 0.7]}
              onValueChange={([value]) => handleChange('temperature', value)}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Higher values increase creativity but may reduce accuracy
            </p>
          </div>
          
          <div>
            <Label htmlFor="maxTokens">Max Output Length ({formState.maxTokens})</Label>
            <Slider
              id="maxTokens"
              min={100}
              max={2000}
              step={100}
              value={[formState.maxTokens || 1000]}
              onValueChange={([value]) => handleChange('maxTokens', value)}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Maximum length of generated content
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Voice Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="voiceRate">Speech Rate ({formState.voiceRate || 1.0})</Label>
              <Slider
                id="voiceRate"
                min={0.5}
                max={2}
                step={0.1}
                value={[formState.voiceRate || 1.0]}
                onValueChange={([value]) => handleChange('voiceRate', value)}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="voicePitch">Voice Pitch ({formState.voicePitch || 1.0})</Label>
              <Slider
                id="voicePitch"
                min={0.5}
                max={2}
                step={0.1}
                value={[formState.voicePitch || 1.0]}
                onValueChange={([value]) => handleChange('voicePitch', value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="contentGeneration" className="cursor-pointer">Content Generation</Label>
              <Switch
                id="contentGeneration"
                checked={formState.features?.contentGeneration ?? true}
                onCheckedChange={(value) => handleFeatureChange('contentGeneration', value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="errorCorrection" className="cursor-pointer">Error Correction</Label>
              <Switch
                id="errorCorrection"
                checked={formState.features?.errorCorrection ?? true}
                onCheckedChange={(value) => handleFeatureChange('errorCorrection', value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="pronunciationHelp" className="cursor-pointer">Pronunciation Help</Label>
              <Switch
                id="pronunciationHelp"
                checked={formState.features?.pronunciationHelp ?? true}
                onCheckedChange={(value) => handleFeatureChange('pronunciationHelp', value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="personalization" className="cursor-pointer">Personalization</Label>
              <Switch
                id="personalization"
                checked={formState.features?.personalization ?? true}
                onCheckedChange={(value) => handleFeatureChange('personalization', value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISettingsComponent;
