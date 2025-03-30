
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAI } from '@/contexts/AIContext';
import { Check, ChevronsRight, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AISetupWizardProps {
  onComplete?: () => void;
}

const AISetupWizard: React.FC<AISetupWizardProps> = ({ onComplete }) => {
  const { settings, updateSettings } = useAI();
  const [step, setStep] = useState<'provider' | 'config' | 'testing' | 'complete'>('provider');
  const [selectedProvider, setSelectedProvider] = useState<string>(settings.modelProvider);
  const [apiKey, setApiKey] = useState<string>(settings.apiKey || '');
  const [modelName, setModelName] = useState<string>(settings.modelName || '');
  const [testMessage, setTestMessage] = useState<string>('');
  const [testResponse, setTestResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testError, setTestError] = useState<string | null>(null);

  const providers = [
    { id: 'openai', name: 'OpenAI', description: 'Use OpenAI models like GPT-4o' },
    { id: 'huggingface', name: 'Hugging Face', description: 'Use Hugging Face models locally or via API' },
    { id: 'azure', name: 'Azure AI', description: 'Use Azure OpenAI services' },
    { id: 'google', name: 'Google AI', description: 'Use Google Gemini models' },
    { id: 'local', name: 'Local Models', description: 'Use locally running models (advanced)' }
  ];

  const handleSelectProvider = (provider: string) => {
    setSelectedProvider(provider);
  };

  const handleNext = () => {
    if (step === 'provider') {
      setStep('config');
    } else if (step === 'config') {
      handleSaveConfig();
      setStep('testing');
    } else if (step === 'testing') {
      setStep('complete');
    }
  };

  const handleBack = () => {
    if (step === 'config') {
      setStep('provider');
    } else if (step === 'testing') {
      setStep('config');
    } else if (step === 'complete') {
      setStep('testing');
    }
  };

  const handleSaveConfig = () => {
    updateSettings({
      modelProvider: selectedProvider as 'openai' | 'huggingface' | 'azure' | 'google' | 'local',
      apiKey,
      modelName
    });
  };

  const handleComplete = () => {
    if (onComplete) onComplete();
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestError(null);
    
    try {
      // In a real application, this would make an API call to test the connection
      setTimeout(() => {
        if (apiKey && modelName) {
          setTestResponse("Connection successful! AI is properly configured.");
        } else {
          throw new Error("API key or model name is missing");
        }
        setIsLoading(false);
      }, 1500);
    } catch (error: any) {
      setTestError(error.message || "Connection failed");
      setIsLoading(false);
    }
  };

  const getProviderInstructions = () => {
    switch (selectedProvider) {
      case 'openai':
        return (
          <div className="space-y-4 text-sm">
            <p>To set up OpenAI integration, you'll need:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>An OpenAI API key from your OpenAI dashboard</li>
              <li>Select one of the available models (GPT-4o recommended)</li>
            </ol>
            <p>Enter your OpenAI API key in the field below.</p>
          </div>
        );
      case 'huggingface':
        return (
          <div className="space-y-4 text-sm">
            <p>To set up Hugging Face integration, you'll need:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>A Hugging Face API key from your Hugging Face account</li>
              <li>Choose either a hosted API model or a local model name</li>
            </ol>
            <p>Enter your Hugging Face API key in the field below.</p>
          </div>
        );
      case 'azure':
        return (
          <div className="space-y-4 text-sm">
            <p>To set up Azure OpenAI integration, you'll need:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Your Azure OpenAI endpoint URL</li>
              <li>Your Azure OpenAI API key</li>
              <li>The deployed model name in your Azure instance</li>
            </ol>
            <p>Enter your Azure API key in the field below.</p>
          </div>
        );
      case 'google':
        return (
          <div className="space-y-4 text-sm">
            <p>To set up Google AI integration, you'll need:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>A Google AI Studio API key</li>
              <li>Select one of the available Gemini models</li>
            </ol>
            <p>Enter your Google AI API key in the field below.</p>
          </div>
        );
      case 'local':
        return (
          <div className="space-y-4 text-sm">
            <p>To set up local model integration:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Ensure you have a local model server running (Ollama, LM Studio, etc.)</li>
              <li>Enter the local endpoint URL (typically http://localhost:port)</li>
              <li>Specify the model name you have installed locally</li>
            </ol>
            <p>Enter your local endpoint URL in the field below.</p>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Local models require more technical setup and adequate hardware.
              </AlertDescription>
            </Alert>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>AI Setup Wizard</CardTitle>
        <CardDescription>Configure your AI provider for Italian language learning assistance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={step} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="provider" disabled={step !== 'provider'}>
              1. Select Provider
            </TabsTrigger>
            <TabsTrigger value="config" disabled={step !== 'config'}>
              2. Configuration
            </TabsTrigger>
            <TabsTrigger value="testing" disabled={step !== 'testing'}>
              3. Test Connection
            </TabsTrigger>
            <TabsTrigger value="complete" disabled={step !== 'complete'}>
              4. Complete
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="provider" className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Select an AI Provider</h3>
              <p className="text-sm text-muted-foreground">
                Choose the AI provider you want to use for language learning features
              </p>
            </div>
            
            <RadioGroup 
              value={selectedProvider} 
              onValueChange={handleSelectProvider}
              className="grid gap-4"
            >
              {providers.map((provider) => (
                <div key={provider.id} className="flex items-center">
                  <RadioGroupItem value={provider.id} id={provider.id} className="peer sr-only" />
                  <Label
                    htmlFor={provider.id}
                    className="flex flex-col items-start gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full cursor-pointer"
                  >
                    <div className="flex w-full justify-between">
                      <span className="font-semibold">{provider.name}</span>
                      {selectedProvider === provider.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <span className="text-sm font-normal text-muted-foreground">
                      {provider.description}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="config" className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">{providers.find(p => p.id === selectedProvider)?.name} Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Enter the required configuration details
              </p>
            </div>
            
            {getProviderInstructions()}
            
            <div className="space-y-4 mt-8">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder={
                    selectedProvider === 'openai' ? 'gpt-4o-mini' : 
                    selectedProvider === 'google' ? 'gemini-pro' :
                    selectedProvider === 'huggingface' ? 'mistralai/mixtral-8x7b-instruct-v0.1' :
                    selectedProvider === 'azure' ? 'gpt-4' :
                    'localhost:11434/api/chat'
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the model name you want to use
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="testing" className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Test Your Connection</h3>
              <p className="text-sm text-muted-foreground">
                Verify that your AI configuration works correctly
              </p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Configuration Summary</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="font-medium">{providers.find(p => p.id === selectedProvider)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{modelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Key:</span>
                  <span className="font-medium">••••••••••••••••</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testMessage">Test Message</Label>
              <div className="flex gap-2">
                <Input
                  id="testMessage"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="E.g., Translate 'hello' to Italian"
                  disabled={isLoading}
                />
                <Button onClick={handleTestConnection} disabled={isLoading}>
                  {isLoading ? "Testing..." : "Test"}
                </Button>
              </div>
            </div>
            
            {testResponse && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
                <p className="text-green-800 dark:text-green-300 text-sm">{testResponse}</p>
              </div>
            )}
            
            {testError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{testError}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="complete" className="space-y-6">
            <div className="text-center">
              <div className="mx-auto bg-green-100 dark:bg-green-900/20 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium">Setup Complete!</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Your AI provider has been successfully configured. You can now use AI features throughout the application.
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">What's Next?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can adjust your AI settings at any time from the Admin dashboard. The AI will now be available for content generation, language correction, and student assistance.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step !== 'provider' && (
          <Button variant="outline" onClick={handleBack} disabled={isLoading}>
            Back
          </Button>
        )}
        {step !== 'provider' && step === 'complete' ? (
          <Button onClick={handleComplete}>
            Finish
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={isLoading || (step === 'config' && (!apiKey || !modelName))}>
            {step === 'testing' ? 'Finish Setup' : 'Continue'}
            <ChevronsRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AISetupWizard;
