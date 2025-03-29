
import React, { useState, useEffect } from 'react';
import { Volume2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { speak, isSpeechSupported, stopSpeaking } from '@/utils/textToSpeech';
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
  showTooltip?: boolean;
  tooltipContent?: string;
  onPlayComplete?: () => void;
}

const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  language = 'it',
  className = '',
  onClick,
  disabled = false,
  autoPlay = false,
  size = 'default',
  showTooltip = true,
  tooltipContent,
  onPlayComplete
}) => {
  const { toast } = useToast();
  const { voicePreference, autoPlayAudio } = useUserPreferences();
  const { isAIEnabled, speakText, isSpeaking, cancelSpeech } = useAIUtils();
  const [error, setError] = useState<string | null>(null);
  
  // Check if speech is supported
  const speechSupported = isSpeechSupported();

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        cancelSpeech();
      }
    };
  }, [isSpeaking, cancelSpeech]);

  // Auto-play functionality - controlled by user preference
  useEffect(() => {
    // Only auto-play if explicitly set to true AND user preference is true
    // And only if AI is enabled and speech is supported
    if (autoPlay && autoPlayAudio && isAIEnabled && speechSupported && word) {
      handleSpeak(null);
    }
  }, [word, autoPlay, autoPlayAudio, isAIEnabled, speechSupported]); 

  const handleSpeak = async (e: React.MouseEvent | null) => {
    if (e) {
      e.stopPropagation(); // Prevent triggering the parent onClick
    }
    
    if (!speechSupported) {
      setError("Your browser doesn't support text-to-speech.");
      toast({
        title: "Speech Not Supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isAIEnabled) {
      setError("AI features are disabled.");
      toast({
        title: "AI Features Disabled",
        description: "Enable AI features in settings to use text-to-speech.",
        variant: "destructive"
      });
      return;
    }
    
    if (isSpeaking || disabled || !word) return;
    
    setError(null);
    
    try {
      console.log(`Speaking word: "${word}" in ${language} language`);
      await speakText(word, language);
      if (onPlayComplete) {
        onPlayComplete();
      }
    } catch (error) {
      console.error('Error speaking word:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Speech Error",
        description: "Couldn't pronounce this word. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Determine button size classes
  const buttonSizeClass = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  const iconSizeClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  // If speech isn't supported and AI is disabled, just show the word without the button
  if (!speechSupported && !isAIEnabled) {
    return (
      <span className={className}>
        {word}
      </span>
    );
  }

  const tooltipText = tooltipContent || (
    error 
      ? `Error: ${error}` 
      : `Pronounce "${word}" in ${language === 'it' ? 'Italian' : 'English'}`
  );

  const renderButton = () => (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className={`ml-1 ${buttonSizeClass} ${isSpeaking ? 'opacity-100' : 'opacity-60 hover:opacity-100 focus:opacity-100'} ${error ? 'text-destructive' : isSpeaking ? 'text-primary' : ''}`}
      disabled={disabled || isSpeaking || !isAIEnabled || !speechSupported || !word}
      onClick={handleSpeak}
      aria-label={`Pronounce "${word}"`}
    >
      {error ? (
        <AlertCircle className={iconSizeClass} />
      ) : (
        <Volume2 className={`${iconSizeClass} ${isSpeaking ? 'animate-pulse text-primary' : ''}`} />
      )}
    </Button>
  );

  return (
    <span 
      className={`inline-flex items-center group relative ${className}`}
      onClick={onClick}
    >
      {word}
      
      {showTooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {renderButton()}
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        renderButton()
      )}
    </span>
  );
};

export default SpeakableWord;
