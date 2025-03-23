
import { API } from "./api";

export interface Flashcard {
  id: string;
  italian: string;
  english: string;
  mastered: boolean;
}

export interface MultipleChoiceQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface WritingPrompt {
  id: number;
  title: string;
  prompt: string;
  minWords: number;
  maxWords: number;
  example?: string;
}

export class ContentService {
  static async getFlashcards(): Promise<Flashcard[]> {
    const response = await API.handleRequest<{ data: Flashcard[] }>("/content/flashcards", "GET");
    return response.data;
  }
  
  static async saveFlashcard(flashcard: Omit<Flashcard, "id">): Promise<Flashcard> {
    return API.handleRequest<Flashcard>("/content/flashcards", "POST", flashcard);
  }
  
  static async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard> {
    return API.handleRequest<Flashcard>(`/content/flashcards/${id}`, "PUT", updates);
  }
  
  static async deleteFlashcard(id: string): Promise<void> {
    return API.handleRequest<void>(`/content/flashcards/${id}`, "DELETE");
  }
  
  static async getMultipleChoiceQuestions(): Promise<MultipleChoiceQuestion[]> {
    const response = await API.handleRequest<{ data: MultipleChoiceQuestion[] }>("/content/multiple-choice", "GET");
    return response.data;
  }
  
  static async getWritingPrompts(): Promise<WritingPrompt[]> {
    const response = await API.handleRequest<{ data: WritingPrompt[] }>("/content/writing-prompts", "GET");
    return response.data;
  }
  
  static async submitWritingResponse(promptId: number, response: string): Promise<any> {
    return API.handleRequest<any>("/content/writing-responses", "POST", { promptId, response });
  }
}
