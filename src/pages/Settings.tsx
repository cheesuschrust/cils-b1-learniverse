
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Volume2, Settings as SettingsIcon, Save, User, Bell, Moon, RotateCcw } from "lucide-react";
import UserPreferences from "@/components/user/UserPreferences";
import { useToast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { getAllVoices, speak } from "@/utils/textToSpeech";
import { useTheme } from "@/components/ui/theme-provider";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("preferences");
  const { voicePreference, setVoicePreference } = useUserPreferences();
  const { theme, setTheme } = useTheme();
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: user?.firstName || "",
    email: user?.email || "",
    bio: user?.preferences?.bio || "",
    theme: theme || "system",
    notifications: user?.preferences?.emailNotifications || false
  });
  
  // Voice settings state
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedItalianVoice, setSelectedItalianVoice] = useState(voicePreference?.italianVoiceURI || "");
  const [selectedEnglishVoice, setSelectedEnglishVoice] = useState(voicePreference?.englishVoiceURI || "");
  const [voiceSpeed, setVoiceSpeed] = useState(voicePreference?.voiceRate || 1);
  const [voicePitch, setVoicePitch] = useState(voicePreference?.voicePitch || 1);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Update form when user data changes
    if (user) {
      setUserProfile({
        name: user.firstName || "",
        email: user.email || "",
        bio: user.preferences?.bio || "",
        theme: theme || "system",
        notifications: user.preferences?.emailNotifications || false
      });
    }
    
    // Get available voices for speech synthesis
    const loadVoices = async () => {
      const voices = await getAllVoices();
      setAvailableVoices(voices);
      
      // Set default voices if none selected
      if (!selectedItalianVoice) {
        const italianVoice = voices.find(v => v.lang.startsWith('it'))?.name || "";
        setSelectedItalianVoice(italianVoice);
      }
      
      if (!selectedEnglishVoice) {
        const englishVoice = voices.find(v => v.lang.startsWith('en'))?.name || "";
        setSelectedEnglishVoice(englishVoice);
      }
    };
    
    loadVoices();
  }, [user, voicePreference, theme]);
  
  const handleProfileUpdate = async () => {
    try {
      if (!user) return;
      
      await updateUser({
        ...user,
        firstName: userProfile.name,
        preferences: {
          ...user.preferences,
          bio: userProfile.bio,
          theme: userProfile.theme as "light" | "dark" | "system",
          emailNotifications: userProfile.notifications
        }
      });
      
      // Update the theme in the ThemeProvider
      setTheme(userProfile.theme as "light" | "dark" | "system");
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleVoiceUpdate = () => {
    setVoicePreference({
      italianVoiceURI: selectedItalianVoice,
      englishVoiceURI: selectedEnglishVoice,
      voiceRate: voiceSpeed,
      voicePitch: voicePitch
    });
    
    toast({
      title: "Voice Settings Updated",
      description: "Your voice preferences have been saved."
    });
  };
  
  const testVoice = async (language: 'it' | 'en') => {
    setIsTesting(true);
    try {
      const voice = language === 'it' ? selectedItalianVoice : selectedEnglishVoice;
      const text = language === 'it' 
        ? "Ciao, questo è un esempio di come suonerà la voce italiana." 
        : "Hello, this is an example of how the English voice will sound.";
      
      await speak(text, language, {
        italianVoiceURI: selectedItalianVoice,
        englishVoiceURI: selectedEnglishVoice,
        voiceRate: voiceSpeed,
        voicePitch: voicePitch
      });
    } catch (error) {
      console.error("Error testing voice:", error);
      toast({
        title: "Voice Test Failed",
        description: "There was a problem testing the voice.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  const getVoicesByLanguage = (langPrefix: string) => {
    return availableVoices
      .filter(voice => voice.lang.startsWith(langPrefix))
      .sort((a, b) => {
        // Prioritize natural-sounding voices
        const aIsGoogle = a.name.includes('Google') || a.name.includes('Natural');
        const bIsGoogle = b.name.includes('Google') || b.name.includes('Natural');
        
        if (aIsGoogle && !bIsGoogle) return -1;
        if (!aIsGoogle && bIsGoogle) return 1;
        
        return a.name.localeCompare(b.name);
      });
  };
  
  const resetVoiceSettings = () => {
    const defaultItalianVoice = availableVoices.find(v => v.lang.startsWith('it'))?.name || "";
    const defaultEnglishVoice = availableVoices.find(v => v.lang.startsWith('en'))?.name || "";
    
    setSelectedItalianVoice(defaultItalianVoice);
    setSelectedEnglishVoice(defaultEnglishVoice);
    setVoiceSpeed(1);
    setVoicePitch(1);
    
    toast({
      title: "Voice Settings Reset",
      description: "Voice settings have been reset to defaults."
    });
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>You must be logged in to access settings</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const isAdmin = user.role === "admin";

  // Handle theme changes directly
  const handleThemeChange = (newTheme: string) => {
    setUserProfile({...userProfile, theme: newTheme as "light" | "dark" | "system"});
    // Also update the theme immediately through the theme provider
    setTheme(newTheme as "light" | "dark" | "system");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <SettingsIcon className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="preferences">User Preferences</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="voice">Voice Settings</TabsTrigger>
          {isAdmin && <TabsTrigger value="account">Account Management</TabsTrigger>}
          {isAdmin && <TabsTrigger value="system">System Configuration</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="preferences">
          <UserPreferences />
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={userProfile.name} 
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={userProfile.email} 
                    readOnly 
                    disabled 
                    className="bg-muted/40"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  value={userProfile.bio} 
                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                  placeholder="Tell us a bit about yourself"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Moon className="h-4 w-4" /> Theme Preference
                </h3>
                <Select 
                  value={userProfile.theme} 
                  onValueChange={handleThemeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="notifications" className="flex-1">Enable notifications</Label>
                <Switch 
                  id="notifications" 
                  checked={userProfile.notifications} 
                  onCheckedChange={(checked) => setUserProfile({...userProfile, notifications: checked})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} className="ml-auto">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" /> Voice Settings
              </CardTitle>
              <CardDescription>
                Customize the text-to-speech voices used for pronunciation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="italian-voice" className="font-medium">Italian Voice</Label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <Select 
                        value={selectedItalianVoice} 
                        onValueChange={setSelectedItalianVoice}
                      >
                        <SelectTrigger id="italian-voice">
                          <SelectValue placeholder="Select an Italian voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {getVoicesByLanguage('it').map((voice) => (
                            <SelectItem key={voice.name} value={voice.name}>
                              {voice.name} {voice.localService ? " (local)" : ""}
                            </SelectItem>
                          ))}
                          {getVoicesByLanguage('it').length === 0 && (
                            <SelectItem value="" disabled>No Italian voices available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={() => testVoice('it')} 
                      disabled={isTesting || !selectedItalianVoice}
                      className="flex items-center justify-center"
                    >
                      <Volume2 className={`h-4 w-4 mr-2 ${isTesting ? 'animate-pulse' : ''}`} />
                      Test
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="english-voice" className="font-medium">English Voice</Label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <Select 
                        value={selectedEnglishVoice} 
                        onValueChange={setSelectedEnglishVoice}
                      >
                        <SelectTrigger id="english-voice">
                          <SelectValue placeholder="Select an English voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {getVoicesByLanguage('en').map((voice) => (
                            <SelectItem key={voice.name} value={voice.name}>
                              {voice.name} {voice.localService ? " (local)" : ""}
                            </SelectItem>
                          ))}
                          {getVoicesByLanguage('en').length === 0 && (
                            <SelectItem value="" disabled>No English voices available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={() => testVoice('en')} 
                      disabled={isTesting || !selectedEnglishVoice}
                      className="flex items-center justify-center"
                    >
                      <Volume2 className={`h-4 w-4 mr-2 ${isTesting ? 'animate-pulse' : ''}`} />
                      Test
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="speed" className="font-medium">Speech Speed</Label>
                      <span className="text-sm text-muted-foreground">{voiceSpeed.toFixed(1)}x</span>
                    </div>
                    <Input
                      id="speed"
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Slower</span>
                      <span>Faster</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="pitch" className="font-medium">Voice Pitch</Label>
                      <span className="text-sm text-muted-foreground">{voicePitch.toFixed(1)}</span>
                    </div>
                    <Input
                      id="pitch"
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voicePitch}
                      onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Lower</span>
                      <span>Higher</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetVoiceSettings}>
                <RotateCcw className="h-4 w-4 mr-2" /> Reset to Defaults
              </Button>
              <Button onClick={handleVoiceUpdate}>
                <Save className="h-4 w-4 mr-2" /> Save Voice Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Administrator tools to manage user accounts will be displayed here.</p>
              <div className="mt-4 p-4 border rounded-md bg-amber-50 border-amber-200">
                <p className="text-amber-700">This section is under development.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure system-wide settings and features</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Administrator tools to configure the system will be displayed here.</p>
              <div className="mt-4 p-4 border rounded-md bg-amber-50 border-amber-200">
                <p className="text-amber-700">This section is under development.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
