import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Save } from 'lucide-react';
import { getAvailableVoices, speak, VoicePreference } from '@/utils/textToSpeech';

const saveDefaultVoiceSettings = async (settings: any) => {
  console.log('Saving default voice settings:', settings);
  return new Promise(resolve => setTimeout(resolve, 1000));
};

const SiteVoiceSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [italianVoices, setItalianVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const [defaultSettings, setDefaultSettings] = useState({
    defaultEnglishVoiceURI: '',
    defaultItalianVoiceURI: '',
    defaultVoiceRate: 1.0,
    defaultVoicePitch: 1.0
  });
  
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voices = await getAvailableVoices();
        
        const enVoices = voices.filter(voice => 
          voice.lang.startsWith('en') || voice.name.toLowerCase().includes('english')
        );
        
        const itVoices = voices.filter(voice => 
          voice.lang.startsWith('it') || voice.name.toLowerCase().includes('italian')
        );
        
        setEnglishVoices(enVoices);
        setItalianVoices(itVoices);
        
        if (enVoices.length > 0 && !defaultSettings.defaultEnglishVoiceURI) {
          setDefaultSettings(prev => ({...prev, defaultEnglishVoiceURI: enVoices[0].voiceURI}));
        }
        
        if (itVoices.length > 0 && !defaultSettings.defaultItalianVoiceURI) {
          setDefaultSettings(prev => ({...prev, defaultItalianVoiceURI: itVoices[0].voiceURI}));
        }
      } catch (error) {
        console.error("Error loading voices:", error);
      }
    };
    
    loadVoices();
  }, []);
  
  const handlePreview = async (language: 'en' | 'it') => {
    const sampleText = language === 'en' 
      ? "This is the default English voice for all users."
      : "Questa è la voce italiana predefinita per tutti gli utenti.";
    
    try {
      await speak(
        sampleText, 
        language === 'en' ? 'en' : 'it',
        {
          englishVoiceURI: defaultSettings.defaultEnglishVoiceURI,
          italianVoiceURI: defaultSettings.defaultItalianVoiceURI,
          voiceRate: defaultSettings.defaultVoiceRate,
          voicePitch: defaultSettings.defaultVoicePitch
        }
      );
    } catch (error) {
      console.error("Error playing voice preview:", error);
      toast({
        title: "Voice Preview Error",
        description: "There was a problem playing the voice preview.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveDefaults = async () => {
    setIsLoading(true);
    try {
      await saveDefaultVoiceSettings(defaultSettings);
      toast({
        title: "Default Voice Settings Saved",
        description: "Site-wide default voice settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving default settings:", error);
      toast({
        title: "Save Failed",
        description: "There was a problem saving the default voice settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Site Default Voice Settings
        </CardTitle>
        <CardDescription>
          Set default voice preferences for all users. Users can override these in their own settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-base">Default English Voice</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handlePreview('en')}
              className="h-8 w-8 p-0"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          
          <Select
            value={defaultSettings.defaultEnglishVoiceURI}
            onValueChange={(value) => setDefaultSettings(prev => ({...prev, defaultEnglishVoiceURI: value}))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select default English voice" />
            </SelectTrigger>
            <SelectContent>
              {englishVoices.length > 0 ? (
                englishVoices.map(voice => (
                  <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} {voice.localService ? " (Local)" : ""}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="default" disabled>
                  No English voices available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-base">Default Italian Voice</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handlePreview('it')}
              className="h-8 w-8 p-0"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          
          <Select
            value={defaultSettings.defaultItalianVoiceURI}
            onValueChange={(value) => setDefaultSettings(prev => ({...prev, defaultItalianVoiceURI: value}))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select default Italian voice" />
            </SelectTrigger>
            <SelectContent>
              {italianVoices.length > 0 ? (
                italianVoices.map(voice => (
                  <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} {voice.localService ? " (Local)" : ""}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="default" disabled>
                  No Italian voices available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="default-voice-rate" className="text-base">Default Voice Rate</Label>
              <span className="text-sm font-medium">{defaultSettings.defaultVoiceRate.toFixed(1)}x</span>
            </div>
            <Slider 
              id="default-voice-rate"
              defaultValue={[defaultSettings.defaultVoiceRate]} 
              max={2} 
              min={0.5} 
              step={0.1} 
              onValueChange={(value) => setDefaultSettings(prev => ({...prev, defaultVoiceRate: value[0]}))}
              className="mt-2"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="default-voice-pitch" className="text-base">Default Voice Pitch</Label>
              <span className="text-sm font-medium">{defaultSettings.defaultVoicePitch.toFixed(1)}</span>
            </div>
            <Slider 
              id="default-voice-pitch"
              defaultValue={[defaultSettings.defaultVoicePitch]} 
              max={2} 
              min={0.5} 
              step={0.1} 
              onValueChange={(value) => setDefaultSettings(prev => ({...prev, defaultVoicePitch: value[0]}))}
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveDefaults} 
          disabled={isLoading}
          className="ml-auto"
        >
          {isLoading ? (
            <span>Saving...</span>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Default Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SiteVoiceSettings;
