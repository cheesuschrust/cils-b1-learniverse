
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { SpeakableWordProps } from '@/types';

export const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  language = 'italian',
  className = '',
  showTooltip = true,
  tooltipContent = 'Listen to pronunciation',
  onPlayComplete,
  autoPlay = false,
  size = 'default',
  onClick,
  iconOnly = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { speak, isAIEnabled } = useAIUtils();

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }
    
    if (!isPlaying && word && speak) {
      setIsPlaying(true);
      try {
        await speak({ text: word, language });
        if (onPlayComplete) {
          onPlayComplete();
        }
      } catch (error) {
        console.error('Error playing audio:', error);
      } finally {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (autoPlay && word && speak) {
      handleClick();
    }
  }, [word, autoPlay]);

  const buttonSizeClass = 
    size === 'small' ? 'h-7 w-7 p-0' : 
    size === 'large' ? 'h-10 w-10 p-0' : 
    'h-9 w-9 p-0';
  
  const iconSizeClass = 
    size === 'small' ? 'h-3.5 w-3.5' : 
    size === 'large' ? 'h-5 w-5' : 
    'h-4 w-4';

  const button = (
    <Button
      type="button"
      variant="ghost"
      className={`${buttonSizeClass} rounded-full ${className}`}
      onClick={handleClick}
      disabled={isPlaying || !isAIEnabled}
    >
      <Volume className={`${iconSizeClass} ${isPlaying ? 'animate-pulse' : ''}`} />
      <span className="sr-only">Play pronunciation</span>
    </Button>
  );

  if (iconOnly) {
    return button;
  }

  return showTooltip ? (
    <div className="flex items-center">
      {!iconOnly && <span className="mr-1">{word}</span>}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ) : (
    <div className="flex items-center">
      {!iconOnly && <span className="mr-1">{word}</span>}
      {button}
    </div>
  );
};

export default SpeakableWord;
