import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume2, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIUtils } from '@/hooks/useAIUtils';
import { VoicePreference } from '@/types/core-types';

// Helper function to get available voices
const getAvailableVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
};

// Mock useUserPreferences hook for this component
const useUserPreferences = () => {
  const [voicePreference, setVoicePreference] = useState<VoicePreference>({
    englishVoiceURI: '',
    italianVoiceURI: '',
    voiceRate: 1.0,
    voicePitch: 1.0
  });

  return { voicePreference, setVoicePreference };
};

const VoicePreferences = () => {
  const { voicePreference, setVoicePreference } = useUserPreferences();
  const { toast } = useToast();
  const { speak } = useAIUtils();
  
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [italianVoices, setItalianVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedEnglishVoiceURI, setSelectedEnglishVoiceURI] = useState(voicePreference.englishVoiceURI);
  const [selectedItalianVoiceURI, setSelectedItalianVoiceURI] = useState(voicePreference.italianVoiceURI);
  const [voiceRate, setVoiceRate] = useState(voicePreference.voiceRate);
  const [voicePitch, setVoicePitch] = useState(voicePreference.voicePitch);
  const [loading, setLoading] = useState(true);
  
  // Load available voices when component mounts
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
        
        // Set default voices if none are selected
        if (!selectedEnglishVoiceURI && enVoices.length > 0) {
          setSelectedEnglishVoiceURI(enVoices[0].voiceURI);
        }
        
        if (!selectedItalianVoiceURI && itVoices.length > 0) {
          setSelectedItalianVoiceURI(itVoices[0].voiceURI);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading voices:", error);
        setLoading(false);
      }
    };
    
    loadVoices();
  }, [selectedEnglishVoiceURI, selectedItalianVoiceURI]);
  
  // Handle voice preview
  const handlePreview = async (language: 'en' | 'it') => {
    const sampleText = language === 'en' 
      ? "This is a preview of the English voice."
      : "Questo è un'anteprima della voce italiana.";
    
    try {
      await speak(sampleText, language);
      
    } catch (error) {
      console.error("Error playing voice preview:", error);
      toast({
        title: "Voice Preview Error",
        description: "There was a problem playing the voice preview.",
        variant: "destructive"
      });
    }
  };
  
  // Apply voice settings
  const applySettings = () => {
    const newPreferences: VoicePreference = {
      englishVoiceURI: selectedEnglishVoiceURI,
      italianVoiceURI: selectedItalianVoiceURI,
      voiceRate,
      voicePitch
    };
    
    setVoicePreference(newPreferences);
    
    toast({
      title: "Voice Settings Updated",
      description: "Your voice preferences have been saved."
    });
  };
  
  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading voice options...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base flex items-center">
            <Volume2 className="h-4 w-4 mr-2" />
            English Voice
          </Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handlePreview('en')}
            className="h-8 w-8 p-0"
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
        
        <Select
          value={selectedEnglishVoiceURI || ''}
          onValueChange={setSelectedEnglishVoiceURI}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select English voice" />
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
          <Label className="text-base flex items-center">
            <Volume2 className="h-4 w-4 mr-2" />
            Italian Voice
          </Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handlePreview('it')}
            className="h-8 w-8 p-0"
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
        
        <Select
          value={selectedItalianVoiceURI || ''}
          onValueChange={setSelectedItalianVoiceURI}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Italian voice" />
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
            <Label htmlFor="voice-rate" className="text-base">Voice Rate</Label>
            <span className="text-sm font-medium">{voiceRate.toFixed(1)}x</span>
          </div>
          <Slider 
            id="voice-rate"
            defaultValue={[voiceRate]} 
            max={2} 
            min={0.5} 
            step={0.1} 
            onValueChange={(value) => setVoiceRate(value[0])}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Adjust speech speed (0.5x - 2.0x)
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-pitch" className="text-base">Voice Pitch</Label>
            <span className="text-sm font-medium">{voicePitch.toFixed(1)}</span>
          </div>
          <Slider 
            id="voice-pitch"
            defaultValue={[voicePitch]} 
            max={2} 
            min={0.5} 
            step={0.1} 
            onValueChange={(value) => setVoicePitch(value[0])}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Adjust voice pitch (0.5 - 2.0)
          </p>
        </div>
      </div>
      
      <Button onClick={applySettings} className="w-full">
        Apply Voice Settings
      </Button>
    </div>
  );
};

export default VoicePreferences;
