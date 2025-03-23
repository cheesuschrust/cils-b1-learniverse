
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speak, isSpeechSupported, stopSpeaking } from '@/utils/textToSpeech';
import { useToast } from '@/hooks/use-toast';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface SpeakableWordProps {
  word: string;
  language?: 'it' | 'en';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  autoPlay?: boolean;
}

const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  language = 'it',
  className = '',
  onClick,
  disabled = false,
  autoPlay = false
}) => {
  const { toast } = useToast();
  const { voicePreference } = useUserPreferences();
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Check if speech is supported
  const speechSupported = isSpeechSupported();

  // Handle auto-play only if explicitly enabled
  useEffect(() => {
    let isMounted = true;
    
    if (autoPlay && speechSupported && word && !disabled) {
      const playAudio = async () => {
        try {
          setIsSpeaking(true);
          await speak(word, language, voicePreference);
          if (isMounted) {
            setIsSpeaking(false);
          }
        } catch (error) {
          console.error('Error auto-playing audio:', error);
          if (isMounted) {
            setIsSpeaking(false);
          }
        }
      };
      
      // Add a small delay before auto-playing
      const timer = setTimeout(() => {
        playAudio();
      }, 500);
      
      return () => {
        isMounted = false;
        clearTimeout(timer);
        stopSpeaking();
      };
    }
    
    return () => {
      isMounted = false;
    };
  }, [autoPlay, word, language, disabled, speechSupported, voicePreference]);
  
  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    
    if (!speechSupported) {
      toast({
        title: "Speech Not Supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      return;
    }
    
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    
    if (disabled) return;
    
    setIsSpeaking(true);
    
    try {
      console.log(`Speaking word: "${word}" in ${language} language`);
      await speak(word, language, voicePreference);
    } catch (error) {
      console.error('Error speaking word:', error);
      toast({
        title: "Speech Error",
        description: "Couldn't pronounce this word. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  if (!speechSupported) {
    return (
      <span className={className}>
        {word}
      </span>
    );
  }

  return (
    <span 
      className={`inline-flex items-center group relative ${className}`}
      onClick={onClick}
    >
      {word}
      
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className={`ml-1 h-6 w-6 opacity-60 hover:opacity-100 focus:opacity-100 ${isSpeaking ? 'text-primary' : ''}`}
        disabled={disabled}
        onClick={handleSpeak}
        title={isSpeaking ? 'Stop pronunciation' : `Pronounce "${word}"`}
      >
        {isSpeaking ? (
          <VolumeX className="h-4 w-4 animate-pulse text-primary" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </span>
  );
};

export default SpeakableWord;
