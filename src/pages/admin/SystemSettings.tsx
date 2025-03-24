import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  AlertCircle, 
  Boxes, 
  FileText, 
  Globe, 
  Languages, 
  Server, 
  Settings, 
  Shield, 
  Mail 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const SystemSettings = () => {
  const { toast } = useToast();
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const emailConfig = {
    host: 'smtp.example.com',
    port: '587',
    username: 'notifications@italianlearning.com',
    password: '••••••••••••',
    fromEmail: 'no-reply@italianlearning.com',
    fromName: 'Italian Learning App'
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your system settings have been updated successfully."
      });
    }, 1000);
  };
  
  const handleTestEmail = () => {
    setIsTestingEmail(true);
    setTimeout(() => {
      setIsTestingEmail(false);
      toast({
        title: "Test email sent",
        description: "A test email was sent successfully to the administrator."
      });
    }, 1500);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>
        <Settings className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email Configuration</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Application Name</Label>
                  <Input id="site-name" defaultValue="Italian Learning Platform" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-url">Application URL</Label>
                  <Input id="site-url" defaultValue="https://italian-learning.example.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Application Description</Label>
                <Textarea 
                  id="site-description" 
                  defaultValue="A comprehensive platform for learning Italian through interactive exercises and AI-powered content."
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register</p>
                  </div>
                  <Switch id="allow-registration" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">User Content Upload</Label>
                    <p className="text-sm text-muted-foreground">Allow users to upload content</p>
                  </div>
                  <Switch id="allow-uploads" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure email server settings for notifications and user communications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email-host">SMTP Host</Label>
                  <Input id="email-host" defaultValue={emailConfig.host} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-port">SMTP Port</Label>
                  <Input id="email-port" defaultValue={emailConfig.port} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email-username">SMTP Username</Label>
                  <Input id="email-username" defaultValue={emailConfig.username} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-password">SMTP Password</Label>
                  <Input id="email-password" type="password" defaultValue={emailConfig.password} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email Address</Label>
                  <Input id="from-email" defaultValue={emailConfig.fromEmail} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input id="from-name" defaultValue={emailConfig.fromName} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-encryption">Encryption</Label>
                <Select defaultValue="tls">
                  <SelectTrigger id="email-encryption">
                    <SelectValue placeholder="Select encryption type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Email Templates
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Email Templates</DialogTitle>
                      <DialogDescription>
                        Manage and customize email templates
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-5 items-center gap-4">
                        <Label htmlFor="template-name" className="text-right col-span-1">
                          Template
                        </Label>
                        <Select defaultValue="welcome" className="col-span-4">
                          <SelectTrigger id="template-name">
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="welcome">Welcome Email</SelectItem>
                            <SelectItem value="reset-password">Password Reset</SelectItem>
                            <SelectItem value="account-verification">Account Verification</SelectItem>
                            <SelectItem value="notification">Notification</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-5 items-center gap-4">
                        <Label htmlFor="template-subject" className="text-right col-span-1">
                          Subject
                        </Label>
                        <Input
                          id="template-subject"
                          defaultValue="Welcome to Italian Learning"
                          className="col-span-4"
                        />
                      </div>
                      <div className="grid grid-cols-5 items-start gap-4">
                        <Label htmlFor="template-content" className="text-right col-span-1 pt-2">
                          Content
                        </Label>
                        <Textarea
                          id="template-content"
                          className="col-span-4 min-h-[200px]"
                          defaultValue="Dear {{name}},\n\nWelcome to Italian Learning! We're excited to have you join our community of language learners.\n\nTo get started, please verify your email address by clicking the link below:\n{{verification_link}}\n\nBest regards,\nThe Italian Learning Team"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">Save Template</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button variant="secondary" onClick={handleTestEmail} disabled={isTestingEmail}>
                  {isTestingEmail ? "Sending..." : "Send Test Email"}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Email Settings"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Notification Settings</CardTitle>
              <CardDescription>
                Configure which events trigger email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Send welcome email when a new user registers
                  </p>
                </div>
                <Switch id="notify-registration" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Password Reset</Label>
                  <p className="text-sm text-muted-foreground">
                    Send password reset instructions
                  </p>
                </div>
                <Switch id="notify-password-reset" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Support Ticket</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify admins when a new support ticket is created
                  </p>
                </div>
                <Switch id="notify-support-ticket" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">System Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications about system issues or downtime
                  </p>
                </div>
                <Switch id="notify-system-alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Manage artificial intelligence settings and model configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="default-model">Default AI Model</Label>
                  <Select defaultValue="huggingface">
                    <SelectTrigger id="default-model">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="huggingface">HuggingFace Transformers</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="local">Local Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model-version">Model Version</Label>
                  <Input id="model-version" defaultValue="Xenova/distilgpt2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key (if applicable)</Label>
                <Input id="api-key" type="password" defaultValue="" placeholder="Enter API key" />
                <p className="text-xs text-muted-foreground mt-1">
                  Only required for cloud-based AI services
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Content Generation</Label>
                    <p className="text-sm text-muted-foreground">Enable AI content generation</p>
                  </div>
                  <Switch id="ai-content-generation" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Content Classification</Label>
                    <p className="text-sm text-muted-foreground">Enable AI content classification</p>
                  </div>
                  <Switch id="ai-content-classification" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Speech Recognition</Label>
                    <p className="text-sm text-muted-foreground">Enable AI speech recognition</p>
                  </div>
                  <Switch id="ai-speech-recognition" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Process on Device</Label>
                    <p className="text-sm text-muted-foreground">Run AI models locally when possible</p>
                  </div>
                  <Switch id="ai-local-processing" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confidence-threshold">Minimum Confidence Threshold</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="confidence-threshold"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="70"
                    className="col-span-1"
                  />
                  <p className="text-sm text-muted-foreground flex items-center">
                    Minimum confidence score (%) to accept AI classifications
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save AI Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Configuration
              </CardTitle>
              <CardDescription>
                Advanced database settings (for experienced administrators only)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md bg-amber-50 p-4 border border-amber-200 text-amber-800">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Warning: Advanced Settings</h3>
                    <p className="text-sm mt-1">
                      Changes to these settings may affect system stability. Proceed with caution.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="db-host">Database Host</Label>
                  <Input id="db-host" defaultValue="localhost" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">Database Port</Label>
                  <Input id="db-port" defaultValue="5432" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="db-name">Database Name</Label>
                  <Input id="db-name" defaultValue="italian_learning" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-user">Database User</Label>
                  <Input id="db-user" defaultValue="app_user" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db-password">Database Password</Label>
                <Input id="db-password" type="password" defaultValue="••••••••••••" />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <BellRing className="mr-2 h-4 w-4" />
                  Test Database Connection
                </Button>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1">
                    <Lock className="mr-2 h-4 w-4" />
                    Backup Database
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Braces className="mr-2 h-4 w-4" />
                    Export Schema
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive">
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Advanced Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
