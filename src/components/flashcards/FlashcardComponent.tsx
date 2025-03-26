
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flashcard } from '@/types/flashcard';
import { ArrowUpDown, Check, X } from 'lucide-react';

export interface FlashcardComponentProps {
  flashcard: Flashcard;
  onRating: (card: Flashcard, rating: number) => void;
  onSkip: () => void;
  flipped: boolean;
  onFlip: () => void;
}

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  flashcard,
  onRating,
  onSkip,
  flipped,
  onFlip
}) => {
  const handleRating = (rating: number) => {
    onRating(flashcard, rating);
  };

  return (
    <div className="w-full max-w-md mx-auto">
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
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onSkip}>
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Skip
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-red-200 hover:bg-red-50"
            onClick={() => handleRating(1)}
          >
            <X className="h-4 w-4 mr-2 text-red-500" />
            Hard
          </Button>
          
          <Button 
            variant="outline"
            className="border-yellow-200 hover:bg-yellow-50"
            onClick={() => handleRating(2)}
          >
            <X className="h-4 w-4 mr-2 text-yellow-500" />
            Medium
          </Button>
          
          <Button 
            variant="outline"
            className="border-green-200 hover:bg-green-50"
            onClick={() => handleRating(4)}
          >
            <Check className="h-4 w-4 mr-2 text-green-500" />
            Easy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardComponent;
