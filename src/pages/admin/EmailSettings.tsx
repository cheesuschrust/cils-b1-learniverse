
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Server, 
  Save, 
  Settings, 
  Send, 
  AlertTriangle, 
  CheckCircle2,
  Trash,
  FileText,
  TestTube,
  Clock
} from "lucide-react";
import { EmailProvider, EmailSettings as EmailSettingsType } from "@/services/EmailService";
import { toast } from "@/components/ui/use-toast";

const EmailSettings = () => {
  const { getEmailSettings, updateEmailSettings } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  
  const [settings, setSettings] = useState<EmailSettingsType>({
    provider: "temporaryEmail",
    fromEmail: "",
    fromName: "",
    config: {
      host: "",
      port: 587,
      username: "",
      password: "",
      enableSsl: true,
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
  
  // Load email settings on mount
  useEffect(() => {
    const currentSettings = getEmailSettings();
    setSettings(currentSettings);
  }, []);
  
  // Handle settings changes
  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => {
      if (section === "root") {
        return { ...prev, [field]: value };
      } else if (section === "config") {
        return { 
          ...prev, 
          config: { 
            ...prev.config, 
            [field]: value 
          } 
        };
      } else if (section.startsWith("templates.")) {
        const template = section.split(".")[1];
        return {
          ...prev,
          templates: {
            ...prev.templates,
            [template]: {
              ...(prev.templates as any)[template],
              [field]: value
            }
          }
        };
      }
      return prev;
    });
  };
  
  // Handle save settings
  const saveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Filter unused config fields based on provider
      let configToSave = { ...settings.config };
      
      // Update settings
      const success = await updateEmailSettings({
        ...settings,
        config: configToSave
      });
      
      if (success) {
        toast({
          title: "Settings Saved",
          description: "Email settings have been updated successfully",
        });
      }
    } catch (error) {
      console.error("Error saving email settings:", error);
      toast({
        title: "Error",
        description: "Failed to save email settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send test email
  const sendTestEmail = async () => {
    if (!testEmailAddress) {
      toast({
        title: "Error",
        description: "Please enter a test email address",
        variant: "destructive"
      });
      return;
    }
    
    setSendingTest(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Test Email Sent",
        description: `A test email has been sent to ${testEmailAddress}`,
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive"
      });
    } finally {
      setSendingTest(false);
    }
  };
  
  // Get provider-specific settings
  const getProviderSettings = () => {
    switch (settings.provider) {
      case "smtp":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input 
                  id="smtp-host" 
                  placeholder="smtp.example.com" 
                  value={settings.config.host || ""}
                  onChange={(e) => handleChange("config", "host", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input 
                  id="smtp-port" 
                  type="number" 
                  placeholder="587" 
                  value={settings.config.port || 587}
                  onChange={(e) => handleChange("config", "port", parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-username">Username</Label>
                <Input 
                  id="smtp-username" 
                  placeholder="user@example.com" 
                  value={settings.config.username || ""}
                  onChange={(e) => handleChange("config", "username", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Password</Label>
                <Input 
                  id="smtp-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={settings.config.password || ""}
                  onChange={(e) => handleChange("config", "password", e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="ssl-enabled" 
                checked={settings.config.enableSsl || false}
                onCheckedChange={(checked) => handleChange("config", "enableSsl", checked)}
              />
              <Label htmlFor="ssl-enabled">Enable SSL/TLS</Label>
            </div>
          </div>
        );
        
      case "sendgrid":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sendgrid-api-key">SendGrid API Key</Label>
              <Input 
                id="sendgrid-api-key" 
                type="password" 
                placeholder="SG.••••••••••••••" 
                value={settings.config.apiKey || ""}
                onChange={(e) => handleChange("config", "apiKey", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                You can get your API key from the SendGrid dashboard.
              </p>
            </div>
          </div>
        );
        
      case "mailgun":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mailgun-api-key">Mailgun API Key</Label>
              <Input 
                id="mailgun-api-key" 
                type="password" 
                placeholder="key-••••••••••••••" 
                value={settings.config.apiKey || ""}
                onChange={(e) => handleChange("config", "apiKey", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mailgun-domain">Mailgun Domain</Label>
              <Input 
                id="mailgun-domain" 
                placeholder="mail.yourdomain.com" 
                value={settings.config.domain || ""}
                onChange={(e) => handleChange("config", "domain", e.target.value)}
              />
            </div>
          </div>
        );
        
      case "ses":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aws-access-key">AWS Access Key</Label>
              <Input 
                id="aws-access-key" 
                placeholder="AKIA••••••••••••••" 
                value={settings.config.accessKey || ""}
                onChange={(e) => handleChange("config", "accessKey", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aws-secret-key">AWS Secret Key</Label>
              <Input 
                id="aws-secret-key" 
                type="password" 
                placeholder="••••••••••••••" 
                value={settings.config.secretKey || ""}
                onChange={(e) => handleChange("config", "secretKey", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aws-region">AWS Region</Label>
              <Select 
                value={settings.config.region || "us-east-1"}
                onValueChange={(value) => handleChange("config", "region", value)}
              >
                <SelectTrigger id="aws-region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                  <SelectItem value="us-east-2">US East (Ohio)</SelectItem>
                  <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                  <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                  <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                  <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                  <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                  <SelectItem value="ap-southeast-2">Asia Pacific (Sydney)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case "gmail":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gmail-email">Gmail Address</Label>
              <Input 
                id="gmail-email" 
                placeholder="your.name@gmail.com" 
                value={settings.config.username || ""}
                onChange={(e) => handleChange("config", "username", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gmail-app-password">App Password</Label>
              <Input 
                id="gmail-app-password" 
                type="password" 
                placeholder="••••••••••••••" 
                value={settings.config.password || ""}
                onChange={(e) => handleChange("config", "password", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                You need to generate an app password from your Google account settings.
                <br />
                <a 
                  href="https://support.google.com/accounts/answer/185833" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Learn how to create an app password
                </a>
              </p>
            </div>
          </div>
        );
        
      case "temporaryEmail":
        return (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Temporary email is suitable for development and testing only. Emails are stored temporarily and accessible via a web interface.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="temp-duration">Inbox Duration (hours)</Label>
              <Input 
                id="temp-duration" 
                type="number" 
                min="1" 
                max="168" 
                placeholder="24" 
                value={settings.temporaryInboxDuration || 24}
                onChange={(e) => handleChange("root", "temporaryInboxDuration", parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                How long temporary emails should be stored before deletion (1-168 hours)
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const templateVariables = {
    verification: {
      name: "User's name",
      verificationLink: "Link to verify email"
    },
    passwordReset: {
      name: "User's name",
      resetLink: "Link to reset password"
    },
    welcome: {
      name: "User's name"
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Email Settings
          </CardTitle>
          <CardDescription>
            Configure how the application sends emails to users
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="provider">Provider</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            <TabsContent value="general" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input 
                  id="from-email" 
                  placeholder="noreply@yourdomain.com" 
                  value={settings.fromEmail || ""}
                  onChange={(e) => handleChange("root", "fromEmail", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from-name">From Name</Label>
                <Input 
                  id="from-name" 
                  placeholder="CILS B2 Cittadinanza" 
                  value={settings.fromName || ""}
                  onChange={(e) => handleChange("root", "fromName", e.target.value)}
                />
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Test Email Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Send a test email to verify your configuration
                    </p>
                  </div>
                  <TestTube className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex space-x-2">
                  <Input 
                    placeholder="test@example.com" 
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    className="max-w-md"
                  />
                  <Button 
                    onClick={sendTestEmail} 
                    disabled={sendingTest || !testEmailAddress}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sendingTest ? "Sending..." : "Send Test"}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="provider" className="space-y-6 mt-0">
              <div className="space-y-2">
                <Label htmlFor="email-provider">Email Provider</Label>
                <Select 
                  value={settings.provider}
                  onValueChange={(value) => handleChange("root", "provider", value as EmailProvider)}
                >
                  <SelectTrigger id="email-provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP Server</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                    <SelectItem value="gmail">Gmail</SelectItem>
                    <SelectItem value="temporaryEmail">Temporary Email (Development)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select the service you want to use for sending emails
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                {getProviderSettings()}
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-6 mt-0">
              <Tabs defaultValue="verification">
                <TabsList className="mb-4">
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                  <TabsTrigger value="passwordReset">Password Reset</TabsTrigger>
                  <TabsTrigger value="welcome">Welcome</TabsTrigger>
                </TabsList>
                
                <TabsContent value="verification" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification-subject">Subject</Label>
                    <Input 
                      id="verification-subject" 
                      placeholder="Verify Your Email - CILS B2 Cittadinanza" 
                      value={settings.templates.verification.subject || ""}
                      onChange={(e) => handleChange("templates.verification", "subject", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="verification-body">Email Body (HTML)</Label>
                      <div className="text-sm text-muted-foreground">
                        Available variables:
                        {Object.entries(templateVariables.verification).map(([key, desc]) => (
                          <span key={key} className="ml-2">
                            <code className="bg-muted px-1 rounded text-xs">{'{{' + key + '}}'}</code>
                          </span>
                        ))}
                      </div>
                    </div>
                    <Textarea 
                      id="verification-body" 
                      placeholder="<p>Hello {{name}},</p><p>Please verify your email by clicking <a href='{{verificationLink}}'>here</a>.</p>" 
                      value={settings.templates.verification.body || ""}
                      onChange={(e) => handleChange("templates.verification", "body", e.target.value)}
                      className="h-60 font-mono text-sm"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="passwordReset" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-subject">Subject</Label>
                    <Input 
                      id="reset-subject" 
                      placeholder="Reset Your Password - CILS B2 Cittadinanza" 
                      value={settings.templates.passwordReset.subject || ""}
                      onChange={(e) => handleChange("templates.passwordReset", "subject", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="reset-body">Email Body (HTML)</Label>
                      <div className="text-sm text-muted-foreground">
                        Available variables:
                        {Object.entries(templateVariables.passwordReset).map(([key, desc]) => (
                          <span key={key} className="ml-2">
                            <code className="bg-muted px-1 rounded text-xs">{'{{' + key + '}}'}</code>
                          </span>
                        ))}
                      </div>
                    </div>
                    <Textarea 
                      id="reset-body" 
                      placeholder="<p>Hello {{name}},</p><p>Click <a href='{{resetLink}}'>here</a> to reset your password.</p>" 
                      value={settings.templates.passwordReset.body || ""}
                      onChange={(e) => handleChange("templates.passwordReset", "body", e.target.value)}
                      className="h-60 font-mono text-sm"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="welcome" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-subject">Subject</Label>
                    <Input 
                      id="welcome-subject" 
                      placeholder="Welcome to CILS B2 Cittadinanza Question of the Day!" 
                      value={settings.templates.welcome.subject || ""}
                      onChange={(e) => handleChange("templates.welcome", "subject", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="welcome-body">Email Body (HTML)</Label>
                      <div className="text-sm text-muted-foreground">
                        Available variables:
                        {Object.entries(templateVariables.welcome).map(([key, desc]) => (
                          <span key={key} className="ml-2">
                            <code className="bg-muted px-1 rounded text-xs">{'{{' + key + '}}'}</code>
                          </span>
                        ))}
                      </div>
                    </div>
                    <Textarea 
                      id="welcome-body" 
                      placeholder="<p>Welcome to CILS B2 Cittadinanza, {{name}}!</p><p>We're excited to have you on board.</p>" 
                      value={settings.templates.welcome.body || ""}
                      onChange={(e) => handleChange("templates.welcome", "body", e.target.value)}
                      className="h-60 font-mono text-sm"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                const currentSettings = getEmailSettings();
                setSettings(currentSettings);
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveSettings} disabled={isLoading}>
              {isLoading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default EmailSettings;
