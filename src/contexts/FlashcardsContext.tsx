
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import * as supabaseClient from '@/lib/supabase-client';
import { Flashcard, FlashcardSet } from '@/types/flashcard';
import { normalizeFlashcard } from '@/types/flashcard';

interface FlashcardsContextType {
  flashcards: Flashcard[];
  flashcardSets: FlashcardSet[];
  isLoading: boolean;
  addFlashcard: (flashcard: Partial<Flashcard>) => Promise<Flashcard>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<Flashcard>;
  deleteFlashcard: (id: string) => Promise<boolean>;
  createFlashcardSet: (set: Partial<FlashcardSet>) => Promise<FlashcardSet>;
  updateFlashcardSet: (id: string, updates: Partial<FlashcardSet>) => Promise<FlashcardSet>;
  deleteFlashcardSet: (id: string) => Promise<boolean>;
  getFlashcardsBySet: (setId: string) => Flashcard[];
  addCardToSet: (setId: string, cardId: string) => Promise<boolean>;
  removeCardFromSet: (setId: string, cardId: string) => Promise<boolean>;
  markCardAsMastered: (cardId: string, mastered: boolean) => Promise<Flashcard>;
  getPublicFlashcardSets: () => Promise<FlashcardSet[]>;
  refreshFlashcards: () => Promise<void>;
}

const FlashcardsContext = createContext<FlashcardsContextType | undefined>(undefined);

export function FlashcardsProvider({ children }: { children: ReactNode }) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshFlashcards = async () => {
    if (!user) {
      setFlashcards([]);
      setFlashcardSets([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [cardsData, setsData] = await Promise.all([
        supabaseClient.fetchFlashcards(user.id),
        supabaseClient.fetchFlashcardSets(user.id)
      ]);

      const normalizedCards = cardsData.map(card => normalizeFlashcard(card));
      setFlashcards(normalizedCards);
      setFlashcardSets(setsData.map(set => ({
        ...set,
        cards: [],
        createdAt: new Date(set.created_at),
        updatedAt: new Date(set.updated_at),
      })));
    } catch (error: any) {
      console.error('Error loading flashcards:', error);
      toast({
        title: 'Error loading flashcards',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshFlashcards();
  }, [user]);

  const addFlashcard = async (flashcard: Partial<Flashcard>) => {
    if (!user) throw new Error('You must be logged in to add flashcards');

    const cardData = {
      user_id: user.id,
      front: flashcard.front || flashcard.italian || '',
      back: flashcard.back || flashcard.english || '',
      italian: flashcard.italian || flashcard.front || '',
      english: flashcard.english || flashcard.back || '',
      tags: flashcard.tags || [],
      difficulty: flashcard.level || 1,
      set_id: flashcard.setId,
    };

    try {
      const newCard = await supabaseClient.createFlashcard(cardData);
      const normalizedCard = normalizeFlashcard(newCard);
      setFlashcards(prev => [...prev, normalizedCard]);
      return normalizedCard;
    } catch (error: any) {
      console.error('Error adding flashcard:', error);
      toast({
        title: 'Error adding flashcard',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateFlashcard = async (id: string, updates: Partial<Flashcard>) => {
    try {
      const updatedCard = await supabaseClient.updateFlashcard(id, {
        front: updates.front,
        back: updates.back,
        italian: updates.italian,
        english: updates.english,
        tags: updates.tags,
        difficulty: updates.level,
      });

      const normalizedCard = normalizeFlashcard(updatedCard);
      setFlashcards(prev => 
        prev.map(card => card.id === id ? normalizedCard : card)
      );
      
      return normalizedCard;
    } catch (error: any) {
      console.error('Error updating flashcard:', error);
      toast({
        title: 'Error updating flashcard',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      await supabaseClient.deleteFlashcard(id);
      setFlashcards(prev => prev.filter(card => card.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting flashcard:', error);
      toast({
        title: 'Error deleting flashcard',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const createFlashcardSet = async (set: Partial<FlashcardSet>) => {
    if (!user) throw new Error('You must be logged in to create flashcard sets');

    const setData = {
      name: set.name || 'New Set',
      description: set.description || '',
      is_public: set.isPublic || false,
      is_favorite: set.isFavorite || false,
      language: set.language || 'italian',
      category: set.category,
      tags: set.tags || [],
      user_id: user.id,
    };

    try {
      const newSet = await supabaseClient.createFlashcardSet(setData);
      const formattedSet = {
        ...newSet,
        id: newSet.id,
        cards: [],
        createdAt: new Date(newSet.created_at),
        updatedAt: new Date(newSet.updated_at),
        isPublic: newSet.is_public,
        isFavorite: newSet.is_favorite,
      };

      setFlashcardSets(prev => [...prev, formattedSet]);
      return formattedSet;
    } catch (error: any) {
      console.error('Error creating flashcard set:', error);
      toast({
        title: 'Error creating flashcard set',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateFlashcardSet = async (id: string, updates: Partial<FlashcardSet>) => {
    try {
      const updatedSet = await supabaseClient.updateFlashcardSet(id, {
        name: updates.name,
        description: updates.description,
        is_public: updates.isPublic,
        is_favorite: updates.isFavorite,
        language: updates.language,
        category: updates.category,
        tags: updates.tags,
      });

      const formattedSet = {
        ...updatedSet,
        id: updatedSet.id,
        cards: flashcardSets.find(set => set.id === id)?.cards || [],
        createdAt: new Date(updatedSet.created_at),
        updatedAt: new Date(updatedSet.updated_at),
        isPublic: updatedSet.is_public,
        isFavorite: updatedSet.is_favorite,
      };

      setFlashcardSets(prev => 
        prev.map(set => set.id === id ? formattedSet : set)
      );
      
      return formattedSet;
    } catch (error: any) {
      console.error('Error updating flashcard set:', error);
      toast({
        title: 'Error updating flashcard set',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteFlashcardSet = async (id: string) => {
    try {
      await supabaseClient.deleteFlashcardSet(id);
      setFlashcardSets(prev => prev.filter(set => set.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting flashcard set:', error);
      toast({
        title: 'Error deleting flashcard set',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getFlashcardsBySet = (setId: string) => {
    return flashcards.filter(card => card.setId === setId);
  };

  const addCardToSet = async (setId: string, cardId: string) => {
    try {
      await supabaseClient.updateFlashcard(cardId, { set_id: setId });
      
      // Update local state
      setFlashcards(prev => prev.map(card => 
        card.id === cardId ? { ...card, setId } : card
      ));
      
      return true;
    } catch (error: any) {
      console.error('Error adding card to set:', error);
      toast({
        title: 'Error adding card to set',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeCardFromSet = async (setId: string, cardId: string) => {
    try {
      await supabaseClient.updateFlashcard(cardId, { set_id: null });
      
      // Update local state
      setFlashcards(prev => prev.map(card => 
        card.id === cardId ? { ...card, setId: undefined } : card
      ));
      
      return true;
    } catch (error: any) {
      console.error('Error removing card from set:', error);
      toast({
        title: 'Error removing card from set',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const markCardAsMastered = async (cardId: string, mastered: boolean) => {
    if (!user) throw new Error('You must be logged in to update flashcards');

    try {
      const updatedProgress = await supabaseClient.updateFlashcardProgress({
        user_id: user.id,
        flashcard_id: cardId,
        status: mastered ? 'mastered' : 'learning',
        last_review: new Date().toISOString(),
      });
      
      const card = flashcards.find(c => c.id === cardId);
      if (!card) throw new Error('Flashcard not found');
      
      const updatedCard = { ...card, mastered };
      setFlashcards(prev => prev.map(c => c.id === cardId ? updatedCard : c));
      
      return updatedCard;
    } catch (error: any) {
      console.error('Error updating flashcard mastery status:', error);
      toast({
        title: 'Error updating flashcard',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getPublicFlashcardSets = async () => {
    try {
      const publicSets = await supabaseClient.fetchPublicFlashcardSets();
      return publicSets.map(set => ({
        ...set,
        cards: [],
        createdAt: new Date(set.created_at),
        updatedAt: new Date(set.updated_at),
        isPublic: set.is_public,
        isFavorite: set.is_favorite,
      }));
    } catch (error: any) {
      console.error('Error fetching public flashcard sets:', error);
      toast({
        title: 'Error fetching public flashcard sets',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  };

  return (
    <FlashcardsContext.Provider
      value={{
        flashcards,
        flashcardSets,
        isLoading,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        createFlashcardSet,
        updateFlashcardSet,
        deleteFlashcardSet,
        getFlashcardsBySet,
        addCardToSet,
        removeCardFromSet,
        markCardAsMastered,
        getPublicFlashcardSets,
        refreshFlashcards,
      }}
    >
      {children}
    </FlashcardsContext.Provider>
  );
}

export function useFlashcards() {
  const context = useContext(FlashcardsContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardsProvider');
  }
  return context;
}
