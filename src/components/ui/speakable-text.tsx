
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useVoiceSystemContext } from '@/contexts/VoiceSystemContext';

export interface SpeakableTextProps {
  text: string;
  language?: 'en' | 'it';
  className?: string;
  showTooltip?: boolean;
  tooltipContent?: string;
  onPlayComplete?: () => void;
  autoPlay?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline' | 'link';
  iconOnly?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const SpeakableText: React.FC<SpeakableTextProps> = ({
  text,
  language = 'it',
  className = '',
  showTooltip = true,
  tooltipContent = 'Listen to pronunciation',
  onPlayComplete,
  autoPlay = false,
  size = 'default',
  variant = 'ghost',
  iconOnly = false,
  disabled = false,
  children,
}) => {
  const { speak, stopSpeaking, isSpeaking, isReady } = useVoiceSystemContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [thisTextPlaying, setThisTextPlaying] = useState(false);
  
  useEffect(() => {
    // Reset our playing state when the global speaking state changes
    if (!isSpeaking && isPlaying) {
      setIsPlaying(false);
      setThisTextPlaying(false);
      
      if (onPlayComplete && thisTextPlaying) {
        onPlayComplete();
      }
    }
  }, [isSpeaking, isPlaying, thisTextPlaying, onPlayComplete]);
  
  useEffect(() => {
    // Auto-play if enabled
    if (autoPlay && text && !isPlaying && isReady && !disabled) {
      handlePlayClick();
    }
  }, [text, autoPlay, isReady]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const handlePlayClick = async () => {
    if (isPlaying || !isReady || disabled) {
      return;
    }
    
    try {
      setIsPlaying(true);
      setThisTextPlaying(true);
      
      await speak(text, { language });
      
      // The effect will handle completion
    } catch (error) {
      console.error('Error playing speech:', error);
      setIsPlaying(false);
      setThisTextPlaying(false);
    }
  };
  
  const handleStopClick = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      setThisTextPlaying(false);
    }
  };
  
  const sizeClasses = {
    sm: 'h-7 w-7',
    default: 'h-9 w-9',
    lg: 'h-11 w-11'
  };
  
  const buttonSize = size === 'default' ? 'icon' : size;
  const sizeClass = sizeClasses[size as keyof typeof sizeClasses];
  
  const renderButton = () => (
    <Button
      type="button"
      variant={variant}
      size={buttonSize}
      className={cn(iconOnly ? sizeClass : '', 'rounded-full', className)}
      onClick={isPlaying ? handleStopClick : handlePlayClick}
      disabled={!isReady || disabled}
    >
      {isPlaying ? (
        <Volume className={cn("animate-pulse", iconOnly ? "" : "mr-2 h-4 w-4")} />
      ) : (
        <Volume className={cn(iconOnly ? "" : "mr-2 h-4 w-4")} />
      )}
      {!iconOnly && (isPlaying ? 'Stop' : 'Listen')}
    </Button>
  );
  
  const renderContent = () => {
    if (children) {
      return (
        <div className="flex items-center gap-2">
          {children}
          {iconOnly ? renderButton() : (
            <Button 
              variant={variant} 
              size={size} 
              onClick={isPlaying ? handleStopClick : handlePlayClick}
              disabled={!isReady || disabled}
              className={className}
            >
              {isPlaying ? (
                <>
                  <Volume className="mr-2 h-4 w-4 animate-pulse" />
                  Stop
                </>
              ) : (
                <>
                  <Volume className="mr-2 h-4 w-4" />
                  Listen
                </>
              )}
            </Button>
          )}
        </div>
      );
    }
    
    if (iconOnly) {
      return renderButton();
    }
    
    return (
      <div className="flex items-center gap-2">
        <span className={cn("font-medium", isPlaying ? "text-primary" : "")}>{text}</span>
        {renderButton()}
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
