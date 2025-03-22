
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Send, RefreshCw } from 'lucide-react';

interface EmailSettings {
  provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
  fromEmail: string;
  fromName: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  apiKey?: string;
  region?: string;
  enableSsl?: boolean;
  templates: {
    verification: string;
    passwordReset: string;
    welcome: string;
  };
}

const EmailSettings = () => {
  const { getEmailSettings, updateEmailSettings, user } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<EmailSettings>({
    provider: 'smtp',
    fromEmail: '',
    fromName: '',
    host: '',
    port: 587,
    username: '',
    password: '',
    enableSsl: true,
    templates: {
      verification: '',
      passwordReset: '',
      welcome: '',
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = () => {
    try {
      const currentSettings = getEmailSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Error loading email settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email settings',
        variant: 'destructive',
      });
    }
  };
  
  const handleChange = (
    field: string,
    value: string | number | boolean
  ) => {
    // Handle nested fields (for templates)
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof EmailSettings],
          [child]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateEmailSettings(settings);
      toast({
        title: 'Success',
        description: 'Email settings updated successfully',
      });
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save email settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const sendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: 'Email Required',
        description: 'Please enter an email address to send the test email',
        variant: 'destructive',
      });
      return;
    }
    
    setSendingTest(true);
    
    try {
      // In a real app, we would call an API endpoint to send a test email
      // For this mock implementation, we'll just show a success message
      setTimeout(() => {
        toast({
          title: 'Test Email Sent',
          description: `A test email has been sent to ${testEmail}`,
        });
        setSendingTest(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test email',
        variant: 'destructive',
      });
      setSendingTest(false);
    }
  };
  
  const renderProviderFields = () => {
    switch (settings.provider) {
      case 'smtp':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">SMTP Host</Label>
                <Input
                  id="host"
                  value={settings.host || ''}
                  onChange={(e) => handleChange('host', e.target.value)}
                  placeholder="smtp.example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="port">SMTP Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={settings.port || ''}
                  onChange={(e) => handleChange('port', parseInt(e.target.value))}
                  placeholder="587"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">SMTP Username</Label>
                <Input
                  id="username"
                  value={settings.username || ''}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="username@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">SMTP Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={settings.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enableSsl"
                checked={settings.enableSsl || false}
                onCheckedChange={(checked) => handleChange('enableSsl', checked)}
              />
              <Label htmlFor="enableSsl">Enable SSL/TLS</Label>
            </div>
          </>
        );
      
      case 'sendgrid':
      case 'mailgun':
        return (
          <div className="space-y-2">
            <Label htmlFor="apiKey">{settings.provider === 'sendgrid' ? 'SendGrid' : 'Mailgun'} API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={settings.apiKey || ''}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder="Enter API key"
            />
          </div>
        );
      
      case 'ses':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">AWS Access Key</Label>
                <Input
                  id="apiKey"
                  value={settings.apiKey || ''}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                  placeholder="AWS access key"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">AWS Region</Label>
                <Select
                  value={settings.region || ''}
                  onValueChange={(value) => handleChange('region', value)}
                >
                  <SelectTrigger id="region">
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
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Email Settings</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadSettings}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Provider Settings */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Provider</CardTitle>
                  <CardDescription>
                    Configure your email service provider
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select
                      value={settings.provider}
                      onValueChange={(value) => handleChange('provider', value)}
                    >
                      <SelectTrigger id="provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP Server</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        value={settings.fromName}
                        onChange={(e) => handleChange('fromName', e.target.value)}
                        placeholder="Italian Learning App"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        value={settings.fromEmail}
                        onChange={(e) => handleChange('fromEmail', e.target.value)}
                        placeholder="noreply@italianlearning.app"
                      />
                    </div>
                  </div>
                  
                  {renderProviderFields()}
                </CardContent>
              </Card>
              
              {/* Email Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Email Templates</CardTitle>
                  <CardDescription>
                    Customize the email templates sent to users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="verification" className="w-full">
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="verification">Verification</TabsTrigger>
                      <TabsTrigger value="passwordReset">Password Reset</TabsTrigger>
                      <TabsTrigger value="welcome">Welcome</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="verification" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="verification-template">
                          Email Verification Template
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Available variables: {{name}}, {{verificationLink}}
                        </p>
                        <Textarea
                          id="verification-template"
                          value={settings.templates.verification}
                          onChange={(e) => handleChange('templates.verification', e.target.value)}
                          placeholder="<p>Hello {{name}},</p><p>Please verify your email by clicking <a href='{{verificationLink}}'>here</a>.</p>"
                          className="min-h-[200px] font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="passwordReset" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="passwordReset-template">
                          Password Reset Template
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Available variables: {{name}}, {{resetLink}}
                        </p>
                        <Textarea
                          id="passwordReset-template"
                          value={settings.templates.passwordReset}
                          onChange={(e) => handleChange('templates.passwordReset', e.target.value)}
                          placeholder="<p>Hello {{name}},</p><p>Click <a href='{{resetLink}}'>here</a> to reset your password.</p>"
                          className="min-h-[200px] font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="welcome" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="welcome-template">
                          Welcome Email Template
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Available variables: {{name}}
                        </p>
                        <Textarea
                          id="welcome-template"
                          value={settings.templates.welcome}
                          onChange={(e) => handleChange('templates.welcome', e.target.value)}
                          placeholder="<p>Welcome to Italian Learning App, {{name}}!</p><p>We're excited to have you on board.</p>"
                          className="min-h-[200px] font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Test Email and Save */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Email</CardTitle>
                  <CardDescription>
                    Send a test email to verify your settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="testEmail">Recipient Email</Label>
                    <Input
                      id="testEmail"
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={sendTestEmail}
                    disabled={sendingTest}
                  >
                    {sendingTest ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Test
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Save Changes</CardTitle>
                  <CardDescription>
                    Apply and save your email configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Save your settings to apply them to all outgoing emails.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default EmailSettings;
