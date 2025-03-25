
import React, { useState } from 'react';
import { useFlashcards, Deck, Flashcard } from '@/hooks/useFlashcards';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FlashcardPronunciation } from '@/components/flashcards/FlashcardPronunciation';
import { SpacedRepetitionInfo } from '@/components/flashcards/SpacedRepetitionInfo';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { 
  Plus, X, Check, ArrowLeftRight, Trash2, Edit, Save, Book, ListChecks,
  PlayCircle, RefreshCw, Download, Upload, ChevronLeft, ChevronRight, Bookmark,
} from 'lucide-react';

const Flashcards = () => {
  const {
    decks,
    activeDeck,
    activeDeckId,
    setActiveDeckId,
    isReviewing,
    showBack,
    currentCardIndex,
    dueCardIds,
    reviewedCardIds,
    startReview,
    endReview,
    nextCard,
    prevCard,
    flipCard,
    markCardResult,
    createDeck,
    updateDeck,
    deleteDeck,
    createCard,
    updateCard,
    deleteCard,
    toggleCardMastery,
    resetProgress,
    addTagToDeck,
    removeTagFromDeck,
    addTagToCard,
    removeTagFromCard,
    importCardsFromCsv,
    exportDeckToCsv,
    isLoading,
    error,
  } = useFlashcards();
  const { toast } = useToast();
  const { translateText, isAIEnabled } = useAIUtils();
  const { preferredLanguage } = useUserPreferences();
  
  // State for new deck
  const [isNewDeckDialogOpen, setIsNewDeckDialogOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [newDeckLanguage, setNewDeckLanguage] = useState<'english' | 'italian'>(
    preferredLanguage === 'italian' ? 'italian' : 'english'
  );
  
  // State for new card
  const [isNewCardDialogOpen, setIsNewCardDialogOpen] = useState(false);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardNotes, setNewCardNotes] = useState('');
  const [newCardTags, setNewCardTags] = useState('');
  const [newCardFrontLang, setNewCardFrontLang] = useState<'english' | 'italian'>(
    preferredLanguage === 'italian' ? 'italian' : 'english'
  );
  const [newCardBackLang, setNewCardBackLang] = useState<'english' | 'italian'>(
    preferredLanguage === 'italian' ? 'english' : 'italian'
  );
  
  // State for import/export
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importContent, setImportContent] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  // State for editing
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  
  // Create a new deck
  const handleCreateDeck = () => {
    if (!newDeckName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a name for the deck.',
        variant: 'destructive',
      });
      return;
    }
    
    createDeck(newDeckName, newDeckDescription, newDeckLanguage);
    setNewDeckName('');
    setNewDeckDescription('');
    setIsNewDeckDialogOpen(false);
  };
  
  // Create a new card
  const handleCreateCard = () => {
    if (!newCardFront.trim() || !newCardBack.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both front and back text for the card.',
        variant: 'destructive',
      });
      return;
    }
    
    const tags = newCardTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    createCard(activeDeckId, {
      front: newCardFront,
      back: newCardBack,
      notes: newCardNotes,
      tags,
      frontLanguage: newCardFrontLang,
      backLanguage: newCardBackLang,
    });
    
    setNewCardFront('');
    setNewCardBack('');
    setNewCardNotes('');
    setNewCardTags('');
    setIsNewCardDialogOpen(false);
  };
  
  // Handle card update
  const handleUpdateCard = () => {
    if (!editingCard) return;
    
    if (!editingCard.front.trim() || !editingCard.back.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both front and back text for the card.',
        variant: 'destructive',
      });
      return;
    }
    
    updateCard(activeDeckId, editingCard.id, editingCard);
    setEditingCard(null);
  };
  
  // Handle deck update
  const handleUpdateDeck = () => {
    if (!editingDeck) return;
    
    if (!editingDeck.name.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a name for the deck.',
        variant: 'destructive',
      });
      return;
    }
    
    updateDeck(editingDeck.id, editingDeck);
    setEditingDeck(null);
  };
  
  // Handle import
  const handleImport = async () => {
    if (!importContent.trim()) {
      toast({
        title: 'Missing Content',
        description: 'Please enter CSV content to import.',
        variant: 'destructive',
      });
      return;
    }
    
    const importedCount = await importCardsFromCsv(activeDeckId, importContent);
    if (importedCount > 0) {
      setImportContent('');
      setIsImportDialogOpen(false);
    }
  };
  
  // Handle export
  const handleExport = () => {
    const csvContent = exportDeckToCsv(activeDeckId);
    
    if (csvContent) {
      // Create a download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeDeck.name.replace(/\s+/g, '_')}_flashcards.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: `${activeDeck.name} has been exported to CSV.`,
      });
    }
  };
  
  // Auto-translate function (when AI is enabled)
  const handleAutoTranslate = async () => {
    if (!isAIEnabled || !translateText) {
      toast({
        title: 'AI Features Disabled',
        description: 'Enable AI features to use auto-translation.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (newCardFront && !newCardBack) {
        const sourceLang = newCardFrontLang === 'italian' ? 'it' : 'en';
        const targetLang = newCardBackLang === 'italian' ? 'it' : 'en';
        
        const translation = await translateText(newCardFront, sourceLang, targetLang);
        setNewCardBack(translation);
        
        toast({
          title: 'Translation Added',
          description: 'The text has been automatically translated.',
        });
      }
    } catch (err) {
      toast({
        title: 'Translation Failed',
        description: err instanceof Error ? err.message : 'Failed to translate text',
        variant: 'destructive',
      });
    }
  };
  
  // Swap languages
  const handleSwapLanguages = () => {
    const tempLang = newCardFrontLang;
    setNewCardFrontLang(newCardBackLang);
    setNewCardBackLang(tempLang);
    
    // Also swap content if both fields have text
    if (newCardFront && newCardBack) {
      const tempText = newCardFront;
      setNewCardFront(newCardBack);
      setNewCardBack(tempText);
    }
  };
  
  // Render current review card
  const renderReviewCard = () => {
    if (!isReviewing || dueCardIds.length === 0) return null;
    
    const currentCardId = dueCardIds[currentCardIndex];
    const card = activeDeck.cards.find(c => c.id === currentCardId);
    
    if (!card) return null;
    
    return (
      <div className="w-full max-w-xl mx-auto mt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Card {currentCardIndex + 1} of {dueCardIds.length}
          </div>
          <Button variant="outline" size="sm" onClick={endReview}>
            End Review
          </Button>
        </div>
        
        <Card className="w-full h-64 flex flex-col">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <Badge variant="outline">{card.frontLanguage}</Badge>
              <SpacedRepetitionInfo card={card} compact />
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center items-center p-6">
            <div className="text-2xl font-semibold text-center mb-4">
              {showBack ? card.back : card.front}
            </div>
            
            {showBack && (
              <div className="mt-2">
                <FlashcardPronunciation 
                  text={card.back} 
                  language={card.backLanguage === 'italian' ? 'it-IT' : 'en-US'} 
                />
              </div>
            )}
            
            {card.notes && showBack && (
              <div className="mt-4 text-sm text-muted-foreground border-t pt-2 w-full">
                <span className="font-medium">Notes:</span> {card.notes}
              </div>
            )}
          </CardContent>
        </Card>
        
        {!showBack ? (
          <Button 
            className="w-full mt-4" 
            onClick={flipCard}
          >
            Show Answer
          </Button>
        ) : (
          <div className="grid grid-cols-4 gap-2 mt-4">
            <Button 
              variant="outline" 
              className="border-red-500 hover:bg-red-100 dark:hover:bg-red-950" 
              onClick={() => markCardResult('again')}
            >
              Again
            </Button>
            <Button 
              variant="outline" 
              className="border-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-950" 
              onClick={() => markCardResult('hard')}
            >
              Hard
            </Button>
            <Button 
              variant="outline" 
              className="border-green-500 hover:bg-green-100 dark:hover:bg-green-950" 
              onClick={() => markCardResult('good')}
            >
              Good
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-950" 
              onClick={() => markCardResult('easy')}
            >
              Easy
            </Button>
          </div>
        )}
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={prevCard}
            disabled={currentCardIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={nextCard}
            disabled={currentCardIndex === dueCardIds.length - 1}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render deck list and cards
  const renderDeckAndCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Deck list */}
        <div className="md:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Decks</h2>
            <Dialog open={isNewDeckDialogOpen} onOpenChange={setIsNewDeckDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Deck
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Deck</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="deckName">Deck Name</Label>
                    <Input
                      id="deckName"
                      placeholder="Enter deck name"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deckDescription">Description</Label>
                    <Textarea
                      id="deckDescription"
                      placeholder="Enter deck description"
                      value={newDeckDescription}
                      onChange={(e) => setNewDeckDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deckLanguage">Primary Language</Label>
                    <Select value={newDeckLanguage} onValueChange={(value) => setNewDeckLanguage(value as 'english' | 'italian')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewDeckDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateDeck}>Create Deck</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {decks.length === 0 ? (
              <div className="text-center p-4 border rounded-md">
                <p className="text-muted-foreground">No decks yet. Create your first deck to get started!</p>
              </div>
            ) : (
              decks.map(deck => (
                <div
                  key={deck.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    deck.id === activeDeckId ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveDeckId(deck.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{deck.name}</h3>
                      <p className="text-xs text-muted-foreground">{deck.totalCards} cards</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {deck.id === activeDeckId && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDeck({...deck});
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete "${deck.name}"?`)) {
                                deleteDeck(deck.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {deck.language && (
                      <Badge variant="outline" className="text-xs">
                        {deck.language}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {deck.dueCards} due
                    </Badge>
                    {deck.masteredCards > 0 && (
                      <Badge variant="secondary" className="text-xs text-green-600">
                        {deck.masteredCards} mastered
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Cards section */}
        <div className="md:col-span-3">
          {activeDeck.id ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{activeDeck.name}</h1>
                  <p className="text-muted-foreground">{activeDeck.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={startReview}
                    disabled={activeDeck.dueCards === 0}
                  >
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Review Deck
                  </Button>
                  <Dialog open={isNewCardDialogOpen} onOpenChange={setIsNewCardDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Add Card
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Card</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="frontLanguage">Front Language</Label>
                            <Select value={newCardFrontLang} onValueChange={(value) => setNewCardFrontLang(value as 'english' | 'italian')}>
                              <SelectTrigger>
                                <SelectValue placeholder="Front language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="italian">Italian</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="backLanguage">Back Language</Label>
                            <Select value={newCardBackLang} onValueChange={(value) => setNewCardBackLang(value as 'english' | 'italian')}>
                              <SelectTrigger>
                                <SelectValue placeholder="Back language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="italian">Italian</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleSwapLanguages} 
                            title="Swap languages"
                          >
                            <ArrowLeftRight className="h-4 w-4" />
                          </Button>
                          {isAIEnabled && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleAutoTranslate}
                              disabled={!newCardFront}
                              className="ml-auto"
                            >
                              Auto-translate
                            </Button>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="cardFront">Front Side</Label>
                          <Textarea
                            id="cardFront"
                            placeholder={`Enter text in ${newCardFrontLang}`}
                            value={newCardFront}
                            onChange={(e) => setNewCardFront(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardBack">Back Side</Label>
                          <Textarea
                            id="cardBack"
                            placeholder={`Enter text in ${newCardBackLang}`}
                            value={newCardBack}
                            onChange={(e) => setNewCardBack(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNotes">Notes (Optional)</Label>
                          <Textarea
                            id="cardNotes"
                            placeholder="Enter any additional notes"
                            value={newCardNotes}
                            onChange={(e) => setNewCardNotes(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardTags">Tags (comma separated)</Label>
                          <Input
                            id="cardTags"
                            placeholder="grammar, basics, food, etc."
                            value={newCardTags}
                            onChange={(e) => setNewCardTags(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsNewCardDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleCreateCard}>Add Card</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Import
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import Cards</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <p className="text-sm text-muted-foreground">
                          Paste CSV content below. Format: Front,Back,Notes,Tags
                        </p>
                        <Textarea
                          placeholder="Front,Back,Notes,Tags
Hello,Ciao,,greeting;basic
Thank you,Grazie,,courtesy"
                          className="min-h-[200px] font-mono text-sm"
                          value={importContent}
                          onChange={(e) => setImportContent(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleImport} disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                Importing...
                              </>
                            ) : (
                              'Import Cards'
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (confirm('Reset progress for all cards in this deck?')) {
                        resetProgress(activeDeckId);
                      }
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reset Progress
                  </Button>
                </div>
              </div>
              
              {/* Deck stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Book className="mr-2 h-4 w-4" />
                      Total Cards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-2xl font-bold">{activeDeck.totalCards}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <ListChecks className="mr-2 h-4 w-4" />
                      Due for Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-2xl font-bold">{activeDeck.dueCards}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Check className="mr-2 h-4 w-4" />
                      Mastered
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-2xl font-bold">{activeDeck.masteredCards}</p>
                  </CardContent>
                </Card>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Cards ({activeDeck.totalCards})</TabsTrigger>
                  <TabsTrigger value="due">Due ({activeDeck.dueCards})</TabsTrigger>
                  <TabsTrigger value="mastered">Mastered ({activeDeck.masteredCards})</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  {activeDeck.cards.length === 0 ? (
                    <div className="text-center p-8 border rounded-md">
                      <p className="text-muted-foreground">No cards in this deck yet. Add your first card to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeDeck.cards.map((card) => (
                        <Card key={card.id} className={card.isMastered ? 'border-green-200 dark:border-green-800' : ''}>
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                  {card.frontLanguage}
                                </Badge>
                                {card.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => toggleCardMastery(activeDeckId, card.id)}
                                  title={card.isMastered ? "Mark as not mastered" : "Mark as mastered"}
                                >
                                  <Bookmark className={`h-4 w-4 ${card.isMastered ? 'fill-green-500 text-green-500' : ''}`} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => setEditingCard({...card})}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => {
                                    if (confirm('Delete this card?')) {
                                      deleteCard(activeDeckId, card.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <p className="text-xs uppercase text-muted-foreground mb-1">Front</p>
                                <p className="font-medium">{card.front}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase text-muted-foreground mb-1">Back</p>
                                <p className="font-medium">{card.back}</p>
                                <div className="mt-2">
                                  <FlashcardPronunciation 
                                    text={card.back} 
                                    language={card.backLanguage === 'italian' ? 'it-IT' : 'en-US'} 
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {card.notes && (
                              <div className="mt-4 border-t pt-2">
                                <p className="text-xs uppercase text-muted-foreground mb-1">Notes</p>
                                <p className="text-sm">{card.notes}</p>
                              </div>
                            )}
                            
                            <div className="mt-4">
                              <SpacedRepetitionInfo card={card} compact />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="due" className="mt-4">
                  {activeDeck.cards.filter(card => !card.isMastered && (!card.dueDate || isBefore(new Date(), card.dueDate))).length === 0 ? (
                    <div className="text-center p-8 border rounded-md">
                      <p className="text-muted-foreground">No cards due for review. Great job!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeDeck.cards
                        .filter(card => !card.isMastered && (!card.dueDate || isBefore(new Date(), card.dueDate)))
                        .map((card) => (
                          <Card key={card.id}>
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">
                                    {card.frontLanguage}
                                  </Badge>
                                  {card.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => toggleCardMastery(activeDeckId, card.id)}
                                    title="Mark as mastered"
                                  >
                                    <Bookmark className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-xs uppercase text-muted-foreground mb-1">Front</p>
                                  <p className="font-medium">{card.front}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase text-muted-foreground mb-1">Back</p>
                                  <p className="font-medium">{card.back}</p>
                                  <div className="mt-2">
                                    <FlashcardPronunciation 
                                      text={card.back} 
                                      language={card.backLanguage === 'italian' ? 'it-IT' : 'en-US'} 
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <SpacedRepetitionInfo card={card} compact />
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="mastered" className="mt-4">
                  {activeDeck.cards.filter(card => card.isMastered).length === 0 ? (
                    <div className="text-center p-8 border rounded-md">
                      <p className="text-muted-foreground">No cards have been mastered yet. Keep studying!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeDeck.cards
                        .filter(card => card.isMastered)
                        .map((card) => (
                          <Card key={card.id} className="border-green-200 dark:border-green-800">
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">
                                    {card.frontLanguage}
                                  </Badge>
                                  {card.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => toggleCardMastery(activeDeckId, card.id)}
                                    title="Mark as not mastered"
                                  >
                                    <Bookmark className="h-4 w-4 fill-green-500 text-green-500" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-xs uppercase text-muted-foreground mb-1">Front</p>
                                  <p className="font-medium">{card.front}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase text-muted-foreground mb-1">Back</p>
                                  <p className="font-medium">{card.back}</p>
                                  <div className="mt-2">
                                    <FlashcardPronunciation 
                                      text={card.back} 
                                      language={card.backLanguage === 'italian' ? 'it-IT' : 'en-US'} 
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <SpacedRepetitionInfo card={card} compact />
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              {/* Edit card dialog */}
              {editingCard && (
                <Dialog open={!!editingCard} onOpenChange={(open) => !open && setEditingCard(null)}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Card</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="editFrontLanguage">Front Language</Label>
                          <Select 
                            value={editingCard.frontLanguage} 
                            onValueChange={(value) => setEditingCard({...editingCard, frontLanguage: value as 'english' | 'italian'})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Front language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="italian">Italian</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="editBackLanguage">Back Language</Label>
                          <Select 
                            value={editingCard.backLanguage} 
                            onValueChange={(value) => setEditingCard({...editingCard, backLanguage: value as 'english' | 'italian'})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Back language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="italian">Italian</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="editCardFront">Front Side</Label>
                        <Textarea
                          id="editCardFront"
                          placeholder={`Enter text in ${editingCard.frontLanguage}`}
                          value={editingCard.front}
                          onChange={(e) => setEditingCard({...editingCard, front: e.target.value})}
                          className="min-h-[80px]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editCardBack">Back Side</Label>
                        <Textarea
                          id="editCardBack"
                          placeholder={`Enter text in ${editingCard.backLanguage}`}
                          value={editingCard.back}
                          onChange={(e) => setEditingCard({...editingCard, back: e.target.value})}
                          className="min-h-[80px]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editCardNotes">Notes (Optional)</Label>
                        <Textarea
                          id="editCardNotes"
                          placeholder="Enter any additional notes"
                          value={editingCard.notes || ''}
                          onChange={(e) => setEditingCard({...editingCard, notes: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editCardTags">Tags (comma separated)</Label>
                        <Input
                          id="editCardTags"
                          placeholder="grammar, basics, food, etc."
                          value={editingCard.tags.join(', ')}
                          onChange={(e) => setEditingCard({
                            ...editingCard, 
                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                          })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="editCardMastered"
                          checked={editingCard.isMastered}
                          onCheckedChange={(checked) => setEditingCard({...editingCard, isMastered: checked})}
                        />
                        <Label htmlFor="editCardMastered">Mark as mastered</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEditingCard(null)}>Cancel</Button>
                        <Button onClick={handleUpdateCard}>
                          <Save className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              
              {/* Edit deck dialog */}
              {editingDeck && (
                <Dialog open={!!editingDeck} onOpenChange={(open) => !open && setEditingDeck(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Deck</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="editDeckName">Deck Name</Label>
                        <Input
                          id="editDeckName"
                          value={editingDeck.name}
                          onChange={(e) => setEditingDeck({...editingDeck, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editDeckDescription">Description</Label>
                        <Textarea
                          id="editDeckDescription"
                          value={editingDeck.description}
                          onChange={(e) => setEditingDeck({...editingDeck, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editDeckLanguage">Primary Language</Label>
                        <Select 
                          value={editingDeck.language} 
                          onValueChange={(value) => setEditingDeck({...editingDeck, language: value as 'english' | 'italian'})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="italian">Italian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editDeckTags">Tags (comma separated)</Label>
                        <Input
                          id="editDeckTags"
                          value={editingDeck.tags.join(', ')}
                          onChange={(e) => setEditingDeck({
                            ...editingDeck, 
                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                          })}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEditingDeck(null)}>Cancel</Button>
                        <Button onClick={handleUpdateDeck}>
                          <Save className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </>
          ) : (
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground">Select a deck or create a new one to get started.</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
      {isReviewing ? renderReviewCard() : renderDeckAndCards()}
    </div>
  );
};

export default Flashcards;
