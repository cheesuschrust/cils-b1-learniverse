
import { v4 as uuidv4 } from 'uuid';
import { Flashcard, FlashcardSet } from '@/types/flashcard';

// Mock data for flashcards
const generateMockFlashcards = (): Flashcard[] => {
  return [
    {
      id: '1',
      italian: 'cane',
      english: 'dog',
      mastered: false,
      level: 0,
      tags: ['animals', 'basic'],
      nextReview: new Date(Date.now() + 86400000),
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 86400000),
      lastReviewed: new Date(Date.now() - 259200000)
    },
    {
      id: '2',
      italian: 'gatto',
      english: 'cat',
      mastered: false,
      level: 0,
      tags: ['animals', 'basic'],
      nextReview: new Date(Date.now() + 86400000),
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 86400000),
      lastReviewed: new Date(Date.now() - 259200000)
    },
    {
      id: '3',
      italian: 'casa',
      english: 'house',
      mastered: true,
      level: 4,
      tags: ['objects', 'home'],
      nextReview: new Date(Date.now() + 604800000),
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 86400000),
      lastReviewed: new Date(Date.now() - 259200000)
    },
    {
      id: '4',
      italian: 'tavolo',
      english: 'table',
      mastered: false,
      level: 2,
      tags: ['objects', 'furniture', 'home'],
      nextReview: new Date(Date.now() + 172800000),
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 86400000),
      lastReviewed: new Date(Date.now() - 259200000)
    },
    {
      id: '5',
      italian: 'sedia',
      english: 'chair',
      mastered: false,
      level: 1,
      tags: ['objects', 'furniture', 'home'],
      nextReview: new Date(Date.now() + 129600000),
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 86400000),
      lastReviewed: new Date(Date.now() - 259200000)
    },
    {
      id: '6',
      italian: 'libro',
      english: 'book',
      mastered: false,
      level: 3,
      tags: ['objects', 'education'],
      nextReview: new Date(Date.now() + 345600000),
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 86400000),
      lastReviewed: new Date(Date.now() - 259200000)
    },
    {
      id: '7',
      italian: 'macchina',
      english: 'car',
      mastered: false,
      level: 1,
      tags: ['vehicles', 'transportation'],
      nextReview: new Date(Date.now() + 129600000),
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 86400000),
      lastReviewed: new Date(Date.now() - 259200000)
    },
    {
      id: '8',
      italian: 'treno',
      english: 'train',
      mastered: false,
      level: 0,
      tags: ['vehicles', 'transportation'],
      nextReview: new Date(Date.now() + 86400000),
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 86400000),
      lastReviewed: new Date(Date.now() - 259200000)
    },
    {
      id: '9',
      italian: 'mela',
      english: 'apple',
      mastered: false,
      level: 2,
      tags: ['food', 'fruits'],
      nextReview: new Date(Date.now() + 172800000),
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 86400000),
      lastReviewed: new Date(Date.now() - 259200000)
    },
    {
      id: '10',
      italian: 'banana',
      english: 'banana',
      mastered: false,
      level: 1,
      tags: ['food', 'fruits'],
      nextReview: new Date(Date.now() + 129600000),
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 86400000),
      lastReviewed: new Date(Date.now() - 259200000)
    }
  ];
};

// Mock data for flashcard sets
const generateMockFlashcardSets = (flashcards: Flashcard[]): FlashcardSet[] => {
  return [
    {
      id: '1',
      name: 'Basic Animals',
      description: 'Common animal names in Italian',
      cards: flashcards.filter(card => card.tags.includes('animals')),
      isPublic: true,
      createdAt: new Date(Date.now() - 1209600000),
      updatedAt: new Date(Date.now() - 1209600000),
      creator: 'system',
      difficulty: 'beginner',
      category: 'vocabulary',
      isFavorite: false
    },
    {
      id: '2',
      name: 'Household Items',
      description: 'Common items found in a home',
      cards: flashcards.filter(card => card.tags.includes('home')),
      isPublic: true,
      createdAt: new Date(Date.now() - 1209600000),
      updatedAt: new Date(Date.now() - 1209600000),
      creator: 'system',
      difficulty: 'beginner',
      category: 'vocabulary',
      isFavorite: true
    },
    {
      id: '3',
      name: 'Food & Drinks',
      description: 'Basic food and drink vocabulary',
      cards: flashcards.filter(card => card.tags.includes('food')),
      isPublic: true,
      createdAt: new Date(Date.now() - 1209600000),
      updatedAt: new Date(Date.now() - 1209600000),
      creator: 'system',
      difficulty: 'beginner',
      category: 'vocabulary',
      isFavorite: false
    }
  ];
};

// Initialize with mock data
let mockFlashcards = generateMockFlashcards();
let mockFlashcardSets = generateMockFlashcardSets(mockFlashcards);

// Get all flashcards
export const getAllFlashcards = async (): Promise<Flashcard[]> => {
  // In a real app, this would fetch from an API or database
  return Promise.resolve([...mockFlashcards]);
};

// Add a new flashcard
export const addFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Flashcard> => {
  const newFlashcard: Flashcard = {
    ...flashcard,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockFlashcards = [...mockFlashcards, newFlashcard];
  
  return Promise.resolve(newFlashcard);
};

// Update a flashcard
export const updateFlashcard = async (id: string, updates: Partial<Flashcard>): Promise<Flashcard> => {
  const index = mockFlashcards.findIndex(card => card.id === id);
  
  if (index === -1) {
    throw new Error(`Flashcard with id ${id} not found`);
  }
  
  const updatedFlashcard = {
    ...mockFlashcards[index],
    ...updates,
    updatedAt: new Date()
  };
  
  mockFlashcards = [
    ...mockFlashcards.slice(0, index),
    updatedFlashcard,
    ...mockFlashcards.slice(index + 1)
  ];
  
  return Promise.resolve(updatedFlashcard);
};

// Delete a flashcard
export const deleteFlashcard = async (id: string): Promise<boolean> => {
  const initialLength = mockFlashcards.length;
  mockFlashcards = mockFlashcards.filter(card => card.id !== id);
  
  return Promise.resolve(mockFlashcards.length < initialLength);
};

// Import flashcards from CSV
export const importFlashcardsFromCSV = async (csvContent: string): Promise<Flashcard[]> => {
  // Parse CSV content (simple implementation)
  const rows = csvContent.split('\n').map(row => row.split(','));
  const headers = rows[0];
  
  // Check for required columns
  const italianIndex = headers.findIndex(h => h.toLowerCase().includes('italian'));
  const englishIndex = headers.findIndex(h => h.toLowerCase().includes('english'));
  
  if (italianIndex === -1 || englishIndex === -1) {
    throw new Error('CSV must contain columns for Italian and English');
  }
  
  // Process rows into flashcards
  const newFlashcards: Flashcard[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length >= Math.max(italianIndex, englishIndex) + 1) {
      const flashcard: Flashcard = {
        id: uuidv4(),
        italian: row[italianIndex].trim(),
        english: row[englishIndex].trim(),
        mastered: false,
        level: 0,
        tags: ['imported'],
        nextReview: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastReviewed: null
      };
      
      newFlashcards.push(flashcard);
    }
  }
  
  // Add to mock data
  mockFlashcards = [...mockFlashcards, ...newFlashcards];
  
  return Promise.resolve(newFlashcards);
};

// Get all flashcard sets
export const getAllFlashcardSets = async (): Promise<FlashcardSet[]> => {
  return Promise.resolve([...mockFlashcardSets]);
};

// Get a flashcard set by ID
export const getFlashcardSetById = async (id: string): Promise<FlashcardSet | null> => {
  const set = mockFlashcardSets.find(set => set.id === id);
  return Promise.resolve(set || null);
};

// Create a new flashcard set
export const createFlashcardSet = async (set: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>): Promise<FlashcardSet> => {
  const newSet: FlashcardSet = {
    ...set,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockFlashcardSets = [...mockFlashcardSets, newSet];
  
  return Promise.resolve(newSet);
};

// Update a flashcard set
export const updateFlashcardSet = async (id: string, updates: Partial<FlashcardSet>): Promise<FlashcardSet> => {
  const index = mockFlashcardSets.findIndex(set => set.id === id);
  
  if (index === -1) {
    throw new Error(`Flashcard set with id ${id} not found`);
  }
  
  const updatedSet = {
    ...mockFlashcardSets[index],
    ...updates,
    updatedAt: new Date()
  };
  
  mockFlashcardSets = [
    ...mockFlashcardSets.slice(0, index),
    updatedSet,
    ...mockFlashcardSets.slice(index + 1)
  ];
  
  return Promise.resolve(updatedSet);
};

// Delete a flashcard set
export const deleteFlashcardSet = async (id: string): Promise<boolean> => {
  const initialLength = mockFlashcardSets.length;
  mockFlashcardSets = mockFlashcardSets.filter(set => set.id !== id);
  
  return Promise.resolve(mockFlashcardSets.length < initialLength);
};

export default {
  getAllFlashcards,
  addFlashcard,
  updateFlashcard,
  deleteFlashcard,
  importFlashcardsFromCSV,
  getAllFlashcardSets,
  getFlashcardSetById,
  createFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet
};
