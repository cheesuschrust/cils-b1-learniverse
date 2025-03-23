
import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speak, isSpeechSupported } from '@/utils/textToSpeech';
import { useToast } from '@/hooks/use-toast';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface SpeakableWordProps {
  word: string;
  language?: 'it' | 'en';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  language = 'it',
  className = '',
  onClick,
  disabled = false
}) => {
  const { toast } = useToast();
  const { voicePreference } = useUserPreferences();
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Check if speech is supported
  const speechSupported = isSpeechSupported();

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
    
    setIsSpeaking(true);
    
    try {
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
        disabled={disabled || isSpeaking}
        onClick={handleSpeak}
        title={`Pronounce "${word}"`}
      >
        <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse text-primary' : ''}`} />
      </Button>
    </span>
  );
};

export default SpeakableWord;
