
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Mic, Settings, Database, VolumeX, Play, Globe, Lock, Info, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { VoiceIntegrationSettings, VoiceModel, VoiceUsageStatistics } from '@/types/voice-integration';

const defaultVoiceSettings: VoiceIntegrationSettings = {
  defaultEnglishVoice: '',
  defaultItalianVoice: '',
  defaultVoiceRate: 1.0,
  defaultVoicePitch: 1.0,
  defaultVoiceVolume: 0.8,
  provider: 'browser',
  apiKeys: {},
  enableTextToSpeech: true,
  enableSpeechRecognition: true,
  enablePronunciationFeedback: true,
  preferLocalVoices: true,
  fallbackToRemote: true,
  cacheAudio: true,
  maxCacheSize: 100,
  audioQuality: 'medium',
  trackUsage: true,
  usageLimits: {
    daily: 1000,
    monthly: 20000
  }
};

const mockVoiceModels: VoiceModel[] = [
  // Browser voices
  { id: 'browser-en-us-female', name: 'English (US) - Female', provider: 'browser', language: 'en-US', gender: 'female', isPremium: false, isDefault: true },
  { id: 'browser-en-gb-male', name: 'English (UK) - Male', provider: 'browser', language: 'en-GB', gender: 'male', isPremium: false },
  { id: 'browser-it-it-female', name: 'Italian - Female', provider: 'browser', language: 'it-IT', gender: 'female', isPremium: false, isDefault: true },
  { id: 'browser-it-it-male', name: 'Italian - Male', provider: 'browser', language: 'it-IT', gender: 'male', isPremium: false },
  
  // ElevenLabs voices
  { id: 'elevenlabs-it-isabella', name: 'Isabella (Italian)', provider: 'elevenlabs', language: 'it-IT', gender: 'female', isPremium: true },
  { id: 'elevenlabs-it-marco', name: 'Marco (Italian)', provider: 'elevenlabs', language: 'it-IT', gender: 'male', isPremium: true },
  { id: 'elevenlabs-en-rachel', name: 'Rachel (English)', provider: 'elevenlabs', language: 'en-US', gender: 'female', isPremium: true },
  { id: 'elevenlabs-en-josh', name: 'Josh (English)', provider: 'elevenlabs', language: 'en-US', gender: 'male', isPremium: true },
  
  // OpenAI voices
  { id: 'openai-alloy', name: 'Alloy', provider: 'openai', language: 'multi', gender: 'neutral', isPremium: true },
  { id: 'openai-echo', name: 'Echo', provider: 'openai', language: 'multi', gender: 'male', isPremium: true },
  { id: 'openai-fable', name: 'Fable', provider: 'openai', language: 'multi', gender: 'female', isPremium: true },
  { id: 'openai-onyx', name: 'Onyx', provider: 'openai', language: 'multi', gender: 'male', isPremium: true },
  { id: 'openai-nova', name: 'Nova', provider: 'openai', language: 'multi', gender: 'female', isPremium: true },
  { id: 'openai-shimmer', name: 'Shimmer', provider: 'openai', language: 'multi', gender: 'female', isPremium: true },
];

const mockUsageStatistics: VoiceUsageStatistics = {
  totalTextToSpeechRequests: 15782,
  totalSpeechToTextRequests: 3241,
  averageProcessingTime: 423, // ms
  charactersParsed: 1287450,
  audioGeneratedMinutes: 187.3,
  byLanguage: [
    { language: 'Italian', count: 12467, percentage: 78.9 },
    { language: 'English', count: 3315, percentage: 21.1 }
  ],
  byVoice: [
    { voiceId: 'elevenlabs-it-isabella', voiceName: 'Isabella (Italian)', count: 8236, percentage: 52.2 },
    { voiceId: 'elevenlabs-en-rachel', voiceName: 'Rachel (English)', count: 2568, percentage: 16.3 },
    { voiceId: 'browser-it-it-female', voiceName: 'Italian - Female', count: 4231, percentage: 26.8 },
    { voiceId: 'browser-en-us-female', voiceName: 'English (US) - Female', count: 747, percentage: 4.7 }
  ]
};

const VoiceIntegrationSettingsComponent: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<VoiceIntegrationSettings>(defaultVoiceSettings);
  const [availableVoices, setAvailableVoices] = useState<VoiceModel[]>(mockVoiceModels);
  const [usageStats, setUsageStats] = useState<VoiceUsageStatistics>(mockUsageStatistics);
  const [testText, setTestText] = useState({
    english: "This is a test of the English voice settings.",
    italian: "Questo è un test delle impostazioni della voce italiana."
  });
  const [isTestPlaying, setIsTestPlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState('general');
  const [isAPIKeyHidden, setIsAPIKeyHidden] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch actual voice settings from the server
    // For now, we'll use our mock data
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        // In a real app, you'd fetch from an API
        setSettings(defaultVoiceSettings);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading voice settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load voice settings. Please try again.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => {
      // Handle nested properties
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof VoiceIntegrationSettings],
            [child]: value
          }
        };
      }
      
      return {
        ...prev,
        [key]: value
      };
    });
  };

  const handleProviderChange = (provider: 'browser' | 'elevenlabs' | 'openai') => {
    setSettings(prev => ({
      ...prev,
      provider
    }));
  };

  const handleDefaultVoiceChange = (language: 'english' | 'italian', voiceId: string) => {
    setSettings(prev => ({
      ...prev,
      [language === 'english' ? 'defaultEnglishVoice' : 'defaultItalianVoice']: voiceId
    }));
  };

  const handleTestVoice = (language: 'english' | 'italian') => {
    setIsTestPlaying(true);
    
    // Simulate playing voice
    setTimeout(() => {
      setIsTestPlaying(false);
      toast({
        title: 'Voice Test',
        description: `${language === 'english' ? 'English' : 'Italian'} voice sample played successfully.`
      });
    }, 2000);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      toast({
        title: 'Settings Saved',
        description: 'Voice integration settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save voice settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshVoices = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Voices Refreshed',
        description: 'Available voices have been updated successfully.'
      });
    } catch (error) {
      console.error('Error refreshing voices:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh available voices. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAPIKeyVisibility = () => {
    setIsAPIKeyHidden(!isAPIKeyHidden);
  };

  const renderProviderSettings = () => {
    switch (settings.provider) {
      case 'elevenlabs':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="elevenlabs-api-key" className="flex items-center gap-2">
                ElevenLabs API Key
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0"
                  onClick={toggleAPIKeyVisibility}
                >
                  {isAPIKeyHidden ? <Lock size={12} /> : <Info size={12} />}
                </Button>
              </Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="elevenlabs-api-key"
                  type={isAPIKeyHidden ? "password" : "text"}
                  value={settings.apiKeys.elevenlabs || ''}
                  onChange={(e) => handleSettingChange('apiKeys.elevenlabs', e.target.value)}
                  placeholder="Enter your ElevenLabs API key"
                  className="flex-1"
                />
                <Button variant="outline" size="sm">Verify</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Get your API key from the <a href="https://elevenlabs.io/app/account" className="underline" target="_blank" rel="noopener noreferrer">ElevenLabs dashboard</a>
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Model Selection</Label>
                <p className="text-xs text-muted-foreground">Choose ElevenLabs voice model</p>
              </div>
              <Select 
                value="eleven_multilingual_v2"
                onValueChange={() => {}}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eleven_multilingual_v2">Multilingual v2</SelectItem>
                  <SelectItem value="eleven_monolingual_v1">English v1</SelectItem>
                  <SelectItem value="eleven_turbo_v2">Turbo v2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'openai':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="openai-api-key" className="flex items-center gap-2">
                OpenAI API Key
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0"
                  onClick={toggleAPIKeyVisibility}
                >
                  {isAPIKeyHidden ? <Lock size={12} /> : <Info size={12} />}
                </Button>
              </Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="openai-api-key"
                  type={isAPIKeyHidden ? "password" : "text"}
                  value={settings.apiKeys.openai || ''}
                  onChange={(e) => handleSettingChange('apiKeys.openai', e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="flex-1"
                />
                <Button variant="outline" size="sm">Verify</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Get your API key from the <a href="https://platform.openai.com/account/api-keys" className="underline" target="_blank" rel="noopener noreferrer">OpenAI dashboard</a>
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Model Selection</Label>
                <p className="text-xs text-muted-foreground">Choose OpenAI TTS model</p>
              </div>
              <Select 
                value="tts-1"
                onValueChange={() => {}}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tts-1">TTS-1</SelectItem>
                  <SelectItem value="tts-1-hd">TTS-1-HD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'browser':
      default:
        return (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Browser Speech Synthesis</h4>
              <p className="text-sm text-muted-foreground">
                Using the browser's built-in speech synthesis API. No additional configuration required.
                Voice quality and availability will vary based on the user's browser and operating system.
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="prefer-local-voices" className="cursor-pointer">Prefer local voices</Label>
              <Switch 
                id="prefer-local-voices"
                checked={settings.preferLocalVoices}
                onCheckedChange={(checked) => handleSettingChange('preferLocalVoices', checked)}
              />
            </div>
            
            <Button variant="outline" onClick={handleRefreshVoices} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Available Voices
            </Button>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice Integration Settings
        </CardTitle>
        <CardDescription>
          Configure text-to-speech and speech-to-text options for Italian and English voices
        </CardDescription>
      </CardHeader>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="voices" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Voices
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Usage
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="general" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Text-to-Speech</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-tts" className="cursor-pointer">Enable text-to-speech</Label>
                  <Switch 
                    id="enable-tts"
                    checked={settings.enableTextToSpeech}
                    onCheckedChange={(checked) => handleSettingChange('enableTextToSpeech', checked)}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-rate">Default Speed</Label>
                    <span className="text-sm font-medium">{settings.defaultVoiceRate.toFixed(1)}x</span>
                  </div>
                  <Slider 
                    id="voice-rate"
                    min={0.5} 
                    max={2.0} 
                    step={0.1}
                    value={[settings.defaultVoiceRate]} 
                    onValueChange={([value]) => handleSettingChange('defaultVoiceRate', value)}
                    className="mt-2"
                    disabled={!settings.enableTextToSpeech}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-pitch">Default Pitch</Label>
                    <span className="text-sm font-medium">{settings.defaultVoicePitch.toFixed(1)}</span>
                  </div>
                  <Slider 
                    id="voice-pitch"
                    min={0.5} 
                    max={1.5} 
                    step={0.1}
                    value={[settings.defaultVoicePitch]} 
                    onValueChange={([value]) => handleSettingChange('defaultVoicePitch', value)}
                    className="mt-2"
                    disabled={!settings.enableTextToSpeech}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-volume">Default Volume</Label>
                    <span className="text-sm font-medium">{Math.round(settings.defaultVoiceVolume * 100)}%</span>
                  </div>
                  <Slider 
                    id="voice-volume"
                    min={0} 
                    max={1} 
                    step={0.05}
                    value={[settings.defaultVoiceVolume]} 
                    onValueChange={([value]) => handleSettingChange('defaultVoiceVolume', value)}
                    className="mt-2"
                    disabled={!settings.enableTextToSpeech}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="cache-audio" className="cursor-pointer">Cache audio files</Label>
                  <Switch 
                    id="cache-audio"
                    checked={settings.cacheAudio}
                    onCheckedChange={(checked) => handleSettingChange('cacheAudio', checked)}
                    disabled={!settings.enableTextToSpeech}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Speech Recognition</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-stt" className="cursor-pointer">Enable speech recognition</Label>
                  <Switch 
                    id="enable-stt"
                    checked={settings.enableSpeechRecognition}
                    onCheckedChange={(checked) => handleSettingChange('enableSpeechRecognition', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-pronunciation" className="cursor-pointer">Enable pronunciation feedback</Label>
                  <Switch 
                    id="enable-pronunciation"
                    checked={settings.enablePronunciationFeedback}
                    onCheckedChange={(checked) => handleSettingChange('enablePronunciationFeedback', checked)}
                    disabled={!settings.enableSpeechRecognition}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audio Quality</Label>
                    <p className="text-xs text-muted-foreground">Higher quality uses more bandwidth</p>
                  </div>
                  <Select 
                    value={settings.audioQuality}
                    onValueChange={(value) => handleSettingChange('audioQuality', value as 'low' | 'medium' | 'high')}
                    disabled={!settings.enableSpeechRecognition}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="track-usage" className="cursor-pointer">Track usage statistics</Label>
                  <Switch 
                    id="track-usage"
                    checked={settings.trackUsage}
                    onCheckedChange={(checked) => handleSettingChange('trackUsage', checked)}
                  />
                </div>
                
                <div>
                  <Label>Daily Usage Limit</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input 
                      type="number"
                      min={0}
                      value={settings.usageLimits.daily}
                      onChange={(e) => handleSettingChange('usageLimits.daily', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">requests</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="voices" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">English Voices</h3>
                
                <div>
                  <Label htmlFor="default-english-voice">Default English Voice</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Select 
                      value={settings.defaultEnglishVoice}
                      onValueChange={(value) => handleDefaultVoiceChange('english', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select default English voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVoices
                          .filter(voice => voice.language.startsWith('en') || voice.language === 'multi')
                          .map(voice => (
                            <SelectItem key={voice.id} value={voice.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{voice.name}</span>
                                {voice.isPremium && (
                                  <Badge variant="outline" className="ml-2">Premium</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleTestVoice('english')}
                      disabled={isTestPlaying || !settings.defaultEnglishVoice}
                    >
                      {isTestPlaying ? (
                        <Volume2 className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="test-english-text">Test English Text</Label>
                  <Input 
                    id="test-english-text"
                    value={testText.english}
                    onChange={(e) => setTestText({...testText, english: e.target.value})}
                    className="mt-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Available English Voices</Label>
                  <div className="bg-muted p-2 rounded-md max-h-[200px] overflow-y-auto">
                    {availableVoices
                      .filter(voice => voice.language.startsWith('en') || voice.language === 'multi')
                      .map(voice => (
                        <div 
                          key={voice.id} 
                          className="flex items-center justify-between p-2 hover:bg-accent rounded-sm"
                        >
                          <div className="flex items-center gap-2">
                            {voice.provider === 'browser' ? (
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            ) : voice.provider === 'elevenlabs' ? (
                              <Volume2 className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Volume2 className="h-4 w-4 text-green-500" />
                            )}
                            <span>{voice.name}</span>
                          </div>
                          <div className="flex items-center">
                            {voice.isPremium && (
                              <Badge variant="outline" size="sm" className="mr-2">Premium</Badge>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                handleDefaultVoiceChange('english', voice.id);
                                handleTestVoice('english');
                              }}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Italian Voices</h3>
                
                <div>
                  <Label htmlFor="default-italian-voice">Default Italian Voice</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Select 
                      value={settings.defaultItalianVoice}
                      onValueChange={(value) => handleDefaultVoiceChange('italian', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select default Italian voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVoices
                          .filter(voice => voice.language.startsWith('it') || voice.language === 'multi')
                          .map(voice => (
                            <SelectItem key={voice.id} value={voice.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{voice.name}</span>
                                {voice.isPremium && (
                                  <Badge variant="outline" className="ml-2">Premium</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleTestVoice('italian')}
                      disabled={isTestPlaying || !settings.defaultItalianVoice}
                    >
                      {isTestPlaying ? (
                        <Volume2 className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="test-italian-text">Test Italian Text</Label>
                  <Input 
                    id="test-italian-text"
                    value={testText.italian}
                    onChange={(e) => setTestText({...testText, italian: e.target.value})}
                    className="mt-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Available Italian Voices</Label>
                  <div className="bg-muted p-2 rounded-md max-h-[200px] overflow-y-auto">
                    {availableVoices
                      .filter(voice => voice.language.startsWith('it') || voice.language === 'multi')
                      .map(voice => (
                        <div 
                          key={voice.id} 
                          className="flex items-center justify-between p-2 hover:bg-accent rounded-sm"
                        >
                          <div className="flex items-center gap-2">
                            {voice.provider === 'browser' ? (
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            ) : voice.provider === 'elevenlabs' ? (
                              <Volume2 className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Volume2 className="h-4 w-4 text-green-500" />
                            )}
                            <span>{voice.name}</span>
                          </div>
                          <div className="flex items-center">
                            {voice.isPremium && (
                              <Badge variant="outline" size="sm" className="mr-2">Premium</Badge>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                handleDefaultVoiceChange('italian', voice.id);
                                handleTestVoice('italian');
                              }}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="providers" className="space-y-6 mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Voice Provider</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant={settings.provider === 'browser' ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => handleProviderChange('browser')}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Browser (Free)
                </Button>
                <Button
                  variant={settings.provider === 'elevenlabs' ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => handleProviderChange('elevenlabs')}
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  ElevenLabs (Premium)
                </Button>
                <Button
                  variant={settings.provider === 'openai' ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => handleProviderChange('openai')}
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  OpenAI (Premium)
                </Button>
              </div>
              
              <div className="pt-4">
                {renderProviderSettings()}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-6 mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Voice Usage Statistics</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Text-to-Speech Requests</span>
                      <span className="text-2xl font-bold">{usageStats.totalTextToSpeechRequests.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Speech-to-Text Requests</span>
                      <span className="text-2xl font-bold">{usageStats.totalSpeechToTextRequests.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Audio Generated</span>
                      <span className="text-2xl font-bold">{usageStats.audioGeneratedMinutes.toFixed(1)} min</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Avg. Processing Time</span>
                      <span className="text-2xl font-bold">{usageStats.averageProcessingTime} ms</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <h4 className="text-base font-medium">Usage by Language</h4>
                  <div className="space-y-3">
                    {usageStats.byLanguage.map(stat => (
                      <div key={stat.language} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{stat.language}</span>
                          <span className="font-medium">{stat.count.toLocaleString()} ({stat.percentage}%)</span>
                        </div>
                        <Progress value={stat.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-base font-medium">Usage by Voice</h4>
                  <div className="space-y-3">
                    {usageStats.byVoice.map(stat => (
                      <div key={stat.voiceId} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{stat.voiceName}</span>
                          <span className="font-medium">{stat.count.toLocaleString()} ({stat.percentage}%)</span>
                        </div>
                        <Progress value={stat.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md mt-4">
                <h4 className="text-sm font-medium mb-2">Usage Notes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Free browser voices have unlimited usage</li>
                  <li>• Premium voices (ElevenLabs, OpenAI) are billed according to your subscription</li>
                  <li>• Consider downloading frequently used audio for offline use</li>
                  <li>• High-quality voices consume more API credits</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setSettings(defaultVoiceSettings)}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoiceIntegrationSettingsComponent;
