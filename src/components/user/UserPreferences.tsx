
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Volume2, Monitor, BellRing, Languages, Moon, Sun, Cpu } from "lucide-react";
import VoicePreferences from "./VoicePreferences";
import { useTheme } from "@/components/ui/theme-provider";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface UserPreferencesProps {
  onClose?: () => void;
}

const UserPreferences = ({ onClose }: UserPreferencesProps) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const userPreferences = useUserPreferences();
  const [isLoading, setIsLoading] = useState(false);
  
  // Preference state
  const [preferences, setPreferences] = useState({
    // Display and UI
    theme: theme as 'system' | 'light' | 'dark',
    fontSize: 16,
    notificationsEnabled: true,
    animationsEnabled: true,
    
    // Learning settings
    preferredLanguage: userPreferences.preferredLanguage || "both",
    voiceSpeed: 1.0,
    autoPlayAudio: userPreferences.autoPlayAudio || true,
    showProgressMetrics: true,
    
    // AI settings
    aiEnabled: true,
    aiModelSize: "small", // small, medium, large
    aiProcessingOnDevice: true,
    confidenceScoreVisible: true,
    
    // Required fields from the User interface
    emailNotifications: true,
    language: "en" as "en" | "it",
    difficulty: "intermediate" as "beginner" | "intermediate" | "advanced"
  });
  
  // Initialize preferences from user data
  useEffect(() => {
    if (user?.preferences) {
      setPreferences(prev => ({
        ...prev,
        theme: theme as 'system' | 'light' | 'dark',
        preferredLanguage: userPreferences.preferredLanguage || prev.preferredLanguage,
        autoPlayAudio: userPreferences.autoPlayAudio || prev.autoPlayAudio,
        emailNotifications: user.preferences.emailNotifications || prev.emailNotifications,
      }));
    }
  }, [user, theme, userPreferences]);
  
  const handleToggleChange = (key: string) => (checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: checked
    }));
  };
  
  const handleSelectChange = (key: string) => (value: string) => {
    if (key === "theme") {
      // When theme changes, also update ThemeProvider
      setTheme(value as "light" | "dark" | "system");
    }
    
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSliderChange = (key: string) => (value: number[]) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };
  
  const savePreferences = async () => {
    setIsLoading(true);
    
    try {
      // Ensure the theme is saved via ThemeProvider
      setTheme(preferences.theme);
      userPreferences.setTheme?.(preferences.theme);
      
      // Update auto play audio preference
      userPreferences.setAutoPlayAudio?.(preferences.autoPlayAudio);
      
      // Update preferred language
      userPreferences.setPreferredLanguage?.(preferences.preferredLanguage as "english" | "italian" | "both");
      
      await updateProfile({
        preferences: {
          ...user?.preferences,
          theme: preferences.theme,
          emailNotifications: preferences.emailNotifications,
        },
        preferredLanguage: preferences.preferredLanguage as "english" | "italian" | "both"
      });
      
      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated successfully.",
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error saving preferences",
        description: "There was a problem updating your preferences.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          User Preferences
        </CardTitle>
        <CardDescription>
          Customize your learning experience
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="display">
        <div className="px-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="display" className="flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Display</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-1">
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">Learning</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-1">
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Voice</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1">
              <Cpu className="h-4 w-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="space-y-6 pt-2">
          <TabsContent value="display" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred color theme</p>
                </div>
                <Select
                  value={preferences.theme}
                  onValueChange={handleSelectChange("theme")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light" className="flex items-center gap-2">
                      <Sun className="h-4 w-4 inline mr-2" />
                      Light
                    </SelectItem>
                    <SelectItem value="dark" className="flex items-center gap-2">
                      <Moon className="h-4 w-4 inline mr-2" />
                      Dark
                    </SelectItem>
                    <SelectItem value="system" className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 inline mr-2" />
                      System
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="font-size" className="text-base">Font Size</Label>
                    <span className="text-sm font-medium">{preferences.fontSize}px</span>
                  </div>
                  <Slider 
                    id="font-size"
                    defaultValue={[preferences.fontSize]} 
                    max={24} 
                    min={12} 
                    step={1} 
                    onValueChange={handleSliderChange("fontSize")}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Enable in-app notifications</p>
                </div>
                <Switch 
                  checked={preferences.notificationsEnabled}
                  onCheckedChange={handleToggleChange("notificationsEnabled")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable UI animations</p>
                </div>
                <Switch 
                  checked={preferences.animationsEnabled}
                  onCheckedChange={handleToggleChange("animationsEnabled")}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="learning" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label className="text-base">Feedback Language</Label>
                  <p className="text-sm text-muted-foreground">Language for feedback and explanations</p>
                </div>
                <Select
                  value={preferences.preferredLanguage}
                  onValueChange={handleSelectChange("preferredLanguage")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English Only</SelectItem>
                    <SelectItem value="italian">Italian Only</SelectItem>
                    <SelectItem value="both">Both Languages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Play Audio</Label>
                  <p className="text-sm text-muted-foreground">Automatically play audio in exercises</p>
                </div>
                <Switch 
                  checked={preferences.autoPlayAudio}
                  onCheckedChange={handleToggleChange("autoPlayAudio")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Progress</Label>
                  <p className="text-sm text-muted-foreground">Show detailed progress metrics</p>
                </div>
                <Switch 
                  checked={preferences.showProgressMetrics}
                  onCheckedChange={handleToggleChange("showProgressMetrics")}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="mt-0">
            <VoicePreferences />
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">AI Features</Label>
                  <p className="text-sm text-muted-foreground">Enable AI-powered features</p>
                </div>
                <Switch 
                  checked={preferences.aiEnabled}
                  onCheckedChange={handleToggleChange("aiEnabled")}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label className="text-base">AI Model Size</Label>
                  <p className="text-sm text-muted-foreground">Larger models are more capable but slower</p>
                </div>
                <Select
                  value={preferences.aiModelSize}
                  onValueChange={handleSelectChange("aiModelSize")}
                  disabled={!preferences.aiEnabled}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select model size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (Fast)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="large">Large (Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Process On-Device</Label>
                  <p className="text-sm text-muted-foreground">Run models directly in your browser</p>
                </div>
                <Switch 
                  checked={preferences.aiProcessingOnDevice}
                  onCheckedChange={handleToggleChange("aiProcessingOnDevice")}
                  disabled={!preferences.aiEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Confidence</Label>
                  <p className="text-sm text-muted-foreground">Display confidence scores for AI responses</p>
                </div>
                <Switch 
                  checked={preferences.confidenceScoreVisible}
                  onCheckedChange={handleToggleChange("confidenceScoreVisible")}
                  disabled={!preferences.aiEnabled}
                />
              </div>
            </div>
          </TabsContent>
        </CardContent>
      
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={savePreferences} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default UserPreferences;
