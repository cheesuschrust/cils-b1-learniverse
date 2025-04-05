
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge-fixed';
import { Edit, Trash, RotateCw, Check, X, Volume } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlashcardComponentProps } from '@/types';
import SpeakableWord from './SpeakableWord';

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  card,
  onUpdate,
  onDelete,
  showActions = true,
  onRating,
  onSkip,
  flipped = false,
  onFlip,
  showPronunciation = false,
  className = '',
  showHints = false,
  onKnown,
  onUnknown,
}) => {
  const [isFlipped, setIsFlipped] = useState(flipped);

  const handleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) {
      onUpdate(card);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(card.id);
    }
  };

  const handleRating = (rating: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRating) {
      onRating(rating);
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSkip) {
      onSkip();
    }
  };

  const handleKnown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onKnown) {
      onKnown();
    }
  };

  const handleUnknown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUnknown) {
      onUnknown();
    }
  };

  // Determine which content to display
  const frontContent = card.front || card.italian || '';
  const backContent = card.back || card.english || '';
  
  // Get any language tags for the card
  const languageTags = card.tags?.filter(tag => 
    ['italian', 'english', 'beginner', 'intermediate', 'advanced'].includes(tag.toLowerCase())
  );

  return (
    <Card 
      className={cn(
        "border shadow-md cursor-pointer transition-all duration-300 transform-gpu perspective-1000", 
        isFlipped ? "rotate-y-180" : "",
        className
      )}
      onClick={handleFlip}
    >
      <div className={cn(
        "relative h-full w-full transition-all duration-500 transform-gpu backface-hidden",
        isFlipped ? "rotate-y-180 absolute inset-0" : ""
      )}>
        <CardContent className={cn(
          "p-6 pt-8 h-full flex flex-col space-y-4",
          isFlipped ? "hidden" : ""
        )}>
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-2">
              {card.level !== undefined && (
                <Badge variant={card.mastered ? "success" : "secondary"}>
                  Level {card.level}
                </Badge>
              )}
              {languageTags?.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            {showActions && (
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={handleDelete}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-2">{frontContent}</h3>
              {showPronunciation && (
                <SpeakableWord 
                  word={frontContent} 
                  language="italian"
                  size="large"
                />
              )}
              {showHints && card.examples && card.examples.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Example: {card.examples[0]}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center space-x-2">
            {onSkip && (
              <Button variant="outline" size="sm" onClick={handleSkip}>
                Skip
              </Button>
            )}
            {onRating && (
              <div className="space-x-2">
                <Button variant="destructive" size="sm" onClick={handleRating(1)}>
                  Hard
                </Button>
                <Button variant="default" size="sm" onClick={handleRating(3)}>
                  Good
                </Button>
                <Button variant="success" size="sm" onClick={handleRating(5)}>
                  Easy
                </Button>
              </div>
            )}
            {onKnown && onUnknown && (
              <div className="space-x-2">
                <Button variant="destructive" size="sm" onClick={handleUnknown}>
                  <X className="h-4 w-4 mr-1" />
                  Don't Know
                </Button>
                <Button variant="success" size="sm" onClick={handleKnown}>
                  <Check className="h-4 w-4 mr-1" />
                  Know It
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardContent className={cn(
          "p-6 pt-8 h-full flex flex-col",
          !isFlipped ? "hidden" : ""
        )}>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold mb-4">{backContent}</h3>
            {showPronunciation && (
              <SpeakableWord 
                word={backContent} 
                language="english"
                size="large"
              />
            )}
            
            {card.explanation && (
              <div className="mt-4 text-sm text-muted-foreground max-w-md">
                <p className="font-semibold">Explanation:</p>
                <p>{card.explanation}</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="mt-4 self-center"
            onClick={handleFlip}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Flip Card
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default FlashcardComponent;
