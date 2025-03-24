
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Volume2, Play } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { speak } from '@/utils/textToSpeech';

const VoicePreferences = () => {
  const { voicePreference, setVoicePreference } = useUserPreferences();
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [italianVoices, setItalianVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample text for testing voices
  const sampleItalianText = "Ciao, come stai oggi?";
  const sampleEnglishText = "Hello, how are you today?";

  useEffect(() => {
    // Handle voices being loaded asynchronously
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      
      if (voices.length === 0) {
        // If no voices are available yet, try again
        setTimeout(loadVoices, 100);
        return;
      }

      setAvailableVoices(voices);
      
      // Filter for Italian voices
      const itVoices = voices.filter(voice => 
        voice.lang.includes('it') || 
        voice.name.toLowerCase().includes('italian') ||
        voice.name.toLowerCase().includes('italia')
      );
      setItalianVoices(itVoices);
      
      // Filter for English voices
      const enVoices = voices.filter(voice => 
        voice.lang.includes('en') || 
        voice.name.toLowerCase().includes('english')
      );
      setEnglishVoices(enVoices);
      
      setIsLoading(false);
    };

    loadVoices();
    
    // Handle voices changing (mostly for Chrome)
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleVoiceChange = (language: 'english' | 'italian') => (voiceURI: string) => {
    if (language === 'italian') {
      setVoicePreference({
        ...voicePreference,
        italianVoiceURI: voiceURI
      });
    } else {
      setVoicePreference({
        ...voicePreference,
        englishVoiceURI: voiceURI
      });
    }
  };

  const handleRateChange = (values: number[]) => {
    setVoicePreference({
      ...voicePreference,
      voiceRate: values[0]
    });
  };

  const handlePitchChange = (values: number[]) => {
    setVoicePreference({
      ...voicePreference,
      voicePitch: values[0]
    });
  };
  
  const playVoiceSample = async (language: 'it' | 'en') => {
    const text = language === 'it' ? sampleItalianText : sampleEnglishText;
    await speak(text, language, voicePreference);
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading voice options...</div>;
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 pt-2">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="italian-voice">Italian Voice</Label>
            <div className="flex items-center gap-2">
              <Select
                value={voicePreference.italianVoiceURI}
                onValueChange={handleVoiceChange('italian')}
              >
                <SelectTrigger id="italian-voice" className="flex-1">
                  <SelectValue placeholder="Select Italian voice" />
                </SelectTrigger>
                <SelectContent>
                  {italianVoices.length > 0 ? (
                    italianVoices.map(voice => (
                      <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No Italian voices available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button 
                variant="outline"
                size="icon"
                onClick={() => playVoiceSample('it')}
                disabled={!voicePreference.italianVoiceURI}
                title="Preview Italian voice"
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="english-voice">English Voice</Label>
            <div className="flex items-center gap-2">
              <Select
                value={voicePreference.englishVoiceURI}
                onValueChange={handleVoiceChange('english')}
              >
                <SelectTrigger id="english-voice" className="flex-1">
                  <SelectValue placeholder="Select English voice" />
                </SelectTrigger>
                <SelectContent>
                  {englishVoices.length > 0 ? (
                    englishVoices.map(voice => (
                      <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No English voices available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => playVoiceSample('en')}
                disabled={!voicePreference.englishVoiceURI}
                title="Preview English voice"
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-rate">Speech Rate</Label>
                <span className="text-sm font-medium">{voicePreference.voiceRate.toFixed(1)}x</span>
              </div>
              <Slider
                id="voice-rate"
                min={0.5}
                max={2.0}
                step={0.1}
                defaultValue={[voicePreference.voiceRate]}
                onValueChange={handleRateChange}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Adjust how quickly or slowly the voice speaks</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-pitch">Voice Pitch</Label>
                <span className="text-sm font-medium">{voicePreference.voicePitch.toFixed(1)}</span>
              </div>
              <Slider
                id="voice-pitch"
                min={0.5}
                max={2.0}
                step={0.1}
                defaultValue={[voicePreference.voicePitch]}
                onValueChange={handlePitchChange}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Adjust how high or low the voice sounds</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoicePreferences;
