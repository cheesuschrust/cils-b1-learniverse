
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Volume2 } from 'lucide-react';
import { SpeakableWordProps } from '@/types/interface-fixes';
import { useToast } from '@/hooks/use-toast';
import { useAIUtils } from '@/hooks/useAIUtils';

const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  language = 'italian',
  className = '',
  showTooltip = false,
  tooltipContent = 'Listen to pronunciation',
  onPlayComplete,
  autoPlay = false,
  size = 'md',
  onClick,
  iconOnly = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const { speak, isAIEnabled } = useAIUtils();
  
  const handlePlay = async () => {
    if (isPlaying) return;
    
    if (!isAIEnabled) {
      toast({
        title: "Speech unavailable",
        description: "Text-to-speech is currently disabled",
        variant: "warning",
      });
      return;
    }
    
    try {
      setIsPlaying(true);
      
      if (onClick) {
        onClick();
      }
      
      await speak(word, language);
      
      if (onPlayComplete) {
        onPlayComplete();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      toast({
        title: "Playback error",
        description: "Failed to play the pronunciation",
        variant: "destructive",
      });
    } finally {
      setIsPlaying(false);
    }
  };
  
  // Auto-play on mount if enabled
  React.useEffect(() => {
    if (autoPlay && word && !isPlaying) {
      handlePlay();
    }
  }, [autoPlay, word]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const iconSizeClass = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;
  
  const renderButton = () => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`p-1 ${className}`}
      onClick={handlePlay}
      disabled={isPlaying}
    >
      <Volume2 className={iconSizeClass} />
      {!iconOnly && <span className="ml-1">{word}</span>}
    </Button>
  );
  
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {renderButton()}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return renderButton();
};

export default SpeakableWord;
