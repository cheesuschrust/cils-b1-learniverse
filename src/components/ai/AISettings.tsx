
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Cpu, Server, MonitorSmartphone, Zap, CpuIcon } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ContentType } from '@/utils/textAnalysis';

interface AISettingsProps {
  onClose?: () => void;
  isAdmin?: boolean;
}

const AISettings: React.FC<AISettingsProps> = ({ onClose, isAdmin = false }) => {
  const { aiPreference, setAIPreference } = useUserPreferences();
  const { 
    isAIEnabled, 
    toggleAI, 
    modelSize, 
    setModelSize, 
    confidenceScores, 
    isProcessing 
  } = useAIUtils();
  
  const [localPreferences, setLocalPreferences] = useState({
    processOnDevice: aiPreference.processOnDevice,
    modelSize: modelSize,
    dataCollection: aiPreference.dataCollection,
    assistanceLevel: aiPreference.assistanceLevel
  });
  
  const handleToggleAI = () => {
    toggleAI();
  };
  
  const handleModelSizeChange = (value: string) => {
    setLocalPreferences(prev => ({ ...prev, modelSize: value as 'small' | 'medium' | 'large' }));
  };
  
  const handleToggleProcessOnDevice = (checked: boolean) => {
    setLocalPreferences(prev => ({ ...prev, processOnDevice: checked }));
  };
  
  const handleToggleDataCollection = (checked: boolean) => {
    setLocalPreferences(prev => ({ ...prev, dataCollection: checked }));
  };
  
  const handleAssistanceLevelChange = (value: number[]) => {
    setLocalPreferences(prev => ({ ...prev, assistanceLevel: value[0] }));
  };
  
  const saveSettings = () => {
    setModelSize(localPreferences.modelSize);
    setAIPreference({
      ...aiPreference,
      processOnDevice: localPreferences.processOnDevice,
      dataCollection: localPreferences.dataCollection,
      assistanceLevel: localPreferences.assistanceLevel
    });
    
    if (onClose) {
      onClose();
    }
  };
  
  const contentTypes: ContentType[] = [
    'multiple-choice', 
    'flashcards', 
    'writing', 
    'speaking', 
    'listening'
  ];
  
  const contentTypeLabels: Record<ContentType, string> = {
    'multiple-choice': 'Multiple Choice',
    'flashcards': 'Flashcards',
    'writing': 'Writing',
    'speaking': 'Speaking',
    'listening': 'Listening'
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          AI Settings
        </CardTitle>
        <CardDescription>
          Configure AI features and behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable AI Features</Label>
            <p className="text-sm text-muted-foreground">
              Text-to-speech, content analysis, and other AI-powered features
            </p>
          </div>
          <Switch
            checked={isAIEnabled}
            onCheckedChange={handleToggleAI}
            disabled={isProcessing}
          />
        </div>
        
        {isAIEnabled && (
          <>
            <div className="space-y-3">
              <Label className="text-base">Model Size</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Select the size of the AI model to use. Larger models are more accurate but use more resources.
              </p>
              <RadioGroup
                value={localPreferences.modelSize}
                onValueChange={handleModelSizeChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="model-small" />
                  <Label htmlFor="model-small" className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                    Small
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Low resource usage, faster)
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="model-medium" />
                  <Label htmlFor="model-medium" className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-orange-500" />
                    Medium
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Balanced performance)
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="model-large" />
                  <Label htmlFor="model-large" className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-red-500" />
                    Large
                    <span className="ml-2 text-xs text-muted-foreground">
                      (High accuracy, slower)
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-base">Processing Location</Label>
                <Badge variant={localPreferences.processOnDevice ? "secondary" : "outline"}>
                  {localPreferences.processOnDevice ? 
                    <MonitorSmartphone className="h-3 w-3 mr-1" /> : 
                    <Server className="h-3 w-3 mr-1" />
                  }
                  {localPreferences.processOnDevice ? "On-Device" : "Cloud"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Choose where AI processing happens. On-device is more private but has limited capabilities.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Cloud</span>
                </div>
                <Switch
                  checked={localPreferences.processOnDevice}
                  onCheckedChange={handleToggleProcessOnDevice}
                />
                <div className="flex items-center gap-2">
                  <MonitorSmartphone className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Device</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base">AI Assistance Level</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Adjust how proactive the AI will be in offering suggestions and corrections.
              </p>
              <div className="space-y-2">
                <Slider
                  defaultValue={[localPreferences.assistanceLevel]}
                  max={10}
                  min={1}
                  step={1}
                  onValueChange={handleAssistanceLevelChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimal</span>
                  <span>Balanced</span>
                  <span>Proactive</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Data Collection</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anonymous data collection to improve AI performance
                </p>
              </div>
              <Switch
                checked={localPreferences.dataCollection}
                onCheckedChange={handleToggleDataCollection}
              />
            </div>
            
            {isAdmin && (
              <div className="space-y-3 bg-secondary/20 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <Label className="text-base flex items-center">
                    <CpuIcon className="h-4 w-4 mr-2" />
                    AI Content Confidence
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}}
                    className="text-xs"
                  >
                    Recalibrate
                  </Button>
                </div>
                <div className="space-y-4">
                  {contentTypes.map(type => (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{contentTypeLabels[type]}</span>
                        <span className="font-medium">{confidenceScores[type]}%</span>
                      </div>
                      <Progress value={confidenceScores[type]} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={saveSettings} disabled={isProcessing}>
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AISettings;
