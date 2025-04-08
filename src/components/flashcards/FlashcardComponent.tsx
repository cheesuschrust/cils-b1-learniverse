
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FlashcardComponentProps {
  card: {
    id: string;
    front: string;
    back: string;
    hint?: string;
    examples?: string[];
    difficulty?: number;
  };
  onRating?: (rating: number) => void;
  onSkip?: () => void;
  onUnknown?: () => void;
  flipped?: boolean;
  onFlip?: () => void;
  showActions?: boolean;
  showHints?: boolean;
}

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  card,
  onRating,
  onSkip,
  onUnknown,
  flipped = false,
  onFlip,
  showActions = false,
  showHints = false
}) => {
  const [isFlipped, setIsFlipped] = useState(flipped);
  const [showExample, setShowExample] = useState(false);
  
  const handleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setIsFlipped(!isFlipped);
    }
  };
  
  const getDifficultyColor = (difficulty: number = 1) => {
    switch(difficulty) {
      case 1: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 2: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 3: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 4: return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 5: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <motion.div 
        className="relative w-full h-72 sm:h-80 cursor-pointer preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
        onClick={handleFlip}
      >
        {/* Front Card */}
        <Card className={cn(
          "absolute w-full h-full backface-hidden",
          isFlipped ? 'invisible' : 'visible'
        )}>
          <CardContent className="flex flex-col h-full p-6">
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <h3 className="text-2xl font-medium mb-2">{card.front}</h3>
                {card.difficulty !== undefined && (
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(card.difficulty)}
                    >
                      Level {card.difficulty}
                    </Badge>
                  </div>
                )}
                {showHints && card.hint && (
                  <button 
                    className="text-sm text-primary hover:underline mt-4 block mx-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowExample(!showExample);
                    }}
                  >
                    {showExample ? 'Hide hint' : 'Show hint'}
                  </button>
                )}
                {showExample && card.hint && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    Hint: {card.hint}
                  </p>
                )}
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Click to flip
            </div>
          </CardContent>
        </Card>

        {/* Back Card */}
        <Card 
          className={cn(
            "absolute w-full h-full backface-hidden",
            !isFlipped ? 'invisible' : 'visible'
          )} 
          style={{ transform: 'rotateY(180deg)' }}
        >
          <CardContent className="flex flex-col h-full p-6">
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <h3 className="text-2xl font-medium mb-2">{card.back}</h3>
                {card.examples && card.examples.length > 0 && (
                  <div className="mt-4 text-sm">
                    <p className="font-medium mb-1">Examples:</p>
                    <ul className="text-muted-foreground">
                      {card.examples.map((example, index) => (
                        <li key={index} className="mb-1">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {showActions && (
              <div className="mt-4">
                {onUnknown && (
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full bg-red-100 hover:bg-red-200 text-red-800 border-red-300 hover:border-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnknown();
                      }}
                    >
                      Don't Know
                    </Button>
                    {onSkip && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSkip();
                        }}
                      >
                        Skip
                      </Button>
                    )}
                  </div>
                )}
                
                {onRating && (
                  <div className="mt-2">
                    <p className="text-sm text-center mb-2">How well did you know this?</p>
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "flex-1",
                            rating === 1 && "bg-red-100 hover:bg-red-200 text-red-800 border-red-300",
                            rating === 2 && "bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300",
                            rating === 3 && "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300",
                            rating === 4 && "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300",
                            rating === 5 && "bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRating(rating);
                          }}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!showActions && (
              <div className="text-center text-sm text-muted-foreground">
                Click to flip back
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FlashcardComponent;
