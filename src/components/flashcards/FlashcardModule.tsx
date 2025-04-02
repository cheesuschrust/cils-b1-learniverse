
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Volume2, Plus, Save, Trash2, PenLine, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Flashcard {
  id: string;
  italian: string;
  english: string;
  notes?: string;
  tags?: string[];
}

const FlashcardModule = () => {
  const { user } = useAuth();
  const isPremium = user?.isPremiumUser || false;
  
  const [activeTab, setActiveTab] = useState<string>('study');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [newCardItalian, setNewCardItalian] = useState<string>('');
  const [newCardEnglish, setNewCardEnglish] = useState<string>('');
  const [newCardNotes, setNewCardNotes] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Load flashcards from storage or API
  useEffect(() => {
    // For demo purposes, using mock data
    const mockFlashcards: Flashcard[] = [
      {
        id: '1',
        italian: 'Ciao',
        english: 'Hello',
        notes: 'Informal greeting'
      },
      {
        id: '2',
        italian: 'Arrivederci',
        english: 'Goodbye',
        notes: 'Formal goodbye'
      },
      {
        id: '3',
        italian: 'Grazie',
        english: 'Thank you',
        notes: ''
      },
    ];
    
    setFlashcards(mockFlashcards);
  }, []);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };
  
  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };
  
  const handleAddCard = () => {
    if (!newCardItalian || !newCardEnglish) return;
    
    const newCard: Flashcard = {
      id: Date.now().toString(),
      italian: newCardItalian,
      english: newCardEnglish,
      notes: newCardNotes,
    };
    
    setFlashcards([...flashcards, newCard]);
    setNewCardItalian('');
    setNewCardEnglish('');
    setNewCardNotes('');
  };
  
  const handleSpeakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    window.speechSynthesis.speak(utterance);
  };
  
  const handleEditCard = (card: Flashcard) => {
    setActiveCardId(card.id);
    setNewCardItalian(card.italian);
    setNewCardEnglish(card.english);
    setNewCardNotes(card.notes || '');
    setEditMode(true);
  };
  
  const handleUpdateCard = () => {
    const updatedCards = flashcards.map(card => 
      card.id === activeCardId 
        ? { 
            ...card, 
            italian: newCardItalian, 
            english: newCardEnglish, 
            notes: newCardNotes 
          }
        : card
    );
    
    setFlashcards(updatedCards);
    setNewCardItalian('');
    setNewCardEnglish('');
    setNewCardNotes('');
    setEditMode(false);
    setActiveCardId(null);
  };
  
  const handleDeleteCard = (id: string) => {
    const updatedCards = flashcards.filter(card => card.id !== id);
    setFlashcards(updatedCards);
    if (currentCardIndex >= updatedCards.length) {
      setCurrentCardIndex(Math.max(0, updatedCards.length - 1));
    }
  };
  
  const handleCancelEdit = () => {
    setNewCardItalian('');
    setNewCardEnglish('');
    setNewCardNotes('');
    setEditMode(false);
    setActiveCardId(null);
  };
  
  const filteredCards = flashcards.filter(card => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      card.italian.toLowerCase().includes(query) ||
      card.english.toLowerCase().includes(query) ||
      (card.notes && card.notes.toLowerCase().includes(query))
    );
  });
  
  const currentCard = filteredCards[currentCardIndex];
  const maxCards = isPremium ? 500 : 50;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Flashcards</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="study" className="space-y-6">
          {flashcards.length > 0 ? (
            <>
              <div className="flex justify-between items-center max-w-md mx-auto">
                <span className="text-sm text-muted-foreground">
                  Card {currentCardIndex + 1} of {filteredCards.length}
                </span>
                
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Search cards..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>
              
              <div 
                className="max-w-md mx-auto h-64 cursor-pointer perspective"
                onClick={handleFlip}
              >
                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front of card */}
                  <Card className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-6 text-center">
                    <CardContent className="pt-6">
                      <h3 className="text-2xl font-semibold mb-6">
                        {currentCard?.italian}
                      </h3>
                      <p className="text-muted-foreground text-sm italic">Click to reveal translation</p>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeakText(currentCard?.italian);
                        }} 
                        className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
                        aria-label="Speak text"
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    </CardContent>
                  </Card>
                  
                  {/* Back of card */}
                  <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col justify-center items-center p-6 text-center">
                    <CardContent className="pt-6">
                      <h3 className="text-2xl font-semibold mb-4">
                        {currentCard?.english}
                      </h3>
                      
                      {currentCard?.notes && (
                        <p className="text-sm text-muted-foreground mt-4">
                          {currentCard.notes}
                        </p>
                      )}
                      
                      <p className="text-muted-foreground text-sm italic mt-6">Click to return</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 max-w-md mx-auto">
                <Button onClick={handlePrevCard} variant="outline">
                  Previous
                </Button>
                <Button onClick={handleNextCard}>
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No flashcards found</p>
              <Button onClick={() => setActiveTab('create')}>Create your first flashcard</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {!isPremium && (
                  <div className="text-sm text-amber-600 mb-4">
                    <p>Free user limit: {flashcards.length}/{maxCards} cards</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="italian">Italian</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="italian"
                      value={newCardItalian}
                      onChange={(e) => setNewCardItalian(e.target.value)}
                      placeholder="Enter text in Italian"
                      disabled={flashcards.length >= maxCards && !isPremium && !editMode}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      type="button"
                      onClick={() => handleSpeakText(newCardItalian)}
                      disabled={!newCardItalian}
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="english">English</Label>
                  <Input 
                    id="english"
                    value={newCardEnglish}
                    onChange={(e) => setNewCardEnglish(e.target.value)}
                    placeholder="Enter translation in English"
                    disabled={flashcards.length >= maxCards && !isPremium && !editMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea 
                    id="notes"
                    value={newCardNotes}
                    onChange={(e) => setNewCardNotes(e.target.value)}
                    placeholder="Add additional context or notes"
                    rows={3}
                    disabled={flashcards.length >= maxCards && !isPremium && !editMode}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  {editMode ? (
                    <>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateCard}>
                        <Save className="h-4 w-4 mr-2" />
                        Update Card
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={handleAddCard}
                      disabled={(flashcards.length >= maxCards && !isPremium) || !newCardItalian || !newCardEnglish}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                  )}
                </div>
                
                {flashcards.length >= maxCards && !isPremium && (
                  <div className="mt-4 p-4 border rounded-md bg-muted/20">
                    <p className="text-sm font-medium">Free user limit reached</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upgrade to Premium to create unlimited flashcards
                    </p>
                    <Button className="mt-2" size="sm">
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-6">
          {flashcards.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Your Flashcards</h3>
                <Input 
                  placeholder="Search cards..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48"
                />
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {filteredCards.map((card) => (
                  <Card key={card.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-grow">
                        <div className="flex items-center">
                          <span className="font-medium">{card.italian}</span>
                          <button 
                            onClick={() => handleSpeakText(card.italian)} 
                            className="ml-2 text-muted-foreground hover:text-primary"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">{card.english}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditCard(card)}
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No flashcards found</p>
              <Button onClick={() => setActiveTab('create')}>Create your first flashcard</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlashcardModule;
