
import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, RotateCcw, Check, X } from 'lucide-react';

interface FlashcardItem {
  id: string;
  front: string;
  back: string;
}

interface FlashcardDeckProps {
  flashcards: FlashcardItem[];
  onComplete?: (results: { correct: number; incorrect: number; total: number }) => void;
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ flashcards, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const totalCards = flashcards.length;
  const progress = ((currentIndex) / totalCards) * 100;

  useEffect(() => {
    if (currentIndex >= totalCards && totalCards > 0) {
      setIsComplete(true);
      if (onComplete) {
        onComplete({
          correct: correctCount,
          incorrect: incorrectCount,
          total: totalCards
        });
      }
    }
  }, [currentIndex, totalCards, correctCount, incorrectCount, onComplete]);

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsComplete(false);
  };

  const handleMarkCorrect = () => {
    setCorrectCount(correctCount + 1);
    handleNext();
  };

  const handleMarkIncorrect = () => {
    setIncorrectCount(incorrectCount + 1);
    handleNext();
  };

  if (totalCards === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-muted-foreground">No flashcards available.</p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="text-center p-8 space-y-6">
        <h3 className="text-2xl font-bold">Review Complete!</h3>
        
        <div className="space-y-2">
          <p className="text-lg">You've reviewed all {totalCards} flashcards.</p>
          <div className="flex justify-center space-x-8 mt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{correctCount}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">{incorrectCount}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalCards - correctCount - incorrectCount}</div>
              <div className="text-sm text-muted-foreground">Skipped</div>
            </div>
          </div>
        </div>
        
        <Button onClick={handleReset} className="mt-6">
          <RotateCcw className="mr-2 h-4 w-4" />
          Restart Deck
        </Button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Card {currentIndex + 1} of {totalCards}</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center"><Check className="h-4 w-4 text-success mr-1" /> {correctCount}</span>
            <span className="flex items-center"><X className="h-4 w-4 text-destructive mr-1" /> {incorrectCount}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Flashcard
        front={currentCard.front}
        back={currentCard.back}
        onMarkCorrect={handleMarkCorrect}
        onMarkIncorrect={handleMarkIncorrect}
      />
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          onClick={handleNext}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
