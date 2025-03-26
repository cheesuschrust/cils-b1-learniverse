
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FlashcardComponentProps } from '@/types/interface-fixes';

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  card,
  onRating,
  onSkip,
  flipped = false,
  onFlip,
  showPronunciation = false,
  showActions = true,
  onKnown,
  onUnknown,
  className
}) => {
  const [isFlipped, setIsFlipped] = useState(flipped);
  
  // Use the card prop if provided, otherwise use flashcard prop for backward compatibility
  const flashcard = card;
  
  // Update internal state when the flipped prop changes
  useEffect(() => {
    setIsFlipped(flipped);
  }, [flipped]);
  
  // Handle card flip
  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    if (onFlip) onFlip();
  };
  
  // Handle card rating (1-5)
  const handleRate = (rating: number) => {
    if (onRating) onRating(flashcard, rating);
  };
  
  // Handle card skip
  const handleSkip = () => {
    if (onSkip) onSkip();
  };
  
  // Handle "I know this" button
  const handleKnown = () => {
    if (onKnown) onKnown();
  };
  
  // Handle "I don't know this" button
  const handleUnknown = () => {
    if (onUnknown) onUnknown();
  };
  
  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <Card
        className={cn(
          'relative h-60 w-full cursor-pointer transition-all duration-500',
          isFlipped ? 'shadow-lg' : 'shadow',
          className
        )}
        onClick={handleFlip}
      >
        <div className={cn(
          'absolute inset-0 w-full h-full transition-transform duration-500 transform-gpu backface-visibility-hidden',
          isFlipped ? 'rotate-y-180' : ''
        )}>
          {/* Front of the card (Italian) */}
          <div className="p-6 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="text-xs text-muted-foreground">Italian</div>
                <div className="flex flex-wrap gap-1">
                  {flashcard.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-medium text-center mt-4">{flashcard.italian}</h3>
              {flashcard.examples && flashcard.examples.length > 0 && (
                <p className="italic text-muted-foreground text-sm mt-4 text-center">
                  {flashcard.examples[0]}
                </p>
              )}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              {isFlipped ? 'Click to see Italian' : 'Click to see English'}
            </div>
          </div>
        </div>
        
        <div className={cn(
          'absolute inset-0 w-full h-full transition-transform duration-500 transform-gpu backface-visibility-hidden',
          !isFlipped ? 'rotate-y-180' : ''
        )}>
          {/* Back of the card (English) */}
          <div className="p-6 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">English</div>
              <h3 className="text-2xl font-medium text-center mt-4">{flashcard.english}</h3>
              
              {flashcard.explanation && (
                <p className="text-sm text-muted-foreground mt-4">
                  {flashcard.explanation}
                </p>
              )}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              {isFlipped ? 'Click to see Italian' : 'Click to see English'}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Card Actions */}
      {showActions && (
        <div className="mt-4 space-y-3">
          {/* Rating buttons (1-5) */}
          {onRating && (
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <Button
                  key={rating}
                  size="sm"
                  variant={rating <= 2 ? "destructive" : rating >= 4 ? "default" : "outline"}
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate(rating);
                  }}
                >
                  {rating}
                </Button>
              ))}
            </div>
          )}
          
          {/* Know/Don't know buttons */}
          {(onKnown || onUnknown) && (
            <div className="flex gap-2">
              {onUnknown && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnknown();
                  }}
                >
                  I don't know
                </Button>
              )}
              
              {onKnown && (
                <Button
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKnown();
                  }}
                >
                  I know this
                </Button>
              )}
            </div>
          )}
          
          {/* Skip button */}
          {onSkip && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
            >
              Skip
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardComponent;
