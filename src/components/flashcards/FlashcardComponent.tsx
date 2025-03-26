
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlashcardComponentProps } from '@/types/interface-fixes';
import { ArrowUpDown, Check, X, Volume } from 'lucide-react';

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  flashcard,
  onRating,
  onSkip,
  flipped,
  onFlip,
  showPronunciation = false,
  showActions = true,
  onKnown,
  onUnknown,
  className = ''
}) => {
  const handleRating = (rating: number) => {
    onRating(flashcard.id, rating);
  };

  const handleSkip = () => {
    onSkip(flashcard.id);
  };

  const handleKnown = () => {
    if (onKnown) onKnown(flashcard.id);
  };

  const handleUnknown = () => {
    if (onUnknown) onUnknown(flashcard.id);
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <Card 
        className={`relative h-56 cursor-pointer transition-all duration-500 ${
          flipped ? 'bg-primary/5' : 'bg-card'
        }`}
        onClick={onFlip}
      >
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          {flashcard.tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <CardContent className="flex items-center justify-center h-full p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">
              {flipped ? flashcard.english : flashcard.italian}
            </h3>
            {flipped && flashcard.explanation && (
              <p className="text-muted-foreground mt-2">{flashcard.explanation}</p>
            )}
            
            {showPronunciation && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  // Placeholder for pronunciation functionality
                  console.log('Pronounce:', flipped ? flashcard.english : flashcard.italian);
                }}
              >
                <Volume className="h-4 w-4 mr-2" />
                Pronounce
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {showActions && (
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handleSkip}>
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Skip
          </Button>
          
          <div className="flex gap-2">
            {onUnknown ? (
              <Button 
                variant="outline" 
                className="border-red-200 hover:bg-red-50"
                onClick={handleUnknown}
              >
                <X className="h-4 w-4 mr-2 text-red-500" />
                Don't Know
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="border-red-200 hover:bg-red-50"
                onClick={() => handleRating(1)}
              >
                <X className="h-4 w-4 mr-2 text-red-500" />
                Hard
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="border-yellow-200 hover:bg-yellow-50"
              onClick={() => handleRating(2)}
            >
              <X className="h-4 w-4 mr-2 text-yellow-500" />
              Medium
            </Button>
            
            {onKnown ? (
              <Button 
                variant="outline"
                className="border-green-200 hover:bg-green-50"
                onClick={handleKnown}
              >
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Know It
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="border-green-200 hover:bg-green-50"
                onClick={() => handleRating(4)}
              >
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Easy
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardComponent;
