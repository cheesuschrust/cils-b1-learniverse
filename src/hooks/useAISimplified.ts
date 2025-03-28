
import { useState, useCallback } from 'react';
import { AIStatus, UseAIReturn } from '@/types/ai';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types/user';
import { Flashcard } from '@/types/flashcard';

// Define options interface for AI operations
export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

// This is a simplified version of useAI hook for components that don't need all functionalities
export default function useAISimplified(): UseAIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);
  const { toast } = useToast();

  const handleError = useCallback((error: Error) => {
    setError(error);
    setIsLoading(false);
    toast({
      title: "AI Error",
      description: error.message || "An error occurred while processing your request.",
      variant: "destructive",
    });
  }, [toast]);

  const generateText = useCallback(async (prompt: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create a new AbortController for this request
      const newController = new AbortController();
      setController(newController);

      // Simulate an API call with a slight delay
      const mockResponse = await new Promise<string>((resolve, reject) => {
        setTimeout(() => {
          if (newController.signal.aborted) {
            reject(new Error('Request was aborted'));
            return;
          }
          
          // Simple mock response
          const response = `Response to: ${prompt}\n\nThis is a simplified mock AI response for demonstration purposes. In a real implementation, this would call an actual AI service.`;
          resolve(response);
        }, 1500);
      });

      setResult(mockResponse);
      setIsLoading(false);
      return mockResponse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      handleError(error);
      return error.message;
    } finally {
      setController(null);
    }
  }, [handleError]);

  const abort = useCallback(() => {
    if (controller) {
      controller.abort();
      setController(null);
      setIsLoading(false);
    }
  }, [controller]);

  // Mock confidence score calculation based on content type
  const getConfidenceScore = (contentType: string): number => {
    const scoreMap: Record<string, number> = {
      'writing': 0.85,
      'speaking': 0.78,
      'listening': 0.92,
      'multiple-choice': 0.95,
      'flashcards': 0.89
    };
    
    return scoreMap[contentType] || 0.7; // Default to 0.7 if content type not found
  };

  // Mock method to classify text
  const classifyText = async (text: string): Promise<any[]> => {
    return [
      { label: 'positive', score: 0.75 },
      { label: 'neutral', score: 0.20 },
      { label: 'negative', score: 0.05 }
    ];
  };

  // Mock method for flashcard generation
  const generateFlashcards = async (
    content: string, 
    count: number = 5, 
    difficulty: string = 'intermediate'
  ): Promise<any[]> => {
    const flashcards = [];
    for (let i = 0; i < count; i++) {
      flashcards.push({
        id: `card-${i}`,
        front: `Term ${i+1} from ${content}`,
        back: `Definition ${i+1} for ${difficulty} level`,
        level: 0,
        mastered: false,
        tags: ['generated', difficulty],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    return flashcards;
  };

  // Mock method for generating questions
  const generateQuestions = async (
    content: string,
    contentType: string,
    count: number,
    difficulty: string
  ): Promise<any[]> => {
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `question-${i}`,
        text: `Question ${i+1} about ${content}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        difficulty,
        category: contentType,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [contentType, difficulty],
        points: 10
      });
    }
    return questions;
  };

  const loadModel = async (): Promise<void> => {
    // Mock implementation
    console.log("Loading AI model...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("AI model loaded");
  };

  // Return the simplified API
  return {
    isLoading,
    error,
    result,
    generateText,
    abort,
    status: 'ready' as AIStatus,
    isModelLoaded: true,
    loadModel,
    generateQuestions,
    isProcessing: isLoading,
    generateFlashcards,
    classifyText,
    getConfidenceScore
  };
}

// Backward compatibility functions for Flashcard normalization
export function normalizeFlashcard(card: any): Flashcard {
  if (!card) return null as any;
  
  return {
    id: card.id || '',
    front: card.front || card.italian || '',
    back: card.back || card.english || '',
    level: card.level || 0,
    tags: card.tags || [],
    nextReview: card.nextReview || card.dueDate || new Date(),
    createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
    updatedAt: card.updatedAt ? new Date(card.updatedAt) : new Date(),
    mastered: card.mastered || false,
    italian: card.italian,
    english: card.english
  };
}

// Backward compatibility function for User normalization
export function convertLegacyUser(user: any): User {
  if (!user) return null as any;
  
  return {
    id: user.id || user.uid,
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL || user.photo_url,
    displayName: user.displayName || user.display_name,
    firstName: user.firstName || user.first_name,
    lastName: user.lastName || user.last_name,
    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
    updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
    role: user.role || 'user'
  };
}

// Re-export from useAISimplified for backward compatibility
export { useAISimplified };
