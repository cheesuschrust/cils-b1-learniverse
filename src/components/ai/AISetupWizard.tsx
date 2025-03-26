
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AIModel, AIPreference } from '@/types/ai';

// Model info
const modelSizes = [
  { 
    id: 'small', 
    name: 'Small', 
    description: 'Fast with low memory usage', 
    size: '~50MB',
    pros: ['Fast to load', 'Works on most devices', 'Low memory usage'],
    cons: ['Lower accuracy', 'Limited capabilities']
  },
  { 
    id: 'medium', 
    name: 'Medium', 
    description: 'Balanced performance', 
    size: '~100MB',
    pros: ['Good accuracy', 'Balanced performance', 'Moderate memory usage'],
    cons: ['Slower loading on older devices']
  },
  { 
    id: 'large', 
    name: 'Large', 
    description: 'Most accurate but resource intensive', 
    size: '~200MB',
    pros: ['Highest accuracy', 'Best performance', 'Advanced capabilities'],
    cons: ['High memory usage', 'Slower to load', 'May not work on older devices']
  }
];

// Form schema
const formSchema = z.object({
  modelSize: z.enum(['small', 'medium', 'large'] as const),
  useWebGPU: z.boolean().default(false),
  voiceEnabled: z.boolean().default(true),
  voiceRate: z.number().min(0.5).max(2).default(1),
  voicePitch: z.number().min(0.5).max(2).default(1),
  cacheResponses: z.boolean().default(true),
  anonymousAnalytics: z.boolean().default(true)
});

interface AISetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (preferences: AIPreference) => void;
  defaultValues?: Partial<AIPreference>;
}

export const AISetupWizard: React.FC<AISetupWizardProps> = ({
  open,
  onOpenChange,
  onComplete,
  defaultValues
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelSize: (defaultValues?.modelSize || 'medium') as AIModel,
      useWebGPU: defaultValues?.useWebGPU || false,
      voiceEnabled: defaultValues?.voiceEnabled || true,
      voiceRate: defaultValues?.voiceRate || 1,
      voicePitch: defaultValues?.voicePitch || 1,
      cacheResponses: defaultValues?.cacheResponses || true,
      anonymousAnalytics: defaultValues?.anonymousAnalytics || true
    }
  });
  
  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const values = form.getValues();
      onComplete({
        enabled: true,
        modelSize: values.modelSize,
        useWebGPU: values.useWebGPU,
        voiceEnabled: values.voiceEnabled,
        voiceRate: values.voiceRate,
        voicePitch: values.voicePitch,
        cacheResponses: values.cacheResponses,
        anonymousAnalytics: values.anonymousAnalytics
      });
      onOpenChange(false);
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Welcome to AI Setup</h3>
              <p className="text-muted-foreground">Let's configure the AI engine for optimal performance</p>
            </div>
            
            <FormField
              control={form.control}
              name="modelSize"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Choose AI Model Size</FormLabel>
                  <FormDescription>
                    Select based on your device capabilities and performance needs
                  </FormDescription>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modelSizes.map((model) => (
                      <Card 
                        key={model.id} 
                        className={`cursor-pointer transition ${field.value === model.id ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => form.setValue('modelSize', model.id as AIModel)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{model.name}</CardTitle>
                          <CardDescription>{model.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 text-sm">
                          <p>Size: {model.size}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-0">
                          <RadioGroup value={field.value} className="hidden">
                            <RadioGroupItem value={model.id} id={model.id} />
                          </RadioGroup>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Performance Settings</h3>
              <p className="text-muted-foreground">Optimize how the AI runs on your device</p>
            </div>
            
            <FormField
              control={form.control}
              name="useWebGPU"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Use GPU Acceleration</FormLabel>
                    <FormDescription>
                      Improve performance on supported devices
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cacheResponses"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Cache Responses</FormLabel>
                    <FormDescription>
                      Store responses for faster repeated interactions
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Voice Settings</h3>
              <p className="text-muted-foreground">Configure text-to-speech capabilities</p>
            </div>
            
            <FormField
              control={form.control}
              name="voiceEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Voice</FormLabel>
                    <FormDescription>
                      Allow the AI to speak responses
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch('voiceEnabled') && (
              <>
                <FormField
                  control={form.control}
                  name="voiceRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Speed</FormLabel>
                      <FormControl>
                        <div className="space-y-1">
                          <Slider
                            min={0.5}
                            max={2}
                            step={0.1}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Slow</span>
                            <span>{field.value}x</span>
                            <span>Fast</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="voicePitch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Pitch</FormLabel>
                      <FormControl>
                        <div className="space-y-1">
                          <Slider
                            min={0.5}
                            max={2}
                            step={0.1}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Low</span>
                            <span>{field.value}x</span>
                            <span>High</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Finish Setup</h3>
              <p className="text-muted-foreground">Review your settings before continuing</p>
            </div>
            
            <div className="rounded-lg border p-4 space-y-4">
              <h4 className="font-medium">Selected Configuration</h4>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Model Size:</div>
                <div>{modelSizes.find(m => m.id === form.watch('modelSize'))?.name}</div>
                
                <div className="text-muted-foreground">GPU Acceleration:</div>
                <div>{form.watch('useWebGPU') ? 'Enabled' : 'Disabled'}</div>
                
                <div className="text-muted-foreground">Voice:</div>
                <div>{form.watch('voiceEnabled') ? 'Enabled' : 'Disabled'}</div>
                
                {form.watch('voiceEnabled') && (
                  <>
                    <div className="text-muted-foreground">Voice Speed:</div>
                    <div>{form.watch('voiceRate')}x</div>
                    
                    <div className="text-muted-foreground">Voice Pitch:</div>
                    <div>{form.watch('voicePitch')}x</div>
                  </>
                )}
                
                <div className="text-muted-foreground">Cache Responses:</div>
                <div>{form.watch('cacheResponses') ? 'Enabled' : 'Disabled'}</div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="anonymousAnalytics"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Help Improve the App</FormLabel>
                    <FormDescription>
                      Send anonymous usage data to help us enhance the AI
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Setup Wizard</DialogTitle>
          <DialogDescription>
            Configure the AI features to enhance your learning experience
          </DialogDescription>
        </DialogHeader>
        
        <Progress value={(step / totalSteps) * 100} className="h-2" />
        
        <Form {...form}>
          <form className="space-y-6">
            {renderStepContent()}
          </form>
        </Form>
        
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePreviousStep}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button 
              type="button" 
              onClick={handleNextStep}
            >
              {step === totalSteps ? 'Complete Setup' : 'Continue'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AISetupWizard;
