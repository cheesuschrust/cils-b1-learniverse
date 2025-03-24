
import { useState, useEffect, useCallback } from "react";
import { ContentService, Flashcard } from "@/services/ContentService";
import { useToast } from "@/components/ui/use-toast";

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchFlashcards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ContentService.getFlashcards();
      setFlashcards(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load flashcards";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);
  
  const addFlashcard = async (italian: string, english: string) => {
    try {
      const newCard = await ContentService.saveFlashcard({
        italian,
        english,
        mastered: false,
      });
      setFlashcards((prev) => [...prev, newCard]);
      toast({
        title: "Success",
        description: "Flashcard added successfully",
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add flashcard";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const updateFlashcard = async (id: string, updates: Partial<Flashcard>) => {
    try {
      const updatedCard = await ContentService.updateFlashcard(id, updates);
      setFlashcards((prev) =>
        prev.map((card) => (card.id === id ? updatedCard : card))
      );
      toast({
        title: "Success",
        description: "Flashcard updated successfully",
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update flashcard";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const deleteFlashcard = async (id: string) => {
    try {
      await ContentService.deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((card) => card.id !== id));
      toast({
        title: "Success",
        description: "Flashcard deleted successfully",
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete flashcard";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const toggleMastered = async (id: string) => {
    const card = flashcards.find((c) => c.id === id);
    if (!card) return false;
    
    return updateFlashcard(id, { mastered: !card.mastered });
  };
  
  const importFlashcards = async (fileContent: string, format: 'csv' | 'json' = 'csv') => {
    try {
      setIsLoading(true);
      const importedCards = await ContentService.importFlashcards(fileContent, format);
      
      if (importedCards.length > 0) {
        await fetchFlashcards(); // Refresh the full list
        
        toast({
          title: "Import Success",
          description: `Successfully imported ${importedCards.length} flashcards.`,
        });
        return true;
      } else {
        toast({
          title: "Import Warning",
          description: "No flashcards were found to import.",
          variant: "warning",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to import flashcards";
      toast({
        title: "Import Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const exportFlashcards = async (format: 'csv' | 'json' = 'csv', onlyMastered = false) => {
    try {
      setIsLoading(true);
      const exportData = await ContentService.exportFlashcards(format, onlyMastered);
      
      // Create a downloadable file
      const blob = new Blob([exportData], { 
        type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8' 
      });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashcards_${onlyMastered ? 'mastered_' : ''}${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Success",
        description: `Flashcards exported successfully as ${format.toUpperCase()}.`,
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export flashcards";
      toast({
        title: "Export Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    flashcards,
    isLoading,
    error,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    toggleMastered,
    importFlashcards,
    exportFlashcards,
    refreshFlashcards: fetchFlashcards,
  };
};
