
import { AIServiceInterface, AIServiceOptions } from '@/types/ai';

/**
 * Stub implementation of AI Service for development and testing
 */
class AIServiceStub implements AIServiceInterface {
  private activeRequests: Map<string, AbortController> = new Map();
  private shouldSimulateErrors: boolean = false;
  
  /**
   * Enable or disable error simulation
   */
  setErrorSimulation(enable: boolean): void {
    this.shouldSimulateErrors = enable;
  }
  
  /**
   * Generate text using a mock implementation
   */
  async generateText(prompt: string, options: AIServiceOptions = {}): Promise<string> {
    // Create a unique request ID
    const requestId = `request_${Date.now()}`;
    const controller = new AbortController();
    this.activeRequests.set(requestId, controller);
    
    try {
      // Simulate network delay
      await this.simulateDelay(1000);
      
      // Check if we should simulate an error
      if (this.shouldSimulateErrors) {
        throw new Error('Simulated AI service error');
      }
      
      // Generate a simple response based on prompt
      if (prompt.includes('hello') || prompt.includes('hi')) {
        return 'Hello! How can I help you today?';
      }
      
      if (prompt.includes('translate')) {
        return 'Here is the translation: "Ciao, come stai oggi?"';
      }
      
      if (prompt.includes('explain')) {
        return 'Here is an explanation of the requested topic...';
      }
      
      // Default response
      return `AI generated response for: ${prompt.substring(0, 50)}...`;
    } finally {
      this.activeRequests.delete(requestId);
    }
  }
  
  /**
   * Classify text with mock classification
   */
  async classifyText(text: string): Promise<Array<{ label: string; score: number }>> {
    // Create a unique request ID
    const requestId = `request_${Date.now()}`;
    const controller = new AbortController();
    this.activeRequests.set(requestId, controller);
    
    try {
      // Simulate network delay
      await this.simulateDelay(800);
      
      // Check if we should simulate an error
      if (this.shouldSimulateErrors) {
        throw new Error('Simulated AI classification error');
      }
      
      // Simple classification based on text content
      const classifications = [];
      
      if (text.includes('?')) {
        classifications.push({ label: 'Question', score: 0.91 });
      }
      
      if (text.length > 100) {
        classifications.push({ label: 'Long Text', score: 0.85 });
      } else {
        classifications.push({ label: 'Short Text', score: 0.92 });
      }
      
      if (text.includes('ciao') || text.includes('buongiorno')) {
        classifications.push({ label: 'Italian Content', score: 0.94 });
      } else if (text.includes('hello') || text.includes('good morning')) {
        classifications.push({ label: 'English Content', score: 0.89 });
      }
      
      return classifications;
    } finally {
      this.activeRequests.delete(requestId);
    }
  }
  
  /**
   * Get confidence score for a content type
   */
  getConfidenceScore(contentType: string): number {
    // Return mock confidence scores based on content type
    const scores: Record<string, number> = {
      'multiple-choice': 78,
      'flashcards': 82,
      'writing': 69,
      'speaking': 74,
      'listening': 65
    };
    
    return scores[contentType] || 60;
  }
  
  /**
   * Add training examples for content type recognition
   */
  addTrainingExamples(contentType: string, examples: any[]): number {
    // Simulate adding examples to training data
    console.log(`Added ${examples.length} examples for ${contentType}`);
    return examples.length;
  }
  
  /**
   * Generate flashcards based on a topic
   */
  async generateFlashcards(topic: string, count: number = 5, difficulty: string = 'intermediate'): Promise<any[]> {
    // Create a unique request ID
    const requestId = `request_${Date.now()}`;
    const controller = new AbortController();
    this.activeRequests.set(requestId, controller);
    
    try {
      // Simulate network delay
      await this.simulateDelay(1500);
      
      // Check if we should simulate an error
      if (this.shouldSimulateErrors) {
        throw new Error('Simulated flashcard generation error');
      }
      
      // Generate mock flashcards based on topic
      const mockFlashcards = [];
      
      for (let i = 0; i < count; i++) {
        mockFlashcards.push({
          id: `card-${i + 1}`,
          italian: `Italian term ${i + 1} for ${topic}`,
          english: `English definition ${i + 1} for ${topic}`,
          tags: [topic.toLowerCase()],
          level: difficulty === 'advanced' ? 2 : difficulty === 'intermediate' ? 1 : 0,
          mastered: false
        });
      }
      
      return mockFlashcards;
    } finally {
      this.activeRequests.delete(requestId);
    }
  }
  
  /**
   * Generate questions based on content
   */
  async generateQuestions(content: string, count: number = 5, type: string = 'multiple-choice'): Promise<any[]> {
    // Create a unique request ID
    const requestId = `request_${Date.now()}`;
    const controller = new AbortController();
    this.activeRequests.set(requestId, controller);
    
    try {
      // Simulate network delay
      await this.simulateDelay(1200);
      
      // Check if we should simulate an error
      if (this.shouldSimulateErrors) {
        throw new Error('Simulated question generation error');
      }
      
      // Generate mock questions
      const mockQuestions = [];
      
      for (let i = 0; i < count; i++) {
        if (type === 'multiple-choice') {
          mockQuestions.push({
            id: `q-${i + 1}`,
            type: 'multiple-choice',
            question: `Sample question ${i+1} about ${content.substring(0, 20)}...?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option A',
            explanation: 'This is a sample explanation.'
          });
        } else if (type === 'text-input') {
          mockQuestions.push({
            id: `q-${i + 1}`,
            type: 'text-input',
            question: `Sample fill-in question ${i+1} about ${content.substring(0, 20)}...?`,
            correctAnswers: ['Answer 1', 'Answer 2'],
            caseSensitive: false,
            explanation: 'This is a sample explanation.'
          });
        }
      }
      
      return mockQuestions;
    } finally {
      this.activeRequests.delete(requestId);
    }
  }
  
  /**
   * Helper method to simulate delay
   */
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Abort ongoing request
   */
  abortRequest(requestId: string): void {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
    }
  }
  
  /**
   * Abort all ongoing requests
   */
  abortAllRequests(): void {
    this.activeRequests.forEach(controller => {
      controller.abort();
    });
    this.activeRequests.clear();
  }
}

export default new AIServiceStub();
