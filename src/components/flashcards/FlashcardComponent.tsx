
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlashcardComponentProps } from '@/types/interface-fixes';

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  flashcard,
  card, // Legacy support
  onFlip,
  onNext,
  onPrevious,
  onMark,
  onRating, // Legacy support
  onSkip, // Legacy support
  flipped = false, // Legacy support
  showControls = true,
  showHints = false,
  showPronunciation = false, // Legacy support
  showActions = true, // Legacy support
  onKnown, // Legacy support
  onUnknown, // Legacy support
  className = '', // Legacy support
  autoFlip = false,
  frontLabel = 'Italian',
  backLabel = 'English'
}) => {
  // Handle both new flashcard and legacy card prop
  const actualCard = flashcard || card;
  
  if (!actualCard) {
    return <div>No flashcard data available</div>;
  }

  // Determine front and back content
  const frontContent = actualCard.front || actualCard.italian || '';
  const backContent = actualCard.back || actualCard.english || '';
  
  const [isFlipped, setIsFlipped] = useState(flipped);

  useEffect(() => {
    setIsFlipped(flipped);
  }, [flipped]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) onFlip();
  };

  const handleMark = (status: 'correct' | 'incorrect' | 'hard') => {
    if (onMark) onMark(status);
    
    // Legacy support
    if (status === 'correct' && onKnown) onKnown();
    if (status === 'incorrect' && onUnknown) onUnknown();
    if (onRating) {
      const ratingMap = { correct: 5, hard: 3, incorrect: 1 };
      onRating(ratingMap[status]);
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto overflow-hidden ${className}`}>
      <CardContent 
        className={`p-6 cursor-pointer h-64 flex flex-col justify-between transition-all duration-300`}
        onClick={handleFlip}
      >
        <div className="text-center mb-2 text-sm text-gray-500">
          {isFlipped ? backLabel : frontLabel}
        </div>
        
        <div className="flex-grow flex items-center justify-center text-2xl font-semibold">
          {isFlipped ? backContent : frontContent}
        </div>
        
        {showHints && actualCard.examples && actualCard.examples.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 italic">
            <p>Example: {actualCard.examples[0]}</p>
          </div>
        )}
        
        {showControls && (
          <div className="mt-4 flex justify-between space-x-2">
            {onPrevious && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onPrevious(); 
                }}
              >
                Previous
              </Button>
            )}
            
            {showActions && (
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleMark('incorrect');
                  }}
                >
                  Don't Know
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleMark('hard'); 
                  }}
                >
                  Hard
                </Button>
                
                <Button
                  variant="success"
                  size="sm"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleMark('correct'); 
                  }}
                >
                  Know
                </Button>
              </div>
            )}
            
            {onNext && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onNext(); 
                }}
              >
                Next
              </Button>
            )}
            
            {onSkip && (
              <Button 
                variant="ghost" 
                size="sm" 
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
      </CardContent>
    </Card>
  );
};

export default FlashcardComponent;
