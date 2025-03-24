
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import UserPreferences from '@/components/user/UserPreferences';
import { Settings as SettingsIcon, BellRing, Shield, Keyboard } from 'lucide-react';

const Settings = () => {
  const { theme } = useUserPreferences();

  return (
    <>
      <Helmet>
        <title>User Settings - Italian Learning</title>
      </Helmet>
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <SettingsIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="mb-6 w-full md:w-auto">
            <TabsTrigger value="preferences" className="flex items-center gap-1">
              <SettingsIcon className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <BellRing className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-1">
              <Keyboard className="h-4 w-4" />
              <span>Accessibility</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="mt-0">
            <UserPreferences />
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Notification settings will be implemented in a future update.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Security settings will be implemented in a future update.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Settings</CardTitle>
                <CardDescription>
                  Customize your experience for accessibility needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Accessibility settings will be implemented in a future update.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
