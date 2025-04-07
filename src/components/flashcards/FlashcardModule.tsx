
import React, { useState, useEffect } from 'react';
import { useFlashcards } from '@/hooks/useFlashcards';
import FlashcardComponent from '@/components/flashcards/FlashcardComponent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, ListPlus, Book, BookOpen, RotateCcw } from 'lucide-react';
import { FlashcardSet, Flashcard } from '@/types/flashcard-unified';
import useFeatureLimits from '@/hooks/useFeatureLimits';
import { Progress } from '@/components/ui/progress';

const FlashcardModule: React.FC = () => {
  const {
    flashcards,
    flashcardSets,
    addFlashcard,
    updateFlashcard,
    updateCardDifficulty,
    getDueCards,
    getDifficultCards,
    getFlashcardStats
  } = useFlashcards();
  
  const { toast } = useToast();
  const { checkCanUseFeature, incrementUsage, limits } = useFeatureLimits();
  
  const [currentTab, setCurrentTab] = useState('practice');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [practiceCards, setPracticeCards] = useState<Flashcard[]>([]);
  const [reviewMode, setReviewMode] = useState<'due' | 'difficult' | 'all'>('due');
  const [isFlipped, setIsFlipped] = useState(false);
  
  useEffect(() => {
    loadPracticeCards();
  }, [reviewMode]);
  
  const loadPracticeCards = () => {
    let cards: Flashcard[] = [];
    
    switch (reviewMode) {
      case 'due':
        cards = getDueCards();
        break;
      case 'difficult':
        cards = getDifficultCards();
        break;
      case 'all':
        cards = flashcards.filter(card => !card.mastered);
        break;
    }
    
    // Shuffle the cards
    cards = [...cards].sort(() => Math.random() - 0.5);
    
    setPracticeCards(cards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleNextCard = () => {
    if (currentCardIndex < practiceCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // End of practice session
      toast({
        title: "Practice Complete",
        description: "You've reviewed all the cards in this session!",
        variant: "default",
      });
      
      // Reload cards to get a fresh set
      loadPracticeCards();
    }
  };
  
  const handleRating = (rating: number) => {
    if (!checkCanUseFeature('flashcards')) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your daily flashcard limit. Upgrade to premium for unlimited reviews.",
        variant: "destructive"
      });
      return;
    }
    
    const card = practiceCards[currentCardIndex];
    if (card) {
      updateCardDifficulty(card.id, rating);
      incrementUsage('flashcards');
      handleNextCard();
    }
  };
  
  const handleSkip = () => {
    handleNextCard();
  };
  
  const handleUnknown = () => {
    if (!checkCanUseFeature('flashcards')) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your daily flashcard limit. Upgrade to premium for unlimited reviews.",
        variant: "destructive"
      });
      return;
    }
    
    const card = practiceCards[currentCardIndex];
    if (card) {
      // Rating of 1 = didn't know it
      updateCardDifficulty(card.id, 1);
      incrementUsage('flashcards');
      handleNextCard();
    }
  };
  
  const stats = getFlashcardStats();
  const masteryPercentage = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">Flashcards</CardTitle>
            <CardDescription>
              Practice vocabulary with spaced repetition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Cards</span>
                <Badge variant="outline">{stats.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Mastered</span>
                <Badge variant="secondary">{stats.mastered}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">To Review Today</span>
                <Badge variant="default">{stats.toReview}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Still Learning</span>
                <Badge variant="outline">{stats.learning}</Badge>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Mastery Progress</span>
                  <span className="text-sm font-medium">{masteryPercentage}%</span>
                </div>
                <Progress value={masteryPercentage} className="h-2" />
              </div>
              <div className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Daily limit: {limits.flashcards.currentUsage}/{limits.premium.isPremium ? '∞' : limits.flashcards.maxCardsPerDay} reviews
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">Practice Mode</CardTitle>
            <CardDescription>
              Choose which cards to practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  variant={reviewMode === 'due' ? 'default' : 'outline'} 
                  onClick={() => setReviewMode('due')}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Due Cards
                </Button>
                <Button 
                  variant={reviewMode === 'difficult' ? 'default' : 'outline'} 
                  onClick={() => setReviewMode('difficult')}
                  className="flex-1"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Difficult
                </Button>
                <Button 
                  variant={reviewMode === 'all' ? 'default' : 'outline'} 
                  onClick={() => setReviewMode('all')}
                  className="flex-1"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  All Cards
                </Button>
              </div>
              
              {practiceCards.length === 0 ? (
                <div className="text-center p-6">
                  <p className="text-muted-foreground mb-4">No cards to review for this mode.</p>
                  <Button onClick={() => setReviewMode('all')}>
                    View All Cards
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-center text-muted-foreground">
                  Card {currentCardIndex + 1} of {practiceCards.length}
                </div>
              )}
              
              <div className="mt-4 flex justify-between gap-4">
                <Button variant="outline" className="flex-1" size="sm">
                  <ListPlus className="h-4 w-4 mr-2" />
                  My Sets
                </Button>
                <Button className="flex-1" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="py-6">
        {practiceCards.length > 0 ? (
          <FlashcardComponent
            card={practiceCards[currentCardIndex]}
            onRating={handleRating}
            onSkip={handleSkip}
            onUnknown={handleUnknown}
            flipped={isFlipped}
            onFlip={handleFlip}
            showActions={true}
            showHints={true}
          />
        ) : (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <p className="mb-4">No flashcards available for review. Create new cards or check back later.</p>
              <Button>Create Flashcard</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FlashcardModule;
