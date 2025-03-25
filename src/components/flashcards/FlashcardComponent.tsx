
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCw, Volume2, Check, X, Edit, Trash } from 'lucide-react';
import { Flashcard } from '@/types/flashcard';
import { cn } from '@/lib/utils';

interface FlashcardComponentProps {
  card: Flashcard;
  onFlip?: () => void;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showControls?: boolean;
  className?: string;
}

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  card,
  onFlip,
  onCorrect,
  onIncorrect,
  onEdit,
  onDelete,
  showControls = true,
  className
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    
    if (onFlip) {
      onFlip();
    }
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };
  
  const playAudio = (text: string, language: string) => {
    // In a real implementation, this would use the text-to-speech API
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'italian' ? 'it-IT' : 'en-US';
    speechSynthesis.speak(utterance);
  };
  
  return (
    <div className={cn("perspective-1000 w-full", className)}>
      <Card 
        className={cn(
          "w-full h-full transition-transform duration-300 transform-style-3d cursor-pointer relative",
          isFlipped ? "rotate-y-180" : "",
          isAnimating ? "pointer-events-none" : ""
        )}
        onClick={handleFlip}
      >
        {/* Front Side (Italian) */}
        <CardContent 
          className={cn(
            "absolute w-full h-full backface-hidden p-6 flex flex-col justify-between",
            isFlipped ? "invisible" : ""
          )}
        >
          <div className="flex justify-end">
            <Badge variant={card.mastered ? "default" : "outline"} className={card.mastered ? "bg-green-500" : ""}>
              {card.mastered ? "Mastered" : `Level ${card.level}`}
            </Badge>
          </div>
          
          <div className="flex-1 flex items-center justify-center flex-col gap-4 py-6">
            <h3 className="text-2xl font-bold text-center">{card.italian}</h3>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                playAudio(card.italian, 'italian');
              }}
            >
              <Volume2 className="h-5 w-5 text-primary" />
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Click to reveal translation
          </div>
        </CardContent>
        
        {/* Back Side (English) */}
        <CardContent 
          className={cn(
            "absolute w-full h-full backface-hidden p-6 rotate-y-180 flex flex-col justify-between",
            !isFlipped ? "invisible" : ""
          )}
        >
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                playAudio(card.english, 'english');
              }}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center flex-col gap-4 py-6">
            <h3 className="text-2xl font-bold text-center">{card.english}</h3>
            {card.explanation && (
              <p className="text-sm text-muted-foreground text-center">{card.explanation}</p>
            )}
          </div>
          
          {showControls && (
            <div className="flex justify-center gap-2">
              {onIncorrect && (
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full bg-destructive/10 hover:bg-destructive/20 border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIncorrect();
                  }}
                >
                  <X className="h-5 w-5 text-destructive" />
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
              >
                <RotateCw className="h-5 w-5" />
              </Button>
              
              {onCorrect && (
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full bg-green-500/10 hover:bg-green-500/20 border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCorrect();
                  }}
                >
                  <Check className="h-5 w-5 text-green-500" />
                </Button>
              )}
            </div>
          )}
          
          {onEdit && onDelete && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlashcardComponent;
