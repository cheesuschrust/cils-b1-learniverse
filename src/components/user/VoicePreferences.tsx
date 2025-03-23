
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { getAllVoices, speak } from '@/utils/textToSpeech';

const VoicePreferences = () => {
  const { voicePreference, setVoicePreference } = useUserPreferences();
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [italianVoices, setItalianVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(voicePreference?.voiceRate || 1);
  const [pitch, setPitch] = useState(voicePreference?.voicePitch || 1);
  const [selectedItalianVoice, setSelectedItalianVoice] = useState(voicePreference?.italianVoiceURI || '');
  const [selectedEnglishVoice, setSelectedEnglishVoice] = useState(voicePreference?.englishVoiceURI || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voices = await getAllVoices();
        setAvailableVoices(voices);
        
        // Filter voices by language
        const italian = voices.filter(voice => voice.lang.startsWith('it'));
        const english = voices.filter(voice => voice.lang.startsWith('en'));
        
        setItalianVoices(italian);
        setEnglishVoices(english);
        
        // Set defaults if not already set
        if (!selectedItalianVoice && italian.length > 0) {
          setSelectedItalianVoice(italian[0].name);
        }
        
        if (!selectedEnglishVoice && english.length > 0) {
          setSelectedEnglishVoice(english[0].name);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading voices:", error);
        setIsLoading(false);
      }
    };
    
    loadVoices();
  }, [selectedEnglishVoice, selectedItalianVoice]);

  const savePreferences = () => {
    if (setVoicePreference) {
      setVoicePreference({
        italianVoiceURI: selectedItalianVoice,
        englishVoiceURI: selectedEnglishVoice,
        voiceRate: rate,
        voicePitch: pitch
      });
    }
  };

  const testItalianVoice = () => {
    const voice = availableVoices.find(v => v.name === selectedItalianVoice);
    if (voice) {
      speak("Buongiorno, come stai oggi?", voice, rate, pitch);
    }
  };

  const testEnglishVoice = () => {
    const voice = availableVoices.find(v => v.name === selectedEnglishVoice);
    if (voice) {
      speak("Hello, how are you today?", voice, rate, pitch);
    }
  };

  // Save whenever settings change
  useEffect(() => {
    savePreferences();
  }, [selectedItalianVoice, selectedEnglishVoice, rate, pitch]);

  if (isLoading) {
    return <div className="text-center py-4">Loading voice options...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base">Italian Voice</Label>
          <div className="flex gap-2">
            <Select 
              value={selectedItalianVoice} 
              onValueChange={setSelectedItalianVoice}
              disabled={italianVoices.length === 0}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select Italian voice" />
              </SelectTrigger>
              <SelectContent>
                {italianVoices.length > 0 ? (
                  italianVoices.map(voice => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No Italian voices available</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={testItalianVoice}
              disabled={!selectedItalianVoice || italianVoices.length === 0}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Label className="text-base">English Voice</Label>
          <div className="flex gap-2">
            <Select 
              value={selectedEnglishVoice} 
              onValueChange={setSelectedEnglishVoice}
              disabled={englishVoices.length === 0}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select English voice" />
              </SelectTrigger>
              <SelectContent>
                {englishVoices.length > 0 ? (
                  englishVoices.map(voice => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No English voices available</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={testEnglishVoice}
              disabled={!selectedEnglishVoice || englishVoices.length === 0}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VolumeX className="h-4 w-4 text-muted-foreground" />
              <Label>Voice Speed</Label>
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium">{rate.toFixed(1)}x</span>
          </div>
          <Slider 
            value={[rate]} 
            min={0.5} 
            max={2} 
            step={0.1} 
            onValueChange={(values) => setRate(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Voice Pitch</Label>
            <span className="text-sm font-medium">{pitch.toFixed(1)}</span>
          </div>
          <Slider 
            value={[pitch]} 
            min={0.5} 
            max={2} 
            step={0.1}
            onValueChange={(values) => setPitch(values[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default VoicePreferences;
