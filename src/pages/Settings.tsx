
import React, { useState } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, BellRing, Languages, Volume2, Monitor, Moon, Sun } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const Settings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('english');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [showConfirmPasswordDialog, setShowConfirmPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleSaveSettings = async () => {
    setIsUpdating(true);
    
    try {
      // In a real app, we would update the user settings in the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'An error occurred while updating your settings',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Your new password and confirmation do not match',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // In a real app, we would update the user password in the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully',
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowConfirmPasswordDialog(false);
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'An error occurred while changing your password',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="preferences">Learning</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your app appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred appearance</p>
                  </div>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="mr-2 h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="mr-2 h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center">
                          <Monitor className="mr-2 h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language">Interface Language</Label>
                    <p className="text-sm text-muted-foreground">App interface language (not learning content)</p>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">
                        <div className="flex items-center">
                          <Languages className="mr-2 h-4 w-4" />
                          English
                        </div>
                      </SelectItem>
                      <SelectItem value="italian">
                        <div className="flex items-center">
                          <Languages className="mr-2 h-4 w-4" />
                          Italian
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Preferences</CardTitle>
              <CardDescription>Customize your learning experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select defaultValue="intermediate">
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (A1-A2)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (B1-B2)</SelectItem>
                    <SelectItem value="advanced">Advanced (C1-C2)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Adjust the difficulty of learning content</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-play">Auto-play Audio</Label>
                    <p className="text-sm text-muted-foreground">Automatically play audio in lessons</p>
                  </div>
                  <Switch 
                    id="auto-play" 
                    checked={autoPlayAudio} 
                    onCheckedChange={setAutoPlayAudio}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voice-speed">Voice Speed</Label>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    id="voice-speed"
                    defaultValue={[1]}
                    max={2}
                    min={0.5}
                    step={0.1}
                    onValueChange={(value) => setVoiceSpeed(value[0])}
                  />
                  <span className="w-12 text-sm text-muted-foreground">{voiceSpeed.toFixed(1)}x</span>
                </div>
                <p className="text-sm text-muted-foreground">Adjust the speed of spoken audio</p>
              </div>
              
              <Button onClick={handleSaveSettings} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how we communicate with you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-notifications">App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive in-app reminders and updates</p>
                  </div>
                  <Switch 
                    id="app-notifications" 
                    checked={notifications} 
                    onCheckedChange={setNotifications}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive learning reminders and tips via email</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Notification Types</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BellRing className="h-4 w-4 mr-2" />
                      <Label htmlFor="daily-reminder">Daily practice reminder</Label>
                    </div>
                    <Switch id="daily-reminder" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BellRing className="h-4 w-4 mr-2" />
                      <Label htmlFor="streak-alerts">Streak alerts</Label>
                    </div>
                    <Switch id="streak-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BellRing className="h-4 w-4 mr-2" />
                      <Label htmlFor="achievement-alerts">Achievement unlocked</Label>
                    </div>
                    <Switch id="achievement-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BellRing className="h-4 w-4 mr-2" />
                      <Label htmlFor="new-content-alerts">New content available</Label>
                    </div>
                    <Switch id="new-content-alerts" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account details and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="account-email">Email Address</Label>
                <Input
                  id="account-email"
                  value={user?.email || ''}
                  disabled
                />
                <p className="text-sm text-muted-foreground">Your account email (cannot be changed)</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">Update your account password</p>
                <Button variant="outline" onClick={() => setShowConfirmPasswordDialog(true)}>
                  Change Password
                </Button>
              </div>
              
              {showConfirmPasswordDialog && (
                <form onSubmit={handleChangePassword} className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-medium">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="ghost" onClick={() => setShowConfirmPasswordDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Password
                    </Button>
                  </div>
                </form>
              )}
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">Actions here cannot be undone</p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={logout}>
                    Sign Out
                  </Button>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
