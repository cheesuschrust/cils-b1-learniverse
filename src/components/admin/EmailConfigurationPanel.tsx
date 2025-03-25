
import React, { useState } from 'react';
import { 
  Send, 
  Check, 
  Mail, 
  Save, 
  Download, 
  Upload, 
  Play, 
  Copy, 
  RefreshCw,
  Settings,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

interface TemplateData {
  id: string;
  name: string;
  subject: string;
  content: string;
  description: string;
}

const EmailConfigurationPanel: React.FC = () => {
  const { toast } = useToast();
  const [emailProvider, setEmailProvider] = useState('smtp');
  const [smtpConfig, setSmtpConfig] = useState({
    host: '',
    port: '587',
    username: '',
    password: '',
    encryption: 'tls',
  });
  const [apiConfig, setApiConfig] = useState({
    apiKey: '',
    domain: '',
    region: 'us-east-1',
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('welcome');
  
  // Email templates
  const templates: TemplateData[] = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to Italian Learning Platform',
      content: 'Hello {{name}},\n\nWelcome to the Italian Learning Platform! We\'re excited to have you join our community of language learners.\n\nTo get started, we recommend:\n1. Completing your profile\n2. Taking the placement test\n3. Exploring our flashcard collections\n\nIf you have any questions, don\'t hesitate to reach out to our support team.\n\nBuon apprendimento!\nThe Italian Learning Team',
      description: 'Sent to new users after registration'
    },
    {
      id: 'password-reset',
      name: 'Password Reset',
      subject: 'Reset Your Password',
      content: 'Hello {{name}},\n\nWe received a request to reset your password. Click the link below to set a new password:\n\n{{resetLink}}\n\nIf you didn\'t request a password reset, you can ignore this email.\n\nThe link will expire in 24 hours.\n\nRegards,\nThe Italian Learning Team',
      description: 'Sent when a user requests a password reset'
    },
    {
      id: 'streak-reminder',
      name: 'Streak Reminder',
      subject: 'Don\'t Break Your Learning Streak!',
      content: 'Ciao {{name}}!\n\nJust a friendly reminder that you haven\'t completed your daily Italian lesson yet. Take a few minutes today to maintain your {{streakCount}}-day streak!\n\nConsistency is key to language learning success.\n\nA presto!\nThe Italian Learning Team',
      description: 'Sent to remind users to maintain their streak'
    },
    {
      id: 'achievement',
      name: 'Achievement Unlocked',
      subject: 'Congratulations on Your Achievement!',
      content: 'Bravo, {{name}}!\n\nYou\'ve unlocked the "{{achievementName}}" achievement!\n\n{{achievementDescription}}\n\nKeep up the great work with your Italian studies. New challenges and achievements await!\n\nContinua così!\nThe Italian Learning Team',
      description: 'Sent when a user unlocks an achievement'
    }
  ];
  
  const handleSmtpConfigChange = (key: string, value: string) => {
    setSmtpConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApiConfigChange = (key: string, value: string) => {
    setApiConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const handleTestConnection = () => {
    setIsTestingConnection(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsTestingConnection(false);
      toast({
        title: "Connection successful",
        description: "Email server connection was successful",
        variant: "success",
      });
    }, 1500);
  };
  
  const handleSaveConfig = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Email configuration has been updated successfully",
        variant: "success",
      });
    }, 1500);
  };
  
  const handleSendTestEmail = () => {
    if (!testEmailAddress) {
      toast({
        title: "Missing email address",
        description: "Please enter an email address for the test",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Test email sent",
      description: `A test email has been sent to ${testEmailAddress}`,
    });
  };
  
  const handleSaveTemplate = () => {
    toast({
      title: "Template saved",
      description: "Email template has been updated successfully",
    });
  };
  
  const [editableTemplate, setEditableTemplate] = useState<TemplateData>({...templates[0]});
  
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEditableTemplate({...template});
    }
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Email Configuration</h1>
          <p className="text-muted-foreground">
            Configure email providers and manage notification templates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveConfig} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button onClick={handleTestConnection} disabled={isTestingConnection}>
            <Send className="h-4 w-4 mr-2" />
            {isTestingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="provider">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="provider">
            <Settings className="h-4 w-4 mr-2" />
            Provider
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Mail className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="test">
            <Play className="h-4 w-4 mr-2" />
            Testing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="provider">
          <Card>
            <CardHeader>
              <CardTitle>Email Provider Configuration</CardTitle>
              <CardDescription>
                Configure your email service provider for sending notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="provider">Email Provider</Label>
                <Select 
                  value={emailProvider} 
                  onValueChange={setEmailProvider}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select email provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP Server</SelectItem>
                    <SelectItem value="aws">Amazon SES</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {emailProvider === 'smtp' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">SMTP Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input 
                        id="smtp-host" 
                        value={smtpConfig.host}
                        onChange={(e) => handleSmtpConfigChange('host', e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input 
                        id="smtp-port" 
                        value={smtpConfig.port}
                        onChange={(e) => handleSmtpConfigChange('port', e.target.value)}
                        placeholder="587"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">Username</Label>
                      <Input 
                        id="smtp-username" 
                        value={smtpConfig.username}
                        onChange={(e) => handleSmtpConfigChange('username', e.target.value)}
                        placeholder="user@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Password</Label>
                      <Input 
                        id="smtp-password" 
                        type="password"
                        value={smtpConfig.password}
                        onChange={(e) => handleSmtpConfigChange('password', e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-encryption">Encryption</Label>
                    <Select 
                      value={smtpConfig.encryption} 
                      onValueChange={(value) => handleSmtpConfigChange('encryption', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select encryption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {emailProvider === 'aws' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Amazon SES Configuration</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aws-api-key">API Key</Label>
                    <Input 
                      id="aws-api-key" 
                      value={apiConfig.apiKey}
                      onChange={(e) => handleApiConfigChange('apiKey', e.target.value)}
                      placeholder="AWS API Key"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aws-region">AWS Region</Label>
                      <Select 
                        value={apiConfig.region} 
                        onValueChange={(value) => handleApiConfigChange('region', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select AWS region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                          <SelectItem value="us-east-2">US East (Ohio)</SelectItem>
                          <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                          <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                          <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                          <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              
              {(emailProvider === 'sendgrid' || emailProvider === 'mailgun') && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{emailProvider === 'sendgrid' ? 'SendGrid' : 'Mailgun'} Configuration</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      value={apiConfig.apiKey}
                      onChange={(e) => handleApiConfigChange('apiKey', e.target.value)}
                      placeholder="API Key"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input 
                      id="domain" 
                      value={apiConfig.domain}
                      onChange={(e) => handleApiConfigChange('domain', e.target.value)}
                      placeholder="example.com"
                    />
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t space-y-3">
                <h3 className="text-sm font-medium">Default Email Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email Address</Label>
                  <Input 
                    id="from-email"
                    placeholder="noreply@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input 
                    id="from-name"
                    placeholder="Italian Learning Platform"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reply-to">Reply-To Email Address</Label>
                  <Input 
                    id="reply-to"
                    placeholder="support@example.com"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="email-enabled" />
                <Label htmlFor="email-enabled">Enable email notifications</Label>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveConfig} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
                <Button onClick={handleTestConnection} disabled={isTestingConnection}>
                  <Send className="h-4 w-4 mr-2" />
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Customize email notification templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="template-select">Select Template</Label>
                <Select 
                  value={selectedTemplate} 
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {editableTemplate?.description}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-subject">Subject Line</Label>
                <Input 
                  id="template-subject"
                  value={editableTemplate?.subject}
                  onChange={(e) => setEditableTemplate(prev => ({...prev, subject: e.target.value}))}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="template-content">Email Content</Label>
                  <div className="text-xs text-muted-foreground">
                    Available variables: <code>&#123;&#123;name&#125;&#125;</code>, <code>&#123;&#123;resetLink&#125;&#125;</code>, etc.
                  </div>
                </div>
                <Textarea 
                  id="template-content"
                  value={editableTemplate?.content}
                  onChange={(e) => setEditableTemplate(prev => ({...prev, content: e.target.value}))}
                  rows={10}
                />
              </div>
              
              <div className="pt-4 space-y-2">
                <h3 className="text-sm font-medium">Template Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="ghost" onClick={() => handleTemplateChange(selectedTemplate)}>
                Discard Changes
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSendTestEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Email Testing</CardTitle>
              <CardDescription>
                Send test emails to verify your configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Make sure to save your configuration before sending test emails.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="test-email">Test Email Address</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="test-email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="your-email@example.com"
                  />
                  <Button onClick={handleSendTestEmail}>Send Test</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  A basic test email will be sent to verify your configuration
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Test Specific Templates</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map(template => (
                    <Button 
                      key={template.id}
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        handleTemplateChange(template.id);
                        toast({
                          title: `Template selected`,
                          description: `"${template.name}" template loaded for testing`,
                        });
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-3">
                <h3 className="text-sm font-medium">Troubleshooting</h3>
                <p className="text-sm text-muted-foreground">
                  If you're experiencing issues with email delivery, try these steps:
                </p>
                <ul className="list-disc text-sm text-muted-foreground ml-5 space-y-1">
                  <li>Verify your SMTP credentials and server information</li>
                  <li>Check if your email provider requires specific port or security settings</li>
                  <li>Make sure your sending domain has proper SPF and DKIM records</li>
                  <li>For API-based providers, confirm your API key has sending permissions</li>
                </ul>
                
                <div className="flex items-center gap-2 pt-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Need help? Contact our support team.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailConfigurationPanel;
