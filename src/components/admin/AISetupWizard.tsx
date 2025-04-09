
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { HelpTooltip } from '@/components/help/HelpTooltip';
import { Check, Mail, Bot, RefreshCw, TestTube, Database, Brain } from 'lucide-react';
import ModelPerformanceChart from '@/components/admin/ModelPerformanceChart';

const AISetupWizard: React.FC = () => {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState('welcome');
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Model configuration state
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [maxTokens, setMaxTokens] = useState(8192);
  const [temperature, setTemperature] = useState(0.7);
  const [apiKey, setApiKey] = useState('');
  
  // Voice system state
  const [voiceProvider, setVoiceProvider] = useState('elevenlabs');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [enableVoice, setEnableVoice] = useState(true);
  const [voiceApiKey, setVoiceApiKey] = useState('');
  
  // Email configuration state
  const [emailProvider, setEmailProvider] = useState('smtp');
  const [emailConfig, setEmailConfig] = useState({
    host: '',
    port: '587',
    username: '',
    password: '',
    fromEmail: '',
    fromName: 'AI Assistant'
  });
  
  // Test and validation state
  const [isModelTesting, setIsModelTesting] = useState(false);
  const [isVoiceTesting, setIsVoiceTesting] = useState(false);
  const [isEmailTesting, setIsEmailTesting] = useState(false);
  
  const handleEmailConfigChange = (key: string, value: string) => {
    setEmailConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleTestModel = () => {
    setIsModelTesting(true);
    
    // Simulate API testing
    setTimeout(() => {
      setIsModelTesting(false);
      toast({
        title: "Model connection successful",
        description: "Successfully connected to the selected AI model.",
      });
    }, 2000);
  };
  
  const handleTestVoice = () => {
    setIsVoiceTesting(true);
    
    // Simulate API testing
    setTimeout(() => {
      setIsVoiceTesting(false);
      toast({
        title: "Voice system verified",
        description: "Voice synthesis is working correctly.",
      });
    }, 2000);
  };
  
  const handleTestEmail = () => {
    setIsEmailTesting(true);
    
    // Simulate API testing
    setTimeout(() => {
      setIsEmailTesting(false);
      toast({
        title: "Test email sent",
        description: "A test email has been sent to verify your configuration.",
      });
    }, 2000);
  };
  
  const handleNextStep = (currentStep: string) => {
    const steps = ['welcome', 'model', 'voice', 'email', 'review', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    const nextStep = steps[currentIndex + 1];
    
    setActiveStep(nextStep);
    setProgress(((currentIndex + 1) / (steps.length - 1)) * 100);
    
    if (nextStep === 'complete') {
      setIsComplete(true);
      toast({
        title: "Setup complete",
        description: "Your AI system is now configured and ready to use.",
      });
    }
  };
  
  const handlePreviousStep = (currentStep: string) => {
    const steps = ['welcome', 'model', 'voice', 'email', 'review', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    const previousStep = steps[currentIndex - 1];
    
    setActiveStep(previousStep);
    setProgress(((currentIndex - 1) / (steps.length - 1)) * 100);
  };
  
  const handleFinish = () => {
    toast({
      title: "Configuration saved",
      description: "All settings have been saved successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Setup Wizard</h2>
          <p className="text-muted-foreground">Configure your AI systems with this guided setup</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
          <TabsTrigger value="model">AI Model</TabsTrigger>
          <TabsTrigger value="voice">Voice System</TabsTrigger>
          <TabsTrigger value="email">Email Configuration</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
        </TabsList>
        
        {/* Welcome Step */}
        <TabsContent value="welcome">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to the AI Setup Wizard</CardTitle>
              <CardDescription>
                This wizard will help you configure your AI system for optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">In this setup, you will configure:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <span>AI Model Selection and Configuration</span>
                    <HelpTooltip 
                      content="Choose and configure the AI model that powers your application's intelligence."
                    />
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>Email Notification System</span>
                    <HelpTooltip 
                      content="Set up email notifications for user interactions and system alerts."
                    />
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <span>Data Sources and Integration</span>
                    <HelpTooltip 
                      content="Connect your AI to the necessary data sources for training and operation."
                    />
                  </li>
                </ul>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Prerequisites:</h3>
                <p className="text-sm mb-2">Please make sure you have the following information ready:</p>
                <ul className="space-y-1 text-sm">
                  <li>• API keys for your chosen AI model provider</li>
                  <li>• Voice synthesis service credentials (if using voice features)</li>
                  <li>• Email server details or API keys for email services</li>
                </ul>
              </div>
            </CardContent>
            <div className="flex justify-end p-6 pt-0">
              <Button onClick={() => handleNextStep('welcome')}>
                Get Started
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Model Configuration Step */}
        <TabsContent value="model">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>
                Select and configure the AI model that will power your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="ai-model">AI Model</Label>
                      <HelpTooltip 
                        content="Select the AI model that best fits your needs. Different models have different capabilities, costs, and performance characteristics."
                      />
                    </div>
                    <Select defaultValue={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
                        <SelectItem value="claude-3">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                        <SelectItem value="mistral">Mistral Large</SelectItem>
                        <SelectItem value="llama-3">Llama 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <HelpTooltip 
                        content="Your API key for the selected model provider. This is required to make API calls to the model."
                      />
                    </div>
                    <Input 
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="max-tokens">Max Tokens</Label>
                      <HelpTooltip 
                        content="The maximum number of tokens (roughly words) that the model will generate in a response. Higher values allow for longer responses but may increase costs."
                      />
                    </div>
                    <Input 
                      id="max-tokens"
                      type="number"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <HelpTooltip 
                        content="Controls the randomness of the model's output. Higher values (e.g., 0.8) make responses more creative, while lower values (e.g., 0.2) make them more focused and deterministic."
                      />
                    </div>
                    <Input 
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <Button onClick={handleTestModel} disabled={isModelTesting} className="w-full">
                    {isModelTesting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <TestTube className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
                
                <div>
                  <ModelPerformanceChart 
                    title="Model Comparison"
                    description="Performance metrics for supported AI models"
                  />
                </div>
              </div>
            </CardContent>
            <div className="flex justify-between p-6 pt-0">
              <Button variant="outline" onClick={() => handlePreviousStep('model')}>
                Back
              </Button>
              <Button onClick={() => handleNextStep('model')}>
                Next: Voice Configuration
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Voice System Step */}
        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle>Voice System Configuration</CardTitle>
              <CardDescription>
                Configure text-to-speech capabilities for your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="enable-voice"
                  checked={enableVoice}
                  onCheckedChange={setEnableVoice}
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor="enable-voice">Enable Voice Output</Label>
                  <HelpTooltip 
                    content="Enable or disable the text-to-speech functionality for your AI assistant."
                  />
                </div>
              </div>
              
              {enableVoice && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="voice-provider">Voice Provider</Label>
                        <HelpTooltip 
                          content="Select the service that will provide text-to-speech capabilities. Different providers have different voice options and pricing models."
                        />
                      </div>
                      <Select defaultValue={voiceProvider} onValueChange={setVoiceProvider}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="azure">Azure Cognitive Services</SelectItem>
                          <SelectItem value="amazon">Amazon Polly</SelectItem>
                          <SelectItem value="google">Google Cloud TTS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="voice-api-key">API Key</Label>
                        <HelpTooltip 
                          content="Your API key for the selected voice provider. Required to make API calls to the voice service."
                        />
                      </div>
                      <Input 
                        id="voice-api-key"
                        type="password"
                        value={voiceApiKey}
                        onChange={(e) => setVoiceApiKey(e.target.value)}
                        placeholder="Enter your API key"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="voice-selection">Voice Selection</Label>
                        <HelpTooltip 
                          content="Choose the voice that best represents your AI assistant. Different voices have different characteristics and languages."
                        />
                      </div>
                      <Select defaultValue={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                          <SelectItem value="echo">Echo (Male)</SelectItem>
                          <SelectItem value="fable">Fable (Female)</SelectItem>
                          <SelectItem value="onyx">Onyx (Male, Deep)</SelectItem>
                          <SelectItem value="nova">Nova (Female, Soft)</SelectItem>
                          <SelectItem value="shimmer">Shimmer (Female, Clear)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={handleTestVoice} disabled={isVoiceTesting} className="w-full">
                      {isVoiceTesting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Testing Voice...
                        </>
                      ) : (
                        <>
                          <TestTube className="mr-2 h-4 w-4" />
                          Test Voice
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg space-y-4">
                    <h3 className="font-medium">Voice System Requirements</h3>
                    <p className="text-sm">
                      Voice synthesis requires an active internet connection and may incur additional costs depending on your provider and usage volume.
                    </p>
                    
                    <h4 className="font-medium text-sm">Provider-Specific Notes:</h4>
                    <ul className="text-sm space-y-2">
                      <li>
                        <strong>ElevenLabs:</strong> Highest quality, wide voice selection, pay-per-character pricing
                      </li>
                      <li>
                        <strong>OpenAI:</strong> Good quality, limited voice selection, included with API usage
                      </li>
                      <li>
                        <strong>Azure:</strong> Enterprise-ready, many languages, subscription-based pricing
                      </li>
                      <li>
                        <strong>Amazon Polly:</strong> Good for high-volume use cases, pay-per-character pricing
                      </li>
                      <li>
                        <strong>Google Cloud:</strong> Excellent multilingual support, pay-per-character pricing
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
            <div className="flex justify-between p-6 pt-0">
              <Button variant="outline" onClick={() => handlePreviousStep('voice')}>
                Back
              </Button>
              <Button onClick={() => handleNextStep('voice')}>
                Next: Email Configuration
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Email Configuration Step */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure the email service for notifications and user communication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email-provider">Email Provider</Label>
                  <HelpTooltip 
                    content="Select the email service provider that you want to use for sending emails from your application."
                  />
                </div>
                <Select defaultValue={emailProvider} onValueChange={setEmailProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">Custom SMTP Server</SelectItem>
                    <SelectItem value="gmail">Gmail</SelectItem>
                    <SelectItem value="outlook">Outlook/Office 365</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {emailProvider === 'smtp' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="smtp-host">SMTP Host</Label>
                        <HelpTooltip 
                          content="The hostname or IP address of your SMTP server."
                        />
                      </div>
                      <Input 
                        id="smtp-host"
                        value={emailConfig.host}
                        onChange={(e) => handleEmailConfigChange('host', e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="smtp-port">SMTP Port</Label>
                        <HelpTooltip 
                          content="The port number for your SMTP server. Common ports are 25, 465 (SSL), and 587 (TLS)."
                        />
                      </div>
                      <Input 
                        id="smtp-port"
                        value={emailConfig.port}
                        onChange={(e) => handleEmailConfigChange('port', e.target.value)}
                        placeholder="587"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="smtp-username">Username</Label>
                        <HelpTooltip 
                          content="The username for authenticating with your SMTP server."
                        />
                      </div>
                      <Input 
                        id="smtp-username"
                        value={emailConfig.username}
                        onChange={(e) => handleEmailConfigChange('username', e.target.value)}
                        placeholder="username@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="smtp-password">Password</Label>
                        <HelpTooltip 
                          content="The password for authenticating with your SMTP server."
                        />
                      </div>
                      <Input 
                        id="smtp-password"
                        type="password"
                        value={emailConfig.password}
                        onChange={(e) => handleEmailConfigChange('password', e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {emailProvider === 'gmail' && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <h3 className="font-medium">Gmail Configuration Guide</h3>
                    <p className="text-sm">
                      To use Gmail as your email provider, you need to enable "Less secure app access" or use an App Password:
                    </p>
                    <ol className="text-sm list-decimal ml-5 space-y-1">
                      <li>Go to your Google Account settings</li>
                      <li>Navigate to Security → App passwords</li>
                      <li>Generate a new app password for this application</li>
                      <li>Enter your Gmail address as username and the app password below</li>
                    </ol>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="gmail-username">Gmail Address</Label>
                        <HelpTooltip 
                          content="Your full Gmail email address."
                        />
                      </div>
                      <Input 
                        id="gmail-username"
                        value={emailConfig.username}
                        onChange={(e) => handleEmailConfigChange('username', e.target.value)}
                        placeholder="your.email@gmail.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="gmail-password">App Password</Label>
                        <HelpTooltip 
                          content="The app password generated for this application. Not your regular Gmail password."
                        />
                      </div>
                      <Input 
                        id="gmail-password"
                        type="password"
                        value={emailConfig.password}
                        onChange={(e) => handleEmailConfigChange('password', e.target.value)}
                        placeholder="16-character app password"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Similar sections would be added for other email providers */}
              
              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-medium">Sender Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="from-email">From Email</Label>
                      <HelpTooltip 
                        content="The email address that will appear as the sender in emails sent from your application."
                      />
                    </div>
                    <Input 
                      id="from-email"
                      value={emailConfig.fromEmail}
                      onChange={(e) => handleEmailConfigChange('fromEmail', e.target.value)}
                      placeholder="no-reply@yourapp.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="from-name">From Name</Label>
                      <HelpTooltip 
                        content="The name that will appear as the sender in emails sent from your application."
                      />
                    </div>
                    <Input 
                      id="from-name"
                      value={emailConfig.fromName}
                      onChange={(e) => handleEmailConfigChange('fromName', e.target.value)}
                      placeholder="Your Application Name"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleTestEmail} 
                disabled={isEmailTesting} 
                className="w-full md:w-auto"
              >
                {isEmailTesting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending Test Email...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
            </CardContent>
            <div className="flex justify-between p-6 pt-0">
              <Button variant="outline" onClick={() => handlePreviousStep('email')}>
                Back
              </Button>
              <Button onClick={() => handleNextStep('email')}>
                Next: Review Configuration
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Review Step */}
        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Review Configuration</CardTitle>
              <CardDescription>
                Review your configuration before finalizing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      AI Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Selected Model</dt>
                        <dd className="text-sm">{selectedModel}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Max Tokens</dt>
                        <dd className="text-sm">{maxTokens}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Temperature</dt>
                        <dd className="text-sm">{temperature}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">API Key</dt>
                        <dd className="text-sm">••••••••••••••••</dd>
                      </div>
                    </dl>
                    <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setActiveStep('model')}>
                      Edit
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      Voice System
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                        <dd className="text-sm">{enableVoice ? 'Enabled' : 'Disabled'}</dd>
                      </div>
                      {enableVoice && (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Provider</dt>
                            <dd className="text-sm">{voiceProvider}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Voice</dt>
                            <dd className="text-sm">{selectedVoice}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">API Key</dt>
                            <dd className="text-sm">••••••••••••••••</dd>
                          </div>
                        </>
                      )}
                    </dl>
                    <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setActiveStep('voice')}>
                      Edit
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Email System
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Provider</dt>
                        <dd className="text-sm">{emailProvider}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">From Email</dt>
                        <dd className="text-sm">{emailConfig.fromEmail || '(Not set)'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">From Name</dt>
                        <dd className="text-sm">{emailConfig.fromName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Authentication</dt>
                        <dd className="text-sm">{emailConfig.username ? 'Configured' : 'Not configured'}</dd>
                      </div>
                    </dl>
                    <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setActiveStep('email')}>
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <div className="flex justify-between p-6 pt-0">
              <Button variant="outline" onClick={() => handlePreviousStep('review')}>
                Back
              </Button>
              <Button onClick={() => handleNextStep('review')}>
                Finalize Setup
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Complete Step */}
        <TabsContent value="complete">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Check className="h-6 w-6 text-primary" />
                Setup Complete
              </CardTitle>
              <CardDescription>
                Your AI system has been configured successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 p-4 rounded-lg space-y-4">
                <h3 className="font-medium">What's Next?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>Explore the AI Management Dashboard to monitor and fine-tune your AI system</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <span>Upload training data to improve your AI model's performance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <span>Test the AI assistant functionality with different queries and scenarios</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <div className="flex justify-end p-6 pt-0">
              <Button onClick={handleFinish}>
                Go to AI Dashboard
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISetupWizard;
