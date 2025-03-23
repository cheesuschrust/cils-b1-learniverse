
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  X,
  Volume2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Check,
} from "lucide-react";

// Sample flashcards data
const sampleFlashcards = [
  { id: 1, italian: "casa", english: "house", mastered: false },
  { id: 2, italian: "cibo", english: "food", mastered: false },
  { id: 3, italian: "acqua", english: "water", mastered: true },
  { id: 4, italian: "cittadino", english: "citizen", mastered: false },
  { id: 5, italian: "diritto", english: "right (legal)", mastered: false },
];

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState(sampleFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newItalian, setNewItalian] = useState("");
  const [newEnglish, setNewEnglish] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterMastered, setFilterMastered] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Filter cards based on mastered status
  const filteredCards = filterMastered
    ? flashcards.filter((card) => !card.mastered)
    : flashcards;
  
  // Reset current index when filtered cards change
  useEffect(() => {
    if (filteredCards.length > 0 && currentIndex >= filteredCards.length) {
      setCurrentIndex(0);
    }
  }, [filteredCards, currentIndex]);
  
  const handleFlip = () => {
    if (cardRef.current) {
      cardRef.current.classList.toggle("flipped");
      setFlipped(!flipped);
    }
  };
  
  const handleNext = () => {
    if (filteredCards.length > 0) {
      setFlipped(false);
      if (cardRef.current) {
        cardRef.current.classList.remove("flipped");
      }
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 >= filteredCards.length ? 0 : prevIndex + 1
      );
    }
  };
  
  const handlePrev = () => {
    if (filteredCards.length > 0) {
      setFlipped(false);
      if (cardRef.current) {
        cardRef.current.classList.remove("flipped");
      }
      setCurrentIndex((prevIndex) =>
        prevIndex - 1 < 0 ? filteredCards.length - 1 : prevIndex - 1
      );
    }
  };
  
  const handleMastered = (id: number) => {
    setFlashcards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, mastered: !card.mastered } : card
      )
    );
    
    toast({
      title: "Card updated",
      description: "Flashcard mastery status updated",
    });
  };
  
  const handleAddCard = () => {
    if (!newItalian || !newEnglish) {
      toast({
        title: "Error",
        description: "Please enter both Italian and English words",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API translation verification
    setTimeout(() => {
      const newCard = {
        id: flashcards.length + 1,
        italian: newItalian,
        english: newEnglish,
        mastered: false,
      };
      
      setFlashcards((prevCards) => [...prevCards, newCard]);
      setNewItalian("");
      setNewEnglish("");
      setShowAddCard(false);
      
      toast({
        title: "Success",
        description: "New flashcard added successfully",
      });
      
      setIsLoading(false);
    }, 1000);
  };
  
  const handleDelete = (id: number) => {
    setFlashcards((prevCards) => prevCards.filter((card) => card.id !== id));
    
    toast({
      title: "Card deleted",
      description: "Flashcard removed successfully",
    });
  };
  
  const handleSpeak = (text: string, language: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "italian" ? "it-IT" : "en-US";
    window.speechSynthesis.speak(utterance);
  };
  
  const handleImport = () => {
    // This would be connected to a file upload in a real application
    toast({
      title: "Import feature",
      description: "This feature will be available soon",
    });
  };
  
  const handleExport = () => {
    // This would generate and download a file in a real application
    toast({
      title: "Export feature",
      description: "This feature will be available soon",
    });
  };
  
  const currentCard = filteredCards[currentIndex];
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2 animate-fade-in">
        Flashcards
      </h1>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        Build your Italian vocabulary with interactive flashcards
      </p>
      
      <Tabs defaultValue="practice" className="animate-fade-up">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice">
          <div className="flex flex-col items-center justify-center">
            {filteredCards.length === 0 ? (
              <Card className="w-full max-w-md backdrop-blur-sm border-accent/20">
                <CardContent className="pt-6 pb-6 text-center">
                  <p className="mb-4">No flashcards available.</p>
                  <Button onClick={() => setFilterMastered(false)}>
                    Show All Cards
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="w-full max-w-md mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Card {currentIndex + 1} of {filteredCards.length}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterMastered(!filterMastered)}
                    >
                      {filterMastered
                        ? "Show All Cards"
                        : "Hide Mastered Cards"}
                    </Button>
                  </div>
                </div>
                
                <div
                  ref={cardRef}
                  onClick={handleFlip}
                  className="flashcard w-full max-w-md h-64 mb-8 cursor-pointer perspective-1000"
                >
                  <Card className="flashcard-front absolute w-full h-full bg-gradient-to-br from-accent/20 to-primary/5 backdrop-blur-sm border-accent/20">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6">
                      <h2 className="text-2xl font-bold mb-2">
                        {currentCard.italian}
                      </h2>
                      <p className="text-muted-foreground">Click to flip</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(currentCard.italian, "italian");
                        }}
                      >
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="flashcard-back absolute w-full h-full bg-gradient-to-bl from-primary/10 to-accent/30 backdrop-blur-sm border-accent/20">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6">
                      <h2 className="text-2xl font-bold mb-2">
                        {currentCard.english}
                      </h2>
                      <p className="text-muted-foreground">Click to flip back</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(currentCard.english, "english");
                        }}
                      >
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrev}
                    disabled={filteredCards.length <= 1}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={
                      currentCard.mastered ? "destructive" : "secondary"
                    }
                    onClick={() => handleMastered(currentCard.id)}
                  >
                    {currentCard.mastered ? "Unmark as Mastered" : "Mark as Mastered"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    disabled={filteredCards.length <= 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCurrentIndex(
                        Math.floor(Math.random() * filteredCards.length)
                      );
                      setFlipped(false);
                      if (cardRef.current) {
                        cardRef.current.classList.remove("flipped");
                      }
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Shuffle
                  </Button>
                </div>
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="manage">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Flashcards</h2>
              <Button onClick={() => setShowAddCard(!showAddCard)}>
                {showAddCard ? (
                  <X className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {showAddCard ? "Cancel" : "Add Card"}
              </Button>
            </div>
            
            {showAddCard && (
              <Card className="mb-6 backdrop-blur-sm border-accent/20">
                <CardHeader>
                  <CardTitle>Add New Flashcard</CardTitle>
                  <CardDescription>
                    Enter the Italian word and its English translation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="italian" className="text-sm font-medium">
                        Italian Word
                      </label>
                      <Input
                        id="italian"
                        value={newItalian}
                        onChange={(e) => setNewItalian(e.target.value)}
                        placeholder="e.g. casa"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="english" className="text-sm font-medium">
                        English Translation
                      </label>
                      <Input
                        id="english"
                        value={newEnglish}
                        onChange={(e) => setNewEnglish(e.target.value)}
                        placeholder="e.g. house"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddCard(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCard} disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Card"}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            <div className="space-y-4">
              {flashcards.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No flashcards yet. Add your first card to get started.
                </p>
              ) : (
                flashcards.map((card) => (
                  <Card
                    key={card.id}
                    className={`transition-all hover:shadow-md ${
                      card.mastered ? "bg-green-50" : ""
                    } backdrop-blur-sm border-accent/20`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="grid grid-cols-2 gap-4 flex-grow">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Italian
                            </p>
                            <div className="flex items-center">
                              <p className="font-semibold">{card.italian}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-2"
                                onClick={() =>
                                  handleSpeak(card.italian, "italian")
                                }
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              English
                            </p>
                            <div className="flex items-center">
                              <p className="font-semibold">{card.english}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-2"
                                onClick={() =>
                                  handleSpeak(card.english, "english")
                                }
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant={card.mastered ? "default" : "outline"}
                            size="sm"
                            className="h-8"
                            onClick={() => handleMastered(card.id)}
                          >
                            {card.mastered ? (
                              <>
                                <Check className="h-4 w-4 mr-1" /> Mastered
                              </>
                            ) : (
                              "Mark Mastered"
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(card.id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="import">
          <div className="max-w-md mx-auto space-y-6">
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle>Import Flashcards</CardTitle>
                <CardDescription>
                  Upload a CSV or text file with your flashcards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop a file, or click to browse
                  </p>
                  <Button onClick={handleImport} variant="secondary">
                    Choose File
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: CSV, TXT. Maximum file size: 5MB
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle>Export Flashcards</CardTitle>
                <CardDescription>
                  Download your flashcards for backup or sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">All Flashcards</p>
                    <p className="text-sm text-muted-foreground">
                      {flashcards.length} cards total
                    </p>
                  </div>
                  <Button onClick={handleExport} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Mastered Cards Only</p>
                    <p className="text-sm text-muted-foreground">
                      {flashcards.filter((card) => card.mastered).length} cards
                      mastered
                    </p>
                  </div>
                  <Button onClick={handleExport} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Flashcards;
