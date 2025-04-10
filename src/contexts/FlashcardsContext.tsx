
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { FlashcardSet, Flashcard } from '@/types/interface-fixes';
import { convertDbFlashcardToFlashcard, convertFlashcardToDbFormat } from '@/utils/flashcardUtils';
import { safeParseDate, ensureDate } from '@/utils/dateUtils';

interface FlashcardsContextType {
  flashcards: Flashcard[];
  flashcardSets: FlashcardSet[];
  publicFlashcardSets: FlashcardSet[];
  isLoading: boolean;
  error: string | null;
  createFlashcardSet: (data: Partial<FlashcardSet>) => Promise<string | null>;
  updateFlashcardSet: (id: string, data: Partial<FlashcardSet>) => Promise<boolean>;
  deleteFlashcardSet: (id: string) => Promise<boolean>;
  createFlashcard: (data: Partial<Flashcard>) => Promise<string | null>;
  updateFlashcard: (id: string, data: Partial<Flashcard>) => Promise<boolean>;
  deleteFlashcard: (id: string) => Promise<boolean>;
  fetchFlashcardsBySet: (setId: string) => Promise<Flashcard[]>;
  fetchSetById: (id: string) => Promise<FlashcardSet | null>;
  fetchPublicSets: () => Promise<void>;
  fetchAllSets: () => Promise<void>;
  exportFlashcards: () => Promise<any>;
  importFlashcards: (data: any) => Promise<boolean>;
}

const FlashcardsContext = createContext<FlashcardsContextType | undefined>(undefined);

export const FlashcardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [publicFlashcardSets, setPublicFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's flashcard sets when user changes
  useEffect(() => {
    if (user) {
      fetchAllSets();
    } else {
      setFlashcardSets([]);
      setFlashcards([]);
    }
  }, [user]);

  // Fetch all flashcard sets for the current user
  const fetchAllSets = async (): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedSets = data.map((set: any) => ({
        ...set,
        createdAt: ensureDate(set.created_at),
        updatedAt: ensureDate(set.updated_at)
      })) as FlashcardSet[];
      
      setFlashcardSets(formattedSets);
    } catch (err: any) {
      console.error('Error fetching flashcard sets:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch public flashcard sets
  const fetchPublicSets = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      const formattedSets = data.map((set: any) => ({
        ...set,
        createdAt: ensureDate(set.created_at),
        updatedAt: ensureDate(set.updated_at)
      })) as FlashcardSet[];
      
      setPublicFlashcardSets(formattedSets);
    } catch (err: any) {
      console.error('Error fetching public flashcard sets:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new flashcard set
  const createFlashcardSet = async (data: Partial<FlashcardSet>): Promise<string | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: newSet, error } = await supabase
        .from('flashcard_sets')
        .insert([{
          ...data,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const formattedSet = {
        ...newSet,
        createdAt: ensureDate(newSet.created_at),
        updatedAt: ensureDate(newSet.updated_at)
      } as FlashcardSet;
      
      setFlashcardSets(prev => [formattedSet, ...prev]);
      
      return newSet.id;
    } catch (err: any) {
      console.error('Error creating flashcard set:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing flashcard set
  const updateFlashcardSet = async (id: string, data: Partial<FlashcardSet>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: updatedSet, error } = await supabase
        .from('flashcard_sets')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      const formattedSet = {
        ...updatedSet,
        createdAt: ensureDate(updatedSet.created_at),
        updatedAt: ensureDate(updatedSet.updated_at)
      } as FlashcardSet;
      
      setFlashcardSets(prev => prev.map(set => 
        set.id === id ? formattedSet : set
      ));
      
      return true;
    } catch (err: any) {
      console.error('Error updating flashcard set:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a flashcard set
  const deleteFlashcardSet = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('flashcard_sets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setFlashcardSets(prev => prev.filter(set => set.id !== id));
      setFlashcards(prev => prev.filter(card => card.setId !== id));
      
      return true;
    } catch (err: any) {
      console.error('Error deleting flashcard set:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all flashcards in a set
  const fetchFlashcardsBySet = async (setId: string): Promise<Flashcard[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('set_id', setId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedCards = data.map((card: any) => 
        convertDbFlashcardToFlashcard(card)
      );
      
      setFlashcards(formattedCards);
      return formattedCards;
    } catch (err: any) {
      console.error('Error fetching flashcards:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get a flashcard set by ID
  const fetchSetById = async (id: string): Promise<FlashcardSet | null> => {
    try {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        createdAt: ensureDate(data.created_at),
        updatedAt: ensureDate(data.updated_at)
      } as FlashcardSet;
    } catch (err: any) {
      console.error('Error fetching flashcard set:', err);
      return null;
    }
  };

  // Create a new flashcard
  const createFlashcard = async (data: Partial<Flashcard>): Promise<string | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert the data to database format
      const dbData = convertFlashcardToDbFormat(data);
      
      const { data: newCard, error } = await supabase
        .from('flashcards')
        .insert([{
          ...dbData,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const formattedCard = convertDbFlashcardToFlashcard(newCard);
      
      setFlashcards(prev => [formattedCard, ...prev]);
      
      return newCard.id;
    } catch (err: any) {
      console.error('Error creating flashcard:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing flashcard
  const updateFlashcard = async (id: string, data: Partial<Flashcard>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert the data to database format
      const dbData = convertFlashcardToDbFormat(data);
      
      const { data: updatedCard, error } = await supabase
        .from('flashcards')
        .update(dbData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      const formattedCard = convertDbFlashcardToFlashcard(updatedCard);
      
      setFlashcards(prev => prev.map(card => 
        card.id === id ? formattedCard : card
      ));
      
      return true;
    } catch (err: any) {
      console.error('Error updating flashcard:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a flashcard
  const deleteFlashcard = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setFlashcards(prev => prev.filter(card => card.id !== id));
      
      return true;
    } catch (err: any) {
      console.error('Error deleting flashcard:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Export all user's flashcards (for backup/sharing)
  const exportFlashcards = async () => {
    if (!user) return null;
    
    try {
      // Fetch all user's sets
      const { data: sets, error: setsError } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('user_id', user.id);
      
      if (setsError) throw setsError;
      
      // Fetch all cards from those sets
      const exportData = {
        sets: sets,
        cards: [] as any[]
      };
      
      for (const set of sets) {
        const { data: cards, error: cardsError } = await supabase
          .from('flashcards')
          .select('*')
          .eq('set_id', set.id);
        
        if (cardsError) throw cardsError;
        
        exportData.cards.push(...cards);
      }
      
      return exportData;
    } catch (err: any) {
      console.error('Error exporting flashcards:', err);
      setError(err.message);
      return null;
    }
  };

  // Import flashcards from exported data
  const importFlashcards = async (importData: any): Promise<boolean> => {
    if (!user || !importData) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First create the sets
      for (const set of importData.sets) {
        // Skip id and user_id - will be generated newly
        const { id, user_id, created_at, updated_at, ...setData } = set;
        
        await supabase
          .from('flashcard_sets')
          .insert([{
            ...setData,
            user_id: user.id
          }]);
      }
      
      // Then re-fetch sets to get the new IDs
      const { data: newSets } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('user_id', user.id);
      
      // Update local state
      if (newSets) {
        const formattedSets = newSets.map((set: any) => ({
          ...set,
          createdAt: ensureDate(set.created_at),
          updatedAt: ensureDate(set.updated_at)
        })) as FlashcardSet[];
        
        setFlashcardSets(formattedSets);
      }
      
      return true;
    } catch (err: any) {
      console.error('Error importing flashcards:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    flashcards,
    flashcardSets,
    publicFlashcardSets,
    isLoading,
    error,
    createFlashcardSet,
    updateFlashcardSet,
    deleteFlashcardSet,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    fetchFlashcardsBySet,
    fetchSetById,
    fetchPublicSets,
    fetchAllSets,
    exportFlashcards,
    importFlashcards
  };

  return (
    <FlashcardsContext.Provider value={value}>
      {children}
    </FlashcardsContext.Provider>
  );
};

export const useFlashcards = () => {
  const context = useContext(FlashcardsContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardsProvider');
  }
  return context;
};
