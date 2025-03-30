
import React, { useState } from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface SpeakableWordProps {
  word: string;
  language?: 'en' | 'it';
  showIcon?: boolean;
  className?: string;
  iconOnly?: boolean;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
}

const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  language = 'it',
  showIcon = true,
  className = '',
  iconOnly = false,
  buttonVariant = 'ghost',
  buttonSize = 'sm'
}) => {
  const { speak } = useAIUtils();
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const handleSpeak = async () => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      await speak(word, language);
    } catch (error) {
      console.error('Error speaking word:', error);
    } finally {
      setIsSpeaking(false);
    }
  };
  
  if (iconOnly) {
    return (
      <Button 
        variant={buttonVariant} 
        size="icon" 
        className={className}
        onClick={handleSpeak}
        disabled={isSpeaking}
        title={`Speak ${word}`}
        aria-label={`Speak ${word}`}
      >
        <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
      </Button>
    );
  }
  
  return (
    <Button
      variant={buttonVariant}
      size={buttonSize}
      className={`px-2 ${className}`}
      onClick={handleSpeak}
      disabled={isSpeaking}
    >
      {showIcon && <Volume2 className={`h-4 w-4 mr-1 ${isSpeaking ? 'animate-pulse' : ''}`} />}
      {word}
    </Button>
  );
};

export default SpeakableWord;
