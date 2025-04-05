
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAI } from '@/hooks/useAI';
import { SpeakableWordProps } from '@/types';

const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  language = 'it-IT',
  className,
  showTooltip = true,
  tooltipContent = 'Click to hear pronunciation',
  onPlayComplete,
  autoPlay = false,
  size = 'default',
  onClick,
  iconOnly = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { speak, isAIEnabled } = useAI();

  const handlePlay = async () => {
    if (!isAIEnabled || !speak || isPlaying || !word) return;
    
    setIsPlaying(true);
    
    try {
      await speak(word, { language });
      if (onPlayComplete) {
        onPlayComplete();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
    
    if (onClick) onClick();
  };

  React.useEffect(() => {
    if (autoPlay && !isPlaying && word) {
      handlePlay();
    }
  }, [word, autoPlay]); // eslint-disable-line react-hooks/exhaustive-deps

  const sizeClasses = {
    sm: 'h-6 w-6 p-0',
    default: 'h-8 w-8 p-0',
    lg: 'h-10 w-10 p-0'
  };

  const buttonSize = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default;
  
  const renderButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className={cn(buttonSize, 'rounded-full', className)}
      onClick={handlePlay}
      disabled={!isAIEnabled || isPlaying || !word}
    >
      {isPlaying ? <Volume2 className="animate-pulse" /> : <Volume />}
    </Button>
  );

  const renderContent = () => {
    if (iconOnly) {
      return renderButton();
    }
    
    return (
      <div className="flex items-center gap-2">
        {renderButton()}
        <span className="font-medium">{word}</span>
      </div>
    );
  };

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {renderContent()}
          </TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return renderContent();
};

export { SpeakableWord };
