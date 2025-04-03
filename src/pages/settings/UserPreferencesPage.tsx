
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase-client";

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  language: 'english' | 'italian' | 'both';
  notifications: boolean;
  emailNotifications: boolean;
  soundEffects: boolean;
  autoPlayAudio: boolean;
  voiceSpeed: number;
  fontSizeAdjustment: number;
}

const UserPreferencesPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    difficulty: 'adaptive',
    language: 'both',
    notifications: true,
    emailNotifications: true,
    soundEffects: true,
    autoPlayAudio: false,
    voiceSpeed: 1,
    fontSizeAdjustment: 0,
  });
  
  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setPreferences({
            theme: data.theme || 'system',
            difficulty: data.difficulty_level || 'adaptive',
            language: 'both',
            notifications: data.notification_settings?.enabled !== false,
            emailNotifications: data.notification_settings?.email !== false,
            soundEffects: data.notification_settings?.sound !== false,
            autoPlayAudio: data.voice_enabled || false,
            voiceSpeed: data.voice_speed || 1,
            fontSizeAdjustment: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
    
    fetchPreferences();
  }, [user]);
  
  // Save preferences
  const savePreferences = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme: preferences.theme,
          difficulty_level: preferences.difficulty,
          notification_settings: {
            enabled: preferences.notifications,
            email: preferences.emailNotifications,
            sound: preferences.soundEffects,
          },
          voice_enabled: preferences.autoPlayAudio,
          voice_speed: preferences.voiceSpeed,
        });
      
      if (error) throw error;
      
      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save preferences.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle preference changes
  const handleChange = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>User Preferences - CILS Italian Citizenship</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings & Preferences</h1>
        <p className="text-muted-foreground">
          Customize your learning experience to match your preferences
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Customize the appearance and behavior of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Theme</h3>
                  <RadioGroup 
                    value={preferences.theme} 
                    onValueChange={(value) => handleChange('theme', value)}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="light" id="light" className="peer sr-only" />
                      <Label
                        htmlFor="light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-3">
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2" />
                          <path d="M12 20v2" />
                          <path d="m4.93 4.93 1.41 1.41" />
                          <path d="m17.66 17.66 1.41 1.41" />
                          <path d="M2 12h2" />
                          <path d="M20 12h2" />
                          <path d="m6.34 17.66-1.41 1.41" />
                          <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                        Light
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                      <Label
                        htmlFor="dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-3">
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                        Dark
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="system" id="system" className="peer sr-only" />
                      <Label
                        htmlFor="system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-3">
                          <rect width="20" height="14" x="2" y="3" rx="2" />
                          <line x1="8" x2="16" y1="21" y2="21" />
                          <line x1="12" x2="12" y1="17" y2="21" />
                        </svg>
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Font Size</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">A</span>
                      <span className="text-lg">A</span>
                    </div>
                    <Slider 
                      value={[preferences.fontSizeAdjustment]} 
                      onValueChange={(value) => handleChange('fontSizeAdjustment', value[0])}
                      min={-2} 
                      max={2} 
                      step={1}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Learning Preferences</CardTitle>
              <CardDescription>
                Customize your learning experience and difficulty settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Difficulty Level</h3>
                  <Select 
                    value={preferences.difficulty}
                    onValueChange={(value) => handleChange('difficulty', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="adaptive">Adaptive (Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    {preferences.difficulty === 'adaptive' ? 
                      "The system will automatically adjust difficulty based on your performance." :
                      `Content and questions will be presented at ${preferences.difficulty} level.`
                    }
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Learning Language</h3>
                  <Select 
                    value={preferences.language}
                    onValueChange={(value: "english" | "italian" | "both") => handleChange('language', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="both">Both Languages</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    {preferences.language === 'both' ? 
                      "Instructions will be shown in English, with Italian content where relevant." :
                      `Content will be primarily displayed in ${preferences.language}.`
                    }
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Audio Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-play-audio">Auto-play audio</Label>
                      <Switch 
                        id="auto-play-audio" 
                        checked={preferences.autoPlayAudio}
                        onCheckedChange={(value) => handleChange('autoPlayAudio', value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="voice-speed" className="mb-2 block">Voice speed</Label>
                      <div className="grid grid-cols-5 items-center gap-2">
                        <span className="text-sm text-muted-foreground">Slower</span>
                        <Slider 
                          id="voice-speed"
                          className="col-span-3"
                          value={[preferences.voiceSpeed * 100]} 
                          onValueChange={(value) => handleChange('voiceSpeed', value[0] / 100)}
                          min={50} 
                          max={200} 
                          step={25}
                        />
                        <span className="text-sm text-muted-foreground text-right">Faster</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base font-medium">Enable notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new content and your progress
                    </p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={preferences.notifications}
                    onCheckedChange={(value) => handleChange('notifications', value)}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-base font-medium">Notification Types</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates and reminders via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={preferences.emailNotifications}
                      onCheckedChange={(value) => handleChange('emailNotifications', value)}
                      disabled={!preferences.notifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound-effects">Sound effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for notifications and interactions
                      </p>
                    </div>
                    <Switch 
                      id="sound-effects" 
                      checked={preferences.soundEffects}
                      onCheckedChange={(value) => handleChange('soundEffects', value)}
                      disabled={!preferences.notifications}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={savePreferences} disabled={isSaving}>
          {isSaving ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserPreferencesPage;
