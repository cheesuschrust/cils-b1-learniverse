
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { EmailSettings, EmailTemplate, EmailProvider } from '@/services/EmailService';
import { useSystemLog } from '@/hooks/use-system-log';
import { Mail, Server, KeyRound, RefreshCw, Save } from 'lucide-react';

const SystemSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('email');
  const { toast } = useToast();
  const { logSystemAction } = useSystemLog();
  
  // Default email settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    provider: 'smtp',
    fromEmail: 'noreply@example.com',
    fromName: 'CILS B2 Cittadinanza',
    config: {
      enableSsl: true,
      host: "smtp.example.com",
      port: 587,
      username: "user@example.com",
      password: "********"
    },
    templates: {
      verification: {
        subject: 'Verify your email',
        body: 'Please verify your email'
      },
      passwordReset: {
        subject: 'Reset your password',
        body: 'Reset your password'
      },
      welcome: {
        subject: 'Welcome',
        body: 'Welcome to our platform'
      }
    }
  });

  // Fetch settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      // In a real app, this would fetch from the server
      // For now, we'll just use the default settings
      setIsLoading(true);
      try {
        // Example API call:
        // const response = await fetch('/api/admin/settings/email');
        // const data = await response.json();
        // setEmailSettings(data);

        logSystemAction('Viewed system settings');
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings. Please try again.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [logSystemAction, toast]);

  const handleProviderChange = (provider: string) => {
    setEmailSettings(prev => ({
      ...prev,
      provider: provider as EmailProvider
    }));
  };

  const handleConfigChange = (key: keyof typeof emailSettings.config, value: any) => {
    setEmailSettings(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  const handleTemplateChange = (
    templateName: keyof typeof emailSettings.templates,
    field: keyof EmailTemplate,
    value: string
  ) => {
    setEmailSettings(prev => ({
      ...prev,
      templates: {
        ...prev.templates,
        [templateName]: {
          ...prev.templates[templateName],
          [field]: value
        }
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would save to the server
      // Example API call:
      // await fetch('/api/admin/settings/email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emailSettings)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logSystemAction('Updated email settings');
      toast({
        title: 'Success',
        description: 'Email settings have been saved successfully.'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmailConnection = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would test the email connection
      // Example API call:
      // await fetch('/api/admin/settings/email/test', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emailSettings)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      logSystemAction('Tested email connection');
      toast({
        title: 'Success',
        description: 'Email connection test was successful.'
      });
    } catch (error) {
      console.error('Error testing email connection:', error);
      toast({
        title: 'Error',
        description: 'Email connection test failed. Please check your settings.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-6">
      <Helmet>
        <title>System Settings | Admin Dashboard</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-3 mb-6">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Settings
          </TabsTrigger>
          <TabsTrigger value="security" disabled className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="server" disabled className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Server
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Provider Configuration</CardTitle>
              <CardDescription>
                Configure how emails are sent from the system
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="provider">Email Provider</Label>
                  <Select 
                    value={emailSettings.provider} 
                    onValueChange={handleProviderChange}
                  >
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP Server</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                      <SelectItem value="gmail">Gmail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input 
                    id="from-email" 
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({
                      ...prev,
                      fromEmail: e.target.value
                    }))}
                    placeholder="noreply@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input 
                    id="from-name" 
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings(prev => ({
                      ...prev,
                      fromName: e.target.value
                    }))}
                    placeholder="Your Application Name"
                  />
                </div>
              </div>
              
              {emailSettings.provider === 'smtp' && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="text-lg font-medium">SMTP Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input 
                        id="smtp-host" 
                        value={emailSettings.config.host || ''}
                        onChange={(e) => handleConfigChange('host', e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input 
                        id="smtp-port" 
                        type="number"
                        value={emailSettings.config.port || ''}
                        onChange={(e) => handleConfigChange('port', parseInt(e.target.value))}
                        placeholder="587"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">Username</Label>
                      <Input 
                        id="smtp-username" 
                        value={emailSettings.config.username || ''}
                        onChange={(e) => handleConfigChange('username', e.target.value)}
                        placeholder="user@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Password</Label>
                      <Input 
                        id="smtp-password" 
                        type="password"
                        value={emailSettings.config.password || ''}
                        onChange={(e) => handleConfigChange('password', e.target.value)}
                        placeholder="********"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 col-span-2">
                      <Switch 
                        id="smtp-ssl"
                        checked={emailSettings.config.enableSsl}
                        onCheckedChange={(checked) => handleConfigChange('enableSsl', checked)}
                      />
                      <Label htmlFor="smtp-ssl">Enable SSL/TLS</Label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* API Key based providers */}
              {['sendgrid', 'mailgun', 'ses'].includes(emailSettings.provider) && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="text-lg font-medium">{emailSettings.provider.toUpperCase()} Configuration</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      type="password"
                      value={emailSettings.config.apiKey || ''}
                      onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                      placeholder="Your API Key"
                    />
                  </div>
                  
                  {emailSettings.provider === 'mailgun' && (
                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain</Label>
                      <Input 
                        id="domain" 
                        value={emailSettings.config.domain || ''}
                        onChange={(e) => handleConfigChange('domain', e.target.value)}
                        placeholder="mail.yourdomain.com"
                      />
                    </div>
                  )}
                  
                  {emailSettings.provider === 'ses' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="access-key">Access Key</Label>
                        <Input 
                          id="access-key" 
                          value={emailSettings.config.accessKey || ''}
                          onChange={(e) => handleConfigChange('accessKey', e.target.value)}
                          placeholder="AWS Access Key"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="secret-key">Secret Key</Label>
                        <Input 
                          id="secret-key" 
                          type="password"
                          value={emailSettings.config.secretKey || ''}
                          onChange={(e) => handleConfigChange('secretKey', e.target.value)}
                          placeholder="AWS Secret Key"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="region">AWS Region</Label>
                        <Input 
                          id="region" 
                          value={emailSettings.config.region || ''}
                          onChange={(e) => handleConfigChange('region', e.target.value)}
                          placeholder="us-east-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Email Templates */}
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="text-lg font-medium">Email Templates</h3>
                
                <Tabs defaultValue="welcome" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="welcome">Welcome</TabsTrigger>
                    <TabsTrigger value="verification">Verification</TabsTrigger>
                    <TabsTrigger value="passwordReset">Password Reset</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="welcome" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="welcome-subject">Subject</Label>
                      <Input 
                        id="welcome-subject" 
                        value={emailSettings.templates.welcome.subject}
                        onChange={(e) => handleTemplateChange('welcome', 'subject', e.target.value)}
                        placeholder="Welcome to our platform"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="welcome-body">Body</Label>
                      <Textarea 
                        id="welcome-body" 
                        value={emailSettings.templates.welcome.body}
                        onChange={(e) => handleTemplateChange('welcome', 'body', e.target.value)}
                        placeholder="Welcome email body text"
                        rows={5}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="verification" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verification-subject">Subject</Label>
                      <Input 
                        id="verification-subject" 
                        value={emailSettings.templates.verification.subject}
                        onChange={(e) => handleTemplateChange('verification', 'subject', e.target.value)}
                        placeholder="Verify your email address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="verification-body">Body</Label>
                      <Textarea 
                        id="verification-body" 
                        value={emailSettings.templates.verification.body}
                        onChange={(e) => handleTemplateChange('verification', 'body', e.target.value)}
                        placeholder="Verification email body text"
                        rows={5}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="passwordReset" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-subject">Subject</Label>
                      <Input 
                        id="reset-subject" 
                        value={emailSettings.templates.passwordReset.subject}
                        onChange={(e) => handleTemplateChange('passwordReset', 'subject', e.target.value)}
                        placeholder="Reset your password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reset-body">Body</Label>
                      <Textarea 
                        id="reset-body" 
                        value={emailSettings.templates.passwordReset.body}
                        onChange={(e) => handleTemplateChange('passwordReset', 'body', e.target.value)}
                        placeholder="Password reset email body text"
                        rows={5}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleTestEmailConnection}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Test Connection
              </Button>
              
              <Button 
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
