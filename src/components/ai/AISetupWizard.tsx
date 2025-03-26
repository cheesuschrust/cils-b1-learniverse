
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { BrainCircuit, Server, Check, Download, Globe, Cpu, Volume2, Database, RefreshCw } from 'lucide-react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import * as HuggingFaceService from '@/services/HuggingFaceService';

interface StepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isLastStep?: boolean;
}

const WizardStep: React.FC<StepProps> = ({
  title,
  description,
  children,
  onNext,
  onBack,
  nextLabel = "Next",
  backLabel = "Back",
  isLastStep = false
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex justify-between">
        {onBack ? (
          <Button variant="outline" onClick={onBack}>
            {backLabel}
          </Button>
        ) : (
          <div></div>
        )}
        <Button onClick={onNext}>
          {isLastStep ? <Check className="mr-2 h-4 w-4" /> : null}
          {nextLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

const AISetupWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const { isAIEnabled, toggleAI, modelSize, setModelSize, checkMicrophoneAccess } = useAIUtils();
  const { aiPreference, setAIPreference } = useUserPreferences();
  const { toast } = useToast();
  
  const [hasWebGPU, setHasWebGPU] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [micPermission, setMicPermission] = useState(false);
  
  const [settings, setSettings] = useState({
    processOnDevice: aiPreference.processOnDevice || true,
    modelSize: modelSize || 'medium',
    voiceRate: aiPreference.voiceRate || 1,
    voicePitch: aiPreference.voicePitch || 1,
    assistanceLevel: aiPreference.assistanceLevel || 5,
    anonymousAnalytics: aiPreference.anonymousAnalytics || true,
  });
  
  const checkSystemCapabilities = async () => {
    setIsChecking(true);
    try {
      // Check WebGPU support
      const webGPUSupport = await HuggingFaceService.checkWebGPUSupport();
      setHasWebGPU(webGPUSupport);
      
      // Check microphone access
      const micAccess = await checkMicrophoneAccess();
      setMicPermission(micAccess);
      
      toast({
        title: "System Check Complete",
        description: `WebGPU support: ${webGPUSupport ? 'Available' : 'Not available'}. Microphone access: ${micAccess ? 'Granted' : 'Not granted'}.`,
      });
    } catch (error) {
      console.error("Error checking system capabilities:", error);
      toast({
        title: "Error",
        description: "Failed to check system capabilities.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save final settings
      saveSettings();
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const saveSettings = () => {
    // Update AI preferences
    setModelSize(settings.modelSize as 'small' | 'medium' | 'large');
    setAIPreference({
      ...aiPreference,
      processOnDevice: settings.processOnDevice,
      voiceRate: settings.voiceRate,
      voicePitch: settings.voicePitch,
      assistanceLevel: settings.assistanceLevel,
      anonymousAnalytics: settings.anonymousAnalytics
    });
    
    toast({
      title: "Setup Complete",
      description: "Your AI system has been successfully configured!",
    });
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">AI System Setup Wizard</h2>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
      </div>
      
      {currentStep === 1 && (
        <WizardStep
          title="Enable AI Features"
          description="Turn on AI capabilities to enhance your learning experience."
          onNext={handleNextStep}
          nextLabel="Continue"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">AI System Status</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable all AI-powered features
                </p>
              </div>
              <Switch
                checked={isAIEnabled}
                onCheckedChange={toggleAI}
              />
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <Label className="text-base block mb-2">System Capabilities Check</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Check if your system supports advanced AI features
              </p>
              <Button 
                onClick={checkSystemCapabilities} 
                variant="outline" 
                disabled={isChecking}
                className="w-full"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Cpu className="mr-2 h-4 w-4" />
                    Check System Capabilities
                  </>
                )}
              </Button>
              
              {hasWebGPU !== null && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">WebGPU Support:</span>
                    <span className={`text-sm font-medium ${hasWebGPU ? 'text-green-500' : 'text-amber-500'}`}>
                      {hasWebGPU ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Microphone Access:</span>
                    <span className={`text-sm font-medium ${micPermission ? 'text-green-500' : 'text-amber-500'}`}>
                      {micPermission ? 'Granted' : 'Not Granted'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </WizardStep>
      )}
      
      {currentStep === 2 && (
        <WizardStep
          title="Processing Location"
          description="Choose where the AI processing should happen."
          onNext={handleNextStep}
          onBack={handlePreviousStep}
        >
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Processing Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose where AI computations will happen
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-background rounded-lg mb-4">
                <div className="flex items-center">
                  <Server className="h-8 w-8 mr-4 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Cloud Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      More powerful, works on all devices
                    </p>
                  </div>
                </div>
                <Switch
                  checked={!settings.processOnDevice}
                  onCheckedChange={(checked) => setSettings({...settings, processOnDevice: !checked})}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div className="flex items-center">
                  <Cpu className="h-8 w-8 mr-4 text-green-500" />
                  <div>
                    <h4 className="font-medium">On-Device Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      More private, uses your device's resources
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.processOnDevice}
                  onCheckedChange={(checked) => setSettings({...settings, processOnDevice: checked})}
                />
              </div>
              
              {settings.processOnDevice && !hasWebGPU && (
                <div className="mt-4 p-4 bg-amber-50 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> Your device doesn't support WebGPU, which may limit on-device performance.
                    You can still use on-device processing, but it might be slower.
                  </p>
                </div>
              )}
            </div>
          </div>
        </WizardStep>
      )}
      
      {currentStep === 3 && (
        <WizardStep
          title="Model Size Selection"
          description="Choose the size of AI models based on your needs."
          onNext={handleNextStep}
          onBack={handlePreviousStep}
        >
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-4">Model Size</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Larger models are more accurate but require more resources and may run slower.
              </p>
              
              <div className="space-y-4">
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer ${settings.modelSize === 'small' ? 'border-primary bg-primary/5' : 'border-transparent bg-background'}`}
                  onClick={() => setSettings({...settings, modelSize: 'small'})}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Small</h4>
                      <p className="text-sm text-muted-foreground">Fast, lower resource usage</p>
                    </div>
                    {settings.modelSize === 'small' && <Check className="h-5 w-5 text-primary" />}
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer ${settings.modelSize === 'medium' ? 'border-primary bg-primary/5' : 'border-transparent bg-background'}`}
                  onClick={() => setSettings({...settings, modelSize: 'medium'})}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Medium</h4>
                      <p className="text-sm text-muted-foreground">Balanced performance and accuracy</p>
                    </div>
                    {settings.modelSize === 'medium' && <Check className="h-5 w-5 text-primary" />}
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer ${settings.modelSize === 'large' ? 'border-primary bg-primary/5' : 'border-transparent bg-background'}`}
                  onClick={() => setSettings({...settings, modelSize: 'large'})}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Large</h4>
                      <p className="text-sm text-muted-foreground">Highest accuracy, more resources needed</p>
                    </div>
                    {settings.modelSize === 'large' && <Check className="h-5 w-5 text-primary" />}
                  </div>
                </div>
              </div>
              
              {settings.modelSize === 'large' && settings.processOnDevice && (
                <div className="mt-4 p-4 bg-amber-50 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> Using large models with on-device processing may cause performance issues on less powerful devices.
                  </p>
                </div>
              )}
            </div>
          </div>
        </WizardStep>
      )}
      
      {currentStep === 4 && (
        <WizardStep
          title="Voice Settings"
          description="Configure text-to-speech and speech recognition settings."
          onNext={handleNextStep}
          onBack={handlePreviousStep}
        >
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-4">Voice Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="voiceRate">Speech Rate</Label>
                  <div className="flex items-center mt-2">
                    <span className="text-sm mr-4">Slow</span>
                    <Slider
                      id="voiceRate"
                      value={[settings.voiceRate]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={(values) => setSettings({...settings, voiceRate: values[0]})}
                      className="flex-1 mx-2"
                    />
                    <span className="text-sm ml-4">Fast</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {settings.voiceRate.toFixed(1)}x
                  </p>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="voicePitch">Voice Pitch</Label>
                  <div className="flex items-center mt-2">
                    <span className="text-sm mr-4">Low</span>
                    <Slider
                      id="voicePitch"
                      value={[settings.voicePitch]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={(values) => setSettings({...settings, voicePitch: values[0]})}
                      className="flex-1 mx-2"
                    />
                    <span className="text-sm ml-4">High</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {settings.voicePitch.toFixed(1)}
                  </p>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance("This is a test of the text-to-speech system with your current settings.");
                      utterance.rate = settings.voiceRate;
                      utterance.pitch = settings.voicePitch;
                      speechSynthesis.speak(utterance);
                    }}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Test Current Voice Settings
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-4">AI Assistance Level</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure how proactive the AI assistant should be
              </p>
              
              <div>
                <Label htmlFor="assistanceLevel">Assistance Level</Label>
                <div className="flex items-center mt-2">
                  <span className="text-sm mr-4">Minimal</span>
                  <Slider
                    id="assistanceLevel"
                    value={[settings.assistanceLevel]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(values) => setSettings({...settings, assistanceLevel: values[0]})}
                    className="flex-1 mx-2"
                  />
                  <span className="text-sm ml-4">Proactive</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Only when requested</span>
                  <span>Balanced</span>
                  <span>Frequent suggestions</span>
                </div>
              </div>
            </div>
          </div>
        </WizardStep>
      )}
      
      {currentStep === 5 && (
        <WizardStep
          title="Final Settings"
          description="Review and complete your AI system setup."
          onNext={handleNextStep}
          onBack={handlePreviousStep}
          nextLabel="Complete Setup"
          isLastStep={true}
        >
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-4">Setup Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">AI Status:</span>
                  <span className={isAIEnabled ? 'text-green-500' : 'text-red-500'}>
                    {isAIEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Processing Location:</span>
                  <span>{settings.processOnDevice ? 'On-Device' : 'Cloud'}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Model Size:</span>
                  <span className="capitalize">{settings.modelSize}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Voice Rate:</span>
                  <span>{settings.voiceRate.toFixed(1)}x</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Voice Pitch:</span>
                  <span>{settings.voicePitch.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Assistance Level:</span>
                  <span>{settings.assistanceLevel}/10</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Anonymous Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the AI system with anonymous usage data
                  </p>
                </div>
                <Switch
                  checked={settings.anonymousAnalytics}
                  onCheckedChange={(checked) => setSettings({...settings, anonymousAnalytics: checked})}
                />
              </div>
            </div>
          </div>
        </WizardStep>
      )}
    </div>
  );
};

export default AISetupWizard;
