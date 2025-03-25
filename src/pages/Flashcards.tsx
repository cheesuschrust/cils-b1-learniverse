
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useFlashcards, Flashcard, FlashcardSet } from '@/hooks/useFlashcards';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Edit, FileText, Filter, Loader2, MoreVertical, Plus, Save, Search, Shuffle, Trash, Upload, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlashcardImporter } from '@/components/flashcards/FlashcardImporter';
import { SpacedRepetitionInfo } from '@/components/flashcards/SpacedRepetitionInfo';
import SpeakableWord from '@/components/learning/SpeakableWord';
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator';
import { Switch } from '@/components/ui/switch';
import { isBefore } from 'date-fns';

const CARDS_PER_PAGE = 10;

const FlashcardsPage: React.FC = () => {
  const { flashcards, flashcardSets, createFlashcard, updateFlashcard, deleteFlashcard, 
          createFlashcardSet, updateFlashcardSet, deleteFlashcardSet, addFlashcardToSet, 
          removeFlashcardFromSet, getStats, markAsMastered, resetMastered, getDueFlashcards,
          reviewFlashcard, getFlashcardById, getFlashcardSetById } = useFlashcards();
  
  const { translateText, isTranslating, isAIEnabled } = useAIUtils();
  const { toast } = useToast();
  
  // State for creating new cards
  const [italian, setItalian] = useState('');
  const [english, setEnglish] = useState('');
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  
  // State for creating sets
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  
  // State for search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filterMastered, setFilterMastered] = useState<'all' | 'mastered' | 'unmastered'>('all');
  const [filterReviewDue, setFilterReviewDue] = useState(false);
  
  // State for study session
  const [studyMode, setStudyMode] = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for editing
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [editItalian, setEditItalian] = useState('');
  const [editEnglish, setEditEnglish] = useState('');
  
  // State for editing sets
  const [editSetId, setEditSetId] = useState<string | null>(null);
  const [editSetName, setEditSetName] = useState('');
  const [editSetDescription, setEditSetDescription] = useState('');
  
  // State for AI text translation
  const [isTranslating2, setIsTranslating2] = useState(false);
  
  // State for Import/Export 
  const [isImportOpen, setIsImportOpen] = useState(false);
  
  // State for auto-translation
  const [autoTranslate, setAutoTranslate] = useState(true);
  
  // Sort options
  const [sortBy, setSortBy] = useState<'newest' | 'alphabetical' | 'mastery'>('newest');
  
  // Stats from the hooks
  const stats = getStats();
  
  // Side effect to restore selected set from localStorage
  useEffect(() => {
    const savedSetId = localStorage.getItem('selected-flashcard-set');
    if (savedSetId && flashcardSets.some(set => set.id === savedSetId)) {
      setSelectedSetId(savedSetId);
    } else if (flashcardSets.length > 0) {
      setSelectedSetId(flashcardSets[0].id);
    }
  }, [flashcardSets]);
  
  // Save selected set to localStorage when it changes
  useEffect(() => {
    if (selectedSetId) {
      localStorage.setItem('selected-flashcard-set', selectedSetId);
    }
  }, [selectedSetId]);
  
  // Handle automatic translation of entered Italian term
  useEffect(() => {
    if (!autoTranslate || !italian || isTranslating || !isAIEnabled) {
      return;
    }
    
    const timerId = setTimeout(async () => {
      try {
        setIsTranslating2(true);
        const translated = await translateText(italian, 'it', 'en');
        setEnglish(translated);
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setIsTranslating2(false);
      }
    }, 1000); // 1 second delay after typing stops
    
    return () => clearTimeout(timerId);
  }, [italian, autoTranslate, translateText, isTranslating, isAIEnabled]);
  
  // Filter cards based on search and filters
  const filteredCards = useMemo(() => {
    let filtered = [...flashcards];
    
    // Filter by selected set
    if (selectedSetId) {
      const set = flashcardSets.find(s => s.id === selectedSetId);
      if (set) {
        filtered = filtered.filter(card => set.cards.includes(card.id));
      }
    }
    
    // Apply search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(card => 
        card.italian.toLowerCase().includes(lowerSearch) || 
        card.english.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply mastery filter
    if (filterMastered !== 'all') {
      filtered = filtered.filter(card => 
        filterMastered === 'mastered' ? card.mastered : !card.mastered
      );
    }
    
    // Apply review due filter
    if (filterReviewDue) {
      const today = new Date();
      filtered = filtered.filter(card => 
        !card.mastered && (!card.nextReviewDate || 
        isBefore(new Date(card.nextReviewDate), today))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.italian.localeCompare(b.italian));
        break;
      case 'mastery':
        filtered.sort((a, b) => {
          // First by mastery (unmastered first)
          if (a.mastered !== b.mastered) {
            return a.mastered ? 1 : -1;
          }
          
          // Then by due date if not mastered
          if (!a.mastered && !b.mastered) {
            const aDate = a.nextReviewDate ? new Date(a.nextReviewDate) : new Date(0);
            const bDate = b.nextReviewDate ? new Date(b.nextReviewDate) : new Date(0);
            return aDate.getTime() - bDate.getTime();
          }
          
          return 0;
        });
        break;
    }
    
    return filtered;
  }, [flashcards, flashcardSets, selectedSetId, searchTerm, filterMastered, filterReviewDue, sortBy]);
  
  // Paginated cards
  const paginatedCards = useMemo(() => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    return filteredCards.slice(startIndex, startIndex + CARDS_PER_PAGE);
  }, [filteredCards, currentPage]);
  
  // Handle creating a new flashcard
  const handleCreateFlashcard = () => {
    if (!italian || !english) {
      toast({
        title: "Missing Information",
        description: "Please enter both Italian and English terms.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newCard = createFlashcard(italian, english);
      
      // If a set is selected, add the card to it
      if (selectedSetId) {
        addFlashcardToSet(newCard.id, selectedSetId);
      }
      
      // Reset the form
      setItalian('');
      setEnglish('');
      
      toast({
        title: "Flashcard Created",
        description: `Successfully added flashcard for "${italian}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create flashcard",
        variant: "destructive",
      });
    }
  };
  
  // Handle creating a new set
  const handleCreateSet = () => {
    if (!newSetName) {
      toast({
        title: "Missing Name",
        description: "Please enter a name for the flashcard set.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newSet = createFlashcardSet(newSetName, newSetDescription);
      setSelectedSetId(newSet.id);
      
      // Reset the form
      setNewSetName('');
      setNewSetDescription('');
      
      toast({
        title: "Set Created",
        description: `Successfully created set "${newSetName}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create set",
        variant: "destructive",
      });
    }
  };
  
  // Handle updating a flashcard
  const handleUpdateFlashcard = () => {
    if (!editCardId || !editItalian || !editEnglish) {
      toast({
        title: "Missing Information",
        description: "Please enter both Italian and English terms.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      updateFlashcard(editCardId, {
        italian: editItalian,
        english: editEnglish,
      });
      
      // Reset edit state
      setEditCardId(null);
      setEditItalian('');
      setEditEnglish('');
      
      toast({
        title: "Flashcard Updated",
        description: "Successfully updated flashcard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update flashcard",
        variant: "destructive",
      });
    }
  };
  
  // Handle updating a set
  const handleUpdateSet = () => {
    if (!editSetId || !editSetName) {
      toast({
        title: "Missing Information",
        description: "Please enter a name for the set.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      updateFlashcardSet(editSetId, {
        name: editSetName,
        description: editSetDescription,
      });
      
      // Reset edit state
      setEditSetId(null);
      setEditSetName('');
      setEditSetDescription('');
      
      toast({
        title: "Set Updated",
        description: "Successfully updated flashcard set.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update set",
        variant: "destructive",
      });
    }
  };
  
  // Handle starting a study session
  const handleStartStudy = () => {
    let cardsToStudy = [...filteredCards];
    
    // If review due filter is not active, prioritize cards due for review
    if (!filterReviewDue) {
      const dueCards = getDueFlashcards();
      const dueCardIds = new Set(dueCards.map(card => card.id));
      
      // Sort to put due cards first
      cardsToStudy.sort((a, b) => {
        const aIsDue = dueCardIds.has(a.id);
        const bIsDue = dueCardIds.has(b.id);
        
        if (aIsDue && !bIsDue) return -1;
        if (!aIsDue && bIsDue) return 1;
        return 0;
      });
    }
    
    // Shuffle if shuffle mode is on
    if (shuffleMode) {
      cardsToStudy = cardsToStudy
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    }
    
    setStudyCards(cardsToStudy);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudyMode(true);
  };
  
  // Handle next card in study session
  const handleNextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // End of study session
      toast({
        title: "Study Session Complete",
        description: "You've reviewed all cards in this session!",
      });
      setStudyMode(false);
    }
  };
  
  // Handle previous card in study session
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };
  
  // Handle card review
  const handleReviewCard = (difficulty: 'easy' | 'medium' | 'hard') => {
    const currentCard = studyCards[currentCardIndex];
    
    if (currentCard) {
      reviewFlashcard(currentCard.id, difficulty);
      
      toast({
        title: "Card Reviewed",
        description: `Marked as ${difficulty}. Will be shown again at the appropriate interval.`,
      });
      
      handleNextCard();
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
          <p className="text-muted-foreground">Create and review flashcards to build your vocabulary</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ConfidenceIndicator contentType="flashcards" />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New Set
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create New Flashcard Set</SheetTitle>
                <SheetDescription>
                  Create a new set to organize your flashcards.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="set-name">Set Name</Label>
                  <Input
                    id="set-name"
                    placeholder="Enter a name for your set"
                    value={newSetName}
                    onChange={(e) => setNewSetName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set-description">Description (Optional)</Label>
                  <Textarea
                    id="set-description"
                    placeholder="Enter a description for your set"
                    value={newSetDescription}
                    onChange={(e) => setNewSetDescription(e.target.value)}
                  />
                </div>
              </div>
              <SheetFooter>
                <Button onClick={handleCreateSet}>Create Set</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Import Flashcards</DialogTitle>
                <DialogDescription>
                  Import flashcards from CSV, TXT, Anki, or JSON format.
                </DialogDescription>
              </DialogHeader>
              
              <FlashcardImporter onClose={() => setIsImportOpen(false)} />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Your flashcard progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Flashcards:</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mastered:</span>
                  <span className="font-medium">{stats.mastered}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Due for Review:</span>
                  <span className="font-medium">{stats.dueToday}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Mastery Progress:</span>
                  <span className="font-medium">
                    {stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0}%
                  </span>
                </div>
                <Progress value={stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Flashcard Sets</CardTitle>
              <CardDescription>Select a set to view cards</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-80 overflow-y-auto p-4 pt-0">
                <div 
                  className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer ${
                    selectedSetId === null ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedSetId(null)}
                >
                  <span>All Flashcards</span>
                  <Badge>{flashcards.length}</Badge>
                </div>
                
                {flashcardSets.map(set => (
                  <div 
                    key={set.id}
                    className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer ${
                      selectedSetId === set.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedSetId(set.id)}
                  >
                    <span>{set.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge>{set.cards.length}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Set Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setEditSetId(set.id);
                            setEditSetName(set.name);
                            setEditSetDescription(set.description || '');
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Set
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            if (confirm(`Are you sure you want to delete "${set.name}"? This will not delete the cards in the set.`)) {
                              deleteFlashcardSet(set.id);
                            }
                          }} className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Set
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <SpacedRepetitionInfo className="hidden md:block" />
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-3">
          {/* Study Mode */}
          {studyMode ? (
            <Card className="max-w-3xl mx-auto">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Study Session</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setStudyMode(false)}>
                    <X className="h-4 w-4 mr-1" />
                    End Session
                  </Button>
                </div>
                <CardDescription>
                  Card {currentCardIndex + 1} of {studyCards.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {studyCards.length > 0 && currentCardIndex < studyCards.length ? (
                  <div className="space-y-6">
                    <div className="relative flex flex-col justify-center items-center p-8 rounded-lg bg-muted min-h-40">
                      <div className="absolute top-2 right-2">
                        {studyCards[currentCardIndex].mastered && (
                          <Badge variant="default">Mastered</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-center">
                        <SpeakableWord 
                          word={studyCards[currentCardIndex].italian} 
                          language="it"
                          size="lg"
                          autoPlay={false}
                        />
                      </h3>
                      
                      {showAnswer && (
                        <div className="mt-6 pt-6 border-t border-border w-full text-center">
                          <p className="text-xl">
                            <SpeakableWord 
                              word={studyCards[currentCardIndex].english} 
                              language="en"
                            />
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {!showAnswer ? (
                      <Button className="w-full" onClick={() => setShowAnswer(true)}>
                        Show Answer
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" onClick={() => handleReviewCard('hard')}>
                            Hard
                          </Button>
                          <Button variant="outline" onClick={() => handleReviewCard('medium')}>
                            Medium
                          </Button>
                          <Button variant="outline" onClick={() => handleReviewCard('easy')}>
                            Easy
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="default" 
                            onClick={() => markAsMastered(studyCards[currentCardIndex].id)}
                            disabled={studyCards[currentCardIndex].mastered}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Mastered
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => {
                              resetMastered(studyCards[currentCardIndex].id);
                              toast({
                                title: "Reset Mastery",
                                description: "This card has been reset to unmastered status.",
                              });
                            }}
                            disabled={!studyCards[currentCardIndex].mastered}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reset Mastery
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No cards available for study. Create some flashcards or change your filters.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevCard}
                  disabled={currentCardIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, studyCards.length) }).map((_, index) => {
                    const actualIndex = Math.floor(currentCardIndex / 5) * 5 + index;
                    return (
                      <div 
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          actualIndex === currentCardIndex 
                            ? 'bg-primary' 
                            : actualIndex < studyCards.length 
                              ? 'bg-muted-foreground/30' 
                              : 'bg-transparent'
                        }`}
                      />
                    );
                  })}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleNextCard}
                  disabled={currentCardIndex === studyCards.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Tabs defaultValue="browse">
              <TabsList className="grid grid-cols-2 w-full max-w-xs mb-4">
                <TabsTrigger value="browse">Browse</TabsTrigger>
                <TabsTrigger value="create">Create</TabsTrigger>
              </TabsList>
              
              <TabsContent value="browse" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <CardTitle>
                        {selectedSetId 
                          ? flashcardSets.find(s => s.id === selectedSetId)?.name || "Flashcards"
                          : "All Flashcards"
                        }
                      </CardTitle>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleStartStudy} disabled={filteredCards.length === 0}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Study Now
                        </Button>
                        <Button 
                          variant="outline" 
                          className={shuffleMode ? 'bg-muted' : ''} 
                          onClick={() => setShuffleMode(!shuffleMode)}
                        >
                          <Shuffle className="mr-2 h-4 w-4" />
                          {shuffleMode ? 'Shuffle On' : 'Shuffle Off'}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      {selectedSetId
                        ? flashcardSets.find(s => s.id === selectedSetId)?.description || "Browse and study your flashcards"
                        : "Browse and study all your flashcards"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search flashcards..."
                            className="pl-8 w-full md:w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-2 items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setFilterMastered('all')}>
                                {filterMastered === 'all' && '✓ '}All Cards
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setFilterMastered('mastered')}>
                                {filterMastered === 'mastered' && '✓ '}Mastered Only
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setFilterMastered('unmastered')}>
                                {filterMastered === 'unmastered' && '✓ '}Unmastered Only
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setFilterReviewDue(!filterReviewDue)}>
                                {filterReviewDue && '✓ '}Due for Review
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                            <SelectTrigger className="w-[130px]">
                              <span className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Sort by
                              </span>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">Newest</SelectItem>
                              <SelectItem value="alphabetical">Alphabetical</SelectItem>
                              <SelectItem value="mastery">Mastery/Due</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {isSearching ? (
                        <div className="text-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          <p className="text-sm text-muted-foreground mt-2">Searching flashcards...</p>
                        </div>
                      ) : filteredCards.length === 0 ? (
                        <div className="text-center p-8">
                          <p>No flashcards found. Try changing your filters or create some new cards.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground mb-2">
                            Showing {Math.min(CARDS_PER_PAGE, filteredCards.length)} of {filteredCards.length} cards
                          </p>
                          
                          <div className="space-y-2">
                            {paginatedCards.map(card => (
                              <Card key={card.id} className="relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full 
                                  ${card.mastered ? 'bg-green-500' : (!card.nextReviewDate || 
                                  isBefore(new Date(card.nextReviewDate), new Date())) 
                                  ? 'bg-amber-500' : 'bg-blue-500'}`}
                                />
                                <div className="pl-2 pr-0 py-3">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1 pl-2">
                                      <div className="font-medium">
                                        <SpeakableWord 
                                          word={card.italian} 
                                          language="it"
                                          showTooltip={false}
                                        />
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        <SpeakableWord 
                                          word={card.english} 
                                          language="en"
                                          showTooltip={false}
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center pr-2">
                                      {card.mastered && (
                                        <Badge variant="default" className="mr-2">Mastered</Badge>
                                      )}
                                      
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>Card Actions</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => {
                                            setEditCardId(card.id);
                                            setEditItalian(card.italian);
                                            setEditEnglish(card.english);
                                          }}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Card
                                          </DropdownMenuItem>
                                          {card.mastered ? (
                                            <DropdownMenuItem onClick={() => resetMastered(card.id)}>
                                              <X className="mr-2 h-4 w-4" />
                                              Reset Mastery
                                            </DropdownMenuItem>
                                          ) : (
                                            <DropdownMenuItem onClick={() => markAsMastered(card.id)}>
                                              <CheckCircle className="mr-2 h-4 w-4" />
                                              Mark as Mastered
                                            </DropdownMenuItem>
                                          )}
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => {
                                            if (confirm('Are you sure you want to delete this flashcard?')) {
                                              deleteFlashcard(card.id);
                                            }
                                          }} className="text-destructive">
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete Card
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                          
                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="flex justify-center mt-4 space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: totalPages }).map((_, index) => {
                                  const pageNumber = index + 1;
                                  const isInRange = Math.abs(pageNumber - currentPage) <= 1 || 
                                    pageNumber === 1 || pageNumber === totalPages;
                                  
                                  if (!isInRange) {
                                    // Show ellipsis for breaks in the sequence
                                    if (pageNumber === 2 || pageNumber === totalPages - 1) {
                                      return (
                                        <div key={index} className="px-2">
                                          &hellip;
                                        </div>
                                      );
                                    }
                                    return null;
                                  }
                                  
                                  return (
                                    <Button
                                      key={index}
                                      variant={currentPage === pageNumber ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => handlePageChange(pageNumber)}
                                      className="w-8 h-8 p-0"
                                    >
                                      {pageNumber}
                                    </Button>
                                  );
                                })}
                              </div>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="create" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Flashcard</CardTitle>
                    <CardDescription>
                      Add a new flashcard to your collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="italian">Italian</Label>
                        <Input
                          id="italian"
                          placeholder="Enter Italian word or phrase"
                          value={italian}
                          onChange={(e) => setItalian(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="english">English</Label>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">Auto-translate</span>
                            <Switch 
                              checked={autoTranslate} 
                              onCheckedChange={setAutoTranslate} 
                              disabled={!isAIEnabled}
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <Input
                            id="english"
                            placeholder="Enter English translation"
                            value={english}
                            onChange={(e) => setEnglish(e.target.value)}
                            disabled={isTranslating2}
                          />
                          {isTranslating2 && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="set">Add to Set</Label>
                      <Select value={selectedSetId || ''} onValueChange={(value) => setSelectedSetId(value || null)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a set (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Set</SelectItem>
                          {flashcardSets.map(set => (
                            <SelectItem key={set.id} value={set.id}>
                              {set.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleCreateFlashcard}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Flashcard
                    </Button>
                  </CardFooter>
                </Card>
                
                <SpacedRepetitionInfo className="md:hidden" />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      
      {/* Edit Flashcard Dialog */}
      <Dialog open={!!editCardId} onOpenChange={(open) => !open && setEditCardId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Flashcard</DialogTitle>
            <DialogDescription>
              Make changes to your flashcard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-italian">Italian</Label>
              <Input
                id="edit-italian"
                value={editItalian}
                onChange={(e) => setEditItalian(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-english">English</Label>
              <Input
                id="edit-english"
                value={editEnglish}
                onChange={(e) => setEditEnglish(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCardId(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFlashcard}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Set Dialog */}
      <Dialog open={!!editSetId} onOpenChange={(open) => !open && setEditSetId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Flashcard Set</DialogTitle>
            <DialogDescription>
              Make changes to your flashcard set.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-set-name">Set Name</Label>
              <Input
                id="edit-set-name"
                value={editSetName}
                onChange={(e) => setEditSetName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-set-description">Description (Optional)</Label>
              <Textarea
                id="edit-set-description"
                value={editSetDescription}
                onChange={(e) => setEditSetDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSetId(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSet}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlashcardsPage;
