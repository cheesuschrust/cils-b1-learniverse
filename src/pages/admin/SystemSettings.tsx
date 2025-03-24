
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { BellRing, Lock, Braces, Database, Check, RefreshCw, Settings, Volume2 } from 'lucide-react';
import SiteVoiceSettings from '@/components/admin/SiteVoiceSettings';

const SystemSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // General settings
  const [settings, setSettings] = useState({
    siteName: "Italian Learning Platform",
    siteUrl: "https://italianlearning.com",
    adminEmail: "admin@italianlearning.com",
    maxUploadSize: 10,
    defaultLanguage: "english",
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: true,
    cacheEnabled: true,
    logLevel: "error",
  });
  
  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: 587,
    smtpUser: "notifications@italianlearning.com",
    smtpPassword: "",
    senderName: "Italian Learning",
    senderEmail: "no-reply@italianlearning.com",
    enableEmailNotifications: true,
    emailVerificationRequired: true,
    welcomeEmailTemplate: "welcome_template",
    resetPasswordTemplate: "reset_password_template",
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialCharacter: true,
    requireUppercase: true,
    requireNumber: true,
    twoFactorAuthEnabled: false,
    twoFactorAuthRequired: false,
    jwtExpiryTime: 24,
  });
  
  // Database settings
  const [databaseSettings, setDatabaseSettings] = useState({
    backupSchedule: "daily",
    backupRetentionDays: 30,
    autoVacuum: true,
    connectionPoolSize: 20,
    queryTimeout: 30,
    logSlowQueries: true,
    slowQueryThreshold: 2,
  });
  
  // Integration settings - for APIs like translations, voice, etc.
  const [integrationSettings, setIntegrationSettings] = useState({
    googleTranslateApiKey: "",
    openAiApiKey: "",
    elevenLabsApiKey: "",
    deepLApiKey: "",
    awsRegion: "us-east-1",
    s3BucketName: "italian-learning-media",
  });
  
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [selectedApiKeyType, setSelectedApiKeyType] = useState("openAiApiKey");
  const [newApiKey, setNewApiKey] = useState("");
  
  const handleSettingChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleEmailSettingChange = (key: string, value: string | number | boolean) => {
    setEmailSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSecuritySettingChange = (key: string, value: string | number | boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleDatabaseSettingChange = (key: string, value: string | number | boolean) => {
    setDatabaseSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApiKeyChange = (key: string, value: string) => {
    setIntegrationSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const saveSettings = () => {
    setIsLoading(true);
    
    // Simulate an API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully.",
      });
    }, 1500);
  };
  
  const triggerBackup = () => {
    setBackupInProgress(true);
    
    // Simulate a backup process
    setTimeout(() => {
      setBackupInProgress(false);
      toast({
        title: "Backup Complete",
        description: "Database backup completed successfully.",
      });
    }, 2500);
  };
  
  const openApiKeyDialog = (keyType: string) => {
    setSelectedApiKeyType(keyType);
    setNewApiKey(integrationSettings[keyType as keyof typeof integrationSettings] as string);
    setApiKeyDialogOpen(true);
  };
  
  const saveApiKey = () => {
    handleApiKeyChange(selectedApiKeyType, newApiKey);
    setApiKeyDialogOpen(false);
    
    toast({
      title: "API Key Updated",
      description: `The ${selectedApiKeyType.replace('ApiKey', '')} API key has been updated.`,
    });
  };
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading ? (
            <span>Saving...</span>
          ) : (
            <span>Save All Settings</span>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email">
            <BellRing className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Braces className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="voice">
            <Volume2 className="h-4 w-4 mr-2" />
            Voice Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage basic system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={settings.siteName} 
                    onChange={(e) => handleSettingChange('siteName', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input 
                    id="siteUrl" 
                    value={settings.siteUrl} 
                    onChange={(e) => handleSettingChange('siteUrl', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input 
                    id="adminEmail" 
                    value={settings.adminEmail} 
                    onChange={(e) => handleSettingChange('adminEmail', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                  <Input 
                    id="maxUploadSize" 
                    type="number" 
                    value={settings.maxUploadSize} 
                    onChange={(e) => handleSettingChange('maxUploadSize', parseInt(e.target.value))} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select 
                    value={settings.defaultLanguage}
                    onValueChange={(value) => handleSettingChange('defaultLanguage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Log Level</Label>
                  <Select 
                    value={settings.logLevel}
                    onValueChange={(value) => handleSettingChange('logLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select log level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Takes the site offline for maintenance</p>
                  </div>
                  <Switch 
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debugMode">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enables detailed error reporting</p>
                  </div>
                  <Switch 
                    id="debugMode"
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analyticsEnabled">Analytics</Label>
                    <p className="text-sm text-muted-foreground">Enable usage tracking</p>
                  </div>
                  <Switch 
                    id="analyticsEnabled"
                    checked={settings.analyticsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('analyticsEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="cacheEnabled">Content Caching</Label>
                    <p className="text-sm text-muted-foreground">Improves performance</p>
                  </div>
                  <Switch 
                    id="cacheEnabled"
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto" onClick={saveSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email server and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input 
                    id="smtpServer" 
                    value={emailSettings.smtpServer} 
                    onChange={(e) => handleEmailSettingChange('smtpServer', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input 
                    id="smtpPort" 
                    type="number" 
                    value={emailSettings.smtpPort} 
                    onChange={(e) => handleEmailSettingChange('smtpPort', parseInt(e.target.value))} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input 
                    id="smtpUser" 
                    value={emailSettings.smtpUser} 
                    onChange={(e) => handleEmailSettingChange('smtpUser', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input 
                    id="smtpPassword" 
                    type="password" 
                    placeholder="••••••••"
                    onChange={(e) => handleEmailSettingChange('smtpPassword', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Sender Name</Label>
                  <Input 
                    id="senderName" 
                    value={emailSettings.senderName} 
                    onChange={(e) => handleEmailSettingChange('senderName', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input 
                    id="senderEmail" 
                    value={emailSettings.senderEmail} 
                    onChange={(e) => handleEmailSettingChange('senderEmail', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="welcomeEmailTemplate">Welcome Email Template</Label>
                  <Input 
                    id="welcomeEmailTemplate" 
                    value={emailSettings.welcomeEmailTemplate} 
                    onChange={(e) => handleEmailSettingChange('welcomeEmailTemplate', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resetPasswordTemplate">Password Reset Template</Label>
                  <Input 
                    id="resetPasswordTemplate" 
                    value={emailSettings.resetPasswordTemplate} 
                    onChange={(e) => handleEmailSettingChange('resetPasswordTemplate', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send automated email notifications</p>
                  </div>
                  <Switch 
                    id="enableEmailNotifications"
                    checked={emailSettings.enableEmailNotifications}
                    onCheckedChange={(checked) => handleEmailSettingChange('enableEmailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailVerificationRequired">Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                  </div>
                  <Switch 
                    id="emailVerificationRequired"
                    checked={emailSettings.emailVerificationRequired}
                    onCheckedChange={(checked) => handleEmailSettingChange('emailVerificationRequired', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto" onClick={saveSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure account and data protection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number" 
                    value={securitySettings.sessionTimeout} 
                    onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input 
                    id="maxLoginAttempts" 
                    type="number" 
                    value={securitySettings.maxLoginAttempts} 
                    onChange={(e) => handleSecuritySettingChange('maxLoginAttempts', parseInt(e.target.value))} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input 
                    id="passwordMinLength" 
                    type="number" 
                    value={securitySettings.passwordMinLength} 
                    onChange={(e) => handleSecuritySettingChange('passwordMinLength', parseInt(e.target.value))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jwtExpiryTime">JWT Expiry (hours)</Label>
                  <Input 
                    id="jwtExpiryTime" 
                    type="number" 
                    value={securitySettings.jwtExpiryTime} 
                    onChange={(e) => handleSecuritySettingChange('jwtExpiryTime', parseInt(e.target.value))} 
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireSpecialCharacter">Special Character</Label>
                    <p className="text-sm text-muted-foreground">Require special character in passwords</p>
                  </div>
                  <Switch 
                    id="requireSpecialCharacter"
                    checked={securitySettings.requireSpecialCharacter}
                    onCheckedChange={(checked) => handleSecuritySettingChange('requireSpecialCharacter', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireUppercase">Uppercase</Label>
                    <p className="text-sm text-muted-foreground">Require uppercase letter in passwords</p>
                  </div>
                  <Switch 
                    id="requireUppercase"
                    checked={securitySettings.requireUppercase}
                    onCheckedChange={(checked) => handleSecuritySettingChange('requireUppercase', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireNumber">Number</Label>
                    <p className="text-sm text-muted-foreground">Require number in passwords</p>
                  </div>
                  <Switch 
                    id="requireNumber"
                    checked={securitySettings.requireNumber}
                    onCheckedChange={(checked) => handleSecuritySettingChange('requireNumber', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuthEnabled">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enable 2FA option for users</p>
                  </div>
                  <Switch 
                    id="twoFactorAuthEnabled"
                    checked={securitySettings.twoFactorAuthEnabled}
                    onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorAuthEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuthRequired">Require 2FA</Label>
                    <p className="text-sm text-muted-foreground">Require all users to use 2FA</p>
                  </div>
                  <Switch 
                    id="twoFactorAuthRequired"
                    checked={securitySettings.twoFactorAuthRequired}
                    onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorAuthRequired', checked)}
                    disabled={!securitySettings.twoFactorAuthEnabled}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto" onClick={saveSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>Manage database configuration and backups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupSchedule">Backup Schedule</Label>
                  <Select 
                    value={databaseSettings.backupSchedule}
                    onValueChange={(value) => handleDatabaseSettingChange('backupSchedule', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupRetentionDays">Backup Retention (days)</Label>
                  <Input 
                    id="backupRetentionDays" 
                    type="number" 
                    value={databaseSettings.backupRetentionDays} 
                    onChange={(e) => handleDatabaseSettingChange('backupRetentionDays', parseInt(e.target.value))} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="connectionPoolSize">Connection Pool Size</Label>
                  <Input 
                    id="connectionPoolSize" 
                    type="number" 
                    value={databaseSettings.connectionPoolSize} 
                    onChange={(e) => handleDatabaseSettingChange('connectionPoolSize', parseInt(e.target.value))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="queryTimeout">Query Timeout (seconds)</Label>
                  <Input 
                    id="queryTimeout" 
                    type="number" 
                    value={databaseSettings.queryTimeout} 
                    onChange={(e) => handleDatabaseSettingChange('queryTimeout', parseInt(e.target.value))} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slowQueryThreshold">Slow Query Threshold (seconds)</Label>
                  <Input 
                    id="slowQueryThreshold" 
                    type="number" 
                    value={databaseSettings.slowQueryThreshold} 
                    onChange={(e) => handleDatabaseSettingChange('slowQueryThreshold', parseInt(e.target.value))} 
                  />
                </div>
                <div className="flex items-center justify-center h-full">
                  <Button
                    variant="secondary"
                    onClick={triggerBackup}
                    disabled={backupInProgress}
                    className="w-full"
                  >
                    {backupInProgress ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Backing Up...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Backup Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoVacuum">Auto-Vacuum</Label>
                    <p className="text-sm text-muted-foreground">Automatically reclaim storage</p>
                  </div>
                  <Switch 
                    id="autoVacuum"
                    checked={databaseSettings.autoVacuum}
                    onCheckedChange={(checked) => handleDatabaseSettingChange('autoVacuum', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="logSlowQueries">Log Slow Queries</Label>
                    <p className="text-sm text-muted-foreground">Track queries that exceed the threshold</p>
                  </div>
                  <Switch 
                    id="logSlowQueries"
                    checked={databaseSettings.logSlowQueries}
                    onCheckedChange={(checked) => handleDatabaseSettingChange('logSlowQueries', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto" onClick={saveSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>Configure external service connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">OpenAI API</h3>
                    <p className="text-sm text-muted-foreground">Powers AI-assisted learning</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => openApiKeyDialog('openAiApiKey')}
                  >
                    {integrationSettings.openAiApiKey ? "Update Key" : "Add Key"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">ElevenLabs API</h3>
                    <p className="text-sm text-muted-foreground">Advanced text-to-speech voices</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => openApiKeyDialog('elevenLabsApiKey')}
                  >
                    {integrationSettings.elevenLabsApiKey ? "Update Key" : "Add Key"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Google Translate API</h3>
                    <p className="text-sm text-muted-foreground">Translation services</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => openApiKeyDialog('googleTranslateApiKey')}
                  >
                    {integrationSettings.googleTranslateApiKey ? "Update Key" : "Add Key"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">DeepL API</h3>
                    <p className="text-sm text-muted-foreground">High-quality translations</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => openApiKeyDialog('deepLApiKey')}
                  >
                    {integrationSettings.deepLApiKey ? "Update Key" : "Add Key"}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="awsRegion">AWS Region</Label>
                    <Select 
                      value={integrationSettings.awsRegion}
                      onValueChange={(value) => handleApiKeyChange('awsRegion', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select AWS region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                        <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                        <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s3BucketName">S3 Bucket Name</Label>
                    <Input 
                      id="s3BucketName" 
                      value={integrationSettings.s3BucketName} 
                      onChange={(e) => handleApiKeyChange('s3BucketName', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              
              <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Update {selectedApiKeyType.replace('ApiKey', '').split(/(?=[A-Z])/).join(' ')} API Key
                    </DialogTitle>
                    <DialogDescription>
                      Enter the API key for integration with {selectedApiKeyType.replace('ApiKey', '').split(/(?=[A-Z])/).join(' ')}.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Textarea 
                        id="apiKey"
                        placeholder="Enter your API key"
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>Cancel</Button>
                    <Button onClick={saveApiKey}>Save API Key</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto" onClick={saveSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="voice">
          <SiteVoiceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
