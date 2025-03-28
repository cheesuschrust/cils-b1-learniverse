import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw,
  Settings, 
  Sliders 
} from 'lucide-react';
import { AISettings as AISettingsType } from '@/types/ai';
import { AISettingsProps } from '@/types/AISettingsProps';

const defaultSettings: AISettingsType = {
  enabled: true,
  model: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 1000,
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
  contentSafety: true,
  streaming: true
};

const AISettings: React.FC<AISettingsProps> = ({ 
  initialSettings = defaultSettings,
  onSettingsChange,
  onClose
}) => {
  const [settings, setSettings] = useState<AISettingsType>({...initialSettings});
  const [activeTab, setActiveTab] = useState<'general' | 'advanced' | 'features'>('general');

  const handleSave = () => {
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleReset = () => {
    setSettings({...defaultSettings});
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              AI Settings
            </CardTitle>
            <CardDescription>
              Customize your AI assistant behavior and capabilities
            </CardDescription>
          </div>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex space-x-1 mb-6 border rounded-md p-1">
          <Button
            variant={activeTab === 'general' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('general')}
          >
            General
          </Button>
          <Button
            variant={activeTab === 'features' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('features')}
          >
            Features
          </Button>
          <Button
            variant={activeTab === 'advanced' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </Button>
        </div>
        
        {activeTab === 'general' && (
          <div className="space-y-4">
            {/* General settings content */}
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium">AI settings will be displayed here</p>
            </div>
          </div>
        )}
        
        {activeTab === 'features' && (
          <div className="space-y-4">
            {/* Features settings content */}
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium">Features settings will be displayed here</p>
            </div>
          </div>
        )}
        
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            {/* Advanced settings content */}
            <div className="border rounded-md p-4">
              <p className="text-sm font-medium">Advanced settings will be displayed here</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex items-center"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Default
        </Button>
        
        <Button 
          onClick={handleSave}
          size="sm"
          className="flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AISettings;
