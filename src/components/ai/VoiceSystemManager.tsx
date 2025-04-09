
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2, Wand2, Save, Play, PlayCircle, VolumeX, Headphones, Accessibility } from 'lucide-react';

const VoiceSystemManager: React.FC = () => {
  // State for voice settings
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [speed, setSpeed] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState('italian-female-1');
  const [voiceVariation, setVoiceVariation] = useState('standard');
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  
  // Sample voice data
  const italianVoices = [
    { id: 'italian-female-1', name: 'Sofia', gender: 'female', quality: 'premium' },
    { id: 'italian-male-1', name: 'Marco', gender: 'male', quality: 'premium' },
    { id: 'italian-female-2', name: 'Giulia', gender: 'female', quality: 'standard' },
    { id: 'italian-male-2', name: 'Antonio', gender: 'male', quality: 'standard' },
  ];
  
  const englishVoices = [
    { id: 'english-female-1', name: 'Emma', gender: 'female', quality: 'premium' },
    { id: 'english-male-1', name: 'James', gender: 'male', quality: 'premium' },
    { id: 'english-female-2', name: 'Olivia', gender: 'female', quality: 'standard' },
    { id: 'english-male-2', name: 'William', gender: 'male', quality: 'standard' },
  ];
  
  // Test phrases
  const testPhrases = {
    italian: [
      "Buongiorno, come stai oggi?",
      "Mi piace molto imparare l'italiano.",
      "Potrebbe ripetere più lentamente, per favore?",
    ],
    english: [
      "Good morning, how are you today?",
      "I really enjoy learning Italian.",
      "Could you repeat that more slowly, please?",
    ]
  };
  
  // Handle voice test
  const handleVoiceTest = (phrase: string) => {
    console.log(`Testing voice with phrase: "${phrase}"`);
    // In a real implementation, this would use the Web Speech API
    // or a TTS service to speak the phrase with the selected voice settings
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    console.log('Saving voice settings:', {
      enabled: voiceEnabled,
      volume,
      speed,
      voice: selectedVoice,
      variation: voiceVariation,
      autoPlay: autoPlayEnabled
    });
    // In a real implementation, this would save to API or local storage
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Volume2 className="mr-2 h-5 w-5 text-primary" />
          Voice System Manager
        </CardTitle>
        <CardDescription>
          Configure text-to-speech voices and pronunciation settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="italian" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="italian">
              <img src="https://flagcdn.com/16x12/it.png" className="mr-2" alt="Italian flag" />
              Italian Voice
            </TabsTrigger>
            <TabsTrigger value="english">
              <img src="https://flagcdn.com/16x12/gb.png" className="mr-2" alt="UK flag" />
              English Voice
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="italian" className="space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mic className="h-5 w-5 text-primary" />
                <Label htmlFor="voice-enabled-it" className="text-base font-medium">
                  Enable Italian Voice
                </Label>
              </div>
              <Switch 
                id="voice-enabled-it" 
                checked={voiceEnabled} 
                onCheckedChange={setVoiceEnabled} 
              />
            </div>
            
            {voiceEnabled && (
              <>
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Select Voice</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {italianVoices.map(voice => (
                          <SelectItem key={voice.id} value={voice.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{voice.name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="capitalize">
                                  {voice.gender}
                                </Badge>
                                {voice.quality === 'premium' && (
                                  <Badge className="bg-amber-100 text-amber-800">Premium</Badge>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Volume</Label>
                      <span className="text-sm text-muted-foreground">{volume}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        defaultValue={[volume]}
                        max={100}
                        step={5}
                        onValueChange={(value) => setVolume(value[0])}
                        className="flex-1"
                      />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Speech Rate</Label>
                      <span className="text-sm text-muted-foreground">{speed}x</span>
                    </div>
                    <Slider
                      defaultValue={[speed]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => setSpeed(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Voice Variation</Label>
                    <RadioGroup 
                      defaultValue={voiceVariation} 
                      onValueChange={setVoiceVariation}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="clear" id="clear" />
                        <Label htmlFor="clear">Clear</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="slow" id="slow" />
                        <Label htmlFor="slow">Slow</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <Label className="text-sm font-medium mb-3 block">Test Italian Voice</Label>
                  <div className="space-y-2">
                    {testPhrases.italian.map((phrase, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-sm flex-1">{phrase}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleVoiceTest(phrase)}
                          className="flex items-center"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="english" className="space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mic className="h-5 w-5 text-primary" />
                <Label htmlFor="voice-enabled-en" className="text-base font-medium">
                  Enable English Voice
                </Label>
              </div>
              <Switch 
                id="voice-enabled-en" 
                checked={voiceEnabled} 
                onCheckedChange={setVoiceEnabled} 
              />
            </div>
            
            {voiceEnabled && (
              <>
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Select Voice</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {englishVoices.map(voice => (
                          <SelectItem key={voice.id} value={voice.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{voice.name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="capitalize">
                                  {voice.gender}
                                </Badge>
                                {voice.quality === 'premium' && (
                                  <Badge className="bg-amber-100 text-amber-800">Premium</Badge>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Volume</Label>
                      <span className="text-sm text-muted-foreground">{volume}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        defaultValue={[volume]}
                        max={100}
                        step={5}
                        onValueChange={(value) => setVolume(value[0])}
                        className="flex-1"
                      />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Speech Rate</Label>
                      <span className="text-sm text-muted-foreground">{speed}x</span>
                    </div>
                    <Slider
                      defaultValue={[speed]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => setSpeed(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Voice Variation</Label>
                    <RadioGroup 
                      defaultValue={voiceVariation} 
                      onValueChange={setVoiceVariation}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard-en" />
                        <Label htmlFor="standard-en">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="clear" id="clear-en" />
                        <Label htmlFor="clear-en">Clear</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="slow" id="slow-en" />
                        <Label htmlFor="slow-en">Slow</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <Label className="text-sm font-medium mb-3 block">Test English Voice</Label>
                  <div className="space-y-2">
                    {testPhrases.english.map((phrase, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-sm flex-1">{phrase}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleVoiceTest(phrase)}
                          className="flex items-center"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Global Voice Settings */}
        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Global Voice Settings</h3>
          
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm flex items-center" htmlFor="autoplay">
                  <PlayCircle className="h-4 w-4 mr-2 text-green-600" />
                  Auto-play vocabulary pronunciation
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically play word pronunciation when reviewing vocabulary
                </p>
              </div>
              <Switch 
                id="autoplay" 
                checked={autoPlayEnabled} 
                onCheckedChange={setAutoPlayEnabled} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm flex items-center" htmlFor="high-quality">
                  <Wand2 className="h-4 w-4 mr-2 text-purple-600" />
                  Use high-quality voices when available
                </Label>
                <p className="text-xs text-muted-foreground">
                  Uses more bandwidth but provides better pronunciation
                </p>
              </div>
              <Switch id="high-quality" defaultChecked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm flex items-center" htmlFor="accessibility-voice">
                  <Accessibility className="h-4 w-4 mr-2 text-blue-600" />
                  Enable accessibility voice features
                </Label>
                <p className="text-xs text-muted-foreground">
                  Additional clarity and support for screen readers
                </p>
              </div>
              <Switch id="accessibility-voice" defaultChecked={true} />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Save Voice Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSystemManager;
