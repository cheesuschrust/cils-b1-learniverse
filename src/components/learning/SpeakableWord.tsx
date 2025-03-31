
import React, { useState } from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SpeakableWordProps } from '@/types/type-definitions';

const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  language = 'it',
  className = '',
  showTooltip = false,
  tooltipContent,
  onPlayComplete,
  autoPlay = false,
  size = 'sm',
  onClick
}) => {
  const { speakText } = useAIUtils();
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const handleSpeak = async () => {
    if (isSpeaking || !speakText) return;
    
    setIsSpeaking(true);
    try {
      if (onClick) {
        onClick();
      }
      
      await speakText(word, language, () => {
        if (onPlayComplete) {
          onPlayComplete();
        }
      });
    } catch (error) {
      console.error('Error speaking word:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  // Trigger autoplay if enabled
  React.useEffect(() => {
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
        <Volume2 className={`h-4 w-4 mr-1 ${isSpeaking ? 'animate-pulse' : ''}`} />
      )}
      {word}
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
