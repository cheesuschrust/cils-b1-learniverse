
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speak } from '@/utils/textToSpeech';

const VoicePreferences = () => {
  const { voicePreference, setVoicePreference } = useUserPreferences();
  const [availableItalianVoices, setAvailableItalianVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [availableEnglishVoices, setAvailableEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const italianVoices = voices.filter(voice => voice.lang.includes('it'));
      const englishVoices = voices.filter(voice => voice.lang.includes('en'));
      
      setAvailableItalianVoices(italianVoices);
      setAvailableEnglishVoices(englishVoices);
    };
    
    if (window.speechSynthesis) {
      // Some browsers load voices asynchronously
      if (window.speechSynthesis.getVoices().length) {
        loadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);
  
  const handleVoiceChange = (language: 'italian' | 'english') => (voiceURI: string) => {
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
  
  const handleRateChange = (value: number[]) => {
    setVoicePreference({
      ...voicePreference,
      voiceRate: value[0]
    });
  };
  
  const handlePitchChange = (value: number[]) => {
    setVoicePreference({
      ...voicePreference,
      voicePitch: value[0]
    });
  };
  
  const playTestVoice = (language: 'it' | 'en') => {
    const testText = language === 'it' 
      ? "Ciao, questo è un test della voce in italiano." 
      : "Hello, this is a test of the English voice.";
      
    speak(testText, language, voicePreference);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium text-gray-800 mb-2">Italian Voice</h3>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Select
                value={voicePreference.italianVoiceURI || ''}
                onValueChange={handleVoiceChange('italian')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Italian voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableItalianVoices.length ? (
                    availableItalianVoices.map(voice => (
                      <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No Italian voices available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => playTestVoice('it')}
              disabled={!voicePreference.italianVoiceURI}
              className="flex-shrink-0"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-base font-medium text-gray-800 mb-2">English Voice</h3>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Select
                value={voicePreference.englishVoiceURI || ''}
                onValueChange={handleVoiceChange('english')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select English voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableEnglishVoices.length ? (
                    availableEnglishVoices.map(voice => (
                      <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No English voices available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => playTestVoice('en')}
              disabled={!voicePreference.englishVoiceURI}
              className="flex-shrink-0"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-rate" className="text-base">Speaking Rate</Label>
            <span className="text-sm font-medium text-gray-800">{voicePreference.voiceRate.toFixed(1)}x</span>
          </div>
          <Slider 
            id="voice-rate"
            defaultValue={[voicePreference.voiceRate]} 
            max={2} 
            min={0.5} 
            step={0.1} 
            onValueChange={handleRateChange}
            className="mt-2"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-pitch" className="text-base">Voice Pitch</Label>
            <span className="text-sm font-medium text-gray-800">{voicePreference.voicePitch.toFixed(1)}</span>
          </div>
          <Slider 
            id="voice-pitch"
            defaultValue={[voicePreference.voicePitch]} 
            max={2} 
            min={0.5} 
            step={0.1} 
            onValueChange={handlePitchChange}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default VoicePreferences;
