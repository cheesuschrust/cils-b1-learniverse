
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define flashcard types for better type safety
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  set_id?: string;
  user_id?: string;
  difficulty?: number;
  hint?: string;
  examples?: string[];
  created_at?: string;
  next_review?: string;
  review_count?: number;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  user_id?: string;
  is_public: boolean;
  card_count?: number;
  created_at?: string;
  tags?: string[];
}

export const useFlashcards = () => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock flashcards for development/testing
  const mockFlashcards: Flashcard[] = [
    { id: '1', front: 'Ciao', back: 'Hello', difficulty: 1, hint: 'Common greeting', examples: ['Ciao, come stai?', 'Ciao a tutti!'] },
    { id: '2', front: 'Grazie', back: 'Thank you', difficulty: 1, hint: 'Say after receiving something', examples: ['Grazie mille!', 'Grazie per il tuo aiuto.'] },
    { id: '3', front: 'Buongiorno', back: 'Good morning', difficulty: 2, hint: 'Morning greeting', examples: ['Buongiorno, signora.'] },
    { id: '4', front: 'Arrivederci', back: 'Goodbye', difficulty: 2, hint: 'Parting words', examples: ['Arrivederci, a domani!'] },
    { id: '5', front: 'Piacere', back: 'Nice to meet you', difficulty: 3, hint: 'When meeting someone new', examples: ['Piacere, mi chiamo Maria.'] },
    { id: '6', front: 'Scusa', back: 'Excuse me / Sorry', difficulty: 1, hint: 'Used to apologize', examples: ['Scusa, non ho sentito.', 'Scusa per il ritardo.'] },
    { id: '7', front: 'Per favore', back: 'Please', difficulty: 1, hint: 'Used when asking for something', examples: ['Un caffè, per favore.'] },
    { id: '8', front: 'Buonasera', back: 'Good evening', difficulty: 2, hint: 'Evening greeting', examples: ['Buonasera, come va?'] },
  ];

  const mockSets: FlashcardSet[] = [
    { id: '1', name: 'Basic Italian Phrases', description: 'Essential phrases for beginners', is_public: true, card_count: 20 },
    { id: '2', name: 'Italian Verbs', description: 'Common verbs and conjugations', is_public: true, card_count: 30 },
    { id: '3', name: 'Travel Vocabulary', description: 'Words and phrases for traveling', is_public: true, card_count: 25 },
  ];

  useEffect(() => {
    // Load from Supabase if user is logged in, otherwise use mock data
    if (user) {
      fetchUserFlashcards();
      fetchUserFlashcardSets();
    } else {
      // Use mock data for development
      setFlashcards(mockFlashcards);
      setFlashcardSets(mockSets);
    }
  }, [user]);

  const fetchUserFlashcards = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setFlashcards(data);
      } else {
        // If no cards found, use mock data but assign to user
        setFlashcards(mockFlashcards.map(card => ({
          ...card,
          user_id: user.id
        })));
      }
    } catch (err: any) {
      console.error('Error fetching flashcards:', err);
      setError(err.message || 'Failed to load flashcards');
      
      // Fallback to mock data in case of error
      setFlashcards(mockFlashcards.map(card => ({
        ...card,
        user_id: user.id
      })));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserFlashcardSets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setFlashcardSets(data);
      } else {
        // If no sets found, use mock data but assign to user
        setFlashcardSets(mockSets.map(set => ({
          ...set,
          user_id: user.id
        })));
      }
    } catch (err: any) {
      console.error('Error fetching flashcard sets:', err);
      
      // Fallback to mock data in case of error
      setFlashcardSets(mockSets.map(set => ({
        ...set,
        user_id: user.id
      })));
    }
  };

  const addFlashcard = async (card: Omit<Flashcard, 'id'>) => {
    if (!user) {
      // For non-authenticated users, just add to local state
      const newCard = {
        ...card,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };
      
      setFlashcards([...flashcards, newCard]);
      return newCard;
    }
    
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert([{
          ...card,
          user_id: user.id
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setFlashcards([...flashcards, data[0]]);
        return data[0];
      }
    } catch (err: any) {
      console.error('Error adding flashcard:', err);
      setError(err.message || 'Failed to add flashcard');
      
      // Still add to local state in case of error
      const newCard = {
        ...card,
        id: Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        created_at: new Date().toISOString()
      };
      
      setFlashcards([...flashcards, newCard]);
      return newCard;
    }
  };

  const updateFlashcard = async (id: string, updates: Partial<Flashcard>) => {
    // Update in local state first
    setFlashcards(flashcards.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
    
    if (!user) return;
    
    // Then update in Supabase if user is authenticated
    try {
      const { error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating flashcard:', err);
      setError(err.message || 'Failed to update flashcard');
    }
  };

  const deleteFlashcard = async (id: string) => {
    // Remove from local state first
    setFlashcards(flashcards.filter(card => card.id !== id));
    
    if (!user) return;
    
    // Then delete from Supabase if user is authenticated
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting flashcard:', err);
      setError(err.message || 'Failed to delete flashcard');
    }
  };

  const updateCardDifficulty = async (id: string, rating: number) => {
    const card = flashcards.find(c => c.id === id);
    if (!card) return;
    
    // Simple spaced repetition algorithm
    const newDifficulty = Math.max(1, Math.min(5, rating));
    const nextReviewDate = calculateNextReview(rating);
    
    const updates = {
      difficulty: newDifficulty,
      next_review: nextReviewDate,
      review_count: (card.review_count || 0) + 1
    };
    
    await updateFlashcard(id, updates);
  };

  const calculateNextReview = (rating: number): string => {
    const now = new Date();
    let daysToAdd = 0;
    
    // Simple spaced repetition algorithm based on rating
    switch (rating) {
      case 1: // Don't know at all
        daysToAdd = 0.5; // Review in 12 hours
        break;
      case 2: // Barely know
        daysToAdd = 1; // Review tomorrow
        break;
      case 3: // Somewhat know
        daysToAdd = 3; // Review in 3 days
        break;
      case 4: // Know well
        daysToAdd = 7; // Review in a week
        break;
      case 5: // Know perfectly
        daysToAdd = 14; // Review in two weeks
        break;
      default:
        daysToAdd = 1;
    }
    
    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString();
  };

  const getDueCards = (): Flashcard[] => {
    const now = new Date();
    return flashcards.filter(card => {
      if (!card.next_review) return true; // If no next_review, consider it due
      return new Date(card.next_review) <= now;
    });
  };

  const getDifficultCards = (): Flashcard[] => {
    return flashcards.filter(card => {
      return (card.difficulty || 0) <= 2;
    });
  };

  const getFlashcardStats = () => {
    const now = new Date();
    const total = flashcards.length;
    const mastered = flashcards.filter(card => (card.difficulty || 0) >= 4).length;
    const toReview = flashcards.filter(card => {
      if (!card.next_review) return true;
      return new Date(card.next_review) <= now;
    }).length;
    const learning = total - mastered;
    
    return {
      total,
      mastered,
      toReview,
      learning
    };
  };

  return {
    flashcards,
    flashcardSets,
    isLoading,
    error,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    updateCardDifficulty,
    getDueCards,
    getDifficultCards,
    getFlashcardStats
  };
};

export default useFlashcards;
