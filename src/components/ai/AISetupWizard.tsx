
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  BrainCircuit, 
  Database, 
  Shield, 
  Settings, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Steps } from '@/components/ui/steps';
import { HelpTooltip } from '@/components/help/HelpTooltip';
import AIModelSelector from './AIModelSelector';
import TrainingDataManager from './TrainingDataManager';
import AIAdvancedSettings from './AIAdvancedSettings';
import AISecurityMonitor from './AISecurityMonitor';
import { useToast } from '@/hooks/use-toast';

const AISetupWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the setup
      toast({
        title: "AI Setup Completed",
        description: "Your AI system has been configured successfully.",
      });
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const steps = [
    { 
      id: 'model-selection', 
      title: 'Model Selection',
      icon: <BrainCircuit className="h-4 w-4" />,
      description: 'Choose and configure AI models'
    },
    { 
      id: 'training-data', 
      title: 'Training Data',
      icon: <Database className="h-4 w-4" />,
      description: 'Manage data for training your models'
    },
    { 
      id: 'security', 
      title: 'Security',
      icon: <Shield className="h-4 w-4" />,
      description: 'Configure security and privacy settings'
    },
    { 
      id: 'advanced', 
      title: 'Advanced Settings',
      icon: <Settings className="h-4 w-4" />,
      description: 'Fine-tune performance and behavior'
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">AI Setup Wizard</CardTitle>
          <CardDescription>
            Configure your AI system in a few simple steps
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-8">
            <Steps 
              steps={steps.map((step, index) => ({
                id: step.id,
                label: step.title,
                status: index === currentStep ? 'current' : index < currentStep ? 'complete' : 'upcoming',
                icon: step.icon
              }))} 
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
          </div>
          
          <div className="mt-8">
            {currentStep === 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  Step 1: Choose Your AI Models
                  <HelpTooltip 
                    content="Select and configure the AI models you want to use in your application."
                    className="ml-2"
                  />
                </h3>
                <AIModelSelector />
              </div>
            )}
            
            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  Step 2: Configure Training Data
                  <HelpTooltip 
                    content="Upload and manage data for training your AI models."
                    className="ml-2"
                  />
                </h3>
                <TrainingDataManager />
              </div>
            )}
            
            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  Step 3: Security Configuration
                  <HelpTooltip 
                    content="Set up security measures to protect your AI models and data."
                    className="ml-2"
                  />
                </h3>
                <AISecurityMonitor />
              </div>
            )}
            
            {currentStep === 3 && (
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  Step 4: Advanced Settings
                  <HelpTooltip 
                    content="Fine-tune your AI system with advanced configuration options."
                    className="ml-2"
                  />
                </h3>
                <AIAdvancedSettings />
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          
          <Button onClick={handleNext} className="flex items-center">
            {currentStep < 3 ? (
              <>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AISetupWizard;
