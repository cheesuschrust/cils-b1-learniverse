
import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speak, isSpeechSupported } from '@/utils/textToSpeech';
import { useToast } from '@/components/ui/use-toast';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAIUtils } from '@/contexts/AIUtilsContext';

interface SpeakableWordProps {
  word: string;
  language?: 'it' | 'en';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  autoPlay?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  language = 'it',
  className = '',
  onClick,
  disabled = false,
  autoPlay = false,
  size = 'default'
}) => {
  const { toast } = useToast();
  const { voicePreference, autoPlayAudio } = useUserPreferences();
  const { isAIEnabled } = useAIUtils();
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Check if speech is supported
  const speechSupported = isSpeechSupported();

  // Auto-play functionality - controlled by user preference
  useEffect(() => {
    // Only auto-play if explicitly set to true AND user preference is true
    // And only if AI is enabled
    if (autoPlay && autoPlayAudio && isAIEnabled && word) {
      handleSpeak(null);
    }
  }, [word, autoPlay, autoPlayAudio, isAIEnabled]); 

  const handleSpeak = async (e: React.MouseEvent | null) => {
    if (e) {
      e.stopPropagation(); // Prevent triggering the parent onClick
    }
    
    if (!speechSupported || !isAIEnabled) {
      toast({
        title: "Speech Not Supported",
        description: speechSupported 
          ? "AI features are currently disabled. Enable them in settings to use text-to-speech."
          : "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      return;
    }
    
    if (isSpeaking || disabled || !word) return;
    
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

  // Determine button size classes
  const buttonSizeClass = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  const iconSizeClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  if (!speechSupported && !isAIEnabled) {
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
        className={`ml-1 ${buttonSizeClass} opacity-60 hover:opacity-100 focus:opacity-100 ${isSpeaking ? 'text-primary' : ''}`}
        disabled={disabled || isSpeaking || !isAIEnabled || !word}
        onClick={handleSpeak}
        title={`Pronounce "${word}"`}
      >
        <Volume2 className={`${iconSizeClass} ${isSpeaking ? 'animate-pulse text-primary' : ''}`} />
      </Button>
    </span>
  );
};

export default SpeakableWord;
