
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Volume2, MicOff, Mic, Play, VolumeX, Cog, Languages, WavePulse } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VoiceSystemManager: React.FC = () => {
  const { toast } = useToast();
  
  const [voiceSettings, setVoiceSettings] = useState({
    ttsEnabled: true,
    sttEnabled: true,
    defaultSpeed: 1.0,
    defaultPitch: 1.0,
    defaultVoice: 'it-IT-ElsaNeural',
    volume: 0.8,
    useLocalProcessing: true,
    sampleRate: 44100
  });
  
  const [testText, setTestText] = useState("Benvenuti al nostro sistema italiano di apprendimento!");
  const [isPlaying, setIsPlaying] = useState(false);
  
  const availableVoices = [
    { id: 'it-IT-ElsaNeural', name: 'Elsa (Female)', gender: 'female', locale: 'Italian' },
    { id: 'it-IT-DiegoNeural', name: 'Diego (Male)', gender: 'male', locale: 'Italian' },
    { id: 'it-IT-IsabellaNeural', name: 'Isabella (Female)', gender: 'female', locale: 'Italian' },
    { id: 'it-IT-BenignoNeural', name: 'Benigno (Male)', gender: 'male', locale: 'Italian' }
  ];
  
  const voiceStats = {
    requestsTotal: 3482,
    errorRate: 0.8,
    averageProcessingTime: 320, // ms
    charactersParsed: 198450
  };
  
  const handleVoiceSettingChange = (key: string, value: any) => {
    setVoiceSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handlePlayTestAudio = () => {
    setIsPlaying(true);
    
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
      toast({
        title: "Audio Played",
        description: "Test audio was successfully played.",
      });
    }, 3000);
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Voice Settings Saved",
      description: "Your voice system settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tts">
        <TabsList>
          <TabsTrigger value="tts" className="flex items-center">
            <Volume2 className="mr-2 h-4 w-4" />
            Text-to-Speech
          </TabsTrigger>
          <TabsTrigger value="stt" className="flex items-center">
            <Mic className="mr-2 h-4 w-4" />
            Speech-to-Text
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center">
            <WavePulse className="mr-2 h-4 w-4" />
            Voice Metrics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Cog className="mr-2 h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tts" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Text-to-Speech Settings</CardTitle>
                  <CardDescription>Configure TTS for Italian language</CardDescription>
                </div>
                <Switch 
                  checked={voiceSettings.ttsEnabled} 
                  onCheckedChange={(checked) => handleVoiceSettingChange('ttsEnabled', checked)}
                  aria-label="Enable TTS"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="voice-selector">Voice Selection</Label>
                <Select 
                  value={voiceSettings.defaultVoice} 
                  onValueChange={(value) => handleVoiceSettingChange('defaultVoice', value)}
                >
                  <SelectTrigger id="voice-selector">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{voice.name}</span>
                          <Badge variant="outline" className="ml-2">{voice.locale}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-speed">Speed</Label>
                  <span className="text-sm">{voiceSettings.defaultSpeed.toFixed(1)}x</span>
                </div>
                <Slider 
                  id="voice-speed"
                  min={0.5} 
                  max={2.0} 
                  step={0.1}
                  value={[voiceSettings.defaultSpeed]} 
                  onValueChange={(value) => handleVoiceSettingChange('defaultSpeed', value[0])}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-pitch">Pitch</Label>
                  <span className="text-sm">{voiceSettings.defaultPitch.toFixed(1)}</span>
                </div>
                <Slider 
                  id="voice-pitch"
                  min={0.5} 
                  max={1.5} 
                  step={0.1}
                  value={[voiceSettings.defaultPitch]} 
                  onValueChange={(value) => handleVoiceSettingChange('defaultPitch', value[0])}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-volume">Volume</Label>
                  <span className="text-sm">{(voiceSettings.volume * 100).toFixed(0)}%</span>
                </div>
                <Slider 
                  id="voice-volume"
                  min={0} 
                  max={1} 
                  step={0.1}
                  value={[voiceSettings.volume]} 
                  onValueChange={(value) => handleVoiceSettingChange('volume', value[0])}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="test-text">Test Text</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="test-text"
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handlePlayTestAudio}
                    disabled={isPlaying || !voiceSettings.ttsEnabled}
                    size="icon"
                  >
                    {isPlaying ? (
                      <WavePulse className="h-4 w-4 animate-pulse" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button onClick={handleSaveSettings} className="ml-auto">
                Save TTS Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="stt" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Speech-to-Text Settings</CardTitle>
                  <CardDescription>Configure STT for Italian language recognition</CardDescription>
                </div>
                <Switch 
                  checked={voiceSettings.sttEnabled} 
                  onCheckedChange={(checked) => handleVoiceSettingChange('sttEnabled', checked)}
                  aria-label="Enable STT"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="language-model">Recognition Model</Label>
                <Select 
                  defaultValue="whisper-italian"
                >
                  <SelectTrigger id="language-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whisper-italian">Whisper Italian (Medium)</SelectItem>
                    <SelectItem value="whisper-italian-small">Whisper Italian (Small)</SelectItem>
                    <SelectItem value="cils-optimized">CILS Optimized Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="local-processing">Local Processing</Label>
                  <p className="text-sm text-muted-foreground">Process speech on the client device</p>
                </div>
                <Switch 
                  id="local-processing" 
                  checked={voiceSettings.useLocalProcessing}
                  onCheckedChange={(checked) => handleVoiceSettingChange('useLocalProcessing', checked)}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="sample-rate">Sample Rate</Label>
                <Select 
                  value={voiceSettings.sampleRate.toString()} 
                  onValueChange={(value) => handleVoiceSettingChange('sampleRate', parseInt(value))}
                >
                  <SelectTrigger id="sample-rate">
                    <SelectValue placeholder="Select sample rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16000">16 kHz (Low quality)</SelectItem>
                    <SelectItem value="22050">22.05 kHz (Medium quality)</SelectItem>
                    <SelectItem value="44100">44.1 kHz (High quality)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Higher sample rates improve accuracy but require more processing power
                </p>
              </div>
              
              <div className="mt-4 p-4 bg-muted rounded-md">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline"
                    className="flex items-center"
                    disabled={!voiceSettings.sttEnabled}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Test Microphone
                  </Button>
                  <Badge variant="outline">
                    {voiceSettings.sttEnabled ? "Ready" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button onClick={handleSaveSettings} className="ml-auto">
                Save STT Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice System Metrics</CardTitle>
              <CardDescription>Performance statistics for the voice system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Volume2 className="mr-2 h-4 w-4 text-primary" />
                      TTS Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{voiceStats.requestsTotal}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {voiceStats.charactersParsed.toLocaleString()} characters processed
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <VolumeX className="mr-2 h-4 w-4 text-primary" />
                      Error Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{voiceStats.errorRate}%</div>
                    <Progress value={100 - voiceStats.errorRate} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{voiceStats.averageProcessingTime} ms</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average time to process voice requests
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Voice Usage by Locale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span>Italian (IT)</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span>English (US)</span>
                        <span>12%</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span>Other</span>
                        <span>3%</span>
                      </div>
                      <Progress value={3} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Voice Settings</CardTitle>
              <CardDescription>Technical configuration for voice processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="fallback-server">Cloud Fallback</Label>
                  <p className="text-sm text-muted-foreground">Use cloud processing when local fails</p>
                </div>
                <Switch id="fallback-server" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cache-audio">Cache Audio</Label>
                  <p className="text-sm text-muted-foreground">Store frequently used audio clips</p>
                </div>
                <Switch id="cache-audio" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="noise-reduction">Noise Reduction</Label>
                  <p className="text-sm text-muted-foreground">Apply audio noise filtering</p>
                </div>
                <Switch id="noise-reduction" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input 
                  id="api-endpoint"
                  defaultValue="https://api.cilsprep.com/voice"
                />
                <p className="text-xs text-muted-foreground">
                  Custom endpoint for voice processing
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="auth-key">API Key</Label>
                <Input 
                  id="auth-key"
                  type="password"
                  defaultValue="••••••••••••••••"
                />
                <p className="text-xs text-muted-foreground">
                  Authentication key for cloud services
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button onClick={handleSaveSettings} className="ml-auto">
                Save Advanced Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoiceSystemManager;
