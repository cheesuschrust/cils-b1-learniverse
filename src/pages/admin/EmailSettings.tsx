import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Save, Send, MailOpen, Settings, Server, FileType, Mail } from 'lucide-react';
import { EmailSettings as EmailSettingsType } from '@/contexts/shared-types';
import { useSystemLog } from '@/hooks/use-system-log';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmailService, EmailProvider, EmailProviderConfig } from '@/services/EmailService';

const EmailSettings = () => {
  const { toast } = useToast();
  const { logSystemAction } = useSystemLog();
  const [isLoading, setIsLoading] = useState(false);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  
  const [settings, setSettings] = useState<EmailSettingsType>({
    provider: 'smtp',
    fromEmail: 'noreply@cilsb2cittadinanza.com',
    fromName: 'CILS B2 Cittadinanza',
    config: {
      host: 'smtp.example.com',
      port: 587,
      username: '',
      password: '',
      enableSsl: true,
    },
    templates: {
      verification: {
        subject: 'Please verify your email address',
        body: 'Hello {{name}},\n\nPlease verify your email address by clicking the link below:\n\n{{verificationLink}}\n\nThis link will expire in 24 hours.\n\nThank you,\nCILS B2 Cittadinanza Team'
      },
      passwordReset: {
        subject: 'Reset your password',
        body: 'Hello {{name}},\n\nYou recently requested to reset your password. Click the link below to reset it:\n\n{{resetLink}}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.\n\nThank you,\nCILS B2 Cittadinanza Team'
      },
      welcome: {
        subject: 'Welcome to CILS B2 Cittadinanza',
        body: 'Hello {{name}},\n\nWelcome to CILS B2 Cittadinanza! We\'re excited to have you on board.\n\nGet started with your Italian learning journey by logging in to your account.\n\nIf you have any questions, feel free to contact our support team.\n\nBest regards,\nCILS B2 Cittadinanza Team'
      }
    },
    temporaryInboxDuration: 30
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        logSystemAction('Viewed email settings');
        
        // In a real app, this would fetch from the server
        // For now, we'll use the default settings
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Keep using the default settings initialized above
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching email settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load email settings',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast, logSystemAction]);
  
  const handleProviderChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      provider: value as EmailProvider,
      // Reset the config when changing provider
      config: getDefaultConfig(value as EmailProvider)
    }));
  };
  
  const getDefaultConfig = (provider: EmailProvider): EmailProviderConfig => {
    switch (provider) {
      case 'smtp':
        return {
          host: 'smtp.example.com',
          port: 587,
          username: '',
          password: '',
          enableSsl: true,
        };
      case 'sendgrid':
        return {
          apiKey: '',
        };
      case 'mailgun':
        return {
          apiKey: '',
          domain: '',
        };
      case 'ses':
        return {
          accessKey: '',
          secretKey: '',
          region: 'us-east-1',
        };
      case 'gmail':
        return {
          username: '',
          password: '',
        };
      case 'temporaryEmail':
        return {};
      default:
        return {};
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      logSystemAction('Updated email settings');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Email settings have been saved successfully',
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save email settings',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  const handleTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setTestEmailSending(true);
      logSystemAction('Sent test email');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Success',
        description: `Test email sent to ${testEmail}`,
      });
      
      setTestEmailSending(false);
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test email',
        variant: 'destructive',
      });
      setTestEmailSending(false);
    }
  };
  
  const renderProviderConfig = () => {
    switch (settings.provider) {
      case 'smtp':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input
                  id="smtp-host"
                  value={settings.config.host || ''}
                  onChange={e => setSettings(prev => ({
                    ...prev,
                    config: { ...prev.config, host: e.target.value }
                  }))}
                  placeholder="smtp.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  value={settings.config.port || ''}
                  onChange={e => setSettings(prev => ({
                    ...prev,
                    config: { ...prev.config, port: parseInt(e.target.value) }
                  }))}
                  placeholder="587"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-username">Username</Label>
                <Input
                  id="smtp-username"
                  value={settings.config.username || ''}
                  onChange={e => setSettings(prev => ({
                    ...prev,
                    config: { ...prev.config, username: e.target.value }
                  }))}
                  placeholder="username@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Password</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  value={settings.config.password || ''}
                  onChange={e => setSettings(prev => ({
                    ...prev,
                    config: { ...prev.config, password: e.target.value }
                  }))}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="smtp-ssl"
                checked={settings.config.enableSsl}
                onCheckedChange={checked => setSettings(prev => ({
                  ...prev,
                  config: { ...prev.config, enableSsl: Boolean(checked) }
                }))}
              />
              <Label htmlFor="smtp-ssl">Enable SSL/TLS</Label>
            </div>
          </div>
        );
      
      case 'sendgrid':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sendgrid-api-key">SendGrid API Key</Label>
              <Input
                id="sendgrid-api-key"
                type="password"
                value={settings.config.apiKey || ''}
                onChange={e => setSettings(prev => ({
                  ...prev,
                  config: { ...prev.config, apiKey: e.target.value }
                }))}
                placeholder="SG.xxxxxxxxx"
              />
            </div>
          </div>
        );
      
      case 'mailgun':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mailgun-api-key">Mailgun API Key</Label>
              <Input
                id="mailgun-api-key"
                type="password"
                value={settings.config.apiKey || ''}
                onChange={e => setSettings(prev => ({
                  ...prev,
                  config: { ...prev.config, apiKey: e.target.value }
                }))}
                placeholder="key-xxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailgun-domain">Mailgun Domain</Label>
              <Input
                id="mailgun-domain"
                value={settings.config.domain || ''}
                onChange={e => setSettings(prev => ({
                  ...prev,
                  config: { ...prev.config, domain: e.target.value }
                }))}
                placeholder="mg.yourdomain.com"
              />
            </div>
          </div>
        );
      
      case 'ses':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ses-access-key">AWS Access Key</Label>
              <Input
                id="ses-access-key"
                value={settings.config.accessKey || ''}
                onChange={e => setSettings(prev => ({
                  ...prev,
                  config: { ...prev.config, accessKey: e.target.value }
                }))}
                placeholder="AKIAXXXXXXXXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ses-secret-key">AWS Secret Key</Label>
              <Input
                id="ses-secret-key"
                type="password"
                value={settings.config.secretKey || ''}
                onChange={e => setSettings(prev => ({
                  ...prev,
                  config: { ...prev.config, secretKey: e.target.value }
                }))}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ses-region">AWS Region</Label>
              <Select
                value={settings.config.region || 'us-east-1'}
                onValueChange={value => setSettings(prev => ({
                  ...prev,
                  config: { ...prev.config, region: value }
                }))}
              >
                <SelectTrigger id="ses-region">
                  <SelectValue placeholder="Select region" />
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
        );
      
      case 'gmail':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gmail-username">Gmail Address</Label>
              <Input
                id="gmail-username"
                value={settings.config.username || ''}
                onChange={e => setSettings(prev => ({
                  ...prev,
                  config: { ...prev.config, username: e.target.value }
                }))}
                placeholder="youremail@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gmail-password">App Password</Label>
              <Input
                id="gmail-password"
                type="password"
                value={settings.config.password || ''}
                onChange={e => setSettings(prev => ({
                  ...prev,
                  config: { ...prev.config, password: e.target.value }
                }))}
                placeholder="••••••••"
              />
              <p className="text-sm text-muted-foreground">
                You need to create an App Password in your Google Account settings.
              </p>
            </div>
          </div>
        );
      
      case 'temporaryEmail':
        return (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                <div className="flex flex-col space-y-2">
                  <p>Temporary email mode is active. All emails will be stored in a temporary inbox for testing.</p>
                  <div className="space-y-2">
                    <Label htmlFor="temp-duration">Email Retention Period (days)</Label>
                    <Input
                      id="temp-duration"
                      type="number"
                      min="1"
                      max="90"
                      value={settings.temporaryInboxDuration || 30}
                      onChange={e => setSettings(prev => ({
                        ...prev,
                        temporaryInboxDuration: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="container py-6">
      <Helmet>
        <title>Email Settings | Admin</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Email Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
              <CardDescription>
                Configure your email provider settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email-provider">Email Provider</Label>
                  <Select
                    value={settings.provider}
                    onValueChange={handleProviderChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="email-provider">
                      <SelectValue placeholder="Select email provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP Server</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                      <SelectItem value="gmail">Gmail</SelectItem>
                      <SelectItem value="temporaryEmail">Temporary Email (Testing)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email Address</Label>
                  <Input
                    id="from-email"
                    value={settings.fromEmail}
                    onChange={e => setSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                    placeholder="noreply@yourdomain.com"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input
                    id="from-name"
                    value={settings.fromName}
                    onChange={e => setSettings(prev => ({ ...prev, fromName: e.target.value }))}
                    placeholder="Your App Name"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Provider Settings</h3>
                  {renderProviderConfig()}
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full"
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Test Configuration
              </CardTitle>
              <CardDescription>
                Send a test email to verify your settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-email">Test Email Address</Label>
                  <Input
                    id="test-email"
                    type="email"
                    value={testEmail}
                    onChange={e => setTestEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={testEmailSending || isLoading}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleTestEmail}
                  disabled={testEmailSending || isLoading || !testEmail}
                >
                  {testEmailSending ? "Sending..." : "Send Test Email"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileType className="h-5 w-5" />
                Email Templates
              </CardTitle>
              <CardDescription>
                Customize the email templates sent to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="verification">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="verification" className="flex items-center justify-center gap-1">
                    <MailOpen className="h-4 w-4" />
                    Verification
                  </TabsTrigger>
                  <TabsTrigger value="reset" className="flex items-center justify-center gap-1">
                    <Server className="h-4 w-4" />
                    Password Reset
                  </TabsTrigger>
                  <TabsTrigger value="welcome" className="flex items-center justify-center gap-1">
                    <Mail className="h-4 w-4" />
                    Welcome
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="verification">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verification-subject">Subject</Label>
                      <Input
                        id="verification-subject"
                        value={settings.templates.verification.subject}
                        onChange={e => setSettings(prev => ({
                          ...prev,
                          templates: {
                            ...prev.templates,
                            verification: {
                              ...prev.templates.verification,
                              subject: e.target.value
                            }
                          }
                        }))}
                        placeholder="Please verify your email address"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="verification-body">Email Body</Label>
                      <Textarea
                        id="verification-body"
                        value={settings.templates.verification.body}
                        onChange={e => setSettings(prev => ({
                          ...prev,
                          templates: {
                            ...prev.templates,
                            verification: {
                              ...prev.templates.verification,
                              body: e.target.value
                            }
                          }
                        }))}
                        placeholder="Enter the verification email body"
                        className="min-h-[200px]"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Available Variables:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>{{name}} - User's name</li>
                        <li>{{verificationLink}} - Email verification link</li>
                        <li>{{appName}} - Application name</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reset">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-subject">Subject</Label>
                      <Input
                        id="reset-subject"
                        value={settings.templates.passwordReset.subject}
                        onChange={e => setSettings(prev => ({
                          ...prev,
                          templates: {
                            ...prev.templates,
                            passwordReset: {
                              ...prev.templates.passwordReset,
                              subject: e.target.value
                            }
                          }
                        }))}
                        placeholder="Reset your password"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reset-body">Email Body</Label>
                      <Textarea
                        id="reset-body"
                        value={settings.templates.passwordReset.body}
                        onChange={e => setSettings(prev => ({
                          ...prev,
                          templates: {
                            ...prev.templates,
                            passwordReset: {
                              ...prev.templates.passwordReset,
                              body: e.target.value
                            }
                          }
                        }))}
                        placeholder="Enter the password reset email body"
                        className="min-h-[200px]"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Available Variables:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>{{name}} - User's name</li>
                        <li>{{resetLink}} - Password reset link</li>
                        <li>{{appName}} - Application name</li>
                        <li>{{expiry}} - Link expiration time</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="welcome">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="welcome-subject">Subject</Label>
                      <Input
                        id="welcome-subject"
                        value={settings.templates.welcome.subject}
                        onChange={e => setSettings(prev => ({
                          ...prev,
                          templates: {
                            ...prev.templates,
                            welcome: {
                              ...prev.templates.welcome,
                              subject: e.target.value
                            }
                          }
                        }))}
                        placeholder="Welcome to our platform"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="welcome-body">Email Body</Label>
                      <Textarea
                        id="welcome-body"
                        value={settings.templates.welcome.body}
                        onChange={e => setSettings(prev => ({
                          ...prev,
                          templates: {
                            ...prev.templates,
                            welcome: {
                              ...prev.templates.welcome,
                              body: e.target.value
                            }
                          }
                        }))}
                        placeholder="Enter the welcome email body"
                        className="min-h-[200px]"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Available Variables:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>{{name}} - User's name</li>
                        <li>{{loginLink}} - Link to login page</li>
                        <li>{{appName}} - Application name</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving Templates..." : "Save All Templates"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;

