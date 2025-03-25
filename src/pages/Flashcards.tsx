
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';
import SpacedRepetitionInfo from '@/components/flashcards/SpacedRepetitionInfo';
import FlashcardComponent from '@/components/flashcards/FlashcardComponent';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { 
  ArrowUpDown, 
  Check, 
  Download, 
  FileUp, 
  Filter, 
  Plus, 
  Save, 
  Search, 
  Settings, 
  Tag, 
  Timer, 
  Upload, 
  X,
  Brain,
  Star,
  Clock,
  BarChart
} from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { Flashcard, FlashcardSet } from '@/types/flashcard';
import { useAI } from '@/hooks/useAI';

const Flashcards = () => {
  const [activeTab, setActiveTab] = useState('study');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [newCardItalian, setNewCardItalian] = useState('');
  const [newCardEnglish, setNewCardEnglish] = useState('');
  const [newCardTags, setNewCardTags] = useState('');
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(null);
  const [studyMode, setStudyMode] = useState<'all' | 'due' | 'difficult'>('due');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
  const { toast } = useToast();
  const { 
    flashcards, 
    flashcardSets, 
    addFlashcard, 
    updateFlashcard, 
    deleteFlashcard,
    createFlashcardSet,
    addCardToSet,
    removeCardFromSet,
    markCardAsMastered,
    updateCardDifficulty,
    allTags,
    getDueCards,
    getDifficultCards,
    importCards
  } = useFlashcards();
  
  const { generateFlashcards, isProcessing, classifyText } = useAI();
  
  // Study session state
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0
  });
  
  // Filter the flashcards based on search and tags
  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = searchQuery === '' || 
      card.italian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.english.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => card.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  // Initialize study session
  useEffect(() => {
    if (activeTab === 'study') {
      initializeStudySession();
    }
  }, [activeTab, studyMode]);
  
  // Initialize the study session with the appropriate cards
  const initializeStudySession = () => {
    let cardsToStudy: Flashcard[] = [];
    
    if (studyMode === 'due') {
      cardsToStudy = getDueCards();
    } else if (studyMode === 'difficult') {
      cardsToStudy = getDifficultCards();
    } else {
      cardsToStudy = [...flashcards];
    }
    
    // Shuffle the cards
    cardsToStudy = shuffleArray(cardsToStudy);
    
    setStudyCards(cardsToStudy);
    setCurrentCardIndex(0);
    setSessionStats({
      total: cardsToStudy.length,
      correct: 0,
      incorrect: 0,
      skipped: 0
    });
    
    if (cardsToStudy.length > 0) {
      setCurrentFlashcard(cardsToStudy[0]);
    } else {
      setCurrentFlashcard(null);
    }
  };
  
  // Helper function to shuffle an array
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Handle card rating (for spaced repetition)
  const handleCardRating = (card: Flashcard, rating: number) => {
    // Update card difficulty based on rating
    updateCardDifficulty(card.id, rating);
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      correct: rating >= 3 ? prev.correct + 1 : prev.correct,
      incorrect: rating < 3 ? prev.incorrect + 1 : prev.incorrect
    }));
    
    // Move to next card
    goToNextCard();
  };
  
  // Skip the current card
  const handleSkipCard = () => {
    setSessionStats(prev => ({
      ...prev,
      skipped: prev.skipped + 1
    }));
    
    goToNextCard();
  };
  
  // Go to the next card in the study session
  const goToNextCard = () => {
    if (currentCardIndex + 1 < studyCards.length) {
      setCurrentCardIndex(currentCardIndex + 1);
      setCurrentFlashcard(studyCards[currentCardIndex + 1]);
      setIsCardFlipped(false);
    } else {
      // End of session
      toast({
        title: "Study Session Complete",
        description: `You've finished this study session with ${sessionStats.correct} correct answers.`,
      });
      
      // Reset for a new session
      setTimeout(() => {
        initializeStudySession();
      }, 2000);
    }
  };
  
  // Handle adding a new flashcard
  const handleAddFlashcard = () => {
    if (!newCardItalian || !newCardEnglish) {
      toast({
        title: "Incomplete Information",
        description: "Please provide both Italian and English texts.",
        variant: "destructive",
      });
      return;
    }
    
    const tagsArray = newCardTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    const newCard = addFlashcard({
      italian: newCardItalian,
      english: newCardEnglish,
      tags: tagsArray,
      level: 0,
      mastered: false,
      nextReview: new Date(),
      lastReviewed: null
    });
    
    toast({
      title: "Flashcard Added",
      description: "Your new flashcard has been created.",
    });
    
    // Reset form
    setNewCardItalian('');
    setNewCardEnglish('');
    setNewCardTags('');
    setOpenCreateDialog(false);
  };
  
  // Handle creating a new flashcard set
  const handleCreateFlashcardSet = () => {
    if (!newSetName) {
      toast({
        title: "Name Required",
        description: "Please provide a name for the flashcard set.",
        variant: "destructive",
      });
      return;
    }
    
    createFlashcardSet({
      name: newSetName,
      description: newSetDescription,
      difficulty: 'intermediate',
      category: 'general',
      isPublic: false
    });
    
    toast({
      title: "Flashcard Set Created",
      description: "Your new flashcard set has been created.",
    });
    
    // Reset form
    setNewSetName('');
    setNewSetDescription('');
  };
  
  // Generate flashcards using AI
  const handleGenerateFlashcards = async () => {
    if (!newCardTags) {
      toast({
        title: "Topic Required",
        description: "Please provide a topic for the flashcards.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const generatedCards = await generateFlashcards(
        newCardTags,
        5,
        'intermediate'
      );
      
      generatedCards.forEach(card => {
        addFlashcard({
          italian: card.italian,
          english: card.english,
          tags: [newCardTags.trim()],
          level: 0,
          mastered: false,
          nextReview: new Date(),
          lastReviewed: null
        });
      });
      
      toast({
        title: "Flashcards Generated",
        description: `${generatedCards.length} flashcards have been generated for ${newCardTags}.`,
      });
      
      // Reset form
      setNewCardTags('');
      setOpenCreateDialog(false);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle importing flashcards
  const handleImportFlashcards = () => {
    // This would be connected to a real file upload
    const mockImportData = [
      { italian: "casa", english: "house", tags: ["basics"] },
      { italian: "gatto", english: "cat", tags: ["animals"] },
      { italian: "cane", english: "dog", tags: ["animals"] },
      { italian: "libro", english: "book", tags: ["basics"] },
      { italian: "penna", english: "pen", tags: ["basics"] }
    ];
    
    importCards(mockImportData);
    
    toast({
      title: "Import Successful",
      description: `Imported ${mockImportData.length} flashcards.`,
    });
    
    setOpenImportDialog(false);
  };
  
  // Render the study view
  const renderStudyView = () => {
    if (studyCards.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">No cards to study right now!</h3>
          <p className="text-muted-foreground mb-6">
            {studyMode === 'due' 
              ? "You don't have any cards due for review. Try studying all cards instead."
              : "You don't have any flashcards yet. Create some to start studying!"}
          </p>
          <Button onClick={() => setOpenCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Flashcard
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Study Session</h3>
            <p className="text-muted-foreground">
              Card {currentCardIndex + 1} of {studyCards.length}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Badge variant="outline" className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-500" />
              {sessionStats.correct}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <X className="h-4 w-4 mr-1 text-red-500" />
              {sessionStats.incorrect}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <ArrowUpDown className="h-4 w-4 mr-1 text-yellow-500" />
              {sessionStats.skipped}
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-center items-center min-h-[300px]">
          {currentFlashcard && (
            <FlashcardComponent
              flashcard={currentFlashcard}
              onRating={handleCardRating}
              onSkip={handleSkipCard}
              flipped={isCardFlipped}
              onFlip={() => setIsCardFlipped(!isCardFlipped)}
            />
          )}
        </div>
        
        <div className="flex justify-center gap-3">
          <Select value={studyMode} onValueChange={(value: "all" | "due" | "difficult") => setStudyMode(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Study Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due">Due Cards</SelectItem>
              <SelectItem value="difficult">Difficult Cards</SelectItem>
              <SelectItem value="all">All Cards</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={initializeStudySession}>
            <Timer className="h-4 w-4 mr-2" />
            Reset Session
          </Button>
        </div>
        
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <SpacedRepetitionInfo />
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render the library view
  const renderLibraryView = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search flashcards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={selectedTags.length ? "filtered" : "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedTags([]);
                }
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="filtered" disabled={selectedTags.length === 0}>
                  {selectedTags.length} Selected
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => setOpenCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
        
        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Flashcard listing */}
        {filteredFlashcards.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No matching flashcards</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedTags.length > 0 
                ? "Try adjusting your filters or search terms."
                : "You don't have any flashcards yet. Create some to get started!"}
            </p>
            <Button onClick={() => setOpenCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Flashcard
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFlashcards.map(card => (
              <Card key={card.id} className="overflow-hidden">
                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-lg mb-1">{card.italian}</h4>
                    <p className="text-muted-foreground">{card.english}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 sm:items-end justify-between">
                    <div className="flex flex-wrap gap-1">
                      {card.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Badge variant={card.mastered ? "default" : "outline"}>
                        {card.mastered ? "Mastered" : `Level ${card.level}`}
                      </Badge>
                      
                      {card.nextReview && (
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(card.nextReview).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render the sets view
  const renderSetsView = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Flashcard Sets</h3>
          <Button variant="outline" onClick={handleCreateFlashcardSet}>
            <Plus className="h-4 w-4 mr-2" />
            Create Set
          </Button>
        </div>
        
        {flashcardSets.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No flashcard sets</h3>
            <p className="text-muted-foreground mb-6">
              Create a set to organize your flashcards by topic or difficulty.
            </p>
            <Button onClick={handleCreateFlashcardSet}>
              <Plus className="h-4 w-4 mr-2" />
              Create Flashcard Set
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcardSets.map(set => (
              <Card key={set.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{set.name}</CardTitle>
                    {set.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <CardDescription>{set.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2 flex-grow">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-muted-foreground">Cards:</span>
                    <span className="font-medium">{set.cards.length}</span>
                  </div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-muted-foreground">Mastered:</span>
                    <span className="font-medium">
                      {set.cards.filter(card => card.mastered).length} / {set.cards.length}
                    </span>
                  </div>
                  <Progress 
                    value={set.cards.length ? (set.cards.filter(card => card.mastered).length / set.cards.length) * 100 : 0} 
                    className="h-2 mt-2"
                  />
                </CardContent>
                
                <CardFooter className="pt-2">
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1">
                      <BarChart className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button className="flex-1">
                      <Brain className="h-4 w-4 mr-2" />
                      Study
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>Flashcards - Italian Learning</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground mt-1">
            Build your Italian vocabulary with spaced repetition.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenImportDialog(true)}>
            <FileUp className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="study" className="flex-1">Study</TabsTrigger>
          <TabsTrigger value="library" className="flex-1">Library</TabsTrigger>
          <TabsTrigger value="sets" className="flex-1">Sets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="study" className="mt-0">
          {renderStudyView()}
        </TabsContent>
        
        <TabsContent value="library" className="mt-0">
          {renderLibraryView()}
        </TabsContent>
        
        <TabsContent value="sets" className="mt-0">
          {renderSetsView()}
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating a new flashcard */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Flashcard</DialogTitle>
            <DialogDescription>
              Add a new flashcard to your collection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="italian">Italian</Label>
              <Input
                id="italian"
                placeholder="Italian word or phrase"
                value={newCardItalian}
                onChange={(e) => setNewCardItalian(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="english">English</Label>
              <Input
                id="english"
                placeholder="English translation"
                value={newCardEnglish}
                onChange={(e) => setNewCardEnglish(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="basics, food, travel"
                value={newCardTags}
                onChange={(e) => setNewCardTags(e.target.value)}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                <span>AI Generation</span>
                <ConfidenceIndicator score={80} size="sm" />
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Let AI generate flashcards based on a topic.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGenerateFlashcards}
                disabled={isProcessing || !newCardTags}
              >
                <Brain className="h-4 w-4 mr-2" />
                Generate Flashcards for Topic
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFlashcard}>Create Flashcard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for importing flashcards */}
      <Dialog open={openImportDialog} onOpenChange={setOpenImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Flashcards</DialogTitle>
            <DialogDescription>
              Import flashcards from a file or other sources.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Import Source</Label>
              <Select defaultValue="csv">
                <SelectTrigger>
                  <SelectValue placeholder="Select import source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV File</SelectItem>
                  <SelectItem value="json">JSON File</SelectItem>
                  <SelectItem value="anki">Anki Deck</SelectItem>
                  <SelectItem value="quizlet">Quizlet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your file here, or click to select
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportFlashcards}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Flashcards;
