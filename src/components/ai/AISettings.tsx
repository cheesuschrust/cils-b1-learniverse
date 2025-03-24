
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Cpu, Gauge, HardDrive, Server, MonitorSmartphone, BarChart3, ToggleLeft } from "lucide-react";
import { useUserPreferences, AIPreference } from "@/contexts/UserPreferencesContext";
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ContentType } from '@/utils/textAnalysis';

interface AISettingsProps {
  onClose?: () => void;
  isAdmin?: boolean;
}

const AISettings = ({ onClose, isAdmin = false }: AISettingsProps) => {
  const { aiPreference, setAIPreference } = useUserPreferences();
  const { isAIEnabled, toggleAI, modelSize, setModelSize, confidenceScores } = useAIUtils();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [preferences, setPreferences] = React.useState<AIPreference>({...aiPreference});
  
  const handleToggleChange = (key: keyof AIPreference) => (checked: boolean) => {
    if (key === 'enabled') {
      toggleAI();
    }
    
    setPreferences(prev => ({
      ...prev,
      [key]: checked
    }));
  };
  
  const handleSelectChange = (key: keyof AIPreference) => (value: string) => {
    if (key === 'modelSize') {
      setModelSize(value as 'small' | 'medium' | 'large');
    }
    
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const savePreferences = async () => {
    setIsLoading(true);
    
    try {
      setAIPreference(preferences);
      
      toast({
        title: "AI settings saved",
        description: "Your AI preferences have been updated successfully.",
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving AI preferences:", error);
      toast({
        title: "Error saving preferences",
        description: "There was a problem updating your AI preferences.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const contentTypes: { value: ContentType; label: string }[] = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'flashcards', label: 'Flashcards' },
    { value: 'writing', label: 'Writing' },
    { value: 'speaking', label: 'Speaking' },
    { value: 'listening', label: 'Listening' }
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          AI Settings {isAdmin && <span className="text-sm font-normal text-muted-foreground">(Admin)</span>}
        </CardTitle>
        <CardDescription>
          Configure how AI features work in the application
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable AI Features</Label>
            <p className="text-sm text-muted-foreground">Use AI for content generation and analysis</p>
          </div>
          <Switch 
            checked={isAIEnabled}
            onCheckedChange={handleToggleChange("enabled")}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <Label className="text-base">Model Size</Label>
            <p className="text-sm text-muted-foreground">Larger models are more capable but slower</p>
          </div>
          <Select
            value={modelSize}
            onValueChange={handleSelectChange("modelSize")}
            disabled={!isAIEnabled}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select model size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small" className="flex items-center gap-2">
                <Gauge className="h-4 w-4 inline mr-2" />
                Small (Fast)
              </SelectItem>
              <SelectItem value="medium" className="flex items-center gap-2">
                <Gauge className="h-4 w-4 inline mr-2" />
                Medium (Balanced)
              </SelectItem>
              <SelectItem value="large" className="flex items-center gap-2">
                <Gauge className="h-4 w-4 inline mr-2" />
                Large (Quality)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Process On-Device</Label>
            <p className="text-sm text-muted-foreground">Run models directly in your browser</p>
          </div>
          <Switch 
            checked={preferences.processOnDevice}
            onCheckedChange={handleToggleChange("processOnDevice")}
            disabled={!isAIEnabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Show Confidence Scores</Label>
            <p className="text-sm text-muted-foreground">Display AI confidence in results</p>
          </div>
          <Switch 
            checked={preferences.showConfidenceScores}
            onCheckedChange={handleToggleChange("showConfidenceScores")}
            disabled={!isAIEnabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Fall Back to Manual Content</Label>
            <p className="text-sm text-muted-foreground">Use built-in content when AI is unavailable</p>
          </div>
          <Switch 
            checked={preferences.fallbackToManual}
            onCheckedChange={handleToggleChange("fallbackToManual")}
          />
        </div>
        
        {isAdmin && (
          <>
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium mb-4">Model Confidence Scores</h3>
              <div className="space-y-4">
                {contentTypes.map((type) => (
                  <div key={type.value} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{type.label}</span>
                      <Badge variant={confidenceScores[type.value] > 80 ? "default" : "outline"}>
                        {confidenceScores[type.value]}%
                      </Badge>
                    </div>
                    <Progress value={confidenceScores[type.value]} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium mb-4">Advanced Settings (Admin Only)</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">API Endpoint</Label>
                    <p className="text-sm text-muted-foreground">Custom API endpoint for AI services</p>
                  </div>
                  <Select
                    defaultValue="default"
                    disabled={!isAIEnabled}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select endpoint" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (Cloud)</SelectItem>
                      <SelectItem value="local">Local Server</SelectItem>
                      <SelectItem value="custom">Custom Endpoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cache Results</Label>
                    <p className="text-sm text-muted-foreground">Store AI results for faster responses</p>
                  </div>
                  <Switch defaultChecked={true} disabled={!isAIEnabled} />
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={savePreferences} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AISettings;
