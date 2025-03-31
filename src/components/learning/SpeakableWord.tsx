
import React, { useState, useEffect } from 'react';
import { useAIUtils } from '@/hooks/useAIUtils';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SpeakableWordProps } from '@/types';

const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  language = 'it',
  className = '',
  showTooltip = false,
  tooltipContent,
  onPlayComplete,
  autoPlay = false,
  size = 'sm',
  onClick,
  iconOnly = false
}) => {
  const { speak } = useAIUtils();
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const handleSpeak = async () => {
    if (isSpeaking || !speak) return;
    
    setIsSpeaking(true);
    try {
      if (onClick) {
        onClick();
      }
      
      // Map language codes to proper values
      const languageValue = language === 'it' ? 'italian' : 'english';
      
      await speak(word, languageValue);
      if (onPlayComplete) {
        onPlayComplete();
      }
    } catch (error) {
      console.error('Error speaking word:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  // Trigger autoplay if enabled
  useEffect(() => {
    if (autoPlay) {
      handleSpeak();
    }
  }, [word, autoPlay]);
  
  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'text-lg px-3 py-2';
      case 'md':
        return 'text-md px-2 py-1.5';
      case 'sm':
      default:
        return 'text-sm px-2 py-1';
    }
  };
  
  const button = (
    <Button
      variant="ghost"
      size="sm"
      className={cn(`px-2 ${getSizeClasses()}`, className)}
      onClick={handleSpeak}
      disabled={isSpeaking}
    >
      {isSpeaking ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <Volume2 className={`h-4 w-4 ${!iconOnly ? 'mr-1' : ''} ${isSpeaking ? 'animate-pulse' : ''}`} />
      )}
      {!iconOnly && word}
    </Button>
  );
  
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            {tooltipContent || "Click to hear pronunciation"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return button;
};

export default SpeakableWord;
