
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
  
  return {
    flashcards,
    isLoading,
    error,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    toggleMastered,
    refreshFlashcards: fetchFlashcards,
  };
};
