
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { VoicePreference } from '@/utils/textToSpeech';
import { useToast } from '@/components/ui/use-toast';

const VoicePreferences = () => {
  const { voicePreference, setVoicePreference } = useUserPreferences();
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [italianVoices, setItalianVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Get available voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      // Get the available voices
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      
      if (voices.length > 0) {
        setAvailableVoices(voices);
        
        // Filter Italian and English voices
        const itVoices = voices.filter(voice => voice.lang.includes('it-'));
        const enVoices = voices.filter(voice => voice.lang.includes('en-'));
        
        setItalianVoices(itVoices);
        setEnglishVoices(enVoices);
        setIsLoading(false);
      }
    };

    // Load voices immediately
    loadVoices();
    
    // Also set up the event listener for when voices change
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const handleVoiceChange = (language: 'italian' | 'english', voiceURI: string) => {
    if (setVoicePreference) {
      const updatedPreference = { ...voicePreference };
      
      if (language === 'italian') {
        updatedPreference.italianVoiceURI = voiceURI;
      } else {
        updatedPreference.englishVoiceURI = voiceURI;
      }
      
      setVoicePreference(updatedPreference);
      
      toast({
        title: "Voice Updated",
        description: `${language.charAt(0).toUpperCase() + language.slice(1)} voice preference saved.`
      });
    }
  };

  const handleRateChange = (value: number[]) => {
    if (setVoicePreference) {
      setVoicePreference({
        ...voicePreference,
        voiceRate: value[0]
      });
    }
  };

  const handlePitchChange = (value: number[]) => {
    if (setVoicePreference) {
      setVoicePreference({
        ...voicePreference,
        voicePitch: value[0]
      });
    }
  };

  const testVoice = (language: 'italian' | 'english') => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance();
      
      // Set the text based on language
      utterance.text = language === 'italian' 
        ? 'Ciao, questa è una prova della voce italiana.' 
        : 'Hello, this is a test of the English voice.';
      
      // Set the voice URI
      const voiceURI = language === 'italian' 
        ? voicePreference.italianVoiceURI 
        : voicePreference.englishVoiceURI;
      
      // Find the voice object
      const voice = availableVoices.find(v => v.voiceURI === voiceURI);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        // Use default voice for the language if preferred voice not found
        const defaultVoice = language === 'italian' 
          ? italianVoices[0] 
          : englishVoices[0];
        
        if (defaultVoice) {
          utterance.voice = defaultVoice;
          utterance.lang = defaultVoice.lang;
        }
      }
      
      // Set rate and pitch
      utterance.rate = voicePreference.voiceRate;
      utterance.pitch = voicePreference.voicePitch;
      
      // Speak the text
      synth.cancel(); // Cancel any ongoing speech
      synth.speak(utterance);
    }
  };

  if (isLoading) {
    return <div>Loading voice options...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Voice Preferences</h3>
        
        {/* Italian Voice Selection */}
        <div className="mb-4">
          <Label htmlFor="italian-voice" className="mb-2 block">Italian Voice</Label>
          <div className="flex items-center space-x-2">
            <Select 
              value={voicePreference.italianVoiceURI || ''} 
              onValueChange={(value) => handleVoiceChange('italian', value)}
            >
              <SelectTrigger id="italian-voice" className="w-full">
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
                  <SelectItem value="none" disabled>No Italian voices available</SelectItem>
                )}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={() => testVoice('italian')}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm"
              disabled={!voicePreference.italianVoiceURI && italianVoices.length === 0}
            >
              Test
            </button>
          </div>
        </div>
        
        {/* English Voice Selection */}
        <div className="mb-4">
          <Label htmlFor="english-voice" className="mb-2 block">English Voice</Label>
          <div className="flex items-center space-x-2">
            <Select 
              value={voicePreference.englishVoiceURI || ''} 
              onValueChange={(value) => handleVoiceChange('english', value)}
            >
              <SelectTrigger id="english-voice" className="w-full">
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
                  <SelectItem value="none" disabled>No English voices available</SelectItem>
                )}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={() => testVoice('english')}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm"
              disabled={!voicePreference.englishVoiceURI && englishVoices.length === 0}
            >
              Test
            </button>
          </div>
        </div>
        
        {/* Rate Control */}
        <div className="mb-4">
          <Label htmlFor="rate-slider" className="mb-2 block">
            Speech Rate: {voicePreference.voiceRate.toFixed(1)}
          </Label>
          <Slider
            id="rate-slider"
            min={0.5}
            max={2}
            step={0.1}
            value={[voicePreference.voiceRate]}
            onValueChange={handleRateChange}
          />
        </div>
        
        {/* Pitch Control */}
        <div>
          <Label htmlFor="pitch-slider" className="mb-2 block">
            Speech Pitch: {voicePreference.voicePitch.toFixed(1)}
          </Label>
          <Slider
            id="pitch-slider"
            min={0.5}
            max={2}
            step={0.1}
            value={[voicePreference.voicePitch]}
            onValueChange={handlePitchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VoicePreferences;
