
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge-fixed';
import { cn } from '@/lib/utils';
import { FlashcardComponentProps, Flashcard } from '@/types';

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  card,
  onRating,
  onSkip,
  flipped = false,
  onFlip,
  showPronunciation = true,
  showActions = true,
  className,
  showHints = false,
  onKnown,
  onUnknown
}) => {
  const [isFlipped, setIsFlipped] = useState(flipped);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!initialLoad) {
      setIsFlipped(flipped);
    }
    setInitialLoad(false);
  }, [flipped, initialLoad]);

  const handleFlip = () => {
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    if (onFlip) {
      onFlip();
    }
  };

  const handleRating = (rating: number) => {
    if (onRating) {
      onRating(rating);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const handleUnknown = () => {
    if (onUnknown) {
      onUnknown();
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <Card
        className={cn(
          "w-full h-56 md:h-64 perspective-1000 cursor-pointer relative",
          isFlipped ? "flashcard-flipped" : ""
        )}
        onClick={handleFlip}
      >
        <div className="w-full h-full relative transform-style-3d transition-transform duration-500">
          {/* Front side */}
          <CardContent
            className={cn(
              "absolute w-full h-full backface-hidden p-6 flex flex-col justify-between",
              !isFlipped ? "z-10" : "z-0 rotate-y-180"
            )}
          >
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="text-xs font-normal">
                {card.tags && card.tags.length > 0 ? card.tags[0] : "Vocabulary"}
              </Badge>
              {card.level && (
                <Badge variant={card.mastered ? "success" : "secondary"} className="text-xs">
                  Level {card.level}
                </Badge>
              )}
            </div>
            
            <div className="text-center flex-grow flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2">{card.front || card.italian}</h3>
              
              {showHints && card.examples && card.examples.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2 italic">
                  {card.examples[0]}
                </p>
              )}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Click to reveal translation
            </div>
          </CardContent>

          {/* Back side */}
          <CardContent
            className={cn(
              "absolute w-full h-full backface-hidden p-6 bg-muted/30 rotate-y-180 flex flex-col justify-between",
              isFlipped ? "z-10" : "z-0"
            )}
          >
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="text-xs font-normal">
                Translation
              </Badge>
            </div>
            
            <div className="text-center flex-grow flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2">{card.back || card.english}</h3>
              
              {card.explanation && (
                <p className="text-sm mt-4 text-muted-foreground">
                  {card.explanation}
                </p>
              )}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Click to see the word again
            </div>
          </CardContent>
        </div>
      </Card>

      {showActions && (
        <div className="mt-4 flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={handleUnknown}>
            Don't Know
          </Button>

          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRating(rating);
                }}
                className="w-8 h-8 p-0"
              >
                {rating}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={handleSkip}>
            Skip
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlashcardComponent;
