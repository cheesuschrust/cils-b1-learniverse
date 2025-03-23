
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { 
  getAllVoices, 
  getItalianVoices, 
  getEnglishVoices, 
  speakSample,
  VoicePreference,
  stopSpeaking
} from '@/utils/textToSpeech';
import { Volume2, Play, Square } from 'lucide-react';

interface VoiceOption {
  name: string;
  voiceURI: string;
  lang: string;
}

const VoicePreferences: React.FC = () => {
  const { voicePreference, setVoicePreference } = useUserPreferences();
  const [italianVoices, setItalianVoices] = useState<VoiceOption[]>([]);
  const [englishVoices, setEnglishVoices] = useState<VoiceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSample, setActiveSample] = useState<string | null>(null);
  
  // Load available voices
  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsLoading(true);
        
        // Load Italian voices
        const itVoices = await getItalianVoices();
        setItalianVoices(
          itVoices.map(voice => ({
            name: voice.name,
            voiceURI: voice.voiceURI,
            lang: voice.lang
          }))
        );
        
        // Load English voices
        const enVoices = await getEnglishVoices();
        setEnglishVoices(
          enVoices.map(voice => ({
            name: voice.name,
            voiceURI: voice.voiceURI,
            lang: voice.lang
          }))
        );
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading voices:', error);
        setIsLoading(false);
      }
    };
    
    loadVoices();
    
    return () => {
      // Stop any samples playing when component unmounts
      stopSpeaking();
    };
  }, []);
  
  // Play a sample of the selected voice
  const handlePlaySample = async (voiceURI: string, language: 'it' | 'en') => {
    stopSpeaking();
    setActiveSample(voiceURI);
    
    try {
      await speakSample(voiceURI, language);
      setActiveSample(null);
    } catch (error) {
      console.error('Error playing sample:', error);
      setActiveSample(null);
    }
  };
  
  // Stop the current sample
  const handleStopSample = () => {
    stopSpeaking();
    setActiveSample(null);
  };
  
  // Handle voice selection
  const handleVoiceChange = (voiceURI: string, language: 'italian' | 'english') => {
    const updatedPreference: VoicePreference = { ...voicePreference };
    
    if (language === 'italian') {
      updatedPreference.italianVoiceURI = voiceURI;
    } else {
      updatedPreference.englishVoiceURI = voiceURI;
    }
    
    setVoicePreference(updatedPreference);
  };
  
  // Handle voice rate change
  const handleRateChange = (value: number[]) => {
    setVoicePreference({
      ...voicePreference,
      voiceRate: value[0]
    });
  };
  
  // Handle voice pitch change
  const handlePitchChange = (value: number[]) => {
    setVoicePreference({
      ...voicePreference,
      voicePitch: value[0]
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-medium">Italian Voice</Label>
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="col-span-2">
            <Select
              value={voicePreference.italianVoiceURI || ''}
              onValueChange={value => handleVoiceChange(value, 'italian')}
              disabled={isLoading || italianVoices.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading voices..." : "Select Italian voice"} />
              </SelectTrigger>
              <SelectContent>
                {italianVoices.map(voice => (
                  <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
                {italianVoices.length === 0 && !isLoading && (
                  <SelectItem value="none" disabled>No Italian voices available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            {activeSample === voicePreference.italianVoiceURI ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleStopSample}
                className="flex items-center gap-1"
              >
                <Square className="h-4 w-4" />
                <span>Stop</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => voicePreference.italianVoiceURI && 
                  handlePlaySample(voicePreference.italianVoiceURI, 'it')}
                disabled={!voicePreference.italianVoiceURI || isLoading}
                className="flex items-center gap-1"
              >
                <Play className="h-4 w-4" />
                <span>Test</span>
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a voice for Italian text. More natural-sounding voices are listed first.
        </p>
      </div>
      
      <div className="space-y-3">
        <Label className="text-base font-medium">English Voice</Label>
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="col-span-2">
            <Select
              value={voicePreference.englishVoiceURI || ''}
              onValueChange={value => handleVoiceChange(value, 'english')}
              disabled={isLoading || englishVoices.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading voices..." : "Select English voice"} />
              </SelectTrigger>
              <SelectContent>
                {englishVoices.map(voice => (
                  <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
                {englishVoices.length === 0 && !isLoading && (
                  <SelectItem value="none" disabled>No English voices available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            {activeSample === voicePreference.englishVoiceURI ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleStopSample}
                className="flex items-center gap-1"
              >
                <Square className="h-4 w-4" />
                <span>Stop</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => voicePreference.englishVoiceURI && 
                  handlePlaySample(voicePreference.englishVoiceURI, 'en')}
                disabled={!voicePreference.englishVoiceURI || isLoading}
                className="flex items-center gap-1"
              >
                <Play className="h-4 w-4" />
                <span>Test</span>
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a voice for English text. More natural-sounding voices are listed first.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-rate" className="text-base font-medium">Voice Speed</Label>
            <span className="text-sm font-medium">{voicePreference.voiceRate.toFixed(1)}x</span>
          </div>
          <Slider 
            id="voice-rate"
            value={[voicePreference.voiceRate]} 
            min={0.5} 
            max={2.0} 
            step={0.1} 
            onValueChange={handleRateChange}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Adjust the speaking rate. Lower values speak slower, higher values speak faster.
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-pitch" className="text-base font-medium">Voice Pitch</Label>
            <span className="text-sm font-medium">{voicePreference.voicePitch.toFixed(1)}</span>
          </div>
          <Slider 
            id="voice-pitch"
            value={[voicePreference.voicePitch]} 
            min={0.5} 
            max={2.0} 
            step={0.1} 
            onValueChange={handlePitchChange}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Adjust the voice pitch. Lower values sound deeper, higher values sound higher.
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-accent/30 rounded-lg">
        <h4 className="font-medium flex items-center gap-1 mb-2">
          <Volume2 className="h-4 w-4" />
          Voice Quality Tips
        </h4>
        <ul className="space-y-1 text-sm">
          <li>• Different browsers offer different voice quality. Chrome and Edge typically have the best voices.</li>
          <li>• Some voices may sound more natural than others. Test different options to find your preference.</li>
          <li>• Voice quality depends on your device's capabilities and available system voices.</li>
          <li>• For the most natural Italian pronunciation, choose a voice with 'it-IT' language code.</li>
        </ul>
      </div>
    </div>
  );
};

export default VoicePreferences;
