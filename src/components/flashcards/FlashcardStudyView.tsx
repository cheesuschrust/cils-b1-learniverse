
import React, { useState, useEffect } from 'react';
import { useFlashcards } from '@/contexts/FlashcardsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flashcard, FlashcardSet } from '@/types';
import { ChevronLeft, ArrowLeft, Flag, VolumeX, Volume2, ThumbsUp, ThumbsDown, HelpCircle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { calculateReviewPerformance } from '@/types/typeCompatibility';

interface FlashcardStudyViewProps {
  setId: string;
  onBack: () => void;
}

const FlashcardStudyView: React.FC<FlashcardStudyViewProps> = ({ setId, onBack }) => {
  const { fetchFlashcardsBySet, fetchSetById, isLoading } = useFlashcards();
  const { toast } = useToast();
  
  const [currentSet, setCurrentSet] = useState<FlashcardSet | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [studyComplete, setStudyComplete] = useState(false);
  
  // Performance metrics
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);

  useEffect(() => {
    // Calculate progress percentage
    if (cards.length > 0) {
      setProgress(((currentIndex + 1) / cards.length) * 100);
    }
  }, [currentIndex, cards.length]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load set info
        const set = await fetchSetById(setId);
        if (set) {
          setCurrentSet(set);
        }
        
        // Load flashcards
        const fetchedCards = await fetchFlashcardsBySet(setId);
        if (fetchedCards.length === 0) {
          toast({
            title: "No flashcards found",
            description: "This set doesn't have any flashcards yet.",
            variant: "destructive",
          });
          return;
        }
        
        // Shuffle the cards
        const shuffled = [...fetchedCards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
      } catch (error) {
        console.error("Error loading flashcards:", error);
        toast({
          title: "Error loading flashcards",
          description: "Failed to load flashcards. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [setId, fetchFlashcardsBySet, fetchSetById, toast]);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    
    // If flipping to the back, speak the Italian word
    if (!isFlipped && audioEnabled) {
      speakText(cards[currentIndex]?.italian);
    }
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setStudyComplete(true);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    
    setIsSpeaking(true);
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find an Italian voice
    const voices = window.speechSynthesis.getVoices();
    const italianVoice = voices.find(voice => voice.lang.includes('it'));
    
    if (italianVoice) {
      utterance.voice = italianVoice;
    }
    
    utterance.lang = 'it-IT';
    utterance.rate = 0.9;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    if (audioEnabled) {
      // Stop any current speech
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  const markAsKnown = async () => {
    if (!cards[currentIndex]) return;
    
    setKnownCount(knownCount + 1);
    
    try {
      // Update the card's progress in the database
      await updateCardProgress(cards[currentIndex].id, 'good');
    } catch (error) {
      console.error("Error updating card progress:", error);
    }
    
    nextCard();
  };

  const markAsUnknown = async () => {
    if (!cards[currentIndex]) return;
    
    setUnknownCount(unknownCount + 1);
    
    try {
      // Update the card's progress in the database
      await updateCardProgress(cards[currentIndex].id, 'again');
    } catch (error) {
      console.error("Error updating card progress:", error);
    }
    
    nextCard();
  };

  const updateCardProgress = async (cardId: string, quality: 'again' | 'hard' | 'good' | 'easy') => {
    try {
      // First check if there's existing progress for this card
      const { data: existingProgress } = await supabase
        .from('user_flashcard_progress')
        .select('*')
        .eq('flashcard_id', cardId)
        .maybeSingle();
      
      // Use spaced repetition algorithm to calculate new values
      const { interval, easeFactor, status } = calculateReviewPerformance({
        quality: quality === 'again' ? 0 : quality === 'hard' ? 2 : quality === 'good' ? 3 : 4,
        previousInterval: existingProgress?.interval_days || 0,
        previousEaseFactor: existingProgress?.ease_factor || 2.5,
        isNew: !existingProgress,
      });
      
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);
      
      if (existingProgress) {
        // Update existing progress
        await supabase
          .from('user_flashcard_progress')
          .update({
            interval_days: interval,
            ease_factor: easeFactor,
            status: status,
            next_review: nextReview.toISOString(),
            review_count: (existingProgress.review_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
      } else {
        // Create new progress record
        await supabase
          .from('user_flashcard_progress')
          .insert({
            flashcard_id: cardId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            interval_days: interval,
            ease_factor: easeFactor,
            status: status,
            next_review: nextReview.toISOString(),
            review_count: 1
          });
      }
    } catch (error) {
      console.error("Error updating flashcard progress:", error);
      throw error;
    }
  };

  const restartStudy = () => {
    // Shuffle the cards again
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudyComplete(false);
    setKnownCount(0);
    setUnknownCount(0);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-muted-foreground">Loading flashcards...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No flashcards found</h3>
        <p className="mt-2 text-muted-foreground">
          This set doesn't have any flashcards yet.
        </p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sets
        </Button>
      </div>
    );
  }

  if (studyComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Sets
          </Button>
        </div>
        
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Study Session Complete!</h2>
          <p className="text-muted-foreground mb-6">
            You've reviewed all {cards.length} cards in this set.
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
              <ThumbsUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-medium">{knownCount}</p>
              <p className="text-sm text-muted-foreground">Known</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4">
              <ThumbsDown className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-lg font-medium">{unknownCount}</p>
              <p className="text-sm text-muted-foreground">Need Review</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={restartStudy}>
              Study Again
            </Button>
            <Button variant="outline" onClick={onBack}>
              Return to Sets
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Sets
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAudio}
            title={audioEnabled ? "Disable audio" : "Enable audio"}
          >
            {audioEnabled ? (
              <Volume2 className={`h-4 w-4 ${isSpeaking ? 'text-primary' : ''}`} />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
          
          <p className="text-sm font-medium">
            {currentIndex + 1} / {cards.length}
          </p>
        </div>
      </div>
      
      <Progress value={progress} className="mb-6" />
      
      <div 
        className={`w-full aspect-[3/2] perspective-1000 cursor-pointer mb-8 ${isFlipped ? 'is-flipped' : ''}`}
        onClick={flipCard}
      >
        <div className="relative w-full h-full transform-style-3d transition-transform duration-500" style={{ 
          transformStyle: 'preserve-3d', 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>
          {/* Front of card (Italian) */}
          <Card className="absolute w-full h-full backface-hidden flex items-center justify-center p-6" style={{ 
            backfaceVisibility: 'hidden'
          }}>
            <CardContent className="flex flex-col items-center justify-center p-0 h-full">
              <p className="text-muted-foreground text-sm mb-4">Italian</p>
              <h2 className="text-3xl font-bold text-center">{currentCard.italian}</h2>
              {audioEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(currentCard.italian);
                  }}
                  disabled={isSpeaking}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Pronounce
                </Button>
              )}
              <p className="text-muted-foreground text-sm mt-auto">
                Click to reveal translation
              </p>
            </CardContent>
          </Card>
          
          {/* Back of card (English) */}
          <Card className="absolute w-full h-full backface-hidden flex items-center justify-center p-6" style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}>
            <CardContent className="flex flex-col items-center justify-center p-0 h-full">
              <p className="text-muted-foreground text-sm mb-4">English</p>
              <h2 className="text-3xl font-bold text-center">{currentCard.english}</h2>
              {currentCard.back !== currentCard.english && (
                <p className="mt-4 text-center italic">{currentCard.back}</p>
              )}
              <p className="text-muted-foreground text-sm mt-auto">
                Click to go back
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <Button 
          variant="outline" 
          className="flex-1 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950"
          onClick={markAsUnknown}
        >
          <X className="mr-2 h-4 w-4" />
          Don't Know
        </Button>
        
        <Button 
          variant="outline"
          className="flex-1 border-green-200 hover:bg-green-50 hover:text-green-600 dark:border-green-900 dark:hover:bg-green-950"
          onClick={markAsKnown}
        >
          <Check className="mr-2 h-4 w-4" />
          Know It
        </Button>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="ghost" 
          onClick={prevCard} 
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Button variant="ghost" onClick={nextCard}>
          Skip
          <Flag className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardStudyView;
