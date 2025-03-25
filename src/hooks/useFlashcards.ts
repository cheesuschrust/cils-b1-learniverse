
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addDays, isBefore } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { useAIUtils } from '@/contexts/AIUtilsContext';

// Define types for flashcards
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  notes?: string;
  tags: string[];
  createdAt: Date;
  lastReviewed?: Date;
  dueDate?: Date;
  level: number; // 0-5 indicating mastery level
  isMastered: boolean;
  frontLanguage: 'english' | 'italian';
  backLanguage: 'english' | 'italian';
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  createdAt: Date;
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  tags: string[];
  category?: string;
  language: 'english' | 'italian';
}

// Define the return type for the hook
interface UseFlashcardsReturn {
  decks: Deck[];
  activeDeck: Deck;
  activeDeckId: string;
  setActiveDeckId: React.Dispatch<React.SetStateAction<string>>;
  isReviewing: boolean;
  showBack: boolean;
  currentCardIndex: number;
  dueCardIds: string[];
  reviewedCardIds: string[];
  startReview: () => void;
  endReview: () => void;
  nextCard: () => void;
  prevCard: () => void;
  flipCard: () => void;
  markCardResult: (result: 'easy' | 'good' | 'hard' | 'again') => void;
  createDeck: (name: string, description: string, language: 'english' | 'italian') => void;
  updateDeck: (deckId: string, updates: Partial<Deck>) => void;
  deleteDeck: (deckId: string) => void;
  createCard: (deckId: string, card: Partial<Flashcard>) => void;
  updateCard: (deckId: string, cardId: string, updates: Partial<Flashcard>) => void;
  deleteCard: (deckId: string, cardId: string) => void;
  importCardsFromCsv: (deckId: string, csvContent: string) => Promise<number>;
  exportDeckToCsv: (deckId: string) => string;
  toggleCardMastery: (deckId: string, cardId: string) => void;
  resetProgress: (deckId: string) => void;
  addTagToDeck: (deckId: string, tag: string) => void;
  removeTagFromDeck: (deckId: string, tag: string) => void;
  addTagToCard: (deckId: string, cardId: string, tag: string) => void;
  removeTagFromCard: (deckId: string, cardId: string, tag: string) => void;
  isLoading: boolean;
  error: string;
}

export const useFlashcards = (): UseFlashcardsReturn => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeckId, setActiveDeckId] = useState<string>('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [dueCardIds, setDueCardIds] = useState<string[]>([]);
  const [reviewedCardIds, setReviewedCardIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { speakText, isAIEnabled } = useAIUtils();

  // Load flashcards from local storage
  useEffect(() => {
    const loadFlashcards = () => {
      try {
        const savedDecks = localStorage.getItem('flashcard-decks');
        if (savedDecks) {
          const parsedDecks = JSON.parse(savedDecks).map((deck: Deck) => ({
            ...deck,
            createdAt: new Date(deck.createdAt),
            cards: deck.cards.map((card: Flashcard) => ({
              ...card,
              createdAt: new Date(card.createdAt),
              lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined,
              dueDate: card.dueDate ? new Date(card.dueDate) : undefined,
            })),
          }));
          setDecks(parsedDecks);
          
          // Set active deck if possible
          if (parsedDecks.length > 0) {
            const savedActiveDeckId = localStorage.getItem('active-deck-id');
            if (savedActiveDeckId && parsedDecks.some(deck => deck.id === savedActiveDeckId)) {
              setActiveDeckId(savedActiveDeckId);
            } else {
              setActiveDeckId(parsedDecks[0].id);
            }
          }
        } else {
          // Create a sample deck if no decks exist
          createSampleDeck();
        }
      } catch (error) {
        console.error('Error loading flashcards:', error);
        setError('Failed to load flashcards. Using default set.');
        createSampleDeck();
      }
    };
    
    loadFlashcards();
  }, []);

  // Save flashcards to local storage when they change
  useEffect(() => {
    if (decks.length > 0) {
      localStorage.setItem('flashcard-decks', JSON.stringify(decks));
    }
  }, [decks]);

  // Save active deck ID when it changes
  useEffect(() => {
    if (activeDeckId) {
      localStorage.setItem('active-deck-id', activeDeckId);
    }
  }, [activeDeckId]);

  // Create a sample deck with basic flashcards
  const createSampleDeck = useCallback(() => {
    const sampleDeck: Deck = {
      id: uuidv4(),
      name: 'Italian Basics',
      description: 'Essential Italian words and phrases for beginners',
      cards: [
        {
          id: uuidv4(),
          front: 'Hello',
          back: 'Ciao',
          tags: ['greeting', 'basic'],
          createdAt: new Date(),
          level: 0,
          isMastered: false,
          frontLanguage: 'english',
          backLanguage: 'italian',
        },
        {
          id: uuidv4(),
          front: 'Thank you',
          back: 'Grazie',
          tags: ['courtesy', 'basic'],
          createdAt: new Date(),
          level: 0,
          isMastered: false,
          frontLanguage: 'english',
          backLanguage: 'italian',
        },
        {
          id: uuidv4(),
          front: 'Good morning',
          back: 'Buongiorno',
          tags: ['greeting', 'basic'],
          createdAt: new Date(),
          level: 0,
          isMastered: false,
          frontLanguage: 'english',
          backLanguage: 'italian',
        },
      ],
      createdAt: new Date(),
      totalCards: 3,
      masteredCards: 0,
      dueCards: 3,
      tags: ['basic', 'greeting', 'courtesy'],
      language: 'italian',
    };
    
    setDecks([sampleDeck]);
    setActiveDeckId(sampleDeck.id);
  }, []);

  // Get the active deck
  const activeDeck = decks.find(deck => deck.id === activeDeckId) || {
    id: '',
    name: '',
    description: '',
    cards: [],
    createdAt: new Date(),
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    tags: [],
    language: 'english' as 'english' | 'italian',
  };

  // Create a new deck
  const createDeck = useCallback((name: string, description: string, language: 'english' | 'italian') => {
    const newDeck: Deck = {
      id: uuidv4(),
      name,
      description,
      cards: [],
      createdAt: new Date(),
      totalCards: 0,
      masteredCards: 0,
      dueCards: 0,
      tags: [],
      language,
    };
    
    setDecks((prevDecks: Deck[]) => [...prevDecks, newDeck]);
    setActiveDeckId(newDeck.id);
    
    toast({
      title: 'Deck Created',
      description: `Created new deck: ${name}`,
    });
    
    return newDeck.id;
  }, [toast]);

  // Update a deck
  const updateDeck = useCallback((deckId: string, updates: Partial<Deck>) => {
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck =>
        deck.id === deckId
          ? { ...deck, ...updates }
          : deck
      )
    );
    
    toast({
      title: 'Deck Updated',
      description: `Updated deck: ${updates.name || 'Unknown'}`,
    });
  }, [toast]);

  // Delete a deck
  const deleteDeck = useCallback((deckId: string) => {
    setDecks((prevDecks: Deck[]) => prevDecks.filter(deck => deck.id !== deckId));
    
    // If the active deck is deleted, select another deck if available
    if (activeDeckId === deckId) {
      setDecks((prevDecks: Deck[]) => {
        if (prevDecks.length > 0) {
          setActiveDeckId(prevDecks[0].id);
        } else {
          setActiveDeckId('');
        }
        return prevDecks;
      });
    }
    
    toast({
      title: 'Deck Deleted',
      description: 'The deck and all its cards have been removed.',
      variant: 'destructive',
    });
  }, [activeDeckId, toast]);

  // Create a new card in a deck
  const createCard = useCallback((deckId: string, cardData: Partial<Flashcard>) => {
    const newCard: Flashcard = {
      id: uuidv4(),
      front: cardData.front || '',
      back: cardData.back || '',
      notes: cardData.notes || '',
      tags: cardData.tags || [],
      createdAt: new Date(),
      level: 0,
      isMastered: false,
      frontLanguage: cardData.frontLanguage || 'english',
      backLanguage: cardData.backLanguage || 'italian',
    };
    
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck => {
        if (deck.id === deckId) {
          const updatedCards = [...deck.cards, newCard];
          return {
            ...deck,
            cards: updatedCards,
            totalCards: updatedCards.length,
            dueCards: updatedCards.filter(c => !c.isMastered && (!c.dueDate || isBefore(new Date(), c.dueDate))).length,
          };
        }
        return deck;
      })
    );
    
    toast({
      title: 'Card Created',
      description: 'New flashcard has been added to the deck.',
    });
    
    return newCard.id;
  }, [toast]);

  // Update a card in a deck
  const updateCard = useCallback((deckId: string, cardId: string, updates: Partial<Flashcard>) => {
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck => {
        if (deck.id === deckId) {
          const updatedCards = deck.cards.map(card =>
            card.id === cardId
              ? { ...card, ...updates }
              : card
          );
          
          return {
            ...deck,
            cards: updatedCards,
            masteredCards: updatedCards.filter(c => c.isMastered).length,
            dueCards: updatedCards.filter(c => !c.isMastered && (!c.dueDate || isBefore(new Date(), c.dueDate))).length,
          };
        }
        return deck;
      })
    );
  }, []);

  // Delete a card from a deck
  const deleteCard = useCallback((deckId: string, cardId: string) => {
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck => {
        if (deck.id === deckId) {
          const updatedCards = deck.cards.filter(card => card.id !== cardId);
          return {
            ...deck,
            cards: updatedCards,
            totalCards: updatedCards.length,
            masteredCards: updatedCards.filter(c => c.isMastered).length,
            dueCards: updatedCards.filter(c => !c.isMastered && (!c.dueDate || isBefore(new Date(), c.dueDate))).length,
          };
        }
        return deck;
      })
    );
    
    toast({
      title: 'Card Deleted',
      description: 'The flashcard has been removed from the deck.',
      variant: 'destructive',
    });
  }, [toast]);

  // Toggle card mastery status
  const toggleCardMastery = useCallback((deckId: string, cardId: string) => {
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck => {
        if (deck.id === deckId) {
          const updatedCards = deck.cards.map(card => {
            if (card.id === cardId) {
              const newIsMastered = !card.isMastered;
              return {
                ...card,
                isMastered: newIsMastered,
                level: newIsMastered ? 5 : card.level,
              };
            }
            return card;
          });
          
          return {
            ...deck,
            cards: updatedCards,
            masteredCards: updatedCards.filter(c => c.isMastered).length,
            dueCards: updatedCards.filter(c => !c.isMastered && (!c.dueDate || isBefore(new Date(), c.dueDate))).length,
          };
        }
        return deck;
      })
    );
  }, []);

  // Reset progress for all cards in a deck
  const resetProgress = useCallback((deckId: string) => {
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck => {
        if (deck.id === deckId) {
          const updatedCards = deck.cards.map(card => ({
            ...card,
            level: 0,
            isMastered: false,
            lastReviewed: undefined,
            dueDate: undefined,
          }));
          
          return {
            ...deck,
            cards: updatedCards,
            masteredCards: 0,
            dueCards: updatedCards.length,
          };
        }
        return deck;
      })
    );
    
    toast({
      title: 'Progress Reset',
      description: 'All progress for this deck has been reset.',
    });
  }, [toast]);

  // Add a tag to a deck
  const addTagToDeck = useCallback((deckId: string, tag: string) => {
    if (!tag.trim()) return;
    
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck => {
        if (deck.id === deckId && !deck.tags.includes(tag)) {
          return {
            ...deck,
            tags: [...deck.tags, tag],
          };
        }
        return deck;
      })
    );
  }, []);

  // Remove a tag from a deck
  const removeTagFromDeck = useCallback((deckId: string, tag: string) => {
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck => {
        if (deck.id === deckId) {
          return {
            ...deck,
            tags: deck.tags.filter(t => t !== tag),
          };
        }
        return deck;
      })
    );
  }, []);

  // Add a tag to a card
  const addTagToCard = useCallback((deckId: string, cardId: string, tag: string) => {
    if (!tag.trim()) return;
    
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck => {
        if (deck.id === deckId) {
          const updatedCards = deck.cards.map(card => {
            if (card.id === cardId && !card.tags.includes(tag)) {
              return {
                ...card,
                tags: [...card.tags, tag],
              };
            }
            return card;
          });
          
          // Update deck tags if needed
          const allTags = new Set<string>();
          updatedCards.forEach(card => card.tags.forEach(tag => allTags.add(tag)));
          
          return {
            ...deck,
            cards: updatedCards,
            tags: Array.from(allTags),
          };
        }
        return deck;
      })
    );
  }, []);

  // Remove a tag from a card
  const removeTagFromCard = useCallback((deckId: string, cardId: string, tag: string) => {
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck => {
        if (deck.id === deckId) {
          const updatedCards = deck.cards.map(card => {
            if (card.id === cardId) {
              return {
                ...card,
                tags: card.tags.filter(t => t !== tag),
              };
            }
            return card;
          });
          
          // Update deck tags if needed
          const allTags = new Set<string>();
          updatedCards.forEach(card => card.tags.forEach(tag => allTags.add(tag)));
          
          return {
            ...deck,
            cards: updatedCards,
            tags: Array.from(allTags),
          };
        }
        return deck;
      })
    );
  }, []);

  // Import cards from CSV content
  const importCardsFromCsv = useCallback(async (deckId: string, csvContent: string): Promise<number> => {
    try {
      setIsLoading(true);
      setError('');
      
      // Simple CSV parsing (assuming format: front,back,notes,tags)
      const lines = csvContent.split('\n');
      let importedCount = 0;
      
      // Find the deck
      const deck = decks.find(d => d.id === deckId);
      if (!deck) {
        throw new Error(`Deck with ID ${deckId} not found`);
      }
      
      // Process each line
      const updatedDeck: Deck = { ...deck };
      const addedCards: Flashcard[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || (i === 0 && line.toLowerCase().includes('front') && line.toLowerCase().includes('back'))) {
          continue; // Skip empty lines or header row
        }
        
        const parts = line.split(',').map(part => part.trim());
        if (parts.length >= 2) {
          const front = parts[0];
          const back = parts[1];
          const notes = parts[2] || '';
          const tags = parts[3] ? parts[3].split(';').map(tag => tag.trim()) : [];
          
          if (front && back) {
            const newCard: Flashcard = {
              id: uuidv4(),
              front,
              back,
              notes,
              tags,
              createdAt: new Date(),
              level: 0,
              isMastered: false,
              frontLanguage: deck.language === 'italian' ? 'italian' : 'english',
              backLanguage: deck.language === 'italian' ? 'english' : 'italian',
            };
            
            addedCards.push(newCard);
            importedCount++;
          }
        }
      }
      
      // Update the decks state with the new cards
      if (addedCards.length > 0) {
        setDecks((prevDecks: Deck[]) =>
          prevDecks.map(d => {
            if (d.id === deckId) {
              const allCards = [...d.cards, ...addedCards];
              // Update all tags in the deck
              const allTags = new Set<string>();
              allCards.forEach(card => card.tags.forEach(tag => allTags.add(tag)));
              
              return {
                ...d,
                cards: allCards,
                totalCards: allCards.length,
                dueCards: allCards.filter(c => !c.isMastered && (!c.dueDate || isBefore(new Date(), c.dueDate))).length,
                tags: Array.from(allTags),
              };
            }
            return d;
          })
        );
        
        toast({
          title: 'Import Successful',
          description: `Imported ${importedCount} cards into the deck.`,
        });
      } else {
        toast({
          title: 'No Cards Imported',
          description: 'No valid cards were found in the CSV data.',
          variant: 'destructive',
        });
      }
      
      return importedCount;
    } catch (err) {
      console.error('Error importing cards:', err);
      setError(err instanceof Error ? err.message : 'Error importing cards');
      
      toast({
        title: 'Import Failed',
        description: err instanceof Error ? err.message : 'Failed to import cards from CSV',
        variant: 'destructive',
      });
      
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [decks, toast]);

  // Export deck to CSV
  const exportDeckToCsv = useCallback((deckId: string): string => {
    try {
      const deck = decks.find(d => d.id === deckId);
      if (!deck) {
        throw new Error(`Deck with ID ${deckId} not found`);
      }
      
      // Create CSV header and content
      const headerRow = 'Front,Back,Notes,Tags';
      const contentRows = deck.cards.map(card => {
        const front = card.front.replace(/,/g, ';'); // Escape commas
        const back = card.back.replace(/,/g, ';');
        const notes = (card.notes || '').replace(/,/g, ';');
        const tags = card.tags.join(';');
        
        return `${front},${back},${notes},${tags}`;
      });
      
      return [headerRow, ...contentRows].join('\n');
    } catch (err) {
      console.error('Error exporting deck:', err);
      setError(err instanceof Error ? err.message : 'Error exporting deck');
      
      toast({
        title: 'Export Failed',
        description: err instanceof Error ? err.message : 'Failed to export deck to CSV',
        variant: 'destructive',
      });
      
      return '';
    }
  }, [decks, toast]);

  // Review functionality
  const startReview = useCallback(() => {
    if (activeDeck.cards.length === 0) {
      toast({
        title: 'No Cards Available',
        description: 'This deck has no cards to review.',
        variant: 'destructive',
      });
      return;
    }
    
    // Get due cards (not mastered and due date has passed or not set)
    const due = activeDeck.cards
      .filter(card => !card.isMastered && (!card.dueDate || isBefore(new Date(), card.dueDate)))
      .map(card => card.id);
    
    if (due.length === 0) {
      toast({
        title: 'No Cards Due',
        description: 'There are no cards due for review in this deck.',
      });
      return;
    }
    
    // Shuffle the due cards
    const shuffled = [...due].sort(() => Math.random() - 0.5);
    
    setDueCardIds(shuffled);
    setReviewedCardIds([]);
    setCurrentCardIndex(0);
    setShowBack(false);
    setIsReviewing(true);
  }, [activeDeck, toast]);

  const endReview = useCallback(() => {
    setIsReviewing(false);
    setShowBack(false);
    setCurrentCardIndex(0);
    setDueCardIds([]);
    setReviewedCardIds([]);
  }, []);

  const flipCard = useCallback(() => {
    setShowBack(prev => !prev);
    
    // Optionally speak the text when revealing the answer
    if (!showBack && isAIEnabled) {
      const currentCardId = dueCardIds[currentCardIndex];
      const card = activeDeck.cards.find(c => c.id === currentCardId);
      if (card) {
        const textToSpeak = card.back;
        const language = card.backLanguage === 'italian' ? 'it-IT' : 'en-US';
        speakText(textToSpeak, language).catch(console.error);
      }
    }
  }, [showBack, isAIEnabled, dueCardIds, currentCardIndex, activeDeck.cards, speakText]);

  const nextCard = useCallback(() => {
    if (currentCardIndex < dueCardIds.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowBack(false);
    } else {
      // End of review
      toast({
        title: 'Review Complete',
        description: 'You have reviewed all cards in this session.',
      });
      endReview();
    }
  }, [currentCardIndex, dueCardIds.length, endReview, toast]);

  const prevCard = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setShowBack(false);
    }
  }, [currentCardIndex]);

  // Mark card review result and calculate new due date
  const markCardResult = useCallback((result: 'easy' | 'good' | 'hard' | 'again') => {
    const currentCardId = dueCardIds[currentCardIndex];
    
    // Update the card's level and due date based on result
    setDecks((prevDecks: Deck[]) =>
      prevDecks.map(deck => {
        if (deck.id === activeDeckId) {
          const updatedCards = deck.cards.map(card => {
            if (card.id === currentCardId) {
              let newLevel = card.level;
              let dueDate: Date | undefined;
              
              // Update level based on result
              switch (result) {
                case 'again':
                  newLevel = Math.max(0, newLevel - 1);
                  dueDate = new Date(); // Due immediately
                  break;
                case 'hard':
                  // Level stays the same
                  dueDate = addDays(new Date(), 1); // Due tomorrow
                  break;
                case 'good':
                  newLevel = Math.min(4, newLevel + 1);
                  dueDate = addDays(new Date(), Math.pow(2, newLevel)); // Exponential spacing
                  break;
                case 'easy':
                  newLevel = Math.min(5, newLevel + 2);
                  dueDate = addDays(new Date(), Math.pow(2, newLevel)); // Exponential spacing
                  
                  // Mark as mastered if reached max level
                  if (newLevel >= 5) {
                    newLevel = 5;
                  }
                  break;
              }
              
              return {
                ...card,
                level: newLevel,
                lastReviewed: new Date(),
                dueDate,
                isMastered: newLevel >= 5,
              };
            }
            return card;
          });
          
          // Update deck statistics
          return {
            ...deck,
            cards: updatedCards,
            masteredCards: updatedCards.filter(c => c.isMastered).length,
            dueCards: updatedCards.filter(c => !c.isMastered && (!c.dueDate || isBefore(new Date(), c.dueDate))).length,
          };
        }
        return deck;
      })
    );
    
    // Mark as reviewed and go to next card
    setReviewedCardIds(prev => [...prev, currentCardId]);
    nextCard();
  }, [activeDeckId, currentCardIndex, dueCardIds, nextCard]);

  return {
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
    createCard: createCard,
    updateCard,
    deleteCard,
    importCardsFromCsv,
    exportDeckToCsv,
    toggleCardMastery,
    resetProgress,
    addTagToDeck,
    removeTagFromDeck,
    addTagToCard,
    removeTagFromCard,
    isLoading,
    error,
  };
};

export default useFlashcards;
