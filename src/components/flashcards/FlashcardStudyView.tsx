
import React, { useState, useEffect } from 'react';
import { useFlashcards } from '@/contexts/FlashcardsContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, VolumeUp, X, Check, List, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import speak from '@/utils/textToSpeech';

interface FlashcardStudyViewProps {
  setId: string;
  onBack: () => void;
}

const FlashcardStudyView: React.FC<FlashcardStudyViewProps> = ({ setId, onBack }) => {
  const { getFlashcardSet, updateCardProgress } = useFlashcards();
  const [set, setSet] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const loadSet = async () => {
      try {
        const setData = await getFlashcardSet(setId);
        setSet(setData);
        
        // Filter for due cards or all cards if none are due
        let studyCards = setData.cards || [];
        const dueCards = studyCards.filter((card: any) => card.isDue);
        
        if (dueCards.length > 0) {
          studyCards = dueCards;
        }
        
        setCards(studyCards);
      } catch (error) {
        console.error('Error loading flashcard set:', error);
        toast({
          title: "Error",
          description: "Could not load flashcard set. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    loadSet();
  }, [setId, getFlashcardSet, toast]);

  useEffect(() => {
    if (cards.length > 0) {
      setProgress(((currentIndex + 1) / cards.length) * 100);
    }
  }, [currentIndex, cards.length]);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
    
    // Fisher-Yates shuffle
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setCards(shuffled);
    setIsShuffled(!isShuffled);
    toast({
      title: "Cards Shuffled",
      description: "The order of cards has been randomized."
    });
  };

  const handleCorrect = async () => {
    if (currentIndex >= cards.length - 1) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      setShowComplete(true);
      return;
    }
    
    try {
      // Update card progress in database
      await updateCardProgress(cards[currentIndex].id, true, 5);
      
      // Update local stats
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      
      // Move to next card
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error updating card progress:', error);
    }
  };

  const handleIncorrect = async () => {
    if (currentIndex >= cards.length - 1) {
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setShowComplete(true);
      return;
    }
    
    try {
      // Update card progress in database
      await updateCardProgress(cards[currentIndex].id, false, 1);
      
      // Update local stats
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      
      // Move to next card
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error updating card progress:', error);
    }
  };

  const handleSpeak = () => {
    const text = isFlipped 
      ? cards[currentIndex].back || cards[currentIndex].english
      : cards[currentIndex].front || cards[currentIndex].italian;
      
    const language = isFlipped ? 'en' : 'it';
    speak(text, language);
  };

  if (!set || cards.length === 0) {
    return (
      <div className="container py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <p className="text-center text-muted-foreground">
          Loading flashcards...
        </p>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="container py-8">
        <div className="flex mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sets
          </Button>
        </div>
        
        <Card className="max-w-md mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Session Complete!</h2>
          <p className="mb-6">You've completed studying this set.</p>
          
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="text-3xl font-bold text-green-500">{stats.correct}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">{stats.incorrect}</p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button onClick={() => {
              setIsFlipped(false);
              setCurrentIndex(0);
              setShowComplete(false);
              setStats({ correct: 0, incorrect: 0 });
            }}>
              Study Again
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Sets
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sets
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShuffle}>
            <Shuffle className="mr-2 h-4 w-4" /> Shuffle
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-1">{set.name}</h1>
        <p className="text-muted-foreground">{currentIndex + 1} of {cards.length} cards</p>
        <Progress value={progress} className="mt-2" />
      </div>
      
      <div 
        className={`
          relative w-full max-w-xl mx-auto h-80 rounded-xl transition-all duration-500 transform-gpu
          ${isFlipped ? 'rotate-y-180' : ''}
          cursor-pointer hover:shadow-lg
        `} 
        onClick={flipCard}
      >
        {/* Front Side */}
        <div 
          className={`
            absolute inset-0 flex flex-col items-center justify-center p-8 rounded-xl 
            bg-card backface-hidden border ${isFlipped ? 'invisible' : 'visible'}
          `}
        >
          <p className="text-sm text-muted-foreground mb-2">Front (Italian)</p>
          <h2 className="text-3xl font-medium text-center">
            {currentCard.front || currentCard.italian}
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute bottom-4 right-4"
            onClick={(e) => {
              e.stopPropagation();
              handleSpeak();
            }}
          >
            <VolumeUp className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Back Side */}
        <div 
          className={`
            absolute inset-0 flex flex-col items-center justify-center p-8 rounded-xl 
            bg-card rotate-y-180 backface-hidden border ${isFlipped ? 'visible' : 'invisible'}
          `}
        >
          <p className="text-sm text-muted-foreground mb-2">Back (English)</p>
          <h2 className="text-3xl font-medium text-center">
            {currentCard.back || currentCard.english}
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute bottom-4 right-4"
            onClick={(e) => {
              e.stopPropagation();
              handleSpeak();
            }}
          >
            <VolumeUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center gap-4">
        <Button 
          variant="outline" 
          size="lg"
          className="border-red-500 hover:bg-red-500 hover:text-white" 
          onClick={handleIncorrect}
        >
          <X className="mr-2 h-5 w-5" /> Incorrect
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="border-green-500 hover:bg-green-500 hover:text-white" 
          onClick={handleCorrect}
        >
          <Check className="mr-2 h-5 w-5" /> Correct
        </Button>
      </div>
    </div>
  );
};

export default FlashcardStudyView;
