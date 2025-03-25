
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useFlashcards } from "@/hooks/useFlashcards";
import SpeakableWord from "@/components/learning/SpeakableWord";
import "../styles/flashcards.css";

const Flashcards = () => {
  const {
    flashcards,
    isLoading,
    error,
    addFlashcard,
    toggleMastered,
    deleteFlashcard,
    importFlashcards,
    exportFlashcards,
    refreshFlashcards,
  } = useFlashcards();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newItalian, setNewItalian] = useState("");
  const [newEnglish, setNewEnglish] = useState("");
  const [filterMastered, setFilterMastered] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [exportMasteredOnly, setExportMasteredOnly] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  
  const handleMastered = async (id: string) => {
    await toggleMastered(id);
  };
  
  const handleAddCard = async () => {
    if (!newItalian || !newEnglish) {
      toast({
        title: "Error",
        description: "Please enter both Italian and English words",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    const success = await addFlashcard(newItalian, newEnglish);
    
    if (success) {
      setNewItalian("");
      setNewEnglish("");
      setShowAddCard(false);
    }
    setIsSubmitting(false);
  };
  
  const handleDelete = async (id: string) => {
    await deleteFlashcard(id);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const format = file.name.endsWith('.json') ? 'json' : 'csv';
        await importFlashcards(content, format);
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "File Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
    };
    
    reader.readAsText(file);
  };
  
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleExport = async () => {
    await exportFlashcards(exportFormat, exportMasteredOnly);
    setIsFileDialogOpen(false);
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
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="practice" className="animate-fade-up">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice">
          <div className="flex flex-col items-center justify-center">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredCards.length === 0 ? (
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
                        <SpeakableWord 
                          word={currentCard.italian} 
                          language="it"
                          autoPlay={false}
                        />
                      </h2>
                      <p className="text-muted-foreground">Click to flip</p>
                    </CardContent>
                  </Card>
                  <Card className="flashcard-back absolute w-full h-full bg-gradient-to-bl from-primary/10 to-accent/30 backdrop-blur-sm border-accent/20">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6">
                      <h2 className="text-2xl font-bold mb-2">
                        <SpeakableWord 
                          word={currentCard.english} 
                          language="en"
                          autoPlay={false}
                        />
                      </h2>
                      <p className="text-muted-foreground">Click to flip back</p>
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
                  <Button onClick={handleAddCard} disabled={isSubmitting || !newItalian || !newEnglish}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Card"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
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
                        card.mastered ? "bg-secondary/20" : ""
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
                                <SpeakableWord 
                                  word={card.italian} 
                                  language="it"
                                  className="font-semibold" 
                                />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">
                                English
                              </p>
                              <div className="flex items-center">
                                <SpeakableWord 
                                  word={card.english} 
                                  language="en"
                                  className="font-semibold" 
                                />
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
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="import">
          <div className="max-w-md mx-auto space-y-6">
            <Card className="backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle>Import Flashcards</CardTitle>
                <CardDescription>
                  Upload a CSV or JSON file with your flashcards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="import-zone rounded-md p-6 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv,.json,.txt"
                    className="hidden"
                  />
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop a file, or click to browse
                  </p>
                  <Button onClick={handleImport} variant="secondary">
                    Choose File
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: CSV, JSON. Maximum file size: 5MB
                </p>
                <div className="bg-secondary/20 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">CSV Format Example:</p>
                  <pre className="text-xs overflow-x-auto p-2 bg-background/50 rounded">
                    italian,english,mastered<br />
                    casa,house,false<br />
                    gatto,cat,false
                  </pre>
                </div>
                <div className="bg-secondary/20 p-4 rounded-md">
                  <p className="text-sm font-semibold mb-2">JSON Format Example:</p>
                  <pre className="text-xs overflow-x-auto p-2 bg-background/50 rounded">
                    {`[
  {"italian":"casa","english":"house","mastered":false},
  {"italian":"gatto","english":"cat","mastered":false}
]`}
                  </pre>
                </div>
              </CardContent>
            </Card>
            
            <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
              <DialogTrigger asChild>
                <Card className="backdrop-blur-sm border-accent/20 cursor-pointer hover:bg-accent/10 transition-colors">
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
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Export Flashcards</DialogTitle>
                  <DialogDescription>
                    Choose your export format and options
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Export Format</p>
                    <div className="flex gap-4">
                      <Button 
                        variant={exportFormat === 'csv' ? "default" : "outline"}
                        onClick={() => setExportFormat('csv')}
                        className="flex-1"
                      >
                        CSV
                      </Button>
                      <Button 
                        variant={exportFormat === 'json' ? "default" : "outline"}
                        onClick={() => setExportFormat('json')}
                        className="flex-1"
                      >
                        JSON
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Cards to Export</p>
                    <div className="flex gap-4">
                      <Button 
                        variant={!exportMasteredOnly ? "default" : "outline"}
                        onClick={() => setExportMasteredOnly(false)}
                        className="flex-1"
                      >
                        All Cards
                      </Button>
                      <Button 
                        variant={exportMasteredOnly ? "default" : "outline"}
                        onClick={() => setExportMasteredOnly(true)}
                        className="flex-1"
                      >
                        Mastered Only
                      </Button>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsFileDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleExport} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Flashcards;
