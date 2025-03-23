
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Save, Send, MailOpen, Settings, Server, Template, Mail } from 'lucide-react';
import { EmailSettings as EmailSettingsType } from '@/contexts/shared-types';
import { useSystemLog } from '@/hooks/use-system-log';

const EmailSettings = () => {
  const { getEmailSettings, updateEmailSettings } = useAuth();
  const { toast } = useToast();
  const { logSystemAction } = useSystemLog();
  
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<EmailSettingsType | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  useEffect(() => {
    // Load email settings
    const emailSettings = getEmailSettings();
    setSettings(emailSettings);
    logSystemAction('Viewed email settings');
  }, [getEmailSettings, logSystemAction]);
  
  const handleChange = (field: string, value: any) => {
    if (!settings) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent as keyof EmailSettingsType] as any,
          [child]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [field]: value
      });
    }
  };
  
  const handleTemplateChange = (template: string, field: string, value: string) => {
    if (!settings?.templates) return;
    
    setSettings({
      ...settings,
      templates: {
        ...settings.templates,
        [template]: {
          ...settings.templates[template as keyof typeof settings.templates],
          [field]: value
        }
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings) return;
    
    setIsLoading(true);
    
    try {
      const success = await updateEmailSettings(settings);
      
      if (success) {
        toast({
          title: "Settings updated",
          description: "Email settings have been updated successfully.",
        });
        logSystemAction('Updated email settings');
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating email settings:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating the email settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendTestEmail = async () => {
    if (!testEmail || !settings) return;
    
    setIsSendingTest(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        toast({
          title: "Test email sent",
          description: `A test email has been sent to ${testEmail}`,
        });
        setIsSendingTest(false);
        logSystemAction('Sent test email');
      }, 1500);
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Failed to send test email",
        description: "There was a problem sending the test email. Please check your settings and try again.",
        variant: "destructive"
      });
      setIsSendingTest(false);
    }
  };
  
  if (!settings) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Email Settings</h1>
        <Card>
          <CardContent className="py-10">
            <div className="flex justify-center">
              <p>Loading settings...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <Helmet>
        <title>Email Settings | Admin</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Email Settings</h1>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General Settings
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Template className="h-4 w-4" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Test Emails
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure your email service provider and default settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider">Email Provider</Label>
                      <select 
                        id="provider" 
                        className="w-full border rounded-md px-3 py-2"
                        value={settings.provider}
                        onChange={(e) => handleChange('provider', e.target.value)}
                      >
                        <option value="smtp">SMTP</option>
                        <option value="sendgrid">SendGrid</option>
                        <option value="mailchimp">Mailchimp</option>
                        <option value="mailgun">Mailgun</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email Address</Label>
                      <Input 
                        id="fromEmail" 
                        type="email" 
                        value={settings.fromEmail}
                        onChange={(e) => handleChange('fromEmail', e.target.value)}
                        placeholder="noreply@yourdomain.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fromName">From Name</Label>
                    <Input 
                      id="fromName" 
                      value={settings.fromName}
                      onChange={(e) => handleChange('fromName', e.target.value)}
                      placeholder="Your App Name"
                    />
                  </div>
                </div>
                
                <div className="border p-4 rounded-md space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    SMTP Server Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input 
                        id="smtpHost" 
                        value={settings.config.host}
                        onChange={(e) => handleChange('config.host', e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        type="number" 
                        value={settings.config.port}
                        onChange={(e) => handleChange('config.port', parseInt(e.target.value))}
                        placeholder="587"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input 
                        id="smtpUsername" 
                        value={settings.config.username}
                        onChange={(e) => handleChange('config.username', e.target.value)}
                        placeholder="your-username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input 
                        id="smtpPassword" 
                        type="password" 
                        value={settings.config.password}
                        onChange={(e) => handleChange('config.password', e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="enableSsl" 
                      checked={settings.config.enableSsl}
                      onCheckedChange={(checked) => handleChange('config.enableSsl', !!checked)}
                    />
                    <Label htmlFor="enableSsl" className="text-sm">Enable SSL/TLS</Label>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3">Email Notification Preferences</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dailyDigest">Daily Digest</Label>
                        <p className="text-xs text-muted-foreground">
                          Send a daily summary of platform activity
                        </p>
                      </div>
                      <Switch 
                        id="dailyDigest" 
                        checked={settings.dailyDigest}
                        onCheckedChange={(checked) => handleChange('dailyDigest', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">User Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Send email for important user events
                        </p>
                      </div>
                      <Switch 
                        id="notifications" 
                        checked={settings.notifications}
                        onCheckedChange={(checked) => handleChange('notifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing">Marketing Emails</Label>
                        <p className="text-xs text-muted-foreground">
                          Send occasional marketing and promotional emails
                        </p>
                      </div>
                      <Switch 
                        id="marketing" 
                        checked={settings.marketing}
                        onCheckedChange={(checked) => handleChange('marketing', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newFeatures">New Features</Label>
                        <p className="text-xs text-muted-foreground">
                          Send emails about new platform features
                        </p>
                      </div>
                      <Switch 
                        id="newFeatures" 
                        checked={settings.newFeatures}
                        onCheckedChange={(checked) => handleChange('newFeatures', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Customize the email templates sent to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="verification" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="verification">
                    Verification
                  </TabsTrigger>
                  <TabsTrigger value="passwordReset">
                    Password Reset
                  </TabsTrigger>
                  <TabsTrigger value="welcome">
                    Welcome
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="verification">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verificationSubject">Subject</Label>
                      <Input 
                        id="verificationSubject" 
                        value={settings.templates.verification.subject}
                        onChange={(e) => handleTemplateChange('verification', 'subject', e.target.value)}
                        placeholder="Verify your email address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="verificationBody">Email Body</Label>
                      <Textarea 
                        id="verificationBody" 
                        value={settings.templates.verification.body}
                        onChange={(e) => handleTemplateChange('verification', 'body', e.target.value)}
                        placeholder="Please verify your email address by clicking the link below..."
                        rows={10}
                      />
                    </div>
                    
                    <div className="bg-muted p-2 rounded text-sm">
                      <p className="font-medium mb-1">Available Variables:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>{'{{name}}'} - User's name</li>
                        <li>{'{{email}}'} - User's email</li>
                        <li>{'{{verification_link}}'} - Verification link</li>
                        <li>{'{{app_name}}'} - Application name</li>
                        <li>{'{{expiry_time}}'} - Link expiration time</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="passwordReset">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resetSubject">Subject</Label>
                      <Input 
                        id="resetSubject" 
                        value={settings.templates.passwordReset.subject}
                        onChange={(e) => handleTemplateChange('passwordReset', 'subject', e.target.value)}
                        placeholder="Reset your password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resetBody">Email Body</Label>
                      <Textarea 
                        id="resetBody" 
                        value={settings.templates.passwordReset.body}
                        onChange={(e) => handleTemplateChange('passwordReset', 'body', e.target.value)}
                        placeholder="You requested a password reset. Click the link below to reset your password..."
                        rows={10}
                      />
                    </div>
                    
                    <div className="bg-muted p-2 rounded text-sm">
                      <p className="font-medium mb-1">Available Variables:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>{'{{name}}'} - User's name</li>
                        <li>{'{{email}}'} - User's email</li>
                        <li>{'{{reset_link}}'} - Password reset link</li>
                        <li>{'{{app_name}}'} - Application name</li>
                        <li>{'{{expiry_time}}'} - Link expiration time</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="welcome">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="welcomeSubject">Subject</Label>
                      <Input 
                        id="welcomeSubject" 
                        value={settings.templates.welcome.subject}
                        onChange={(e) => handleTemplateChange('welcome', 'subject', e.target.value)}
                        placeholder="Welcome to our platform!"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="welcomeBody">Email Body</Label>
                      <Textarea 
                        id="welcomeBody" 
                        value={settings.templates.welcome.body}
                        onChange={(e) => handleTemplateChange('welcome', 'body', e.target.value)}
                        placeholder="Welcome to our platform! We're excited to have you on board..."
                        rows={10}
                      />
                    </div>
                    
                    <div className="bg-muted p-2 rounded text-sm">
                      <p className="font-medium mb-1">Available Variables:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>{'{{name}}'} - User's name</li>
                        <li>{'{{email}}'} - User's email</li>
                        <li>{'{{app_name}}'} - Application name</li>
                        <li>{'{{login_link}}'} - Link to login page</li>
                        <li>{'{{dashboard_link}}'} - Link to user dashboard</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Templates
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Test Email Delivery</CardTitle>
              <CardDescription>
                Send a test email to verify your configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testEmail">Recipient Email</Label>
                  <Input 
                    id="testEmail" 
                    type="email" 
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Enter email address for test"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Select Test Email Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => sendTestEmail()} disabled={!testEmail || isSendingTest} className="flex items-center gap-2">
                      <MailOpen className="h-4 w-4" />
                      Verification
                    </Button>
                    <Button variant="outline" onClick={() => sendTestEmail()} disabled={!testEmail || isSendingTest} className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Password Reset
                    </Button>
                    <Button variant="outline" onClick={() => sendTestEmail()} disabled={!testEmail || isSendingTest} className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Welcome
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={sendTestEmail} 
                  disabled={!testEmail || isSendingTest} 
                  className="w-full mt-4"
                >
                  {isSendingTest ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Test Email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailSettings;
