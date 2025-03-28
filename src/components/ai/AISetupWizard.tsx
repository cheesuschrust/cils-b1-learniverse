
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AIModel, AIPreferences, AISetupWizardProps } from '@/types/ai';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, Cpu, HelpCircle, Shield, Volume2 } from 'lucide-react';
import { adaptModelToSize, adaptSizeToModel } from '@/utils/modelAdapter';

const AISetupWizard: React.FC<AISetupWizardProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  const [activeTab, setActiveTab] = useState("model");
  const [preferences, setPreferences] = useState<AIPreferences>({
    model: 'medium',
    contentSafety: true,
    debugMode: false,
    voicePreference: 'native',
    autoPlayAudio: true,
  });

  const handleComplete = () => {
    onComplete();
    onOpenChange(false);
  };

  const handleNext = () => {
    switch (activeTab) {
      case "model":
        setActiveTab("voice");
        break;
      case "voice":
        setActiveTab("safety");
        break;
      case "safety":
        handleComplete();
        break;
    }
  };

  const handleBack = () => {
    switch (activeTab) {
      case "voice":
        setActiveTab("model");
        break;
      case "safety":
        setActiveTab("voice");
        break;
    }
  };

  const updatePreference = <K extends keyof AIPreferences>(
    key: K,
    value: AIPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>AI Assistant Setup</DialogTitle>
          <DialogDescription>
            Configure how you want the AI assistant to work for you.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="model" data-active={activeTab === "model"}>
              <Cpu className="h-4 w-4 mr-2" />
              Model
            </TabsTrigger>
            <TabsTrigger value="voice" data-active={activeTab === "voice"}>
              <Volume2 className="h-4 w-4 mr-2" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="safety" data-active={activeTab === "safety"}>
              <Shield className="h-4 w-4 mr-2" />
              Safety
            </TabsTrigger>
          </TabsList>

          <TabsContent value="model" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Choose AI Model Size</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a model size based on your needs. Larger models are more
                  capable but may be slower.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={preferences.model === "small" ? "default" : "outline"}
                    onClick={() => updatePreference("model", "small")}
                    className="flex flex-col h-auto py-4"
                  >
                    <span className="font-medium">Small</span>
                    <span className="text-xs mt-1">Fast, Basic</span>
                  </Button>
                  <Button
                    variant={preferences.model === "medium" ? "default" : "outline"}
                    onClick={() => updatePreference("model", "medium")}
                    className="flex flex-col h-auto py-4"
                  >
                    <span className="font-medium">Medium</span>
                    <span className="text-xs mt-1">Balanced</span>
                  </Button>
                  <Button
                    variant={preferences.model === "large" ? "default" : "outline"}
                    onClick={() => updatePreference("model", "large")}
                    className="flex flex-col h-auto py-4"
                  >
                    <span className="font-medium">Large</span>
                    <span className="text-xs mt-1">Powerful</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Voice Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure how the AI assistant sounds when speaking.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoPlayAudio">Auto-play audio</Label>
                    <Switch
                      id="autoPlayAudio"
                      checked={preferences.autoPlayAudio}
                      onCheckedChange={(checked) =>
                        updatePreference("autoPlayAudio", checked)
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Voice Preference</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={
                          preferences.voicePreference === "native"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => updatePreference("voicePreference", "native")}
                        className="h-auto py-3"
                      >
                        Native Speaker
                      </Button>
                      <Button
                        variant={
                          preferences.voicePreference === "clear"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => updatePreference("voicePreference", "clear")}
                        className="h-auto py-3"
                      >
                        Clear Accent
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Safety & Privacy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure safety and privacy settings for the AI assistant.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="contentSafety" className="mb-1 block">
                        Content Safety Filter
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Filter harmful or inappropriate content
                      </p>
                    </div>
                    <Switch
                      id="contentSafety"
                      checked={preferences.contentSafety}
                      onCheckedChange={(checked) =>
                        updatePreference("contentSafety", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="debugMode" className="mb-1 block">
                        Debug Mode
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Show technical details about AI responses
                      </p>
                    </div>
                    <Switch
                      id="debugMode"
                      checked={preferences.debugMode}
                      onCheckedChange={(checked) =>
                        updatePreference("debugMode", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-2">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={activeTab === "model"}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {activeTab === "safety" ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Complete Setup
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AISetupWizard;
