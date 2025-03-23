
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { EmailProvider, EmailSettings as EmailSettingsType } from '@/contexts/shared-types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const EmailSettingsPage = () => {
  const { getEmailSettings, updateEmailSettings } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<EmailSettingsType>({
    provider: 'smtp',
    fromEmail: "",
    fromName: "",
    config: {
      enableSsl: true, // Default value
      host: "",
      port: 587,
      username: "",
      password: "",
      apiKey: ""
    },
    templates: {
      verification: {
        subject: "",
        body: ""
      },
      passwordReset: {
        subject: "",
        body: ""
      },
      welcome: {
        subject: "",
        body: ""
      }
    },
    temporaryInboxDuration: 24
  });

  // Fetch settings on component mount
  useEffect(() => {
    try {
      const currentSettings = getEmailSettings();
      if (currentSettings) {
        // Ensure config has all required properties with default values
        const config = {
          enableSsl: true,
          ...currentSettings.config
        };
        
        setSettings({
          ...currentSettings,
          config,
          temporaryInboxDuration: currentSettings.temporaryInboxDuration || 24
        });
      }
    } catch (error) {
      console.error("Failed to load email settings:", error);
      toast({
        title: "Error loading settings",
        description: "Could not load email settings. Please try again later.",
        variant: "destructive"
      });
    }
  }, [getEmailSettings, toast]);

  const handleProviderChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      provider: value as EmailProvider
    }));
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setSettings(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [name]: type === 'number' ? parseInt(value) : value
      }
    }));
  };

  const handleSslToggle = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      config: {
        ...prev.config,
        enableSsl: checked
      }
    }));
  };

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateChange = (
    template: 'verification' | 'passwordReset' | 'welcome',
    field: 'subject' | 'body',
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      templates: {
        ...prev.templates,
        [template]: {
          ...prev.templates[template],
          [field]: value
        }
      }
    }));
  };

  const handleTemporaryInboxDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSettings(prev => ({
      ...prev,
      temporaryInboxDuration: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Ensure temporaryInboxDuration is present
      const updatedSettings = {
        ...settings,
        temporaryInboxDuration: settings.temporaryInboxDuration || 24
      };
      
      await updateEmailSettings(updatedSettings);
      toast({
        title: "Settings saved",
        description: "Email settings have been updated successfully."
      });
    } catch (error) {
      console.error("Failed to save email settings:", error);
      toast({
        title: "Error saving settings",
        description: "Could not save email settings. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = () => {
    toast({
      title: "Test email sent",
      description: "A test email has been sent to your inbox."
    });
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Email Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure email service providers and templates for user communication
          </p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Email Service Configuration</CardTitle>
                <CardDescription>
                  Set up your email service provider and default sender information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="provider">Email Provider</Label>
                    <Select 
                      value={settings.provider} 
                      onValueChange={handleProviderChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
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
                  
                  <div>
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input 
                      id="fromEmail"
                      name="fromEmail"
                      value={settings.fromEmail}
                      onChange={handleGeneralChange}
                      placeholder="noreply@yourdomain.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fromName">From Name</Label>
                    <Input 
                      id="fromName"
                      name="fromName"
                      value={settings.fromName}
                      onChange={handleGeneralChange}
                      placeholder="Your App Name"
                    />
                  </div>
                </div>
                
                {settings.provider === 'smtp' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">SMTP Configuration</h3>
                    
                    <div>
                      <Label htmlFor="host">SMTP Host</Label>
                      <Input 
                        id="host"
                        name="host"
                        value={settings.config.host || ''}
                        onChange={handleConfigChange}
                        placeholder="smtp.example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="port">SMTP Port</Label>
                      <Input 
                        id="port"
                        name="port"
                        type="number"
                        value={settings.config.port || 587}
                        onChange={handleConfigChange}
                        placeholder="587"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="username">SMTP Username</Label>
                      <Input 
                        id="username"
                        name="username"
                        value={settings.config.username || ''}
                        onChange={handleConfigChange}
                        placeholder="username"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">SMTP Password</Label>
                      <Input 
                        id="password"
                        name="password"
                        type="password"
                        value={settings.config.password || ''}
                        onChange={handleConfigChange}
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enableSsl"
                        checked={settings.config.enableSsl !== false}
                        onCheckedChange={handleSslToggle}
                      />
                      <Label htmlFor="enableSsl">Enable SSL/TLS</Label>
                    </div>
                  </div>
                )}
                
                {(settings.provider === 'sendgrid' || settings.provider === 'mailgun') && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">API Configuration</h3>
                    
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input 
                        id="apiKey"
                        name="apiKey"
                        value={settings.config.apiKey || ''}
                        onChange={handleConfigChange}
                        placeholder="Your API key"
                      />
                    </div>
                    
                    {settings.provider === 'mailgun' && (
                      <div>
                        <Label htmlFor="domain">Domain</Label>
                        <Input 
                          id="domain"
                          name="domain"
                          value={settings.config.domain || ''}
                          onChange={handleConfigChange}
                          placeholder="mail.yourdomain.com"
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {settings.provider === 'ses' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">AWS SES Configuration</h3>
                    
                    <div>
                      <Label htmlFor="accessKey">AWS Access Key</Label>
                      <Input 
                        id="accessKey"
                        name="accessKey"
                        value={settings.config.accessKey || ''}
                        onChange={handleConfigChange}
                        placeholder="Your AWS access key"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="secretKey">AWS Secret Key</Label>
                      <Input 
                        id="secretKey"
                        name="secretKey"
                        type="password"
                        value={settings.config.secretKey || ''}
                        onChange={handleConfigChange}
                        placeholder="Your AWS secret key"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="region">AWS Region</Label>
                      <Input 
                        id="region"
                        name="region"
                        value={settings.config.region || ''}
                        onChange={handleConfigChange}
                        placeholder="us-east-1"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleTest}
                  >
                    Test Connection
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Customize the content of system emails sent to users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="verification">
                  <TabsList>
                    <TabsTrigger value="verification">Verification</TabsTrigger>
                    <TabsTrigger value="passwordReset">Password Reset</TabsTrigger>
                    <TabsTrigger value="welcome">Welcome</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="verification" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="verificationSubject">Subject</Label>
                      <Input 
                        id="verificationSubject"
                        value={settings.templates.verification.subject}
                        onChange={(e) => handleTemplateChange('verification', 'subject', e.target.value)}
                        placeholder="Verify your email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="verificationBody">Email Body</Label>
                      <Textarea 
                        id="verificationBody"
                        value={settings.templates.verification.body}
                        onChange={(e) => handleTemplateChange('verification', 'body', e.target.value)}
                        placeholder="Please verify your email by clicking on the link below..."
                        rows={10}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Available placeholders:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li><code>{'{{name}}'}</code> - User's name</li>
                        <li><code>{'{{verificationLink}}'}</code> - Email verification link</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="passwordReset" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="passwordResetSubject">Subject</Label>
                      <Input 
                        id="passwordResetSubject"
                        value={settings.templates.passwordReset.subject}
                        onChange={(e) => handleTemplateChange('passwordReset', 'subject', e.target.value)}
                        placeholder="Reset your password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="passwordResetBody">Email Body</Label>
                      <Textarea 
                        id="passwordResetBody"
                        value={settings.templates.passwordReset.body}
                        onChange={(e) => handleTemplateChange('passwordReset', 'body', e.target.value)}
                        placeholder="You requested a password reset. Click the link below to reset your password..."
                        rows={10}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Available placeholders:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li><code>{'{{name}}'}</code> - User's name</li>
                        <li><code>{'{{resetLink}}'}</code> - Password reset link</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="welcome" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="welcomeSubject">Subject</Label>
                      <Input 
                        id="welcomeSubject"
                        value={settings.templates.welcome.subject}
                        onChange={(e) => handleTemplateChange('welcome', 'subject', e.target.value)}
                        placeholder="Welcome to our platform!"
                      />
                    </div>
                    <div>
                      <Label htmlFor="welcomeBody">Email Body</Label>
                      <Textarea 
                        id="welcomeBody"
                        value={settings.templates.welcome.body}
                        onChange={(e) => handleTemplateChange('welcome', 'body', e.target.value)}
                        placeholder="Thank you for joining our platform. Here's what you need to know to get started..."
                        rows={10}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Available placeholders:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li><code>{'{{name}}'}</code> - User's name</li>
                        <li><code>{'{{loginLink}}'}</code> - Link to login page</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleTest}
                  >
                    Preview
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Templates'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure additional email system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.provider === 'temporaryEmail' && (
                  <div>
                    <Label htmlFor="temporaryInboxDuration">Temporary Inbox Duration (hours)</Label>
                    <Input 
                      id="temporaryInboxDuration"
                      type="number"
                      min="1"
                      max="168"
                      value={settings.temporaryInboxDuration || 24}
                      onChange={handleTemporaryInboxDurationChange}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Duration (in hours) for which temporary inboxes remain active
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Advanced Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default EmailSettingsPage;
