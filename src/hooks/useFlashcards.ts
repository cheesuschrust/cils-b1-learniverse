
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  lastReviewed?: Date;
  level: number; // 0-5, higher means better known
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  isMastered: boolean;
  language: string;
  translated?: {
    front?: string;
    back?: string;
  };
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  language: string;
  category: string;
  createdAt: Date;
  lastModified: Date;
}

const demoDecks: Deck[] = [
  {
    id: "1",
    name: "Italian Basics",
    description: "Common Italian words and phrases for beginners",
    language: "italian",
    category: "vocabulary",
    cards: [
      {
        id: "card1",
        front: "Ciao",
        back: "Hello/Goodbye (informal)",
        level: 0,
        tags: ["greeting", "basic"],
        createdAt: new Date(),
        isMastered: false,
        language: "italian",
      },
      {
        id: "card2",
        front: "Grazie",
        back: "Thank you",
        level: 0,
        tags: ["courtesy", "basic"],
        createdAt: new Date(),
        isMastered: false,
        language: "italian",
      },
      {
        id: "card3",
        front: "Per favore",
        back: "Please",
        level: 0,
        tags: ["courtesy", "basic"],
        createdAt: new Date(),
        isMastered: false,
        language: "italian",
      },
      {
        id: "card4",
        front: "Buongiorno",
        back: "Good morning",
        level: 0,
        tags: ["greeting", "basic"],
        createdAt: new Date(),
        isMastered: false,
        language: "italian",
      },
      {
        id: "card5",
        front: "Buonasera",
        back: "Good evening",
        level: 0,
        tags: ["greeting", "basic"],
        createdAt: new Date(),
        isMastered: false,
        language: "italian",
      }
    ],
    createdAt: new Date(),
    lastModified: new Date()
  },
  {
    id: "2",
    name: "Italian Food",
    description: "Essential vocabulary for ordering food in Italian",
    language: "italian",
    category: "food",
    cards: [
      {
        id: "card6",
        front: "Pizza",
        back: "Pizza",
        level: 0,
        tags: ["food", "restaurant"],
        createdAt: new Date(),
        isMastered: false,
        language: "italian",
      },
      {
        id: "card7",
        front: "Pasta",
        back: "Pasta",
        level: 0,
        tags: ["food", "restaurant"],
        createdAt: new Date(),
        isMastered: false,
        language: "italian",
      },
      {
        id: "card8",
        front: "Acqua",
        back: "Water",
        level: 0,
        tags: ["drink", "restaurant"],
        createdAt: new Date(),
        isMastered: false,
        language: "italian",
      }
    ],
    createdAt: new Date(),
    lastModified: new Date()
  }
];

export const useFlashcards = () => {
  // Get decks from local storage or use demo data
  const [decks, setDecks] = useLocalStorage<Deck[]>('flashcard-decks', demoDecks);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { speakText, translateText, isAIEnabled } = useAIUtils();
  
  useEffect(() => {
    // Set first deck as active if none is selected
    if (!activeDeckId && decks.length > 0) {
      setActiveDeckId(decks[0].id);
    }
  }, [decks, activeDeckId]);
  
  const activeDeck = decks.find(deck => deck.id === activeDeckId) || null;
  
  // Get cards for active deck with spaced repetition logic
  const getDueCards = useCallback(() => {
    if (!activeDeck) return [];
    
    const now = new Date();
    
    return activeDeck.cards
      .filter(card => !card.isMastered && (!card.dueDate || new Date(card.dueDate) <= now))
      .sort((a, b) => {
        // Sort by level (prioritize lower levels)
        if (a.level !== b.level) return a.level - b.level;
        
        // If levels are the same, prioritize cards that haven't been reviewed recently
        const aDate = a.lastReviewed ? new Date(a.lastReviewed) : new Date(0);
        const bDate = b.lastReviewed ? new Date(b.lastReviewed) : new Date(0);
        return aDate.getTime() - bDate.getTime();
      });
  }, [activeDeck]);
  
  const dueCards = activeDeck ? getDueCards() : [];
  
  const startReview = useCallback(() => {
    if (!activeDeck) {
      toast({
        title: "No Deck Selected",
        description: "Please select a deck to review.",
        variant: "destructive",
      });
      return;
    }
    
    const cards = getDueCards();
    
    if (cards.length === 0) {
      toast({
        title: "No Cards Due",
        description: "All cards in this deck have been mastered or are not yet due for review.",
      });
      return;
    }
    
    setIsReviewing(true);
    setCurrentCardIndex(0);
    setShowBack(false);
  }, [activeDeck, getDueCards, toast]);
  
  const stopReview = useCallback(() => {
    setIsReviewing(false);
    setCurrentCardIndex(0);
    setShowBack(false);
  }, []);
  
  const flipCard = useCallback(() => {
    setShowBack(prev => !prev);
  }, []);
  
  const getCurrentCard = useCallback(() => {
    if (!isReviewing || !activeDeck) return null;
    
    const dueCards = getDueCards();
    if (dueCards.length === 0) return null;
    
    return dueCards[currentCardIndex];
  }, [isReviewing, activeDeck, currentCardIndex, getDueCards]);
  
  const recordReviewResult = useCallback((remembered: boolean) => {
    if (!activeDeck) return;
    
    const dueCards = getDueCards();
    if (dueCards.length === 0 || currentCardIndex >= dueCards.length) return;
    
    const currentCard = dueCards[currentCardIndex];
    
    setDecks(prevDecks => {
      const updatedDecks = [...prevDecks];
      const deckIndex = updatedDecks.findIndex(d => d.id === activeDeckId);
      
      if (deckIndex === -1) return prevDecks;
      
      const deck = { ...updatedDecks[deckIndex] };
      const cards = [...deck.cards];
      const cardIndex = cards.findIndex(c => c.id === currentCard.id);
      
      if (cardIndex === -1) return prevDecks;
      
      let newLevel = cards[cardIndex].level;
      
      if (remembered) {
        // Increase card level (max 5)
        newLevel = Math.min(5, newLevel + 1);
      } else {
        // Decrease card level (min 0)
        newLevel = Math.max(0, newLevel - 1);
      }
      
      const now = new Date();
      
      // Calculate next review date based on spaced repetition algorithm
      // Using a simplified version of the SM-2 algorithm
      let daysUntilNextReview = 0;
      
      if (remembered) {
        // If remembered, calculate interval based on level
        switch (newLevel) {
          case 0: daysUntilNextReview = 0; break;   // Same day
          case 1: daysUntilNextReview = 1; break;   // Next day
          case 2: daysUntilNextReview = 3; break;   // 3 days later
          case 3: daysUntilNextReview = 7; break;   // 1 week later
          case 4: daysUntilNextReview = 14; break;  // 2 weeks later
          case 5: daysUntilNextReview = 30; break;  // 1 month later
          default: daysUntilNextReview = 1;
        }
      } else {
        // If not remembered, review again shortly
        daysUntilNextReview = 0; // Same day
      }
      
      const nextReviewDate = new Date(now);
      nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilNextReview);
      
      // Update card
      cards[cardIndex] = {
        ...cards[cardIndex],
        level: newLevel,
        lastReviewed: now,
        dueDate: nextReviewDate,
        isMastered: newLevel >= 5,
      };
      
      // Update deck
      deck.cards = cards;
      deck.lastModified = now;
      updatedDecks[deckIndex] = deck;
      
      return updatedDecks;
    });
    
    // Move to next card or end review
    const nextIndex = currentCardIndex + 1;
    
    if (nextIndex >= dueCards.length) {
      // End of review
      toast({
        title: "Review Completed",
        description: "You've completed the review session!",
      });
      
      setIsReviewing(false);
      setCurrentCardIndex(0);
      setShowBack(false);
    } else {
      // Next card
      setCurrentCardIndex(nextIndex);
      setShowBack(false);
    }
  }, [activeDeckId, currentCardIndex, getDueCards, setDecks, toast]);
  
  const addCard = useCallback((front: string, back: string, tags: string[] = []) => {
    if (!activeDeck) {
      toast({
        title: "No Deck Selected",
        description: "Please select a deck to add a card to.",
        variant: "destructive",
      });
      return null;
    }
    
    const newCard: Flashcard = {
      id: uuidv4(),
      front,
      back,
      level: 0,
      tags,
      createdAt: new Date(),
      isMastered: false,
      language: activeDeck.language,
    };
    
    setDecks(prevDecks => {
      const updatedDecks = [...prevDecks];
      const deckIndex = updatedDecks.findIndex(d => d.id === activeDeckId);
      
      if (deckIndex === -1) return prevDecks;
      
      const deck = { ...updatedDecks[deckIndex] };
      deck.cards = [...deck.cards, newCard];
      deck.lastModified = new Date();
      
      updatedDecks[deckIndex] = deck;
      
      return updatedDecks;
    });
    
    return newCard;
  }, [activeDeck, activeDeckId, setDecks, toast]);
  
  const addDeck = useCallback((name: string, description: string, language: string = 'italian', category: string = 'vocabulary') => {
    const newDeck: Deck = {
      id: uuidv4(),
      name,
      description,
      cards: [],
      language,
      category,
      createdAt: new Date(),
      lastModified: new Date(),
    };
    
    setDecks(prevDecks => [...prevDecks, newDeck]);
    setActiveDeckId(newDeck.id);
    
    toast({
      title: "Deck Created",
      description: `Successfully created "${name}" deck.`,
    });
    
    return newDeck;
  }, [setDecks, toast]);
  
  const deleteDeck = useCallback((deckId: string) => {
    setDecks(prevDecks => {
      const updatedDecks = prevDecks.filter(deck => deck.id !== deckId);
      
      // If active deck was deleted, set first available deck as active
      if (deckId === activeDeckId) {
        if (updatedDecks.length > 0) {
          setActiveDeckId(updatedDecks[0].id);
        } else {
          setActiveDeckId(null);
        }
      }
      
      return updatedDecks;
    });
    
    toast({
      title: "Deck Deleted",
      description: "The deck has been deleted.",
    });
  }, [activeDeckId, setDecks, toast]);
  
  const deleteCard = useCallback((cardId: string) => {
    if (!activeDeck) return;
    
    setDecks(prevDecks => {
      const updatedDecks = [...prevDecks];
      const deckIndex = updatedDecks.findIndex(d => d.id === activeDeckId);
      
      if (deckIndex === -1) return prevDecks;
      
      const deck = { ...updatedDecks[deckIndex] };
      deck.cards = deck.cards.filter(card => card.id !== cardId);
      deck.lastModified = new Date();
      
      updatedDecks[deckIndex] = deck;
      
      return updatedDecks;
    });
    
    toast({
      title: "Card Deleted",
      description: "The flashcard has been deleted.",
    });
  }, [activeDeck, activeDeckId, setDecks, toast]);
  
  const updateCard = useCallback((cardId: string, updates: Partial<Flashcard>) => {
    if (!activeDeck) return;
    
    setDecks(prevDecks => {
      const updatedDecks = [...prevDecks];
      const deckIndex = updatedDecks.findIndex(d => d.id === activeDeckId);
      
      if (deckIndex === -1) return prevDecks;
      
      const deck = { ...updatedDecks[deckIndex] };
      const cardIndex = deck.cards.findIndex(c => c.id === cardId);
      
      if (cardIndex === -1) return prevDecks;
      
      deck.cards[cardIndex] = { ...deck.cards[cardIndex], ...updates };
      deck.lastModified = new Date();
      
      updatedDecks[deckIndex] = deck;
      
      return updatedDecks;
    });
  }, [activeDeck, activeDeckId, setDecks]);
  
  const updateDeck = useCallback((updates: Partial<Deck>) => {
    if (!activeDeckId) return;
    
    setDecks(prevDecks => {
      const updatedDecks = [...prevDecks];
      const deckIndex = updatedDecks.findIndex(d => d.id === activeDeckId);
      
      if (deckIndex === -1) return prevDecks;
      
      updatedDecks[deckIndex] = { 
        ...updatedDecks[deckIndex], 
        ...updates,
        lastModified: new Date()
      };
      
      return updatedDecks;
    });
    
    toast({
      title: "Deck Updated",
      description: "The deck has been updated.",
    });
  }, [activeDeckId, setDecks, toast]);
  
  const speakCardContent = useCallback(async (card: Flashcard, side: 'front' | 'back') => {
    if (!isAIEnabled) {
      toast({
        title: "Feature Disabled",
        description: "Text-to-speech requires AI features to be enabled.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Determine language based on the side
      // Front is typically in the target language (e.g., Italian)
      // Back is typically in the user's language (e.g., English)
      const content = side === 'front' ? card.front : card.back;
      const language = side === 'front' ? 'it-IT' : 'en-US';
      
      await speakText(content, language);
    } catch (error) {
      console.error('Error speaking card content:', error);
      toast({
        title: "Speech Error",
        description: "Failed to speak the card content. Please try again.",
        variant: "destructive",
      });
    }
  }, [isAIEnabled, speakText, toast]);
  
  const translateCardContent = useCallback(async (card: Flashcard) => {
    if (!isAIEnabled || !translateText) {
      toast({
        title: "Feature Disabled",
        description: "Translation requires AI features to be enabled.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Translate front (Italian to English)
      const translatedFront = await translateText(card.front, 'it', 'en');
      
      // Translate back (English to Italian)
      const translatedBack = await translateText(card.back, 'en', 'it');
      
      // Update card with translations
      updateCard(card.id, {
        translated: {
          front: translatedFront,
          back: translatedBack
        }
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Error",
        description: "Failed to translate the card content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAIEnabled, translateText, toast, updateCard]);
  
  const exportDeck = useCallback((deckId: string, format: 'csv' | 'json' = 'csv') => {
    const deck = decks.find(d => d.id === deckId);
    
    if (!deck) {
      toast({
        title: "Export Failed",
        description: "Deck not found.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      let content = '';
      let fileName = `${deck.name.replace(/\s+/g, '_')}_flashcards`;
      
      if (format === 'csv') {
        // CSV format: front,back,tags
        content = 'front,back,tags\n';
        content += deck.cards.map(card => 
          `"${card.front.replace(/"/g, '""')}","${card.back.replace(/"/g, '""')}","${card.tags.join(';')}"`
        ).join('\n');
        fileName += '.csv';
      } else {
        // JSON format
        const exportData = {
          name: deck.name,
          description: deck.description,
          language: deck.language,
          category: deck.category,
          cards: deck.cards.map(card => ({
            front: card.front,
            back: card.back,
            tags: card.tags,
            language: card.language
          }))
        };
        content = JSON.stringify(exportData, null, 2);
        fileName += '.json';
      }
      
      // Create a download link
      const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Export Successful",
        description: `Exported ${deck.cards.length} cards from "${deck.name}".`,
      });
      
      return true;
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the deck.",
        variant: "destructive",
      });
      return null;
    }
  }, [decks, toast]);
  
  const importFlashcards = useCallback(async (
    content: string, 
    format: 'csv' | 'txt' | 'json' | 'anki'
  ): Promise<number> => {
    if (!activeDeckId) {
      throw new Error('No active deck selected');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let newCards: Partial<Flashcard>[] = [];
      
      if (format === 'csv') {
        // Parse CSV
        const lines = content.trim().split('\n');
        
        // Check if the file has a header row
        let startIndex = 0;
        const firstLine = lines[0].toLowerCase();
        if (firstLine.includes('front') && firstLine.includes('back')) {
          startIndex = 1; // Skip header row
        }
        
        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Handle quoted CSV properly
          let values: string[] = [];
          
          if (line.includes('"')) {
            // More complex CSV with quotes
            let inQuote = false;
            let currentValue = '';
            let j = 0;
            
            while (j < line.length) {
              if (line[j] === '"') {
                if (j + 1 < line.length && line[j + 1] === '"') {
                  // Escaped quote inside quoted field
                  currentValue += '"';
                  j += 2;
                } else {
                  // Toggle quote state
                  inQuote = !inQuote;
                  j++;
                }
              } else if (line[j] === ',' && !inQuote) {
                // End of field
                values.push(currentValue);
                currentValue = '';
                j++;
              } else {
                // Regular character
                currentValue += line[j];
                j++;
              }
            }
            
            // Add the last value
            values.push(currentValue);
          } else {
            // Simple CSV without quotes
            values = line.split(',');
          }
          
          if (values.length >= 2) {
            const front = values[0].trim();
            const back = values[1].trim();
            
            if (front && back) {
              const tags = values.length > 2 ? values[2].split(';').map(tag => tag.trim()) : [];
              
              newCards.push({
                front,
                back,
                tags,
                level: 0,
                createdAt: new Date(),
                isMastered: false,
                language: 'italian', // Default language
              });
            }
          }
        }
      } else if (format === 'json') {
        try {
          const jsonData = JSON.parse(content);
          
          if (Array.isArray(jsonData)) {
            // Array of cards
            newCards = jsonData.map(item => ({
              front: item.front || item.term || item.question || '',
              back: item.back || item.definition || item.answer || '',
              tags: Array.isArray(item.tags) ? item.tags : [],
              level: 0,
              createdAt: new Date(),
              isMastered: false,
              language: item.language || 'italian',
            }));
          } else if (jsonData.cards && Array.isArray(jsonData.cards)) {
            // Deck object with cards array
            newCards = jsonData.cards.map(item => ({
              front: item.front || item.term || item.question || '',
              back: item.back || item.definition || item.answer || '',
              tags: Array.isArray(item.tags) ? item.tags : [],
              level: 0,
              createdAt: new Date(),
              isMastered: false,
              language: item.language || jsonData.language || 'italian',
            }));
            
            // If the imported deck has a name and we're importing into a new deck, update the deck properties
            if (jsonData.name && activeDeck && activeDeck.cards.length === 0) {
              updateDeck({
                name: jsonData.name,
                description: jsonData.description || activeDeck.description,
                language: jsonData.language || activeDeck.language,
                category: jsonData.category || activeDeck.category,
              });
            }
          }
        } catch (jsonError) {
          throw new Error('Invalid JSON format');
        }
      } else if (format === 'txt') {
        // Assume tab or line separated
        const lines = content.trim().split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          let front, back;
          
          if (line.includes('\t')) {
            // Tab-separated
            const parts = line.split('\t');
            front = parts[0].trim();
            back = parts.length > 1 ? parts[1].trim() : '';
          } else {
            // Just front (useful for importing lists of words to study)
            front = line;
            back = ''; // Empty back side for user to fill in
          }
          
          if (front) {
            newCards.push({
              front,
              back,
              tags: [],
              level: 0,
              createdAt: new Date(),
              isMastered: false,
              language: 'italian', // Default language
            });
          }
        }
      } else if (format === 'anki') {
        throw new Error('Anki import is not supported in this version');
      }
      
      // Filter out invalid cards
      newCards = newCards.filter(card => card.front && card.front.trim() !== '');
      
      if (newCards.length === 0) {
        throw new Error('No valid flashcards found in the imported file');
      }
      
      // Add cards to the active deck
      setDecks(prevDecks => {
        const updatedDecks = [...prevDecks];
        const deckIndex = updatedDecks.findIndex(d => d.id === activeDeckId);
        
        if (deckIndex === -1) return prevDecks;
        
        const deck = { ...updatedDecks[deckIndex] };
        
        // Add unique ID to each new card
        const cardsToAdd = newCards.map(card => ({
          ...card,
          id: uuidv4(),
        })) as Flashcard[];
        
        deck.cards = [...deck.cards, ...cardsToAdd];
        deck.lastModified = new Date();
        
        updatedDecks[deckIndex] = deck;
        
        return updatedDecks;
      });
      
      return newCards.length;
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Failed to import flashcards');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activeDeckId, activeDeck, setDecks, updateDeck]);
  
  return {
    decks,
    activeDeck,
    activeDeckId,
    setActiveDeckId,
    isReviewing,
    showBack,
    dueCards,
    currentCardIndex,
    addCard,
    addDeck,
    deleteDeck,
    deleteCard,
    updateCard,
    updateDeck,
    startReview,
    stopReview,
    flipCard,
    getCurrentCard,
    recordReviewResult,
    speakCardContent,
    translateCardContent,
    exportDeck,
    importFlashcards,
    isLoading,
    error
  };
};
