
import React, { useState } from 'react';
import { Volume2, Volume1, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SpeakableWordProps {
  word: string;
  language?: string;
  autoPlay?: boolean;
  className?: string;
}

const SpeakableWord: React.FC<SpeakableWordProps> = ({ 
  word, 
  language = 'it-IT', 
  autoPlay = false,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (autoPlay) {
      speakWord();
    }
  }, [word, autoPlay]);

  const speakWord = () => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    // Don't try to speak if already speaking
    if (isPlaying) return;
    
    setIsLoading(true);
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    
    // Set language - use 'it-IT' for Italian, 'en-US' for English, etc.
    const langCode = language === 'it' ? 'it-IT' : language === 'en' ? 'en-US' : language;
    utterance.lang = langCode;
    
    // Set voice (optional - will use default if not found)
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
      console.error('Error speaking word');
    };
    
    // Speak the word
    window.speechSynthesis.speak(utterance);
  };

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span>{word}</span>
      <Button
        variant="ghost"
        size="icon"
        className="ml-1 h-6 w-6 rounded-full"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          speakWord();
        }}
        title={`Speak ${word}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <Volume1 className="h-4 w-4" />
        )}
      </Button>
    </span>
  );
};

export default SpeakableWord;
