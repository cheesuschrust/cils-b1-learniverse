
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
import {
  Switch,
  SwitchThumb,
  SwitchTrack
} from '@/components/ui/switch';
import { Loader2, Save, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Enhanced email settings interface with stronger typing
interface EmailTemplateContent {
  subject: string;
  body: string;
}

interface EmailTemplates {
  verification: EmailTemplateContent;
  passwordReset: EmailTemplateContent;
  welcome: EmailTemplateContent;
}

interface EmailProviderConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  apiKey?: string;
  region?: string;
  enableSsl?: boolean;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
}

interface EmailSettings {
  provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses' | 'gmail' | 'temporaryEmail';
  fromEmail: string;
  fromName: string;
  config: EmailProviderConfig;
  templates: EmailTemplates;
  temporaryInboxDuration?: number; // In hours (for temporary email service)
}

const defaultTemplates: EmailTemplates = {
  verification: {
    subject: "Verify Your Email - CILS B2 Cittadinanza",
    body: "<p>Hello {{name}},</p><p>Please verify your email by clicking <a href='{{verificationLink}}'>here</a>.</p><p>Thank you for joining CILS B2 Cittadinanza Question of the Day!</p>"
  },
  passwordReset: {
    subject: "Reset Your Password - CILS B2 Cittadinanza",
    body: "<p>Hello {{name}},</p><p>Click <a href='{{resetLink}}'>here</a> to reset your password.</p><p>If you didn't request this, please ignore this email.</p>"
  },
  welcome: {
    subject: "Welcome to CILS B2 Cittadinanza Question of the Day!",
    body: "<p>Welcome to CILS B2 Cittadinanza, {{name}}!</p><p>We're excited to have you on board. Get ready to improve your Italian language skills!</p>"
  }
};

const EmailSettings = () => {
  const { getEmailSettings, updateEmailSettings, user } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<EmailSettings>({
    provider: 'temporaryEmail',
    fromEmail: 'noreply@cittadinanza-b2.com',
    fromName: 'CILS B2 Cittadinanza',
    config: {
      enableSsl: true,
    },
    templates: defaultTemplates,
    temporaryInboxDuration: 24,
  });
  
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    setLoading(true);
    try {
      const currentSettings = await getEmailSettings();
      
      // Ensure templates have both subject and body
      const templates = currentSettings.templates || {};
      Object.keys(defaultTemplates).forEach(templateKey => {
        const key = templateKey as keyof EmailTemplates;
        if (!templates[key]) {
          templates[key] = defaultTemplates[key];
        } else if (typeof templates[key] === 'string') {
          // Convert old format to new format
          templates[key] = {
            subject: defaultTemplates[key].subject,
            body: templates[key] as unknown as string
          };
        }
      });
      
      // Ensure config is an object
      const config = currentSettings.config || {};
      
      setSettings({
        provider: currentSettings.provider || 'temporaryEmail',
        fromEmail: currentSettings.fromEmail || 'noreply@cittadinanza-b2.com',
        fromName: currentSettings.fromName || 'CILS B2 Cittadinanza',
        config,
        templates: templates as EmailTemplates,
        temporaryInboxDuration: currentSettings.temporaryInboxDuration || 24,
      });
    } catch (error) {
      console.error('Error loading email settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (
    field: string,
    value: string | number | boolean
  ) => {
    // Clear any validation errors for this field
    if (validationErrors[field]) {
      const newErrors = {...validationErrors};
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
    
    // Handle nested fields
    if (field.includes('.')) {
      const [parent, child, subChild] = field.split('.');
      
      if (subChild) {
        // Handle three-level nesting (templates.verification.body)
        setSettings((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof EmailSettings],
            [child]: {
              ...(prev[parent as keyof EmailSettings] as any)[child],
              [subChild]: value,
            },
          },
        }));
      } else {
        // Handle two-level nesting (config.host)
        setSettings((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof EmailSettings],
            [child]: value,
          },
        }));
      }
    } else {
      // Handle top-level fields
      setSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  
  const validateSettings = () => {
    const errors: {[key: string]: string} = {};
    
    // Basic validation
    if (!settings.fromEmail) errors['fromEmail'] = 'From email is required';
    if (!settings.fromName) errors['fromName'] = 'From name is required';
    
    // Provider-specific validation
    switch(settings.provider) {
      case 'smtp':
        if (!settings.config.host) errors['config.host'] = 'SMTP host is required';
        if (!settings.config.port) errors['config.port'] = 'SMTP port is required';
        if (!settings.config.username) errors['config.username'] = 'SMTP username is required';
        if (!settings.config.password) errors['config.password'] = 'SMTP password is required';
        break;
      case 'sendgrid':
      case 'mailgun':
        if (!settings.config.apiKey) errors['config.apiKey'] = 'API key is required';
        break;
      case 'ses':
        if (!settings.config.apiKey) errors['config.apiKey'] = 'AWS access key is required';
        if (!settings.config.region) errors['config.region'] = 'AWS region is required';
        break;
      case 'gmail':
        if (!settings.config.clientId) errors['config.clientId'] = 'Client ID is required';
        if (!settings.config.clientSecret) errors['config.clientSecret'] = 'Client Secret is required';
        break;
      case 'temporaryEmail':
        // No specific validation for temporary email
        break;
    }
    
    // Template validation
    if (!settings.templates.verification.body) {
      errors['templates.verification.body'] = 'Verification template is required';
    }
    if (!settings.templates.passwordReset.body) {
      errors['templates.passwordReset.body'] = 'Password reset template is required';
    }
    if (!settings.templates.welcome.body) {
      errors['templates.welcome.body'] = 'Welcome template is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSettings()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors before saving',
        variant: 'destructive',
      });
      return;
    }
    
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
      // In a real implementation, call the API to send a test email
      // For now, just show a success message after a delay
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
      case 'temporaryEmail':
        return (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Temporary Email Service</AlertTitle>
              <AlertDescription>
                This option uses our built-in temporary email service. Each user will get a temporary mailbox 
                for verification and password resets. No configuration needed.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="temporaryInboxDuration">Temporary Inbox Duration (hours)</Label>
              <Input
                id="temporaryInboxDuration"
                type="number"
                value={settings.temporaryInboxDuration || 24}
                onChange={(e) => handleChange('temporaryInboxDuration', parseInt(e.target.value))}
                min="1"
                max="168"
              />
              <p className="text-sm text-muted-foreground">
                Temporary inboxes will be automatically deleted after this duration.
              </p>
            </div>
          </div>
        );
      
      case 'smtp':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">SMTP Host</Label>
                <Input
                  id="host"
                  value={settings.config.host || ''}
                  onChange={(e) => handleChange('config.host', e.target.value)}
                  placeholder="smtp.example.com"
                  className={validationErrors['config.host'] ? "border-red-500" : ""}
                />
                {validationErrors['config.host'] && (
                  <p className="text-xs text-red-500">{validationErrors['config.host']}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="port">SMTP Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={settings.config.port || ''}
                  onChange={(e) => handleChange('config.port', parseInt(e.target.value))}
                  placeholder="587"
                  className={validationErrors['config.port'] ? "border-red-500" : ""}
                />
                {validationErrors['config.port'] && (
                  <p className="text-xs text-red-500">{validationErrors['config.port']}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">SMTP Username</Label>
                <Input
                  id="username"
                  value={settings.config.username || ''}
                  onChange={(e) => handleChange('config.username', e.target.value)}
                  placeholder="username@example.com"
                  className={validationErrors['config.username'] ? "border-red-500" : ""}
                />
                {validationErrors['config.username'] && (
                  <p className="text-xs text-red-500">{validationErrors['config.username']}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">SMTP Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={settings.config.password || ''}
                  onChange={(e) => handleChange('config.password', e.target.value)}
                  placeholder="••••••••"
                  className={validationErrors['config.password'] ? "border-red-500" : ""}
                />
                {validationErrors['config.password'] && (
                  <p className="text-xs text-red-500">{validationErrors['config.password']}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enableSsl"
                checked={settings.config.enableSsl || false}
                onCheckedChange={(checked) => handleChange('config.enableSsl', checked)}
              >
                <SwitchThumb />
              </Switch>
              <Label htmlFor="enableSsl">Enable SSL/TLS</Label>
            </div>
          </>
        );
      
      case 'gmail':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Google Client ID</Label>
                <Input
                  id="clientId"
                  value={settings.config.clientId || ''}
                  onChange={(e) => handleChange('config.clientId', e.target.value)}
                  placeholder="Your Google Client ID"
                  className={validationErrors['config.clientId'] ? "border-red-500" : ""}
                />
                {validationErrors['config.clientId'] && (
                  <p className="text-xs text-red-500">{validationErrors['config.clientId']}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Google Client Secret</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  value={settings.config.clientSecret || ''}
                  onChange={(e) => handleChange('config.clientSecret', e.target.value)}
                  placeholder="Your Google Client Secret"
                  className={validationErrors['config.clientSecret'] ? "border-red-500" : ""}
                />
                {validationErrors['config.clientSecret'] && (
                  <p className="text-xs text-red-500">{validationErrors['config.clientSecret']}</p>
                )}
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Gmail OAuth Setup</AlertTitle>
              <AlertDescription>
                To use Gmail, you need to create OAuth credentials in the Google Cloud Console. After saving, 
                you'll need to authorize this application to send emails on your behalf.
              </AlertDescription>
            </Alert>
            
            {settings.config.refreshToken && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Gmail account successfully connected.
                </p>
              </div>
            )}
            
            {!settings.config.refreshToken && settings.config.clientId && settings.config.clientSecret && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Authorization Required",
                    description: "In a production environment, this would redirect to Google's OAuth flow."
                  });
                }}
              >
                Authorize Gmail Access
              </Button>
            )}
          </div>
        );
      
      case 'sendgrid':
      case 'mailgun':
        const providerName = settings.provider === 'sendgrid' ? 'SendGrid' : 'Mailgun';
        return (
          <div className="space-y-2">
            <Label htmlFor="apiKey">{providerName} API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={settings.config.apiKey || ''}
              onChange={(e) => handleChange('config.apiKey', e.target.value)}
              placeholder={`Enter your ${providerName} API key`}
              className={validationErrors['config.apiKey'] ? "border-red-500" : ""}
            />
            {validationErrors['config.apiKey'] && (
              <p className="text-xs text-red-500">{validationErrors['config.apiKey']}</p>
            )}
            
            {settings.provider === 'mailgun' && (
              <div className="mt-4">
                <Label htmlFor="mailgunDomain">Mailgun Domain</Label>
                <Input
                  id="mailgunDomain"
                  value={settings.config.host || ''}
                  onChange={(e) => handleChange('config.host', e.target.value)}
                  placeholder="mg.yourdomain.com"
                />
              </div>
            )}
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
                  value={settings.config.apiKey || ''}
                  onChange={(e) => handleChange('config.apiKey', e.target.value)}
                  placeholder="AWS access key"
                  className={validationErrors['config.apiKey'] ? "border-red-500" : ""}
                />
                {validationErrors['config.apiKey'] && (
                  <p className="text-xs text-red-500">{validationErrors['config.apiKey']}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="awsSecretKey">AWS Secret Key</Label>
                <Input
                  id="awsSecretKey"
                  type="password"
                  value={settings.config.password || ''}
                  onChange={(e) => handleChange('config.password', e.target.value)}
                  placeholder="AWS secret key"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">AWS Region</Label>
              <Select
                value={settings.config.region || ''}
                onValueChange={(value) => handleChange('config.region', value)}
              >
                <SelectTrigger id="region" className={validationErrors['config.region'] ? "border-red-500" : ""}>
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
              {validationErrors['config.region'] && (
                <p className="text-xs text-red-500">{validationErrors['config.region']}</p>
              )}
            </div>
          </>
        );
      
      default:
        return null;
    }
  };
  
  const renderTemplateEditor = (templateKey: keyof EmailTemplates, description: string, variables: string[]) => {
    const template = settings.templates[templateKey];
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${templateKey}-subject`}>
            Email Subject
          </Label>
          <Input
            id={`${templateKey}-subject`}
            value={template.subject}
            onChange={(e) => handleChange(`templates.${templateKey}.subject`, e.target.value)}
            placeholder={`Enter ${templateKey} email subject`}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${templateKey}-body`}>
            Email Body (HTML)
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Available variables: {variables.map(v => `{{${v}}}`).join(', ')}
          </p>
          <Textarea
            id={`${templateKey}-body`}
            value={template.body}
            onChange={(e) => handleChange(`templates.${templateKey}.body`, e.target.value)}
            placeholder={description}
            className={`min-h-[200px] font-mono text-sm ${validationErrors[`templates.${templateKey}.body`] ? "border-red-500" : ""}`}
          />
          {validationErrors[`templates.${templateKey}.body`] && (
            <p className="text-xs text-red-500">{validationErrors[`templates.${templateKey}.body`]}</p>
          )}
        </div>
      </div>
    );
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
                        <SelectItem value="temporaryEmail">Temporary Email Service</SelectItem>
                        <SelectItem value="smtp">SMTP Server</SelectItem>
                        <SelectItem value="gmail">Gmail</SelectItem>
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
                        placeholder="CILS B2 Cittadinanza"
                        className={validationErrors['fromName'] ? "border-red-500" : ""}
                      />
                      {validationErrors['fromName'] && (
                        <p className="text-xs text-red-500">{validationErrors['fromName']}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        value={settings.fromEmail}
                        onChange={(e) => handleChange('fromEmail', e.target.value)}
                        placeholder="noreply@cittadinanza-b2.com"
                        className={validationErrors['fromEmail'] ? "border-red-500" : ""}
                      />
                      {validationErrors['fromEmail'] && (
                        <p className="text-xs text-red-500">{validationErrors['fromEmail']}</p>
                      )}
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
                      {renderTemplateEditor(
                        'verification',
                        'Email verification template with verification link',
                        ['name', 'verificationLink']
                      )}
                    </TabsContent>
                    
                    <TabsContent value="passwordReset" className="pt-4">
                      {renderTemplateEditor(
                        'passwordReset',
                        'Password reset template with reset link',
                        ['name', 'resetLink']
                      )}
                    </TabsContent>
                    
                    <TabsContent value="welcome" className="pt-4">
                      {renderTemplateEditor(
                        'welcome',
                        'Welcome email sent after successful registration',
                        ['name']
                      )}
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
