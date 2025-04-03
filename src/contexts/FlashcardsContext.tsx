
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from './EnhancedAuthContext';
import { calculateNextReview } from '@/utils/spacedRepetition';
import { useToast } from '@/hooks/use-toast';

interface FlashcardsContextValue {
  flashcards: any[];
  flashcardSets: any[];
  publicFlashcardSets: any[];
  isLoading: boolean;
  createFlashcardSet: (data: any) => Promise<any>;
  updateFlashcardSet: (id: string, data: any) => Promise<any>;
  deleteFlashcardSet: (id: string) => Promise<boolean>;
  getFlashcardSet: (id: string) => Promise<any>;
  fetchFlashcards: () => Promise<any[]>;
  fetchPublicSets: () => Promise<any[]>;
  addCardToSet: (setId: string, cardData: any) => Promise<any>;
  updateCard: (cardId: string, updates: any) => Promise<any>;
  deleteCard: (cardId: string) => Promise<boolean>;
  updateCardProgress: (cardId: string, correct: boolean, confidence: number) => Promise<any>;
  exportFlashcards: () => Promise<any[]>;
  importFlashcards: (data: any[]) => Promise<any>;
}

const FlashcardsContext = createContext<FlashcardsContextValue | undefined>(undefined);

export const FlashcardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [publicFlashcardSets, setPublicFlashcardSets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user's flashcards
  const fetchFlashcards = useCallback(async () => {
    if (!isAuthenticated) {
      setFlashcards([]);
      return [];
    }
    
    try {
      setIsLoading(true);
      
      // Fetch user's flashcards
      const { data, error } = await supabase
        .from('flashcards')
        .select('*, user_flashcard_progress(*)')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Process cards for due dates
      const processed = data.map(card => {
        const progress = card.user_flashcard_progress?.[0];
        const isDue = progress ? 
          (new Date(progress.next_review) <= new Date()) : 
          true;
        
        return {
          ...card,
          progress,
          isDue
        };
      });
      
      setFlashcards(processed);
      return processed;
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      toast({
        title: "Error Loading Flashcards",
        description: "Failed to load your flashcards",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, toast]);

  // Load flashcard sets
  const fetchFlashcardSets = useCallback(async () => {
    if (!isAuthenticated) {
      setFlashcardSets([]);
      return [];
    }
    
    try {
      setIsLoading(true);
      
      // Fetch user's flashcard sets
      const { data: sets, error } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // For each set, fetch the cards
      const setsWithCards = await Promise.all(sets.map(async (set) => {
        // Fetch cards for this set
        const { data: cards, error: cardsError } = await supabase
          .from('flashcards')
          .select('*, user_flashcard_progress(*)')
          .eq('set_id', set.id);
        
        if (cardsError) throw cardsError;
        
        // Calculate due cards
        const processedCards = cards.map(card => {
          const progress = card.user_flashcard_progress?.[0];
          const isDue = progress ? 
            (new Date(progress.next_review) <= new Date()) : 
            true;
          
          return {
            ...card,
            progress,
            isDue
          };
        });
        
        const dueCount = processedCards.filter(card => card.isDue).length;
        
        return {
          ...set,
          cards: processedCards,
          totalCards: processedCards.length,
          dueCount
        };
      }));
      
      setFlashcardSets(setsWithCards);
      return setsWithCards;
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
      toast({
        title: "Error Loading Sets",
        description: "Failed to load your flashcard sets",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, toast]);

  // Fetch public flashcard sets
  const fetchPublicSets = useCallback(async () => {
    try {
      // Fetch public flashcard sets
      const { data: sets, error } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('is_public', true)
        .limit(50);
      
      if (error) throw error;
      
      // Only fetch cards for a few sets to avoid too many requests
      const topSets = sets.slice(0, 10);
      
      const setsWithInfo = await Promise.all(topSets.map(async (set) => {
        // Fetch card count for this set
        const { count, error: countError } = await supabase
          .from('flashcards')
          .select('id', { count: 'exact', head: true })
          .eq('set_id', set.id);
        
        if (countError) throw countError;
        
        // Fetch user profile for this set
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('display_name, first_name, last_name')
          .eq('id', set.user_id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        
        const displayName = profiles 
          ? (profiles.display_name || `${profiles.first_name || ''} ${profiles.last_name || ''}`.trim())
          : 'Anonymous';
        
        return {
          ...set,
          totalCards: count,
          creator: displayName
        };
      }));
      
      // For the rest of the sets, just show basic info
      const otherSets = await Promise.all(sets.slice(10).map(async (set) => {
        return {
          ...set,
          totalCards: '??',
          creator: 'Anonymous'
        };
      }));
      
      const allSets = [...setsWithInfo, ...otherSets];
      setPublicFlashcardSets(allSets);
      return allSets;
    } catch (error) {
      console.error('Error fetching public flashcard sets:', error);
      return [];
    }
  }, []);

  // Create a new flashcard set
  const createFlashcardSet = async (data: any) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to create a flashcard set');
    }
    
    try {
      // Create the set
      const { data: set, error } = await supabase
        .from('flashcard_sets')
        .insert({
          name: data.name,
          description: data.description,
          user_id: user?.id,
          is_public: data.isPublic || false,
          category: data.category,
          language: data.language || 'italian',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // If initial cards were provided, create them
      if (data.initialCards && data.initialCards.length > 0) {
        const cardsWithSetId = data.initialCards.map((card: any) => ({
          ...card,
          set_id: set.id,
          user_id: user?.id,
        }));
        
        const { data: cards, error: cardsError } = await supabase
          .from('flashcards')
          .insert(cardsWithSetId)
          .select();
        
        if (cardsError) throw cardsError;
        
        // Refresh the flashcard sets
        fetchFlashcardSets();
        
        return { ...set, cards };
      }
      
      // Refresh the flashcard sets
      fetchFlashcardSets();
      
      return set;
    } catch (error) {
      console.error('Error creating flashcard set:', error);
      throw error;
    }
  };

  // Get a specific flashcard set with its cards
  const getFlashcardSet = async (id: string) => {
    try {
      // Fetch the set
      const { data: set, error } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Fetch cards for this set
      const { data: cards, error: cardsError } = await supabase
        .from('flashcards')
        .select('*, user_flashcard_progress(*)')
        .eq('set_id', id);
      
      if (cardsError) throw cardsError;
      
      // Process cards for due dates
      const processedCards = cards.map(card => {
        const progress = card.user_flashcard_progress?.[0];
        const isDue = progress ? 
          (new Date(progress.next_review) <= new Date()) : 
          true;
        
        return {
          ...card,
          progress,
          isDue
        };
      });
      
      return { ...set, cards: processedCards };
    } catch (error) {
      console.error(`Error fetching flashcard set ${id}:`, error);
      throw error;
    }
  };

  // Update a flashcard set
  const updateFlashcardSet = async (id: string, data: any) => {
    try {
      const { data: updatedSet, error } = await supabase
        .from('flashcard_sets')
        .update({
          name: data.name,
          description: data.description,
          is_public: data.isPublic,
          category: data.category,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh the flashcard sets
      fetchFlashcardSets();
      
      return updatedSet;
    } catch (error) {
      console.error(`Error updating flashcard set ${id}:`, error);
      throw error;
    }
  };

  // Delete a flashcard set
  const deleteFlashcardSet = async (id: string) => {
    try {
      // Delete the set (cascade will delete its cards)
      const { error } = await supabase
        .from('flashcard_sets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the flashcard sets
      fetchFlashcardSets();
      
      return true;
    } catch (error) {
      console.error(`Error deleting flashcard set ${id}:`, error);
      throw error;
    }
  };

  // Add a card to a set
  const addCardToSet = async (setId: string, cardData: any) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          ...cardData,
          set_id: setId,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh the flashcards
      fetchFlashcards();
      
      return data;
    } catch (error) {
      console.error(`Error adding card to set ${setId}:`, error);
      throw error;
    }
  };

  // Update a card
  const updateCard = async (cardId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', cardId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh the flashcards
      fetchFlashcards();
      
      return data;
    } catch (error) {
      console.error(`Error updating card ${cardId}:`, error);
      throw error;
    }
  };

  // Delete a card
  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', cardId);
      
      if (error) throw error;
      
      // Refresh the flashcards
      fetchFlashcards();
      
      return true;
    } catch (error) {
      console.error(`Error deleting card ${cardId}:`, error);
      throw error;
    }
  };

  // Update card progress with spaced repetition
  const updateCardProgress = async (cardId: string, correct: boolean, confidence: number) => {
    try {
      // First, fetch the current progress for this card
      const { data: card, error: cardError } = await supabase
        .from('flashcards')
        .select('*, user_flashcard_progress(*)')
        .eq('id', cardId)
        .single();
      
      if (cardError) throw cardError;
      
      // Get existing progress or default values
      const progress = card.user_flashcard_progress?.[0];
      const consecutiveCorrect = progress 
        ? (correct ? (progress.consecutive_correct || 0) + 1 : 0)
        : (correct ? 1 : 0);
      
      const easeFactor = progress
        ? (correct ? Math.min(progress.ease_factor + 0.1, 2.5) : Math.max(progress.ease_factor - 0.2, 1.3))
        : (correct ? 2.5 : 2.3);
      
      // Calculate next review date using spaced repetition algorithm
      const result = calculateNextReview(correct, easeFactor, consecutiveCorrect);
      
      // Update or insert progress
      if (progress) {
        // Update existing progress
        const { data, error } = await supabase
          .from('user_flashcard_progress')
          .update({
            next_review: result.nextReviewDate,
            ease_factor: result.difficultyFactor,
            consecutive_correct: consecutiveCorrect,
            review_count: (progress.review_count || 0) + 1,
            status: correct && consecutiveCorrect >= 4 ? 'mastered' : 'learning'
          })
          .eq('id', progress.id)
          .select();
        
        if (error) throw error;
        return data;
      } else {
        // Insert new progress
        const { data, error } = await supabase
          .from('user_flashcard_progress')
          .insert({
            flashcard_id: cardId,
            user_id: user?.id,
            next_review: result.nextReviewDate,
            ease_factor: result.difficultyFactor,
            consecutive_correct: consecutiveCorrect,
            review_count: 1,
            status: correct && consecutiveCorrect >= 4 ? 'mastered' : 'learning'
          })
          .select();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error(`Error updating card progress for ${cardId}:`, error);
      throw error;
    }
  };

  // Export flashcards as JSON
  const exportFlashcards = async () => {
    try {
      // Fetch all the user's flashcard sets
      const sets = await fetchFlashcardSets();
      
      // Format the data for export
      const exportData = sets.map(set => ({
        name: set.name,
        description: set.description,
        category: set.category,
        cards: set.cards.map((card: any) => ({
          front: card.front,
          back: card.back,
          italian: card.italian,
          english: card.english
        }))
      }));
      
      return exportData;
    } catch (error) {
      console.error('Error exporting flashcards:', error);
      throw error;
    }
  };

  // Import flashcards from JSON
  const importFlashcards = async (data: any[]) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to import flashcards');
    }
    
    try {
      // Create each set with its cards
      for (const set of data) {
        // Create the set
        const { data: newSet, error } = await supabase
          .from('flashcard_sets')
          .insert({
            name: set.name,
            description: set.description || 'Imported set',
            category: set.category,
            user_id: user?.id,
            is_public: false
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Create the cards for this set
        if (set.cards && set.cards.length > 0) {
          const cardsWithSetId = set.cards.map((card: any) => ({
            front: card.front,
            back: card.back,
            italian: card.italian || card.front,
            english: card.english || card.back,
            set_id: newSet.id,
            user_id: user?.id
          }));
          
          const { error: cardsError } = await supabase
            .from('flashcards')
            .insert(cardsWithSetId);
          
          if (cardsError) throw cardsError;
        }
      }
      
      // Refresh the flashcard sets
      fetchFlashcardSets();
      
      return { success: true, message: `Imported ${data.length} sets successfully` };
    } catch (error) {
      console.error('Error importing flashcards:', error);
      throw error;
    }
  };

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchFlashcardSets();
      fetchFlashcards();
    } else {
      setFlashcards([]);
      setFlashcardSets([]);
    }
  }, [isAuthenticated, fetchFlashcardSets, fetchFlashcards]);

  const contextValue: FlashcardsContextValue = {
    flashcards,
    flashcardSets,
    publicFlashcardSets,
    isLoading,
    createFlashcardSet,
    updateFlashcardSet,
    deleteFlashcardSet,
    getFlashcardSet,
    fetchFlashcards,
    fetchPublicSets,
    addCardToSet,
    updateCard,
    deleteCard,
    updateCardProgress,
    exportFlashcards,
    importFlashcards
  };

  return (
    <FlashcardsContext.Provider value={contextValue}>
      {children}
    </FlashcardsContext.Provider>
  );
};

export const useFlashcards = () => {
  const context = useContext(FlashcardsContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardsProvider');
  }
  return context;
};
